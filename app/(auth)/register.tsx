import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, Lock, User, Phone } from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { BrandLogo } from '@/components/BrandLogo';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setLoading, setUser, setSession, setAuthError } from '@/store';
import { authService } from '@/services';

const schema = z
  .object({
    fullName: z.string().min(2, 'Enter your full name'),
    email: z.string().email('Enter a valid email'),
    phone: z.string().optional(),
    password: z.string().min(8, 'At least 8 characters').regex(/[A-Z]/, 'Add an uppercase letter').regex(/[0-9]/, 'Add a number'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] });

type FormValues = z.infer<typeof schema>;

export default function RegisterScreen() {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const loading = useAppSelector((s) => s.auth.status === 'loading');
  const error = useAppSelector((s) => s.auth.error);

  const { control, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: '', email: '', phone: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (values: FormValues) => {
    dispatch(setAuthError(null));
    dispatch(setLoading(true));
    try {
      const { user, session } = await authService.register({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        phone: values.phone,
      });
      dispatch(setUser(user));
      dispatch(setSession(session));
      router.replace('/(auth)/email-verify');
    } catch (e: any) {
      dispatch(setAuthError(e?.message ?? 'Registration failed'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: theme.spacing.xl, paddingVertical: theme.spacing.xl }} keyboardShouldPersistTaps="handled">
        <BrandLogo size="md" />
        <Text style={{ fontFamily: theme.typography.fontFamilyBold, fontSize: theme.typography.sizes.xxl, color: theme.colors.textPrimary, marginTop: theme.spacing.xl }}>
          Create your account
        </Text>
        <Text style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.md, color: theme.colors.textSecondary, marginTop: theme.spacing.xs, marginBottom: theme.spacing.xl }}>
          Join ScamShield AI to start protecting yourself from fraud.
        </Text>

        <View style={{ gap: theme.spacing.md }}>
          <Controller control={control} name="fullName" render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Field label="Full name" icon={User} placeholder="Aarav Sharma" value={value} onChangeText={onChange} error={error?.message} autoCapitalize="words" accessibilityLabel="Full name" />
          )} />
          <Controller control={control} name="email" render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Field label="Email" icon={Mail} placeholder="you@example.com" value={value} onChangeText={onChange} error={error?.message} keyboardType="email-address" autoCapitalize="none" accessibilityLabel="Email" />
          )} />
          <Controller control={control} name="phone" render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Field label="Phone (optional)" icon={Phone} placeholder="+91 98765 43210" value={value} onChangeText={onChange} error={error?.message} keyboardType="phone-pad" accessibilityLabel="Phone" />
          )} />
          <Controller control={control} name="password" render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Field label="Password" icon={Lock} placeholder="At least 8 characters" value={value} onChangeText={onChange} error={error?.message} secureTextEntry autoCapitalize="none" accessibilityLabel="Password" />
          )} />
          <Controller control={control} name="confirmPassword" render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Field label="Confirm password" icon={Lock} placeholder="Re-enter password" value={value} onChangeText={onChange} error={error?.message} secureTextEntry autoCapitalize="none" accessibilityLabel="Confirm password" />
          )} />
        </View>

        {error ? (
          <Text style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.sm, color: theme.colors.error, marginTop: theme.spacing.md }}>
            {error}
          </Text>
        ) : null}

        <View style={{ marginTop: theme.spacing.xl, gap: theme.spacing.sm }}>
          <Button label="Create account" fullWidth size="lg" loading={loading} onPress={() => handleSubmit(onSubmit)()} />
          <Button label="Already have an account? Sign in" variant="ghost" fullWidth onPress={() => router.replace('/(auth)/login')} />
        </View>

        <Text style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.xs, color: theme.colors.textMuted, textAlign: 'center', marginTop: theme.spacing.lg }}>
          By continuing you agree to our Terms and Privacy Policy. This is a demo app using mock authentication.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
