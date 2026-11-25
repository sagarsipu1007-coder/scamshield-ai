/**
 * Mock scan service. Produces realistic, deterministic-ish risk analysis
 * results for each scan type. Typed against ScanService for future backend.
 */

import type { ScanResult, ScanService, RiskLevel } from './types';

const LATENCY = 1200;
const wait = (ms = LATENCY) => new Promise((r) => setTimeout(r, ms));

function scoreFor(input: string, keywords: string[]): { score: number; hit: boolean } {
  const lower = input.toLowerCase();
  const hits = keywords.filter((k) => lower.includes(k));
  const base = 20 + hits.length * 22;
  return { score: Math.min(98, base + (input.length > 120 ? 8 : 0)), hit: hits.length > 0 };
}

function level(score: number): RiskLevel {
  if (score >= 70) return 'high';
  if (score >= 45) return 'suspicious';
  if (score >= 25) return 'low';
  return 'unknown';
}

const PHISHING_KEYWORDS = ['login', 'verify', 'account', 'suspended', 'urgent', 'click', 'http://', 'bit.ly', 'tinyurl', 'free', 'winner', 'kyc', 'otp', 'blocked'];
const PAYMENT_KEYWORDS = ['upi', 'send money', 'pay now', 'gift card', 'tax', 'fee', 'refund', 'investment', 'doubled', 'gpay', 'phonepe', 'paytm'];
const APK_KEYWORDS = ['apk', 'mod', 'cracked', 'premium unlock', 'pirated', 'unknown source', 'adfree'];

