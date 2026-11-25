import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Fingerprint, ScanFace } from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { BrandLogo } from '@/components/BrandLogo';
import { Button } from '@/components/ui/Button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setLoading, setAuthError } from '@/store';
import { authService } from '@/services';

export default function BiometricScreen() {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const loading = useAppSelector((s) => s.auth.status === 'loading');
  const error = useAppSelector((s) => s.auth.error);

  const unlock = async () => {
    dispatch(setAuthError(null));
    dispatch(setLoading(true));
    try {
      const { unlocked } = await authService.biometricUnlock();
      if (unlocked) router.replace('/(tabs)');
      else dispatch(setAuthError('Biometric unlock failed.'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top', 'bottom']}>
      <View style={{ flex: 1, paddingHorizontal: theme.spacing.xl, justifyContent: 'center', alignItems: 'center' }}>
        <BrandLogo size="md" withText={false} />
        <View style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: theme.colors.brandSoft, alignItems: 'center', justifyContent: 'center', marginTop: theme.spacing.xxl }}>
          <ScanFace size={56} color={theme.colors.brand} strokeWidth={1.6} />
        </View>
        <Text style={{ fontFamily: theme.typography.fontFamilyBold, fontSize: theme.typography.sizes.xxl, color: theme.colors.textPrimary, textAlign: 'center', marginTop: theme.spacing.xl }}>
          Biometric unlock
        </Text>
        <Text style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.md, color: theme.colors.textSecondary, textAlign: 'center', marginTop: theme.spacing.sm, marginBottom: theme.spacing.xxl, lineHeight: theme.typography.lineHeight.relaxed }}>
          Use Face ID or fingerprint to securely access ScamShield AI. Your biometric data never leaves this device.
        </Text>
        {error ? <Text style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.sm, color: theme.colors.error, marginBottom: theme.spacing.md }}>{error}</Text> : null}
        <View style={{ gap: theme.spacing.sm, width: '100%' }}>
          <Button label="Unlock with biometrics" fullWidth size="lg" icon={Fingerprint} loading={loading} onPress={unlock} />
          <Button label="Use password instead" variant="ghost" fullWidth onPress={() => router.replace('/(auth)/login')} />
        </View>
        <Text style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.xs, color: theme.colors.textMuted, textAlign: 'center', marginTop: theme.spacing.xl }}>
          Simulated biometric prompt for demo purposes.
        </Text>
      </View>
    </SafeAreaView>
  );
}
