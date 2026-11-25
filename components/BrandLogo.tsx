import { View, Text } from 'react-native';
import { ShieldCheck } from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { useMemo } from 'react';
import type { Theme } from '@/theme/tokens';

export function BrandLogo({ size = 'md', withText = true }: { size?: 'sm' | 'md' | 'lg'; withText?: boolean }) {
  const theme = useTheme();
  const styles = useMemo(() => buildStyles(theme, size), [theme, size]);
  const iconSize = size === 'sm' ? 18 : size === 'lg' ? 34 : 26;
  return (
    <View style={styles.row}>
      <View style={styles.mark}>
        <ShieldCheck size={iconSize} color="#FFFFFF" strokeWidth={2.4} />
      </View>
      {withText && (
        <View>
          <Text style={styles.name}>ScamShield</Text>
          <Text style={styles.tag}>AI fraud protection</Text>
        </View>
      )}
    </View>
  );
}

function buildStyles(theme: Theme, size: 'sm' | 'md' | 'lg') {
  const { colors, spacing, radii, typography } = theme;
  const box = size === 'sm' ? 34 : size === 'lg' ? 56 : 44;
  return {
    row: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: spacing.sm } as const,
    mark: {
      width: box,
      height: box,
      borderRadius: radii.md,
      backgroundColor: colors.brand,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    } as const,
    name: {
      fontFamily: typography.fontFamilyBold,
      fontSize: size === 'lg' ? typography.sizes.xl : typography.sizes.lg,
      color: colors.textPrimary,
      lineHeight: typography.lineHeight.tight,
    } as const,
    tag: { fontFamily: typography.fontFamily, fontSize: typography.sizes.xs, color: colors.textMuted } as const,
  };
}
