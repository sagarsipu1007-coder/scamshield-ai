import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import {
  User, Shield, Bell, Lock, Eye, Sun, Moon, Monitor, Fingerprint,
  LogOut, ChevronRight, KeyRound, Mail, Phone, Globe, Accessibility,
  CheckCircle2,
} from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Screen, ScreenHeader } from '@/components/ui/Screen';
import { Card, CardHeader } from '@/components/ui/Card';
import { Row, ToggleRow } from '@/components/ui/Row';
import { Button } from '@/components/ui/Button';
import { Sheet } from '@/components/ui/Sheet';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setThemeMode, setBiometricEnabled, setNotificationsEnabled, setScanAlertsEnabled,
  setSecurityAlertsEnabled, setProductUpdatesEnabled, setReduceMotion, setHighContrast,
  setLargeText, resetAuth, setSession,
} from '@/store';
import { authService } from '@/services';
import type { ThemeMode } from '@/theme/tokens';

export default function ProfileScreen() {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const mfa = useAppSelector((s) => s.auth.mfa);
  const prefs = useAppSelector((s) => s.preferences);
  const [themeSheet, setThemeSheet] = useState(false);
  const [logoutSheet, setLogoutSheet] = useState(false);

  const initials = (user?.fullName ?? 'U')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const themeModes: { key: ThemeMode; label: string; icon: any }[] = [
    { key: 'light', label: 'Light', icon: Sun },
    { key: 'dark', label: 'Dark', icon: Moon },
    { key: 'system', label: 'System', icon: Monitor },
  ];

  const handleLogout = async () => {
    setLogoutSheet(false);
    await authService.logout();
    dispatch(resetAuth());
    dispatch(setSession(null));
    router.replace('/(auth)/onboarding');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: theme.spacing.xxl }}>
        <ScreenHeader title="Profile" subtitle="Account and settings" />

        <View style={{ paddingHorizontal: theme.spacing.lg, gap: theme.spacing.lg }}>
          {/* User card */}
          <Card>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md }}>
              <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: user?.avatarColor ?? theme.colors.brand, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontFamily: theme.typography.fontFamilyBold, fontSize: 24, color: '#FFFFFF' }}>{initials}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: theme.typography.fontFamilyBold, fontSize: theme.typography.sizes.lg, color: theme.colors.textPrimary }}>
                  {user?.fullName ?? 'User'}
                </Text>
                <Text style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary, marginTop: 2 }}>
                  {user?.email ?? 'user@example.com'}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs, marginTop: theme.spacing.sm }}>
                  {user?.emailVerified ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <CheckCircle2 size={12} color={theme.colors.success} strokeWidth={2.4} />
                      <Text style={{ fontFamily: theme.typography.fontFamilyMedium, fontSize: 11, color: theme.colors.success }}>Verified</Text>
                    </View>
                  ) : null}
                  {mfa.enrolled ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Shield size={12} color={theme.colors.brand} strokeWidth={2.4} />
                      <Text style={{ fontFamily: theme.typography.fontFamilyMedium, fontSize: 11, color: theme.colors.brand }}>MFA on</Text>
                    </View>
                  ) : null}
                </View>
              </View>
            </View>
          </Card>

          {/* Account info */}
          <Card>
            <CardHeader icon={User} title="Account" />
            <View style={{ gap: theme.spacing.sm }}>
              <Row icon={Mail} label="Email" subtitle={user?.email ?? '—'} chevron={false} />
              <Row icon={Phone} label="Phone" subtitle={user?.phone ?? 'Not set'} chevron={false} />
              <Row icon={KeyRound} label="Change password" onPress={() => router.push('/(auth)/forgot-password')} />
            </View>
          </Card>

          {/* Security / MFA */}
          <Card>
            <CardHeader icon={Shield} title="Security" subtitle="MFA and authentication" />
            <View style={{ gap: theme.spacing.sm }}>
              <Row
                icon={KeyRound}
                label="Two-factor authentication"
                subtitle={mfa.enrolled ? `Enabled via ${mfa.method}` : 'Not enabled'}
                onPress={() => router.push('/(auth)/mfa-setup')}
              />
              <Row
                icon={Fingerprint}
                label="Authenticator setup"
                subtitle={mfa.authenticatorSecret ? 'Secret generated' : 'Not configured'}
                onPress={() => router.push('/(auth)/mfa-setup')}
              />
              <Row
                icon={KeyRound}
                label="Recovery codes"
                subtitle={mfa.backupCodes.length > 0 ? `${mfa.backupCodes.length} codes saved` : 'Not generated'}
                onPress={() => router.push('/(auth)/recovery-codes')}
              />
              <ToggleRow
                icon={Fingerprint}
                label="Biometric unlock"
                subtitle="Use fingerprint or face to sign in"
                value={prefs.biometricEnabled}
                onValueChange={(v) => dispatch(setBiometricEnabled(v))}
              />
            </View>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader icon={Bell} title="Notifications" />
            <View style={{ gap: theme.spacing.sm }}>
              <ToggleRow icon={Bell} label="Push notifications" subtitle="Receive alerts on this device" value={prefs.notificationsEnabled} onValueChange={(v) => dispatch(setNotificationsEnabled(v))} />
              <ToggleRow icon={Shield} label="Scan alerts" subtitle="High-risk scan results" value={prefs.scanAlertsEnabled} onValueChange={(v) => dispatch(setScanAlertsEnabled(v))} />
              <ToggleRow icon={Lock} label="Security alerts" subtitle="Account and device threats" value={prefs.securityAlertsEnabled} onValueChange={(v) => dispatch(setSecurityAlertsEnabled(v))} />
              <ToggleRow icon={Globe} label="Product updates" subtitle="New features and tips" value={prefs.productUpdatesEnabled} onValueChange={(v) => dispatch(setProductUpdatesEnabled(v))} />
            </View>
          </Card>

          {/* Privacy */}
          <Card>
            <CardHeader icon={Lock} title="Privacy" />
            <View style={{ gap: theme.spacing.sm }}>
              <Row icon={Eye} label="Data and activity" subtitle="Manage what we store" onPress={() => {}} />
              <Row icon={Lock} label="App permissions" subtitle="Camera, photos, storage" onPress={() => {}} />
              <Row icon={Globe} label="Language" subtitle={prefs.language === 'en' ? 'English' : prefs.language} onPress={() => {}} />
            </View>
          </Card>

          {/* Appearance / theme */}
          <Card>
            <CardHeader icon={Sun} title="Appearance" subtitle="Theme and display" />
            <View style={{ gap: theme.spacing.sm }}>
              <Row icon={themeModes.find((t) => t.key === prefs.themeMode)?.icon ?? Monitor} label="Theme" subtitle={themeModes.find((t) => t.key === prefs.themeMode)?.label ?? 'System'} onPress={() => setThemeSheet(true)} />
            </View>
          </Card>

          {/* Accessibility */}
          <Card>
            <CardHeader icon={Accessibility} title="Accessibility" />
            <View style={{ gap: theme.spacing.sm }}>
              <ToggleRow icon={Eye} label="Reduce motion" subtitle="Minimize animations" value={prefs.reduceMotion} onValueChange={(v) => dispatch(setReduceMotion(v))} />
              <ToggleRow icon={Eye} label="High contrast" subtitle="Stronger color contrast" value={prefs.highContrast} onValueChange={(v) => dispatch(setHighContrast(v))} />
              <ToggleRow icon={Accessibility} label="Large text" subtitle="Increase font size" value={prefs.largeText} onValueChange={(v) => dispatch(setLargeText(v))} />
            </View>
          </Card>

          {/* Logout */}
          <Button label="Log out" variant="danger" fullWidth size="lg" icon={LogOut} onPress={() => setLogoutSheet(true)} />

          <Text style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.xs, color: theme.colors.textMuted, textAlign: 'center' }}>
            ScamShield AI v1.0.0 — Demo build with mock services
          </Text>
        </View>
      </ScrollView>

      {/* Theme picker */}
      <Sheet visible={themeSheet} onClose={() => setThemeSheet(false)} title="Choose theme">
        <View style={{ gap: theme.spacing.sm }}>
          {themeModes.map((t) => {
            const selected = prefs.themeMode === t.key;
            return (
              <Pressable key={t.key} onPress={() => { dispatch(setThemeMode(t.key)); setThemeSheet(false); }} accessibilityLabel={t.label}>
                <Card padded={false} style={{ paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.md, flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, borderColor: selected ? theme.colors.brand : theme.colors.border, borderWidth: selected ? 2 : 1 }}>
                  <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: theme.colors.brandSoft, alignItems: 'center', justifyContent: 'center' }}>
                    <t.icon size={20} color={theme.colors.brand} strokeWidth={2} />
                  </View>
                  <Text style={{ flex: 1, fontFamily: theme.typography.fontFamilyMedium, fontSize: theme.typography.sizes.md, color: theme.colors.textPrimary }}>{t.label}</Text>
                  {selected ? <CheckCircle2 size={20} color={theme.colors.brand} strokeWidth={2.4} /> : <ChevronRight size={18} color={theme.colors.textMuted} />}
                </Card>
              </Pressable>
            );
          })}
        </View>
      </Sheet>

      {/* Logout confirm */}
      <Sheet visible={logoutSheet} onClose={() => setLogoutSheet(false)} title="Log out?">
        <View style={{ gap: theme.spacing.md }}>
          <Text style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.md, color: theme.colors.textSecondary, lineHeight: theme.typography.lineHeight.relaxed }}>
            You will be signed out and returned to the welcome screen. Your security settings will be reset in this demo.
          </Text>
          <View style={{ gap: theme.spacing.sm }}>
            <Button label="Yes, log out" variant="danger" fullWidth size="lg" onPress={handleLogout} />
            <Button label="Cancel" variant="ghost" fullWidth onPress={() => setLogoutSheet(false)} />
          </View>
        </View>
      </Sheet>
    </SafeAreaView>
  );
}
