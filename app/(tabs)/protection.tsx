import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Shield, Smartphone, Users, Lock, CheckCircle2, Circle, ChevronRight,
  Fingerprint, Bell, KeyRound, Eye, Wifi, FileWarning,
} from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Screen, ScreenHeader } from '@/components/ui/Screen';
import { Card, CardHeader } from '@/components/ui/Card';
import { Row } from '@/components/ui/Row';
import { Sheet } from '@/components/ui/Sheet';
import { SecurityScore } from '@/components/SecurityScore';

type Section = 'identity' | 'device' | 'family' | 'privacy' | 'checklist';

const SECTIONS: { key: Section; icon: any; title: string; desc: string }[] = [
  { key: 'identity', icon: Shield, title: 'Digital Identity', desc: 'Protect your online identity' },
  { key: 'device', icon: Smartphone, title: 'Device Security', desc: 'Keep your phone safe' },
  { key: 'family', icon: Users, title: 'Family Protection', desc: 'Safeguard loved ones' },
  { key: 'privacy', icon: Lock, title: 'Privacy Protection', desc: 'Control your data' },
  { key: 'checklist', icon: CheckCircle2, title: 'Security Checklist', desc: 'Complete your setup' },
];

const CHECKLISTS: Record<Section, { icon: any; title: string; detail: string }[]> = {
  identity: [
    { icon: KeyRound, title: 'Enable MFA on all accounts', detail: 'Add two-factor to email, banking, and social.' },
    { icon: Fingerprint, title: 'Use strong unique passwords', detail: 'A password manager prevents reuse.' },
    { icon: Eye, title: 'Monitor credit report', detail: 'Check for unauthorized loans or accounts.' },
    { icon: Shield, title: 'Lock Aadhaar biometrics', detail: 'Prevent misuse via UIDAI lock/unlock.' },
    { icon: FileWarning, title: 'Limit KYC sharing', detail: 'Only share with verified institutions.' },
  ],
  device: [
    { icon: Smartphone, title: 'Install apps from Play Store only', detail: 'Avoid sideloading APKs.' },
    { icon: Wifi, title: 'Avoid public Wi-Fi for banking', detail: 'Use mobile data or a VPN.' },
    { icon: Bell, title: 'Enable Play Protect', detail: 'Google scans for harmful apps.' },
    { icon: Lock, title: 'Set a screen lock', detail: 'PIN, pattern, or biometric.' },
    { icon: Fingerprint, title: 'Keep OS updated', detail: 'Updates patch security holes.' },
  ],
  family: [
    { icon: Users, title: 'Educate elders on scams', detail: 'Common frauds target seniors.' },
    { icon: Bell, title: 'Set up scam alerts', detail: 'Family gets notified of threats.' },
    { icon: Shield, title: 'Enable parental controls', detail: 'Block malicious sites for kids.' },
    { icon: Eye, title: 'Monitor children\'s app usage', detail: 'Watch for phishing in games.' },
  ],
  privacy: [
    { icon: Lock, title: 'Review app permissions', detail: 'Revoke unused camera, SMS, contacts.' },
    { icon: Eye, title: 'Limit social media exposure', detail: 'Private accounts reduce targeting.' },
    { icon: FileWarning, title: 'Opt out of data brokers', detail: 'Reduce unwanted tracking.' },
    { icon: Wifi, title: 'Use encrypted messaging', detail: 'Prefer end-to-end encrypted apps.' },
  ],
  checklist: [
    { icon: KeyRound, title: 'Enable two-factor authentication', detail: 'Add MFA to your ScamShield account.' },
    { icon: Fingerprint, title: 'Set up biometric unlock', detail: 'Faster and more secure sign-in.' },
    { icon: Bell, title: 'Turn on scan alerts', detail: 'Get notified of high-risk results.' },
    { icon: Shield, title: 'Complete your first scan', detail: 'Check a recent suspicious link.' },
    { icon: Lock, title: 'Review privacy settings', detail: 'Control what data you share.' },
    { icon: Users, title: 'Add a family member', detail: 'Extend protection to loved ones.' },
  ],
};

