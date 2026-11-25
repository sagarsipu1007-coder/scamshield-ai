import { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ShieldCheck, ScanLine, Bot, LifeBuoy } from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { BrandLogo } from '@/components/BrandLogo';
import { Button } from '@/components/ui/Button';

const SLIDES = [
  {
    icon: ShieldCheck,
    title: 'Detect scams before they reach you',
    body: 'Scan URLs, messages, QR codes, screenshots, APKs, and payment requests in seconds. Get a clear risk verdict with actionable guidance.',
  },
  {
    icon: ScanLine,
    title: 'Six powerful scanners in one app',
    body: 'From phishing links to fake payment requests, ScamShield AI analyzes every common fraud vector and explains the red flags.',
  },
  {
    icon: Bot,
    title: 'An AI assistant that knows fraud',
    body: 'Ask anything about suspicious activity. Get instant, plain-language guidance tailored to the scams happening right now in India.',
  },
  {
    icon: LifeBuoy,
    title: 'Guided recovery when it matters',
    body: 'If something goes wrong, follow step-by-step recovery checklists, collect evidence, and connect with national cybercrime resources.',
  },
];

export default function OnboardingScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];
  const isLast = index === SLIDES.length - 1;
  const Icon = slide.icon;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top', 'bottom']}>
      <View style={{ flex: 1, paddingHorizontal: theme.spacing.xl }}>
        <View style={{ alignItems: 'flex-end', paddingTop: theme.spacing.md }}>
          <Pressable onPress={() => router.replace('/(auth)/login')} accessibilityLabel="Skip onboarding">
            <Text style={{ fontFamily: theme.typography.fontFamilyMedium, fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary }}>
              Skip
            </Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingVertical: theme.spacing.xl }} showsVerticalScrollIndicator={false}>
          <BrandLogo size="lg" />
          <View style={{ alignItems: 'center', marginTop: theme.spacing.xxl }}>
            <View style={{
              width: 120, height: 120, borderRadius: 60,
              backgroundColor: theme.colors.brandSoft,
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon size={56} color={theme.colors.brand} strokeWidth={1.8} />
            </View>
            <Text style={{
              fontFamily: theme.typography.fontFamilyBold,
              fontSize: theme.typography.sizes.xxl,
              color: theme.colors.textPrimary,
              textAlign: 'center',
              marginTop: theme.spacing.xl,
              lineHeight: theme.typography.lineHeight.tight,
            }}>
              {slide.title}
            </Text>
            <Text style={{
              fontFamily: theme.typography.fontFamily,
              fontSize: theme.typography.sizes.md,
              color: theme.colors.textSecondary,
              textAlign: 'center',
              marginTop: theme.spacing.md,
              lineHeight: theme.typography.lineHeight.relaxed,
            }}>
              {slide.body}
            </Text>
          </View>
        </ScrollView>

        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: theme.spacing.xs, paddingBottom: theme.spacing.lg }}>
          {SLIDES.map((_, i) => (
            <View key={i} style={{
              width: i === index ? 24 : 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: i === index ? theme.colors.brand : theme.colors.borderStrong,
            }} />
          ))}
        </View>

        <View style={{ paddingBottom: theme.spacing.lg, gap: theme.spacing.sm }}>
          <Button
            label={isLast ? 'Get started' : 'Continue'}
            fullWidth
            size="lg"
            onPress={() => (isLast ? router.replace('/(auth)/register') : setIndex((i) => i + 1))}
          />
          <Button
            label="I already have an account"
            variant="ghost"
            fullWidth
            onPress={() => router.replace('/(auth)/login')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
