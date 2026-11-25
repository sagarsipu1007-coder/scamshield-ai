import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { KeyRound, Download, Check } from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { BrandLogo } from '@/components/BrandLogo';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setRecoveryCodesViewed } from '@/store';

export default function RecoveryCodesScreen() {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const codes = useAppSelector((s) => s.auth.mfa.backupCodes);
  const [downloaded, setDownloaded] = useState(false);

  const finish = () => {
    dispatch(setRecoveryCodesViewed(true));
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: theme.spacing.xl, paddingVertical: theme.spacing.xl }}>
        <BrandLogo size="md" withText={false} />
        <View style={{ alignItems: 'center', marginTop: theme.spacing.xl }}>
          <View style={{ width: 84, height: 84, borderRadius: 42, backgroundColor: theme.colors.warningSoft, alignItems: 'center', justifyContent: 'center' }}>
            <KeyRound size={38} color={theme.colors.warning} strokeWidth={1.8} />
          </View>
        </View>
        <Text style={{ fontFamily: theme.typography.fontFamilyBold, fontSize: theme.typography.sizes.xxl, color: theme.colors.textPrimary, textAlign: 'center', marginTop: theme.spacing.lg }}>
          Save your recovery codes
        </Text>
        <Text style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.md, color: theme.colors.textSecondary, textAlign: 'center', marginTop: theme.spacing.sm, marginBottom: theme.spacing.xl, lineHeight: theme.typography.lineHeight.relaxed }}>
          These one-time codes let you sign in if you lose access to your authenticator. Store them somewhere safe. Each code can only be used once.
        </Text>

        <Card>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {codes.map((c, i) => (
              <View key={i} style={{ width: '48%', flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, paddingVertical: theme.spacing.sm }}>
                <Text style={{ fontFamily: theme.typography.fontFamilyMedium, fontSize: 11, color: theme.colors.textMuted }}>{i + 1}.</Text>
                <Text style={{ fontFamily: theme.typography.fontFamilyBold, fontSize: theme.typography.sizes.sm, color: theme.colors.textPrimary, letterSpacing: 1 }}>{c}</Text>
              </View>
            ))}
          </View>
        </Card>

        <View style={{ marginTop: theme.spacing.lg, gap: theme.spacing.sm }}>
          <Button
            label={downloaded ? 'Downloaded' : 'Download codes'}
            fullWidth
            icon={downloaded ? Check : Download}
            variant={downloaded ? 'secondary' : 'outline'}
            onPress={() => setDownloaded(true)}
          />
          <Button label="I have saved my codes" fullWidth size="lg" onPress={finish} />
          <Pressable onPress={finish} style={{ padding: theme.spacing.sm, alignItems: 'center' }}>
            <Text style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.sm, color: theme.colors.textMuted }}>
              Skip — I will do this later
            </Text>
          </Pressable>
        </View>

        <Text style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.xs, color: theme.colors.textMuted, textAlign: 'center', marginTop: theme.spacing.lg }}>
          Treat these codes like passwords. Never share them. This is a demo — no real codes are generated.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