export const mockScanService: ScanService = {
  async scanUrl(url) {
    await wait();
    const { score } = scoreFor(url, PHISHING_KEYWORDS);
    const risk = level(score);
    return {
      id: `scan_${Date.now()}`,
      type: 'url',
      input: url,
      riskLevel: risk,
      riskScore: score,
      title: url,
      summary:
        risk === 'high'
          ? 'This URL shows strong indicators of a phishing page designed to steal credentials.'
          : risk === 'suspicious'
            ? 'This URL has several suspicious characteristics. Proceed with caution.'
            : risk === 'low'
              ? 'No major threats detected, but always verify the destination before entering sensitive data.'
              : 'Could not classify this URL confidently. Treat as unknown risk.',
      signals: [
        { label: 'Domain age', detail: 'Registered less than 30 days ago', severity: score > 50 ? 'danger' : 'info' },
        { label: 'TLS certificate', detail: url.startsWith('https') ? 'Valid HTTPS certificate' : 'No HTTPS - insecure', severity: url.startsWith('https') ? 'info' : 'warning' },
        { label: 'URL shortener', detail: /bit\.ly|tinyurl|t\.co/.test(url) ? 'Uses a link shortener that hides the real destination' : 'No shortener detected', severity: /bit\.ly|tinyurl/.test(url) ? 'warning' : 'info' },
        { label: 'Brand impersonation', detail: /login|verify|account/.test(url.toLowerCase()) ? 'Imitates a login or verification flow' : 'No impersonation signals', severity: /login|verify/.test(url.toLowerCase()) ? 'danger' : 'info' },
      ],
      recommendations: [
        'Do not enter passwords, OTPs, or card details on this page.',
        'Cross-check the domain against the official website.',
        'Report the link to your bank if it claims to be from them.',
      ],
      createdAt: Date.now(),
    };
  },

  async analyzeMessage(text) {
    await wait();
    const { score } = scoreFor(text, PHISHING_KEYWORDS);
    const risk = level(score);
    return {
      id: `scan_${Date.now()}`,
      type: 'message',
      input: text,
      riskLevel: risk,
      riskScore: score,
      title: 'Message analysis',
      summary:
        risk === 'high'
          ? 'This message uses classic fraud tactics: urgency, threats, and a suspicious link.'
          : risk === 'suspicious'
            ? 'Some phrases in this message are commonly used in scams.'
            : risk === 'low'
              ? 'No strong scam signals found, but remain cautious with any links.'
              : 'Could not confidently classify this message.',
      signals: [
        { label: 'Urgency language', detail: /urgent|immediately|within|suspended/.test(text.toLowerCase()) ? 'Pressure to act fast' : 'None detected', severity: /urgent|suspended/.test(text.toLowerCase()) ? 'danger' : 'info' },
        { label: 'Request for OTP/credentials', detail: /otp|password|cvv|pin/.test(text.toLowerCase()) ? 'Asks for sensitive information' : 'No sensitive requests', severity: /otp|password|cvv/.test(text.toLowerCase()) ? 'danger' : 'info' },
        { label: 'Link present', detail: /https?:\/\//.test(text) ? 'Contains a clickable link' : 'No links', severity: /https?:\/\//.test(text) ? 'warning' : 'info' },
        { label: 'Reward bait', detail: /winner|prize|free|lottery/.test(text.toLowerCase()) ? 'Promises a reward' : 'No reward bait', severity: /winner|prize|free/.test(text.toLowerCase()) ? 'warning' : 'info' },
      ],
      recommendations: [
        'Never share OTPs, PINs, or passwords in response to a message.',
        'Verify claims by contacting the organization through official channels.',
        'Delete the message and block the sender if it feels suspicious.',
      ],
      createdAt: Date.now(),
    };
  },

  async scanQr(payload) {
    await wait();
    const { score } = scoreFor(payload, PHISHING_KEYWORDS);
    const risk = level(score);
    return {
      id: `scan_${Date.now()}`,
      type: 'qr',
      input: payload,
      riskLevel: risk,
      riskScore: score,
      title: 'QR code scan',
      summary:
        risk === 'high'
          ? 'This QR code points to a high-risk destination. Do not proceed.'
          : risk === 'suspicious'
            ? 'This QR code leads somewhere suspicious. Review before opening.'
            : risk === 'low'
              ? 'QR destination looks safe, but preview the URL before opening.'
              : 'Could not determine the safety of this QR code.',
      signals: [
        { label: 'Destination type', detail: payload.startsWith('http') ? 'Opens a website' : payload.startsWith('upi') ? 'Triggers a UPI payment' : 'Unknown payload', severity: payload.startsWith('upi') ? 'warning' : 'info' },
        { label: 'Hidden redirect', detail: /bit\.ly|tinyurl/.test(payload) ? 'Shortened link hides real target' : 'Direct link', severity: /bit\.ly|tinyurl/.test(payload) ? 'warning' : 'info' },
        { label: 'Payment request', detail: payload.startsWith('upi') ? 'Requests money via UPI' : 'No payment intent', severity: payload.startsWith('upi') ? 'danger' : 'info' },
      ],
      recommendations: [
        'Preview the URL before opening it in a browser.',
        'Never approve UPI collect requests from unknown QR codes.',
        'Cover your screen while scanning in public.',
      ],
      createdAt: Date.now(),
    };
  },

  async analyzeScreenshot(description) {
    await wait();
    const { score } = scoreFor(description, PHISHING_KEYWORDS);
    const risk = level(score);
    return {
      id: `scan_${Date.now()}`,
      type: 'screenshot',
      input: description,
      riskLevel: risk,
      riskScore: score,
      title: 'Screenshot analysis',
      summary:
        risk === 'high'
          ? 'Visual cues in this screenshot strongly match known scam patterns.'
          : risk === 'suspicious'
            ? 'Some elements in this screenshot resemble scam layouts.'
            : risk === 'low'
              ? 'No obvious scam markers, but stay alert.'
              : 'Could not confidently analyze the screenshot.',
      signals: [
        { label: 'Fake verification badge', detail: /verified|blue tick|official/.test(description.toLowerCase()) ? 'Claims official status' : 'Not detected', severity: /verified|official/.test(description.toLowerCase()) ? 'warning' : 'info' },
        { label: 'Payment urgency', detail: /pay now|pay within|blocked/.test(description.toLowerCase()) ? 'Pressures payment' : 'Not detected', severity: /pay now|blocked/.test(description.toLowerCase()) ? 'danger' : 'info' },
        { label: 'Spoofed branding', detail: /bank|income tax|customs|parcel/.test(description.toLowerCase()) ? 'Imitates authority' : 'Not detected', severity: /bank|customs|tax/.test(description.toLowerCase()) ? 'warning' : 'info' },
      ],
      recommendations: [
        'Compare with official app screenshots side by side.',
        'Do not act on payment demands from unknown contacts.',
        'Forward suspicious screenshots to 19090 (cybercrime helpline).',
      ],
      createdAt: Date.now(),
    };
  },

  async analyzeApk(name, url) {
    await wait();
    const combined = `${name} ${url}`;
    const { score } = scoreFor(combined, APK_KEYWORDS);
    const risk = level(score);
    return {
      id: `scan_${Date.now()}`,
      type: 'apk',
      input: `${name} — ${url}`,
      riskLevel: risk,
      riskScore: score,
      title: `APK analysis: ${name}`,
      summary:
        risk === 'high'
          ? 'This APK is likely malicious or pirated. Installation is strongly discouraged.'
          : risk === 'suspicious'
            ? 'This APK shows sideloading risk markers.'
            : risk === 'low'
              ? 'No strong malicious signals, but sideloading always carries risk.'
              : 'Could not assess this APK confidently.',
      signals: [
        { label: 'Source', detail: /play\.google|appstore/.test(url) ? 'Official store' : 'Third-party / direct download', severity: /play\.google|appstore/.test(url) ? 'info' : 'danger' },
        { label: 'Modded/cracked', detail: /mod|crack|patch|premium/.test(name.toLowerCase()) ? 'Claims to unlock paid features' : 'Not detected', severity: /mod|crack|premium/.test(name.toLowerCase()) ? 'danger' : 'info' },
        { label: 'Requested permissions', detail: 'Likely requests SMS, contacts, and overlay access', severity: 'warning' },
      ],
      recommendations: [
        'Install apps only from the Google Play Store or Apple App Store.',
        'Enable Play Protect and keep unknown-sources installs off.',
        'Uninstall the APK immediately if already installed.',
      ],
      createdAt: Date.now(),
    };
  },

  async analyzePayment(request) {
    await wait();
    const { score } = scoreFor(request, PAYMENT_KEYWORDS);
    const risk = level(score);
    return {
      id: `scan_${Date.now()}`,
      type: 'payment',
      input: request,
      riskLevel: risk,
      riskScore: score,
      title: 'Payment request analysis',
      summary:
        risk === 'high'
          ? 'This payment request shows strong fraud indicators. Do not pay.'
          : risk === 'suspicious'
            ? 'This payment request has several red flags. Verify the recipient.'
            : risk === 'low'
              ? 'No major fraud signals, but always confirm recipient details.'
              : 'Could not assess this payment request.',
      signals: [
        { label: 'Pressure tactics', detail: /urgent|now|immediately|within/.test(request.toLowerCase()) ? 'Demands immediate payment' : 'No urgency', severity: /urgent|immediately/.test(request.toLowerCase()) ? 'danger' : 'info' },
        { label: 'Unusual recipient', detail: /unknown|stranger|new/.test(request.toLowerCase()) ? 'Unknown recipient' : 'Known contact pattern', severity: /unknown|stranger/.test(request.toLowerCase()) ? 'warning' : 'info' },
        { label: 'Investment/gift bait', detail: /investment|doubled|gift|refund/.test(request.toLowerCase()) ? 'Promises returns or refunds' : 'Not detected', severity: /investment|doubled|refund/.test(request.toLowerCase()) ? 'danger' : 'info' },
        { label: 'Collect request', detail: /collect|request money/.test(request.toLowerCase()) ? 'UPI collect request' : 'Send money', severity: /collect|request money/.test(request.toLowerCase()) ? 'warning' : 'info' },
      ],
      recommendations: [
        'Verify the recipient name and UPI ID independently before paying.',
        'Decline UPI collect requests from unknown parties.',
        'If already paid, report immediately to your bank and 1930.',
      ],
      createdAt: Date.now(),
    };
  },
};
