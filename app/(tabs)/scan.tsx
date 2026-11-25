import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, ScrollView, TextInput, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import {
  ScanLine, MessageSquare, QrCode, Image as ImageIcon, FileCode, CreditCard,
  Camera, ChevronRight, Sparkles,
} from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Screen, ScreenHeader } from '@/components/ui/Screen';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useMutation } from '@tanstack/react-query';
import { scanService } from '@/services';
import type { ScanResult } from '@/services/types';
import { ScanResultCard } from '@/components/ScanResultCard';

type ScanType = 'url' | 'message' | 'qr' | 'screenshot' | 'apk' | 'payment';

const TYPES: { key: ScanType; icon: any; label: string; desc: string; placeholder: string }[] = [
  { key: 'url', icon: ScanLine, label: 'URL Scanner', desc: 'Check any link for phishing', placeholder: 'Paste a URL, e.g. https://paytm-verify-login.com' },
  { key: 'message', icon: MessageSquare, label: 'Message Analyzer', desc: 'Analyze SMS or chat for scam signals', placeholder: 'Paste a suspicious message…' },
  { key: 'qr', icon: QrCode, label: 'QR Scanner', desc: 'Preview where a QR code leads', placeholder: 'Enter the QR payload or scan below' },
  { key: 'screenshot', icon: ImageIcon, label: 'Screenshot Analyzer', desc: 'Describe a screenshot to assess it', placeholder: 'Describe what the screenshot shows…' },
  { key: 'apk', icon: FileCode, label: 'APK / File Link', desc: 'Check a sideloaded app link', placeholder: 'APK name, e.g. WhatsAppMod_v2.apk' },
  { key: 'payment', icon: CreditCard, label: 'Payment Request', desc: 'Analyze a UPI or payment request', placeholder: 'Paste the payment request text…' },
];

