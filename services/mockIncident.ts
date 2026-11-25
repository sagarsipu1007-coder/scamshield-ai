/**
 * Mock incident recovery service. Produces guided recovery checklists per
 * incident type and supports step toggling and evidence uploads.
 */

import type { IncidentReport, IncidentService } from './types';

const LATENCY = 600;
const wait = (ms = LATENCY) => new Promise((r) => setTimeout(r, ms));

const TEMPLATES: Record<IncidentReport['type'], { title: string; steps: string[] }> = {
  upi: {
    title: 'UPI fraud recovery',
    steps: [
      'Call your bank immediately and report the fraudulent transaction.',
      'Call 1930 (national cybercrime helpline) within 24 hours.',
      'Raise a dispute on the UPI transaction in your banking app.',
      'Note the fraudster UPI ID and transaction reference number.',
      'File a complaint at cybercrime.gov.in.',
      'Screenshot all chats and transaction confirmations as evidence.',
    ],
  },
  banking: {
    title: 'Banking fraud recovery',
    steps: [
      'Block your card / account via your bank hotline.',
      'Change your netbanking and mobile banking passwords.',
      'Review recent transactions for unauthorized debits.',
      'Submit a written dispute at your home branch.',
      'Report to 1930 and cybercrime.gov.in.',
      'Enable transaction alerts and lower daily limits.',
    ],
  },
  phishing: {
    title: 'Phishing response',
    steps: [
      'Do not click any more links from the suspicious source.',
      'Change the password for the targeted account.',
      'Enable MFA on the affected account.',
      'Report the phishing email/SMS to your provider.',
      'Run a URL scan on any links you received.',
      'Warn friends and family about the scam.',
    ],
  },
  whatsapp: {
    title: 'WhatsApp compromise recovery',
    steps: [
      'Uninstall and reinstall WhatsApp to force re-registration.',
      'Re-register your number to kick out the attacker.',
      'Enable two-step verification with a strong PIN.',
      'Notify close contacts that your account was compromised.',
      'Check linked devices and remove unknown ones.',
      'Report to 1930 if money or data was lost.',
    ],
  },
  identity: {
    title: 'Identity theft recovery',
    steps: [
      'Place a freeze or lock on your credit report.',
      'Change passwords on all financial and government accounts.',
      'File a police complaint with ID proof and evidence.',
      'Notify your bank and request enhanced monitoring.',
      'Report to cybercrime.gov.in.',
      'Monitor for unauthorized loans or accounts in your name.',
    ],
  },
  apk: {
    title: 'Suspicious APK installation',
    steps: [
      'Uninstall the suspicious APK immediately.',
      'Revoke permissions granted to the app.',
      'Run a full device security scan.',
      'Change passwords for any account that may have been accessed.',
      'Check bank and UPI activity for unauthorized transactions.',
      'Report the APK source to cybercrime.gov.in.',
    ],
  },
};

let reports: IncidentReport[] = [];

export const mockIncidentService: IncidentService = {
  async createReport(type) {
    await wait();
    const template = TEMPLATES[type];
    const report: IncidentReport = {
      id: `inc_${Date.now()}`,
      type,
      title: template.title,
      steps: template.steps.map((label, i) => ({ id: `s_${i}`, label, done: false })),
      evidence: [],
      timeline: [{ id: `t_${Date.now()}`, at: Date.now(), label: 'Incident reported' }],
      createdAt: Date.now(),
      status: 'open',
    };
    reports = [report, ...reports];
    return report;
  },

  async toggleStep(reportId, stepId) {
    await wait(300);
    reports = reports.map((r) =>
      r.id === reportId
        ? {
            ...r,
            steps: r.steps.map((s) => (s.id === stepId ? { ...s, done: !s.done } : s)),
            timeline: [
              ...r.timeline,
              { id: `t_${Date.now()}`, at: Date.now(), label: 'Step updated' },
            ],
          }
        : r,
    );
    return reports.find((r) => r.id === reportId)!;
  },

  async addEvidence(reportId, name, kind) {
    await wait(400);
    reports = reports.map((r) =>
      r.id === reportId
        ? {
            ...r,
            evidence: [...r.evidence, { id: `e_${Date.now()}`, name, kind, addedAt: Date.now() }],
            timeline: [
              ...r.timeline,
              { id: `t_${Date.now()}`, at: Date.now(), label: `Evidence added: ${name}` },
            ],
          }
        : r,
    );
    return reports.find((r) => r.id === reportId)!;
  },

  async listReports() {
    await wait(400);
    return reports;
  },
};

export const incidentTemplates = TEMPLATES;
