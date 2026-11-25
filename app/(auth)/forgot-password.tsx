import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, ArrowLeft } from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { BrandLogo } from '@/components/BrandLogo';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setLoading, setAuthError } from '@/store';
import { authService } from '@/services';

export default function ForgotPasswordScreen() {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const loading = useAppSelector((s) => s.auth.status === 'loading');
  const error = useAppSelector((s) => s.auth.error);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [done, setDone] = useState(false);

  const sendReset = async () => {
    dispatch(setAuthError(null));
    dispatch(setLoading(true));
    try {
      await authService.requestPasswordReset(email);
      setSent(true);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const reset = async () => {
    dispatch(setAuthError(null));
    dispatch(setLoading(true));
    try {
      const { success } = await authService.resetPassword(token, newPassword);
      if (success) setDone(true);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: theme.spacing.xl, paddingVertical: theme.spacing.xl }} keyboardShouldPersistTaps="handled">
        <Button label="Back to login" variant="ghost" icon={ArrowLeft} onPress={() => router.replace('/(auth)/login')} />
        <BrandLogo size="md" withText={false} />
        <Text style={{ fontFamily: theme.typography.fontFamilyBold, fontSize: theme.typography.sizes.xxl, color: theme.colors.textPrimary, marginTop: theme.spacing.xl }}>
          {done ? 'Password reset' : sent ? 'Enter reset code' : 'Forgot password'}
        </Text>
        <Text style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.md, color: theme.colors.textSecondary, marginTop: theme.spacing.xs, marginBottom: theme.spacing.xl, lineHeight: theme.typography.lineHeight.relaxed }}>
          {done
            ? 'Your password has been reset. You can now sign in with your new password.'
            : sent
              ? 'We sent a reset code to your email. Enter it below along with a new password.'
              : 'Enter your email and we will send you a reset code.'}
        </Text>

        {done ? (
          <Button label="Back to login" fullWidth size="lg" onPress={() => router.replace('/(auth)/login')} />
        ) : !sent ? (
          <View style={{ gap: theme.spacing.md }}>
            <Field label="Email" icon={Mail} placeholder="you@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" accessibilityLabel="Email" />
            {error ? <Text style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.sm, color: theme.colors.error }}>{error}</Text> : null}
            <Button label="Send reset code" fullWidth size="lg" loading={loading} onPress={sendReset} />
          </View>
        ) : (
          <View style={{ gap: theme.spacing.md }}>
            <View>
              <Text style={{ fontFamily: theme.typography.fontFamilyMedium, fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary, marginBottom: theme.spacing.xs }}>
                Reset code
              </Text>
              <TextInput
                value={token}
                onChangeText={setToken}
                placeholder="Enter reset code"
                accessibilityLabel="Reset code"
                style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.md, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radii.md, paddingHorizontal: theme.spacing.md, height: 52, color: theme.colors.textPrimary }}
              />
            </View>
            <View>
              <Text style={{ fontFamily: theme.typography.fontFamilyMedium, fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary, marginBottom: theme.spacing.xs }}>
                New password
              </Text>
              <TextInput
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="At least 8 characters"
                secureTextEntry
                accessibilityLabel="New password"
                style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.md, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radii.md, paddingHorizontal: theme.spacing.md, height: 52, color: theme.colors.textPrimary }}
              />
            </View>
            {error ? <Text style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.sm, color: theme.colors.error }}>{error}</Text> : null}
            <Button label="Reset password" fullWidth size="lg" loading={loading} onPress={reset} />
            <Text style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.xs, color: theme.colors.textMuted, textAlign: 'center' }}>
              Demo: any code and password will work.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
