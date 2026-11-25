import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import type { Theme } from '@/theme/tokens';
import {
  ScanLine, MessageSquare, QrCode, Image as ImageIcon, FileCode, CreditCard,
  Bot, ShieldCheck, AlertTriangle, ChevronRight, TrendingUp, Bell,
} from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Screen, ScreenHeader } from '@/components/ui/Screen';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { SecurityScore } from '@/components/SecurityScore';
import { useAppSelector } from '@/store/hooks';
import { useQuery } from '@tanstack/react-query';
import { activityService } from '@/services';

const QUICK_ACTIONS = [
  { icon: ScanLine, label: 'URL', route: '/(tabs)/scan' as const, color: '#0E7C66' },
  { icon: MessageSquare, label: 'Message', route: '/(tabs)/scan' as const, color: '#1F6FEB' },
  { icon: QrCode, label: 'QR', route: '/(tabs)/scan' as const, color: '#7C4D0E' },
  { icon: ImageIcon, label: 'Screenshot', route: '/(tabs)/scan' as const, color: '#5B2A86' },
  { icon: FileCode, label: 'APK', route: '/(tabs)/scan' as const, color: '#B23A48' },
  { icon: CreditCard, label: 'Payment', route: '/(tabs)/scan' as const, color: '#0A5C4D' },
];

