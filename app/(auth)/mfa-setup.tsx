import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, ScrollView, TextInput, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Smartphone, KeyRound, ShieldCheck, Copy, Mail, Phone } from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { BrandLogo } from '@/components/BrandLogo';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Row } from '@/components/ui/Row';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setLoading, setMfa, setAuthError } from '@/store';
import { authService } from '@/services';

type Method = 'authenticator' | 'email' | 'sms';

export default function MfaSetupScreen() {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const loading = useAppSelector((s) => s.auth.status === 'loading');
  const error = useAppSelector((s) => s.auth.error);
  const [method, setMethod] = useState<Method | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [qrUri, setQrUri] = useState<string | null>(null);
  const [code, setCode] = useState('');

  const chooseAuthenticator = async () => {
    setMethod('authenticator');
    dispatch(setLoading(true));
    try {
      const { secret, qrUri } = await authService.enrollAuthenticator();
      setSecret(secret);
      setQrUri(qrUri);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const verify = async () => {
    dispatch(setAuthError(null));
    dispatch(setLoading(true));
    try {
      const { verified } = await authService.verifyAuthenticator(code);
      if (verified) {
        const codes = await authService.generateRecoveryCodes();
        dispatch(setMfa({ enrolled: true, method, authenticatorSecret: secret, authenticatorQrUri: qrUri, backupCodes: codes }));
        router.replace('/(auth)/recovery-codes');
      } else dispatch(setAuthError('Incorrect code. Try again.'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const skip = () => router.replace('/(tabs)');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: theme.spacing.xl, paddingVertical: theme.spacing.xl }} keyboardShouldPersistTaps="handled">
        <BrandLogo size="md" withText={false} />
        <Text style={{ fontFamily: theme.typography.fontFamilyBold, fontSize: theme.typography.sizes.xxl, color: theme.colors.textPrimary, marginTop: theme.spacing.xl }}>
          Set up two-factor auth
        </Text>
        <Text style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.md, color: theme.colors.textSecondary, marginTop: theme.spacing.xs, marginBottom: theme.spacing.xl, lineHeight: theme.typography.lineHeight.relaxed }}>
          Add an extra layer of security. Even if someone gets your password, they cannot sign in without your second factor.
        </Text>

        {!method ? (
          <View style={{ gap: theme.spacing.md }}>
            <Row icon={Smartphone} label="Authenticator app" subtitle="Google Authenticator, Authy, 1Password" onPress={chooseAuthenticator} chevron />
            <Row icon={Mail} label="Email" subtitle="Get a code by email each sign-in" onPress={() => setMethod('email')} chevron />
            <Row icon={Phone} label="SMS" subtitle="Get a code by text each sign-in" onPress={() => setMethod('sms')} chevron />
            <View style={{ height: theme.spacing.lg }} />
            <Button label="Skip for now" variant="ghost" fullWidth onPress={skip} />
          </View>
        ) : method === 'authenticator' ? (
          <View style={{ gap: theme.spacing.md }}>
            <Card>
              <Text style={{ fontFamily: theme.typography.fontFamilyMedium, fontSize: theme.typography.sizes.md, color: theme.colors.textPrimary, marginBottom: theme.spacing.sm }}>
                1. Scan this QR code
              </Text>
              <View style={{ alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: theme.radii.md, padding: theme.spacing.lg, borderWidth: 1, borderColor: theme.colors.border }}>
                <Text style={{ fontFamily: 'Inter-Regular', fontSize: 9, lineHeight: 12, color: '#000000', letterSpacing: 0 }}>
                  {renderFakeQr()}
                </Text>
                <Text style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.xs, color: theme.colors.textMuted, marginTop: theme.spacing.sm, textAlign: 'center' }}>
                  (QR preview — scan with your authenticator app)
                </Text>
              </View>
              <Text style={{ fontFamily: theme.typography.fontFamilyMedium, fontSize: theme.typography.sizes.md, color: theme.colors.textPrimary, marginTop: theme.spacing.md, marginBottom: theme.spacing.xs }}>
                Or enter this key manually
              </Text>
              <Pressable onPress={() => secret && copyText(secret)} style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, backgroundColor: theme.colors.surfaceRaised, padding: theme.spacing.md, borderRadius: theme.radii.sm }}>
                <Text style={{ flex: 1, fontFamily: theme.typography.fontFamilyMedium, fontSize: theme.typography.sizes.sm, color: theme.colors.textPrimary, letterSpacing: 1 }}>
                  {secret ?? '—'}
                </Text>
                <Copy size={16} color={theme.colors.textSecondary} />
              </Pressable>
            </Card>
            <Card>
              <Text style={{ fontFamily: theme.typography.fontFamilyMedium, fontSize: theme.typography.sizes.md, color: theme.colors.textPrimary, marginBottom: theme.spacing.sm }}>
                2. Enter the 6-digit code
              </Text>
              <TextInput
                value={code}
                onChangeText={(v) => setCode(v.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                keyboardType="number-pad"
                accessibilityLabel="Authenticator code"
                style={{ fontFamily: theme.typography.fontFamilyBold, fontSize: 24, letterSpacing: 10, textAlign: 'center', backgroundColor: theme.colors.surfaceRaised, borderWidth: 1, borderColor: code.length === 6 ? theme.colors.brand : theme.colors.border, borderRadius: theme.radii.md, paddingVertical: theme.spacing.md, color: theme.colors.textPrimary }}
              />
            </Card>
            {error ? <Text style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.sm, color: theme.colors.error }}>{error}</Text> : null}
            <Button label="Verify and enable" fullWidth size="lg" loading={loading} onPress={verify} icon={ShieldCheck} />
            <Button label="Back" variant="ghost" fullWidth onPress={() => setMethod(null)} />
          </View>
        ) : (
          <View style={{ gap: theme.spacing.md }}>
            <Card>
              <Text style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.md, color: theme.colors.textPrimary, lineHeight: theme.typography.lineHeight.relaxed }}>
                {method === 'email'
                  ? 'We will send a 6-digit verification code to your email every time you sign in. Make sure your email is secure and accessible.'
                  : 'We will text a 6-digit verification code to your phone every time you sign in. Standard message rates may apply.'}
              </Text>
            </Card>
            <Button label="Enable and continue" fullWidth size="lg" onPress={async () => { const codes = await authService.generateRecoveryCodes(); dispatch(setMfa({ enrolled: true, method, backupCodes: codes })); router.replace('/(auth)/recovery-codes'); }} icon={ShieldCheck} />
            <Button label="Back" variant="ghost" fullWidth onPress={() => setMethod(null)} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function renderFakeQr(): string {
  // ASCII-art placeholder for the QR code (demo only).
  const rows = 9;
  return Array.from({ length: rows }, (_, i) =>
    Array.from({ length: rows * 2 }, (_, j) => ((i * 7 + j * 3) % 3 === 0 ? '██' : '  ')).join(''),
  ).join('\n');
}

function copyText(_t: string) { /* no-op on web */ }
