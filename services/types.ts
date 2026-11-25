/**
 * Shared service types for ScamShield AI.
 * These interfaces are API-ready: swapping the mock implementations for
 * real HTTP calls does not require changing calling code.
 */

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatarColor: string;
  createdAt: number;
  emailVerified: boolean;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export type MFAMethod = 'authenticator' | 'email' | 'sms' | null;

export interface MFAStatus {
  enrolled: boolean;
  method: MFAMethod;
  authenticatorSecret: string | null;
  authenticatorQrUri: string | null;
  backupCodes: string[];
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthService {
  register(payload: RegisterPayload): Promise<{ user: AuthUser; session: AuthSession }>;
  login(payload: LoginPayload): Promise<{ user: AuthUser; session: AuthSession }>;
  logout(): Promise<void>;
  sendEmailOtp(email: string): Promise<{ sent: boolean }>;
  verifyEmailOtp(email: string, code: string): Promise<{ verified: boolean }>;
  requestPasswordReset(email: string): Promise<{ sent: boolean }>;
  resetPassword(token: string, newPassword: string): Promise<{ success: boolean }>;
  enrollAuthenticator(): Promise<{ secret: string; qrUri: string }>;
  verifyAuthenticator(code: string): Promise<{ verified: boolean }>;
  generateRecoveryCodes(): Promise<string[]>;
  enableMfa(method: Exclude<MFAMethod, null>): Promise<MFAStatus>;
  disableMfa(): Promise<void>;
  biometricUnlock(): Promise<{ unlocked: boolean }>;
}

export type RiskLevel = 'low' | 'suspicious' | 'high' | 'unknown';

export interface ScanResult {
  id: string;
  type: 'url' | 'message' | 'qr' | 'screenshot' | 'apk' | 'payment';
  input: string;
  riskLevel: RiskLevel;
  riskScore: number; // 0-100
  title: string;
  summary: string;
  signals: { label: string; detail: string; severity: 'info' | 'warning' | 'danger' }[];
  recommendations: string[];
  createdAt: number;
}

export interface ScanService {
  scanUrl(url: string): Promise<ScanResult>;
  analyzeMessage(text: string): Promise<ScanResult>;
  scanQr(payload: string): Promise<ScanResult>;
  analyzeScreenshot(description: string): Promise<ScanResult>;
  analyzeApk(name: string, url: string): Promise<ScanResult>;
  analyzePayment(request: string): Promise<ScanResult>;
}

export interface ChatMessageDTO {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: number;
  suggestions?: string[];
}

export interface AssistantService {
  sendMessage(content: string, history: ChatMessageDTO[]): Promise<ChatMessageDTO>;
  suggestedQuestions(): Promise<string[]>;
}

export interface IncidentStep {
  id: string;
  label: string;
  done: boolean;
}

export interface IncidentReport {
  id: string;
  type: 'upi' | 'banking' | 'phishing' | 'whatsapp' | 'identity' | 'apk';
  title: string;
  steps: IncidentStep[];
  evidence: { id: string; name: string; kind: 'image' | 'note'; addedAt: number }[];
  timeline: { id: string; at: number; label: string }[];
  createdAt: number;
  status: 'open' | 'in-progress' | 'reported' | 'resolved';
}

export interface IncidentService {
  createReport(type: IncidentReport['type']): Promise<IncidentReport>;
  toggleStep(reportId: string, stepId: string): Promise<IncidentReport>;
  addEvidence(reportId: string, name: string, kind: 'image' | 'note'): Promise<IncidentReport>;
  listReports(): Promise<IncidentReport[]>;
}

export interface ActivityRecord {
  id: string;
  kind: 'scan' | 'incident' | 'ai' | 'auth';
  title: string;
  subtitle: string;
  riskLevel?: RiskLevel;
  createdAt: number;
}

export interface ActivityService {
  list(): Promise<ActivityRecord[]>;
  search(query: string, filters: ActivityRecord['kind'][]): Promise<ActivityRecord[]>;
}
