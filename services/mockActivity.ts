/**
 * Mock activity service. Returns a seeded feed of recent activity records.
 */

import type { ActivityRecord, ActivityService } from './types';

const NOW = Date.now();
const HOUR = 1000 * 60 * 60;

const SEED: ActivityRecord[] = [
  { id: 'a1', kind: 'scan', title: 'URL scan', subtitle: 'www.paytm-verify-login.com', riskLevel: 'high', createdAt: NOW - HOUR * 2 },
  { id: 'a2', kind: 'scan', title: 'Message analysis', subtitle: 'SMS about parcel delivery fee', riskLevel: 'suspicious', createdAt: NOW - HOUR * 6 },
  { id: 'a3', kind: 'ai', title: 'AI assistant', subtitle: 'Asked about UPI refund scam', createdAt: NOW - HOUR * 9 },
  { id: 'a4', kind: 'incident', title: 'Incident report opened', subtitle: 'UPI fraud recovery', createdAt: NOW - HOUR * 26 },
  { id: 'a5', kind: 'scan', title: 'QR scan', subtitle: 'upi://pay?pa=unknown@okbiz', riskLevel: 'suspicious', createdAt: NOW - HOUR * 30 },
  { id: 'a6', kind: 'scan', title: 'Payment request analysis', subtitle: 'Pay 5000 for customs parcel release', riskLevel: 'high', createdAt: NOW - HOUR * 50 },
  { id: 'a7', kind: 'auth', title: 'Security event', subtitle: 'MFA authenticator enabled', createdAt: NOW - HOUR * 72 },
  { id: 'a8', kind: 'scan', title: 'APK analysis', subtitle: 'WhatsAppMod_v2.apk', riskLevel: 'high', createdAt: NOW - HOUR * 96 },
  { id: 'a9', kind: 'scan', title: 'URL scan', subtitle: 'https://maps.google.com', riskLevel: 'low', createdAt: NOW - HOUR * 120 },
  { id: 'a10', kind: 'ai', title: 'AI assistant', subtitle: 'Asked about WhatsApp compromise', createdAt: NOW - HOUR * 140 },
];

export const mockActivityService: ActivityService = {
  async list() {
    await new Promise((r) => setTimeout(r, 500));
    return SEED;
  },

  async search(query, filters) {
    await new Promise((r) => setTimeout(r, 400));
    const q = query.trim().toLowerCase();
    return SEED.filter(
      (r) =>
        (filters.length === 0 || filters.includes(r.kind)) &&
        (q === '' || r.title.toLowerCase().includes(q) || r.subtitle.toLowerCase().includes(q)),
    );
  },
};
