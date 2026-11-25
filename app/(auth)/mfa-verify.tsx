import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { ShieldCheck } from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { BrandLogo } from '@/components/BrandLogo';
import { Button } from '@/components/ui/Button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setLoading, setAuthError } from '@/store';
import { authService } from '@/services';

export default function MfaVerifyScreen() {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const loading = useAppSelector((s) => s.auth.status === 'loading');
  const error = useAppSelector((s) => s.auth.error);
  const [code, setCode] = useState('');

  const verify = async () => {
    dispatch(setAuthError(null));
    dispatch(setLoading(true));
    try {
      const { verified } = await authService.verifyAuthenticator(code);
      if (verified) router.replace('/(tabs)');
      else dispatch(setAuthError('Incorrect code.'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top', 'bottom']}>
      <View style={{ flex: 1, paddingHorizontal: theme.spacing.xl, justifyContent: 'center' }}>
        <BrandLogo size="md" withText={false} />
        <View style={{ alignItems: 'center', marginTop: theme.spacing.xxl }}>
          <View style={{ width: 88, height: 88, borderRadius: 44, backgroundColor: theme.colors.brandSoft, alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={40} color={theme.colors.brand} strokeWidth={1.8} />
          </View>
        </View>
        <Text style={{ fontFamily: theme.typography.fontFamilyBold, fontSize: theme.typography.sizes.xxl, color: theme.colors.textPrimary, textAlign: 'center', marginTop: theme.spacing.xl }}>
          Two-factor verification
        </Text>
        <Text style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.md, color: theme.colors.textSecondary, textAlign: 'center', marginTop: theme.spacing.sm, marginBottom: theme.spacing.xxl }}>
          Enter the 6-digit code from your authenticator app.
        </Text>
        <TextInput
          value={code}
          onChangeText={(v) => setCode(v.replace(/\D/g, '').slice(0, 6))}
          placeholder="000000"
          keyboardType="number-pad"
          accessibilityLabel="Authentication code"
          style={{ fontFamily: theme.typography.fontFamilyBold, fontSize: 30, letterSpacing: 12, textAlign: 'center', backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: code.length === 6 ? theme.colors.brand : theme.colors.border, borderRadius: theme.radii.md, paddingVertical: theme.spacing.md, color: theme.colors.textPrimary }}
        />
        {error ? <Text style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.sm, color: theme.colors.error, textAlign: 'center', marginTop: theme.spacing.md }}>{error}</Text> : null}
        <View style={{ marginTop: theme.spacing.xl, gap: theme.spacing.sm }}>
          <Button label="Verify" fullWidth size="lg" loading={loading} onPress={verify} />
          <Button label="Use a recovery code" variant="ghost" fullWidth onPress={() => router.replace('/(auth)/recovery-codes')} />
        </View>
      </View>
    </SafeAreaView>
  );
}
