/**
 * Mock AI assistant service. Returns contextual canned responses and
 * suggested follow-up questions. Typed against AssistantService.
 */

import type { AssistantService, ChatMessageDTO } from './types';

const LATENCY = 1100;
const wait = (ms = LATENCY) => new Promise((r) => setTimeout(r, ms));

const TOPICS: { match: RegExp; reply: string; suggestions: string[] }[] = [
  {
    match: /upi|payment|paid|money transfer|refund/i,
    reply:
      'If a UPI payment went to a scammer, act fast: call your bank and 1930 (the national cybercrime helpline) within the first few hours, raise a dispute on the transaction, and ask your bank to raise a chargeback. The sooner you report, the higher the chance of freezing the fraudster account. I can guide you through the Incident Recovery tab to collect evidence.',
    suggestions: ['How do I report to 1930?', 'What evidence should I collect?', 'How do I raise a chargeback?'],
  },
  {
    match: /phishing|email|link|login|password/i,
    reply:
      'Phishing messages try to trick you into entering credentials on a fake page. Never click links in suspicious emails or SMS. If you already entered a password, change it immediately on the real site, enable MFA, and review recent account activity. Use the URL Scanner in the Scan tab to check any suspicious link.',
    suggestions: ['Scan this URL for me', 'How do I enable MFA?', 'What is a phishing kit?'],
  },
  {
    match: /whatsapp|hacked|account compromise|otp on whatsapp/i,
    reply:
      'If your WhatsApp is compromised: uninstall and reinstall WhatsApp, re-register your number (this kicks out the attacker), notify close contacts not to trust messages from you, and enable two-step verification with a strong PIN. Report to cybercrime if money was lost.',
    suggestions: ['How to enable two-step verification?', 'Report WhatsApp fraud', 'Recover lost money'],
  },
  {
    match: /qr|scan code/i,
    reply:
      'QR scams often hide a UPI collect request or a phishing link. Always preview the URL before opening, and never approve payment requests from QR codes you did not generate yourself. Use the QR Scanner in the Scan tab to preview a codes destination safely.',
    suggestions: ['Is QR payment safe?', 'How to report QR fraud?', 'Scan a QR code'],
  },
  {
    match: /apk|app install|sideload|malware/i,
    reply:
      'Installing APKs from outside the Play Store is risky: they can contain spyware, steal OTPs, or request overlay permissions to read screens. Only install from trusted stores, keep Play Protect on, and uninstall suspicious apps immediately. Use the APK analyzer in the Scan tab to assess a file link.',
    suggestions: ['How to remove a malicious app?', 'What permissions are dangerous?', 'Check an APK link'],
  },
  {
    match: /identity|kyc|aadhaar|pan/i,
    reply:
      'Identity theft protection means limiting where you share Aadhaar/PAN, enabling MFA on all financial accounts, and monitoring your credit report. Never share OTPs, and be wary of KYC calls that ask for details. The Protection Center has a digital identity checklist you can follow.',
    suggestions: ['Show the identity checklist', 'How to lock my Aadhaar?', 'Report identity theft'],
  },
  {
    match: /hello|hi|hey|help/i,
    reply:
      'Hello! I am your ScamShield AI assistant. I can help you understand scams, check suspicious links or messages, and guide recovery if something went wrong. What would you like to do?',
    suggestions: ['Check a suspicious link', 'I think I was scammed', 'Explain common scam types'],
  },
];

const FALLBACK_REPLY =
  'I can help with scam detection, payment fraud, phishing, WhatsApp compromise, identity theft, and APK safety. Ask me about a suspicious message, link, or payment request, or tell me what happened and I will guide you.';

const DEFAULT_SUGGESTIONS = [
  'Check a suspicious link',
  'I think I was scammed',
  'How do I protect my family?',
  'Explain common scam types',
];

export const mockAssistantService: AssistantService = {
  async sendMessage(content, _history) {
    await wait();
    const match = TOPICS.find((t) => t.match.test(content));
    const reply = match?.reply ?? FALLBACK_REPLY;
    const message: ChatMessageDTO = {
      id: `msg_${Date.now()}`,
      role: 'assistant',
      content: reply,
      createdAt: Date.now(),
      suggestions: match?.suggestions ?? DEFAULT_SUGGESTIONS,
    };
    return message;
  },

  async suggestedQuestions() {
    await wait(200);
    return DEFAULT_SUGGESTIONS;
  },
};