const RECOMMENDATIONS = [
  { icon: ShieldCheck, title: 'Enable two-factor authentication', detail: 'Add an extra layer to your account security.' },
  { icon: AlertTriangle, title: 'Review recent SMS for phishing', detail: 'Two suspicious messages detected this week.' },
  { icon: TrendingUp, title: 'Update your recovery phone number', detail: 'Keep recovery options current.' },
];

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const user = useAppSelector((s) => s.auth.user);
  const mfaEnrolled = useAppSelector((s) => s.auth.mfa.enrolled);

  const { data: activity, isLoading } = useQuery({
    queryKey: ['activity-recent'],
    queryFn: () => activityService.list(),
  });

  const recentScans = (activity ?? []).filter((a) => a.kind === 'scan').slice(0, 3);
  const firstName = user?.fullName?.split(' ')[0] ?? 'there';
  const securityScore = mfaEnrolled ? 82 : 64;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: theme.spacing.xxl }}>
        <ScreenHeader
          title={`Hi, ${firstName}`}
          subtitle="Your security at a glance"
          right={
            <Pressable onPress={() => router.push('/(tabs)/profile')} accessibilityLabel="Notifications">
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, alignItems: 'center', justifyContent: 'center' }}>
                <Bell size={20} color={theme.colors.textSecondary} strokeWidth={2} />
              </View>
            </Pressable>
          }
        />

        <View style={{ paddingHorizontal: theme.spacing.lg, gap: theme.spacing.lg }}>
          {/* Security overview */}
          <Card>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: theme.spacing.md }}>
              <View>
                <Text style={{ fontFamily: theme.typography.fontFamilyMedium, fontSize: theme.typography.sizes.md, color: theme.colors.textSecondary }}>
                  Security score
                </Text>
                <Text style={{ fontFamily: theme.typography.fontFamilyBold, fontSize: theme.typography.sizes.lg, color: theme.colors.textPrimary }}>
                  {securityScore >= 80 ? 'Well protected' : securityScore >= 50 ? 'Moderate' : 'At risk'}
                </Text>
              </View>
            </View>
            <View style={{ alignItems: 'center' }}>
              <SecurityScore score={securityScore} />
            </View>
            {!mfaEnrolled && (
              <View style={{ marginTop: theme.spacing.md }}>
                <Button label="Boost your score — enable MFA" variant="secondary" fullWidth icon={ShieldCheck} onPress={() => router.push('/(tabs)/profile')} />
              </View>
            )}
          </Card>

          {/* Quick actions */}
          <View>
            <Text style={{ fontFamily: theme.typography.fontFamilyBold, fontSize: theme.typography.sizes.lg, color: theme.colors.textPrimary, marginBottom: theme.spacing.md }}>
              Quick scan
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md }}>
              {QUICK_ACTIONS.map((action) => (
                <Pressable
                  key={action.label}
                  onPress={() => router.push(action.route)}
                  style={({ pressed }) => ({
                    width: '31%',
                    backgroundColor: theme.colors.surface,
                    borderRadius: theme.radii.lg,
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                    paddingVertical: theme.spacing.md,
                    alignItems: 'center',
                    gap: theme.spacing.sm,
                    opacity: pressed ? 0.8 : 1,
                  })}
                  accessibilityLabel={`Scan ${action.label}`}
                >
                  <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: action.color + '22', alignItems: 'center', justifyContent: 'center' }}>
                    <action.icon size={20} color={action.color} strokeWidth={2} />
                  </View>
                  <Text style={{ fontFamily: theme.typography.fontFamilyMedium, fontSize: theme.typography.sizes.sm, color: theme.colors.textPrimary }}>
                    {action.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* AI assistant entry */}
          <Pressable onPress={() => router.push('/assistant')} accessibilityLabel="Ask AI assistant">
            <Card raised style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md }}>
              <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: theme.colors.brand, alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={24} color="#FFFFFF" strokeWidth={2} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: theme.typography.fontFamilyBold, fontSize: theme.typography.sizes.md, color: theme.colors.textPrimary }}>
                  Ask ScamShield AI
                </Text>
                <Text style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary, marginTop: 2 }}>
                  Get instant guidance on any suspicious activity
                </Text>
              </View>
              <ChevronRight size={20} color={theme.colors.textMuted} />
            </Card>
          </Pressable>

          {/* Recent activity */}
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.md }}>
              <Text style={{ fontFamily: theme.typography.fontFamilyBold, fontSize: theme.typography.sizes.lg, color: theme.colors.textPrimary }}>
                Recent activity
              </Text>
              <Pressable onPress={() => router.push('/(tabs)/activity')}>
                <Text style={{ fontFamily: theme.typography.fontFamilyMedium, fontSize: theme.typography.sizes.sm, color: theme.colors.accent }}>
                  See all
                </Text>
              </Pressable>
            </View>
            {isLoading ? (
              <Card><Text style={{ color: theme.colors.textMuted, textAlign: 'center', padding: theme.spacing.md }}>Loading…</Text></Card>
            ) : recentScans.length === 0 ? (
              <Card><Text style={{ color: theme.colors.textMuted, textAlign: 'center', padding: theme.spacing.md }}>No recent scans yet.</Text></Card>
            ) : (
              <View style={{ gap: theme.spacing.sm }}>
                {recentScans.map((item) => (
                  <Pressable key={item.id} onPress={() => router.push('/(tabs)/activity')}>
                    <Card padded={false} style={{ paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.md }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flex: 1, marginRight: theme.spacing.md }}>
                          <Text style={{ fontFamily: theme.typography.fontFamilyMedium, fontSize: theme.typography.sizes.sm, color: theme.colors.textPrimary }} numberOfLines={1}>
                            {item.title}
                          </Text>
                          <Text style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.xs, color: theme.colors.textMuted, marginTop: 2 }} numberOfLines={1}>
                            {item.subtitle}
                          </Text>
                        </View>
                        {item.riskLevel ? <RiskBadge level={item.riskLevel} size="sm" /> : null}
                      </View>
                    </Card>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          {/* Recommendations */}
          <View>
            <Text style={{ fontFamily: theme.typography.fontFamilyBold, fontSize: theme.typography.sizes.lg, color: theme.colors.textPrimary, marginBottom: theme.spacing.md }}>
              Security recommendations
            </Text>
            <View style={{ gap: theme.spacing.sm }}>
              {RECOMMENDATIONS.map((rec, i) => (
                <Pressable key={i} onPress={() => router.push('/(tabs)/protection')}>
                  <Card padded={false} style={{ paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.md, flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md }}>
                    <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: theme.colors.warningSoft, alignItems: 'center', justifyContent: 'center' }}>
                      <rec.icon size={20} color={theme.colors.warning} strokeWidth={2} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontFamily: theme.typography.fontFamilyMedium, fontSize: theme.typography.sizes.sm, color: theme.colors.textPrimary }}>
                        {rec.title}
                      </Text>
                      <Text style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.xs, color: theme.colors.textMuted, marginTop: 2 }}>
                        {rec.detail}
                      </Text>
                    </View>
                    <ChevronRight size={18} color={theme.colors.textMuted} />
                  </Card>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
