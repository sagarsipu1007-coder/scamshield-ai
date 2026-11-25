import { useMemo } from 'react';
import { Text, View, type ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import type { Theme } from '@/theme/tokens';
import type { RiskLevel } from '@/services/types';

const LABELS: Record<RiskLevel, string> = {
  low: 'Low Risk',
  suspicious: 'Suspicious',
  high: 'High Risk',
  unknown: 'Unknown',
};

const ICONS: Record<RiskLevel, string> = {
  low: '✓',
  suspicious: '!',
  high: '⚠',
  unknown: '?',
};

export function RiskBadge({
  level,
  score,
  size = 'md',
  style,
}: {
  level: RiskLevel;
  score?: number;
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}) {
  const theme = useTheme();
  const styles = useMemo(() => buildStyles(theme, size), [theme, size]);

  const colorKey = `risk${LABELS[level].replace(' ', '')}` as keyof typeof theme.colors;
  const softKey = `${colorKey}Soft` as keyof typeof theme.colors;
  void colorKey;
  void softKey;

  const palette = {
    low: { fg: colors(theme).riskLow, bg: colors(theme).riskLowSoft },
    suspicious: { fg: colors(theme).riskSuspicious, bg: colors(theme).riskSuspiciousSoft },
    high: { fg: colors(theme).riskHigh, bg: colors(theme).riskHighSoft },
    unknown: { fg: colors(theme).riskUnknown, bg: colors(theme).riskUnknownSoft },
  }[level];

  return (
    <View style={[styles.badge, { backgroundColor: palette.bg }, style]}>
      <Text style={[styles.icon, { color: palette.fg }]}>{ICONS[level]}</Text>
      <Text style={[styles.label, { color: palette.fg }]}>
        {LABELS[level]}
        {score !== undefined ? ` · ${score}` : ''}
      </Text>
    </View>
  );
}

function colors(theme: Theme) {
  return theme.colors;
}

function buildStyles(theme: Theme, size: 'sm' | 'md' | 'lg') {
  const { spacing, radii, typography } = theme;
  const padding = size === 'sm' ? spacing.xs : size === 'lg' ? spacing.md : spacing.sm;
  const font = size === 'sm' ? typography.sizes.xs : size === 'lg' ? typography.sizes.md : typography.sizes.sm;
  const iconSize = size === 'sm' ? 12 : size === 'lg' ? 18 : 14;
  return {
    badge: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: padding,
      paddingHorizontal: padding,
      paddingVertical: padding,
      borderRadius: radii.pill,
      alignSelf: 'flex-start' as const,
    },
    icon: { fontSize: iconSize, fontWeight: '700' as const, lineHeight: iconSize + 2 },
    label: { fontFamily: typography.fontFamilyMedium, fontSize: font, fontWeight: '600' as const },
  };
}
