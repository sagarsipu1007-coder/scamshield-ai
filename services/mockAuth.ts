/**
 * Mock authentication service.
 * Simulates network latency and returns realistic data. All methods are
 * typed against AuthService so a real backend can drop in later.
 */

import type {
  AuthService,
  AuthUser,
  AuthSession,
  MFAStatus,
} from './types';
import { mockScamShieldUser } from './mockData';

const LATENCY = 700;
const wait = (ms = LATENCY) => new Promise((r) => setTimeout(r, ms));

function makeSession(): AuthSession {
  return {
    accessToken: `mock_access_${Math.random().toString(36).slice(2)}`,
    refreshToken: `mock_refresh_${Math.random().toString(36).slice(2)}`,
    expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7,
  };
}

function avatarColor(seed: string): string {
  const palette = ['#0E7C66', '#1F6FEB', '#7C4D0E', '#5B2A86', '#0A5C4D', '#B23A48'];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return palette[h % palette.length];
}

let mfaState: MFAStatus = {
  enrolled: false,
  method: null,
  authenticatorSecret: null,
  authenticatorQrUri: null,
  backupCodes: [],
};

export const mockAuthService: AuthService = {
  async register(payload) {
    await wait(900);
    const user: AuthUser = {
      id: `u_${Date.now()}`,
      email: payload.email,
      fullName: payload.fullName,
      phone: payload.phone,
      avatarColor: avatarColor(payload.email),
      createdAt: Date.now(),
      emailVerified: false,
    };
    mockScamShieldUser.user = user;
    return { user, session: makeSession() };
  },

  async login(payload) {
    await wait(800);
    const user: AuthUser = {
      id: `u_${payload.email}`,
      email: payload.email,
      fullName: payload.email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      avatarColor: avatarColor(payload.email),
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 120,
      emailVerified: true,
    };
    mockScamShieldUser.user = user;
    return { user, session: makeSession() };
  },

  async logout() {
    await wait(300);
    mockScamShieldUser.user = null;
  },

  async sendEmailOtp(email) {
    await wait(600);
    void email;
    return { sent: true };
  },

  async verifyEmailOtp(_email, code) {
    await wait(600);
    return { verified: code.length === 6 && /^\d{6}$/.test(code) };
  },

  async requestPasswordReset(email) {
    await wait(700);
    void email;
    return { sent: true };
  },

  async resetPassword(_token, _newPassword) {
    await wait(700);
    return { success: true };
  },

  async enrollAuthenticator() {
    await wait(500);
    const secret = Array.from({ length: 16 }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'[Math.floor(Math.random() * 32)]).join('');
    const qrUri = `otpauth://totp/ScamShield:demo@scamshield.ai?secret=${secret}&issuer=ScamShield`;
    mfaState = { ...mfaState, authenticatorSecret: secret, authenticatorQrUri: qrUri };
    return { secret, qrUri };
  },

  async verifyAuthenticator(code) {
    await wait(500);
    return { verified: code.length === 6 && /^\d{6}$/.test(code) };
  },

  async generateRecoveryCodes() {
    await wait(400);
    const codes = Array.from({ length: 8 }, () =>
      `${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    );
    mfaState = { ...mfaState, backupCodes: codes };
    return codes;
  },

  async enableMfa(method) {
    await wait(400);
    mfaState = { ...mfaState, enrolled: true, method };
    return mfaState;
  },

  async disableMfa() {
    await wait(300);
    mfaState = {
      enrolled: false,
      method: null,
      authenticatorSecret: null,
      authenticatorQrUri: null,
      backupCodes: [],
    };
  },

  async biometricUnlock() {
    await wait(600);
    return { unlocked: true };
  },
};
