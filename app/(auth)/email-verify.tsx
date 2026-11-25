import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TextInput, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { MailCheck, RefreshCw } from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { BrandLogo } from '@/components/BrandLogo';
import { Button } from '@/components/ui/Button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setLoading, setAuthError } from '@/store';
import { authService } from '@/services';

const DEMO_OTP = '284913';

export default function EmailVerifyScreen() {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const loading = useAppSelector((s) => s.auth.status === 'loading');
  const error = useAppSelector((s) => s.auth.error);
  const email = useAppSelector((s) => s.auth.user?.email ?? 'your email');
  const [code, setCode] = useState('');
  const [resending, setResending] = useState(false);

  const verify = async () => {
    dispatch(setAuthError(null));
    dispatch(setLoading(true));
    try {
      const { verified } = await authService.verifyEmailOtp(email, code);
      if (verified) router.replace('/(auth)/mfa-setup');
      else dispatch(setAuthError('Incorrect code. Try again.'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const resend = async () => {
    setResending(true);
    await authService.sendEmailOtp(email);
    setResending(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top', 'bottom']}>
      <View style={{ flex: 1, paddingHorizontal: theme.spacing.xl, justifyContent: 'center' }}>
        <BrandLogo size="md" withText={false} />
        <View style={{ alignItems: 'center', marginTop: theme.spacing.xxl }}>
          <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: theme.colors.brandSoft, alignItems: 'center', justifyContent: 'center' }}>
            <MailCheck size={44} color={theme.colors.brand} strokeWidth={1.8} />
          </View>
        </View>
        <Text style={{ fontFamily: theme.typography.fontFamilyBold, fontSize: theme.typography.sizes.xxl, color: theme.colors.textPrimary, textAlign: 'center', marginTop: theme.spacing.xl }}>
          Verify your email
        </Text>
        <Text style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.md, color: theme.colors.textSecondary, textAlign: 'center', marginTop: theme.spacing.sm, lineHeight: theme.typography.lineHeight.relaxed }}>
          We sent a 6-digit code to {email}. Enter it below to confirm your account.
        </Text>

        <View style={{ marginTop: theme.spacing.xxl }}>
          <Text style={{ fontFamily: theme.typography.fontFamilyMedium, fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary, marginBottom: theme.spacing.sm }}>
            Verification code
          </Text>
          <TextInput
            value={code}
            onChangeText={(v) => setCode(v.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
            keyboardType="number-pad"
            accessibilityLabel="Verification code"
            style={{
              fontFamily: theme.typography.fontFamilyBold,
              fontSize: 30,
              letterSpacing: 12,
              textAlign: 'center',
              backgroundColor: theme.colors.surface,
              borderWidth: 1,
              borderColor: code.length === 6 ? theme.colors.brand : theme.colors.border,
              borderRadius: theme.radii.md,
              paddingVertical: theme.spacing.md,
              color: theme.colors.textPrimary,
            }}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: theme.spacing.xs, marginTop: theme.spacing.md }}>
            <Text style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.xs, color: theme.colors.textMuted }}>
              Demo code:
            </Text>
            <Pressable onPress={() => setCode(DEMO_OTP)} accessibilityLabel="Use demo code">
              <Text style={{ fontFamily: theme.typography.fontFamilyMedium, fontSize: theme.typography.sizes.sm, color: theme.colors.accent }}>
                {DEMO_OTP}
              </Text>
            </Pressable>
          </View>
        </View>

        {error ? (
          <Text style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.sm, color: theme.colors.error, textAlign: 'center', marginTop: theme.spacing.md }}>
            {error}
          </Text>
        ) : null}

        <View style={{ marginTop: theme.spacing.xl, gap: theme.spacing.sm }}>
          <Button label="Verify email" fullWidth size="lg" loading={loading} onPress={verify} />
          <Button label={resending ? 'Sending…' : 'Resend code'} variant="ghost" fullWidth icon={RefreshCw} onPress={resend} />
          <Button label="Continue to MFA setup" variant="ghost" fullWidth onPress={() => router.replace('/(auth)/mfa-setup')} />
        </View>
      </View>
    </SafeAreaView>
  );
}