export default function ScanScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [type, setType] = useState<ScanType>('url');
  const [input, setInput] = useState('');
  const [apkUrl, setApkUrl] = useState('');
  const [result, setResult] = useState<ScanResult | null>(null);

  const active = TYPES.find((t) => t.key === type)!;

  const mutation = useMutation({
    mutationFn: async () => {
      switch (type) {
        case 'url': return scanService.scanUrl(input);
        case 'message': return scanService.analyzeMessage(input);
        case 'qr': return scanService.scanQr(input);
        case 'screenshot': return scanService.analyzeScreenshot(input);
        case 'apk': return scanService.analyzeApk(input, apkUrl || 'https://example.com/download.apk');
        case 'payment': return scanService.analyzePayment(input);
      }
    },
    onSuccess: setResult,
  });

  const runScan = () => {
    if (!input.trim()) return;
    setResult(null);
    mutation.mutate();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: theme.spacing.xxl }}>
        <ScreenHeader title="Scan" subtitle="Check anything for scams" />

        <View style={{ paddingHorizontal: theme.spacing.lg, gap: theme.spacing.lg }}>
          {/* Type selector */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: theme.spacing.sm }}>
            {TYPES.map((t) => {
              const selected = t.key === type;
              return (
                <Pressable
                  key={t.key}
                  onPress={() => { setType(t.key); setInput(''); setApkUrl(''); setResult(null); }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: theme.spacing.xs,
                    paddingHorizontal: theme.spacing.md,
                    paddingVertical: theme.spacing.sm,
                    borderRadius: theme.radii.pill,
                    borderWidth: 1.5,
                    borderColor: selected ? theme.colors.brand : theme.colors.border,
                    backgroundColor: selected ? theme.colors.brandSoft : theme.colors.surface,
                  }}
                  accessibilityLabel={t.label}
                >
                  <t.icon size={16} color={selected ? theme.colors.brand : theme.colors.textSecondary} strokeWidth={2} />
                  <Text style={{ fontFamily: theme.typography.fontFamilyMedium, fontSize: theme.typography.sizes.sm, color: selected ? theme.colors.brand : theme.colors.textPrimary }}>
                    {t.label.split(' ')[0]}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Active scanner card */}
          <Card>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, marginBottom: theme.spacing.md }}>
              <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: theme.colors.brandSoft, alignItems: 'center', justifyContent: 'center' }}>
                <active.icon size={22} color={theme.colors.brand} strokeWidth={2} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: theme.typography.fontFamilyBold, fontSize: theme.typography.sizes.md, color: theme.colors.textPrimary }}>{active.label}</Text>
                <Text style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary, marginTop: 2 }}>{active.desc}</Text>
              </View>
            </View>

            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder={active.placeholder}
              placeholderTextColor={theme.colors.textMuted}
              multiline={type === 'message' || type === 'screenshot' || type === 'payment'}
              numberOfLines={type === 'message' || type === 'screenshot' || type === 'payment' ? 4 : 1}
              style={{
                fontFamily: theme.typography.fontFamily,
                fontSize: theme.typography.sizes.md,
                color: theme.colors.textPrimary,
                backgroundColor: theme.colors.surfaceRaised,
                borderWidth: 1,
                borderColor: theme.colors.border,
                borderRadius: theme.radii.md,
                paddingHorizontal: theme.spacing.md,
                paddingVertical: theme.spacing.md,
                minHeight: 52,
                textAlignVertical: 'top',
              }}
              accessibilityLabel={`${active.label} input`}
            />

            {type === 'apk' && (
              <TextInput
                value={apkUrl}
                onChangeText={setApkUrl}
                placeholder="Download URL (optional)"
                placeholderTextColor={theme.colors.textMuted}
                autoCapitalize="none"
                style={{
                  fontFamily: theme.typography.fontFamily,
                  fontSize: theme.typography.sizes.sm,
                  color: theme.colors.textPrimary,
                  backgroundColor: theme.colors.surfaceRaised,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  borderRadius: theme.radii.md,
                  paddingHorizontal: theme.spacing.md,
                  paddingVertical: theme.spacing.sm,
                  marginTop: theme.spacing.sm,
                }}
                accessibilityLabel="APK download URL"
              />
            )}

            {type === 'qr' && (
              <Pressable
                onPress={() => router.push('/scan-detail?mode=qr')}
                style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, marginTop: theme.spacing.md, paddingVertical: theme.spacing.sm }}
                accessibilityLabel="Open QR camera scanner"
              >
                <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: theme.colors.accentSoft, alignItems: 'center', justifyContent: 'center' }}>
                  <Camera size={20} color={theme.colors.accent} strokeWidth={2} />
                </View>
                <Text style={{ fontFamily: theme.typography.fontFamilyMedium, fontSize: theme.typography.sizes.sm, color: theme.colors.accent }}>
                  Or scan with camera
                </Text>
              </Pressable>
            )}

            {type === 'screenshot' && (
              <Pressable
                onPress={() => router.push('/scan-detail?mode=screenshot')}
                style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, marginTop: theme.spacing.md, paddingVertical: theme.spacing.sm }}
                accessibilityLabel="Pick a screenshot to analyze"
              >
                <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: theme.colors.accentSoft, alignItems: 'center', justifyContent: 'center' }}>
                  <ImageIcon size={20} color={theme.colors.accent} strokeWidth={2} />
                </View>
                <Text style={{ fontFamily: theme.typography.fontFamilyMedium, fontSize: theme.typography.sizes.sm, color: theme.colors.accent }}>
                  Or pick a screenshot
                </Text>
              </Pressable>
            )}

            <View style={{ marginTop: theme.spacing.md }}>
              <Button
                label="Analyze"
                fullWidth
                size="lg"
                icon={Sparkles}
                loading={mutation.isPending}
                onPress={runScan}
              />
            </View>
          </Card>

          {/* Result */}
          {mutation.isError ? (
            <Card><Text style={{ color: theme.colors.error, textAlign: 'center' }}>Scan failed. Please try again.</Text></Card>
          ) : mutation.isPending ? (
            <Card>
              <View style={{ alignItems: 'center', padding: theme.spacing.xl, gap: theme.spacing.md }}>
                <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: theme.colors.brandSoft, alignItems: 'center', justifyContent: 'center' }}>
                  <ScanLine size={26} color={theme.colors.brand} strokeWidth={2} />
                </View>
                <Text style={{ fontFamily: theme.typography.fontFamilyMedium, fontSize: theme.typography.sizes.md, color: theme.colors.textPrimary }}>
                  Analyzing…
                </Text>
                <Text style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary, textAlign: 'center' }}>
                  Cross-referencing against scam signatures and risk signals.
                </Text>
              </View>
            </Card>
          ) : result ? (
            <ScanResultCard result={result} onReport={() => router.push('/incident')} />
          ) : (
            <Card>
              <View style={{ alignItems: 'center', padding: theme.spacing.xl, gap: theme.spacing.sm }}>
                <Sparkles size={28} color={theme.colors.textMuted} strokeWidth={1.6} />
                <Text style={{ fontFamily: theme.typography.fontFamilyMedium, fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary, textAlign: 'center' }}>
                  Enter content above and tap Analyze to get a risk verdict.
                </Text>
              </View>
            </Card>
          )}

          {/* Tips */}
          <Card>
            <Text style={{ fontFamily: theme.typography.fontFamilyBold, fontSize: theme.typography.sizes.md, color: theme.colors.textPrimary, marginBottom: theme.spacing.sm }}>
              What gets checked
            </Text>
            {['Domain reputation and age', 'URL shorteners and redirects', 'Phishing keywords and urgency tactics', 'Payment and UPI collect patterns', 'APK source and modded indicators'].map((tip) => (
              <View key={tip} style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, paddingVertical: theme.spacing.xs }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: theme.colors.brand }} />
                <Text style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary }}>{tip}</Text>
              </View>
            ))}
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
