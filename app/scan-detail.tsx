import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, Pressable, TextInput, Image, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Camera, ScanLine, Image as ImageIcon, Sparkles, CheckCircle2 } from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ScanResultCard } from '@/components/ScanResultCard';
import { useMutation } from '@tanstack/react-query';
import { scanService } from '@/services';
import type { ScanResult } from '@/services/types';
import * as ImagePicker from 'expo-image-picker';

export default function ScanDetailScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const isQr = mode === 'qr';
  const [manualInput, setManualInput] = useState('');
  const [pickedImage, setPickedImage] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      if (isQr) return scanService.scanQr(manualInput || 'https://bit.ly/prize-claim');
      return scanService.analyzeScreenshot(manualInput || 'Suspicious verification screen asking for OTP');
    },
    onSuccess: setResult,
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setPickedImage(result.assets[0].uri);
    }
  };

  const launchCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setPickedImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top', 'bottom']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.md, borderBottomWidth: 1, borderBottomColor: theme.colors.border }}>
        <Pressable onPress={() => router.back()} accessibilityLabel="Go back">
          <ArrowLeft size={22} color={theme.colors.textPrimary} strokeWidth={2} />
        </Pressable>
        <Text style={{ fontFamily: theme.typography.fontFamilyBold, fontSize: theme.typography.sizes.xl, color: theme.colors.textPrimary }}>
          {isQr ? 'QR Scanner' : 'Screenshot Analyzer'}
        </Text>
      </View>

      <View style={{ flex: 1, padding: theme.spacing.lg, gap: theme.spacing.lg }}>
        {isQr ? (
          <>
            {/* Camera preview placeholder */}
            <View style={{ aspectRatio: 1, borderRadius: theme.radii.xl, borderWidth: 2, borderColor: theme.colors.brand, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.surfaceRaised }}>
              <View style={{ width: '70%', height: '70%', borderWidth: 2, borderColor: theme.colors.brand, borderRadius: theme.radii.lg, alignItems: 'center', justifyContent: 'center', borderStyle: 'dashed' }}>
                <ScanLine size={48} color={theme.colors.brand} strokeWidth={1.6} />
                <Text style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary, marginTop: theme.spacing.md, textAlign: 'center' }}>
                  Point your camera{'\n'}at a QR code
                </Text>
              </View>
            </View>
            <Text style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.xs, color: theme.colors.textMuted, textAlign: 'center' }}>
              Camera preview is simulated in the demo. Enter a payload below to analyze it.
            </Text>
            <TextInput
              value={manualInput}
              onChangeText={setManualInput}
              placeholder="e.g. https://bit.ly/prize-claim or upi://pay?pa=…"
              placeholderTextColor={theme.colors.textMuted}
              autoCapitalize="none"
              accessibilityLabel="QR payload"
              style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.md, color: theme.colors.textPrimary, backgroundColor: theme.colors.surface, borderRadius: theme.radii.md, paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.md, borderWidth: 1, borderColor: theme.colors.border }}
            />
          </>
        ) : (
          <>
            {/* Screenshot picker */}
            <Card>
              <Text style={{ fontFamily: theme.typography.fontFamilyMedium, fontSize: theme.typography.sizes.md, color: theme.colors.textPrimary, marginBottom: theme.spacing.md }}>
                Pick or capture a screenshot
              </Text>
              {pickedImage ? (
                <View style={{ alignItems: 'center' }}>
                  <Image source={{ uri: pickedImage }} style={{ width: '100%', height: 240, borderRadius: theme.radii.md, resizeMode: 'contain' }} />
                  <Pressable onPress={() => setPickedImage(null)} style={{ marginTop: theme.spacing.sm }}>
                    <Text style={{ fontFamily: theme.typography.fontFamilyMedium, fontSize: theme.typography.sizes.sm, color: theme.colors.error }}>Remove</Text>
                  </Pressable>
                </View>
              ) : (
                <View style={{ gap: theme.spacing.sm }}>
                  <Button label="Pick from gallery" variant="outline" fullWidth icon={ImageIcon} onPress={pickImage} />
                  <Button label="Take a photo" variant="outline" fullWidth icon={Camera} onPress={launchCamera} />
                </View>
              )}
            </Card>
            <Text style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.xs, color: theme.colors.textMuted, textAlign: 'center' }}>
              Image analysis is simulated. Describe the screenshot for a demo result.
            </Text>
            <TextInput
              value={manualInput}
              onChangeText={setManualInput}
              placeholder="Describe what the screenshot shows…"
              placeholderTextColor={theme.colors.textMuted}
              multiline
              numberOfLines={3}
              accessibilityLabel="Screenshot description"
              style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.md, color: theme.colors.textPrimary, backgroundColor: theme.colors.surface, borderRadius: theme.radii.md, paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.md, borderWidth: 1, borderColor: theme.colors.border, minHeight: 80, textAlignVertical: 'top' }}
            />
          </>
        )}

        <Button
          label="Analyze"
          fullWidth
          size="lg"
          icon={Sparkles}
          loading={mutation.isPending}
          onPress={() => { setResult(null); mutation.mutate(); }}
        />

        {mutation.isError ? (
          <Text style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.sm, color: theme.colors.error, textAlign: 'center' }}>Analysis failed. Try again.</Text>
        ) : result ? (
          <ScanResultCard result={result} onReport={() => router.push('/incident')} />
        ) : null}
      </View>
    </SafeAreaView>
  );
}