export default function ProtectionScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [openSection, setOpenSection] = useState<Section | null>(null);
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (key: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const section = openSection ? SECTIONS.find((s) => s.key === openSection) : null;
  const items = openSection ? CHECKLISTS[openSection] : [];
  const completedCount = items.filter((_, i) => checked.has(`${openSection}-${i}`)).length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: theme.spacing.xxl }}>
        <ScreenHeader title="Protection" subtitle="Your defense center" />

        <View style={{ paddingHorizontal: theme.spacing.lg, gap: theme.spacing.lg }}>
          {/* Overview */}
          <Card>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: theme.typography.fontFamilyMedium, fontSize: theme.typography.sizes.md, color: theme.colors.textSecondary }}>
                  Protection coverage
                </Text>
                <Text style={{ fontFamily: theme.typography.fontFamilyBold, fontSize: theme.typography.sizes.lg, color: theme.colors.textPrimary, marginTop: 2 }}>
                  {Math.round((checked.size / 24) * 100)}% complete
                </Text>
              </View>
              <SecurityScore score={Math.max(20, Math.round((checked.size / 24) * 100))} />
            </View>
          </Card>

          {/* Section cards */}
          {SECTIONS.map((s) => (
            <Pressable key={s.key} onPress={() => setOpenSection(s.key)} accessibilityLabel={s.title}>
              <Card padded={false} style={{ paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.md, flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md }}>
                <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: theme.colors.brandSoft, alignItems: 'center', justifyContent: 'center' }}>
                  <s.icon size={24} color={theme.colors.brand} strokeWidth={2} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: theme.typography.fontFamilyBold, fontSize: theme.typography.sizes.md, color: theme.colors.textPrimary }}>
                    {s.title}
                  </Text>
                  <Text style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary, marginTop: 2 }}>
                    {s.desc}
                  </Text>
                </View>
                <ChevronRight size={20} color={theme.colors.textMuted} />
              </Card>
            </Pressable>
          ))}

          {/* Quick links */}
          <Card>
            <CardHeader icon={Shield} title="Quick actions" subtitle="Jump to key protections" />
            <View style={{ gap: theme.spacing.sm }}>
              <Row icon={KeyRound} label="Manage MFA" subtitle="Authenticator and recovery codes" onPress={() => router.push('/(tabs)/profile')} />
              <Row icon={Fingerprint} label="Biometric unlock" subtitle="Enable fingerprint or face" onPress={() => router.push('/(auth)/biometric')} />
              <Row icon={Bell} label="Notification preferences" subtitle="Choose what alerts you get" onPress={() => router.push('/(tabs)/profile')} />
            </View>
          </Card>
        </View>
      </ScrollView>

      {/* Detail sheet */}
      <Sheet visible={!!openSection} onClose={() => setOpenSection(null)} title={section?.title}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: theme.spacing.sm, paddingBottom: theme.spacing.lg }}>
          <Text style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary, marginBottom: theme.spacing.sm }}>
            {completedCount} of {items.length} completed
          </Text>
          {items.map((item, i) => {
            const key = `${openSection}-${i}`;
            const done = checked.has(key);
            return (
              <Pressable key={key} onPress={() => toggle(key)} accessibilityLabel={`${done ? 'Completed' : 'Incomplete'}: ${item.title}`}>
                <Card padded={false} style={{ paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.md, flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, borderColor: done ? theme.colors.success : theme.colors.border, borderWidth: done ? 1.5 : 1 }}>
                  <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: done ? theme.colors.successSoft : theme.colors.surfaceRaised, alignItems: 'center', justifyContent: 'center' }}>
                    {done ? <CheckCircle2 size={20} color={theme.colors.success} strokeWidth={2} /> : <Circle size={20} color={theme.colors.textMuted} strokeWidth={2} />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: theme.typography.fontFamilyMedium, fontSize: theme.typography.sizes.sm, color: theme.colors.textPrimary, textDecorationLine: done ? 'line-through' : 'none' }}>
                      {item.title}
                    </Text>
                    <Text style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.xs, color: theme.colors.textMuted, marginTop: 2 }}>
                      {item.detail}
                    </Text>
                  </View>
                </Card>
              </Pressable>
            );
          })}
        </ScrollView>
      </Sheet>
    </SafeAreaView>
  );
}
