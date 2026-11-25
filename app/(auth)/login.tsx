import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, Lock, Fingerprint } from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { BrandLogo } from '@/components/BrandLogo';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setLoading, setUser, setSession, setAuthError } from '@/store';
import { authService } from '@/services';
import { useAppReady } from './login-utils';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Enter your password'),
});

type FormValues = z.infer<typeof schema>;

export default function LoginScreen() {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const loading = useAppSelector((s) => s.auth.status === 'loading');
  const error = useAppSelector((s) => s.auth.error);
  const biometricEnabled = useAppSelector((s) => s.preferences.biometricEnabled);
  useAppReady();

  const { control, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const onLogin = async (values: FormValues) => {
    dispatch(setAuthError(null));
    dispatch(setLoading(true));
    try {
      const { user, session } = await authService.login({ email: values.email, password: values.password });
      dispatch(setUser(user));
      dispatch(setSession(session));
      router.replace('/(tabs)');
    } catch (e: any) {
      dispatch(setAuthError(e?.message ?? 'Login failed'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const onBiometric = async () => {
    dispatch(setAuthError(null));
    dispatch(setLoading(true));
    try {
      const { unlocked } = await authService.biometricUnlock();
      if (unlocked) {
        const { user, session } = await authService.login({ email: 'demo@scamshield.ai', password: 'biometric' });
        dispatch(setUser(user));
        dispatch(setSession(session));
        router.replace('/(tabs)');
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: theme.spacing.xl, paddingVertical: theme.spacing.xl }} keyboardShouldPersistTaps="handled">
        <BrandLogo size="md" />
        <Text style={{ fontFamily: theme.typography.fontFamilyBold, fontSize: theme.typography.sizes.xxl, color: theme.colors.textPrimary, marginTop: theme.spacing.xl }}>
          Welcome back
        </Text>
        <Text style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.md, color: theme.colors.textSecondary, marginTop: theme.spacing.xs, marginBottom: theme.spacing.xl }}>
          Sign in to continue protecting yourself.
        </Text>

        <View style={{ gap: theme.spacing.md }}>
          <Controller control={control} name="email" render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Field label="Email" icon={Mail} placeholder="you@example.com" value={value} onChangeText={onChange} error={error?.message} keyboardType="email-address" autoCapitalize="none" accessibilityLabel="Email" />
          )} />
          <Controller control={control} name="password" render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Field label="Password" icon={Lock} placeholder="Your password" value={value} onChangeText={onChange} error={error?.message} secureTextEntry autoCapitalize="none" accessibilityLabel="Password" />
          )} />
        </View>

        <View style={{ alignItems: 'flex-end', marginTop: theme.spacing.sm }}>
          <Pressable onPress={() => router.push('/(auth)/forgot-password')} accessibilityLabel="Forgot password">
            <Text style={{ fontFamily: theme.typography.fontFamilyMedium, fontSize: theme.typography.sizes.sm, color: theme.colors.accent }}>
              Forgot password?
            </Text>
          </Pressable>
        </View>

        {error ? (
          <Text style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.sm, color: theme.colors.error, marginTop: theme.spacing.md }}>
            {error}
          </Text>
        ) : null}

        <View style={{ marginTop: theme.spacing.xl, gap: theme.spacing.sm }}>
          <Button label="Sign in" fullWidth size="lg" loading={loading} onPress={() => handleSubmit(onLogin)()} />
          {biometricEnabled ? (
            <Button label="Use biometric unlock" variant="outline" fullWidth icon={Fingerprint} onPress={onBiometric} />
          ) : null}
          <Button label="Don't have an account? Register" variant="ghost" fullWidth onPress={() => router.replace('/(auth)/register')} />
        </View>

        <Text style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.xs, color: theme.colors.textMuted, textAlign: 'center', marginTop: theme.spacing.lg }}>
          Demo app: any email and password will sign you in.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
