# Project memory

## Product intent & audience

- **ScamShield AI**: mobile security app that detects and helps users recover from scams/fraud
- Target users include vulnerable consumers and families, with emphasis on Indian cybercrime reporting resources (1930, cybercrime.gov.in, UPI/banking/WhatsApp fraud flows)
- Core capabilities: multi-format scam scanning (URL, message, QR, screenshot, APK, payment), AI assistant for security guidance, incident recovery workflows, protection checklists, activity timeline

## Brand personality & voice

- Trustworthy, protective, clear, and actionable
- Risk verdicts communicated plainly: Low / Suspicious / High / Unknown
- Mock/simulated features are explicitly labeled to maintain user trust

## Visual design & UX direction

- Centralized theme tokens with full light/dark color ramps; user-selectable theme (Light/Dark/System) persisted via Redux
- Reusable component library: Button, Card, Field, Row, Sheet, RiskBadge, loading/empty/error states
- Five-tab bottom navigation (Home, Scan, Protection, Activity, Profile)
- Home: security score ring, quick-scan action grid, AI assistant entry, recent activity feed, recommendations
- Scan screens: risk verdict with signal breakdown and step-by-step recommendations; QR/screenshot flows use camera/gallery pickers
- Protection: expandable accordion sections with checkable items and live coverage score
- Activity: searchable + filterable timeline
- Profile: grouped settings (MFA, notifications, privacy, theme, accessibility, logout)
- Accessibility options exposed in profile settings

## Decisions, constraints & rationale

- **Framework**: Expo (React Native)
- **State**: Redux Toolkit for preferences/auth/chat; TanStack Query for server data
- **Forms**: React Hook Form + Zod validation
- **Architecture**: typed service interfaces abstract mock data, ready for backend swap-in
- **Auth**: fully mock-based flow — onboarding, registration, login, biometric option, email OTP (demo code 284913), authenticator-app MFA with QR secret, email/SMS MFA, recovery codes, password recovery, biometric unlock
- **Incident recovery**: guided checklists per fraud type (UPI, banking, phishing, WhatsApp, identity, APK) with evidence collection, timeline, and reporting resources
- Build and typecheck both pass

## Open questions & assumptions

- All data is mock/simulated; real backend endpoints, auth provider, and scanner engines not yet integrated
- Camera/gallery permissions and native biometric module wiring assumed handled by Expo APIs but not yet tested on device
- Push notifications and real OTP delivery are placeholders
- Localization beyond English not addressed