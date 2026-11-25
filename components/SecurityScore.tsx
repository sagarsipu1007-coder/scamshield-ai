import { View, Text } from 'react-native';
import { useMemo } from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import type { Theme } from '@/theme/tokens';

export function SecurityScore({ score, label }: { score: number; label?: string }) {
  const theme = useTheme();
  const styles = useMemo(() => buildStyles(theme), [theme]);

  const color = score >= 80 ? theme.colors.success : score >= 50 ? theme.colors.warning : theme.colors.error;
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const dash = (score / 100) * circumference;

  return (
    <View style={styles.wrap}>
      <View style={styles.ringWrap}>
        <View style={[styles.ringBg, { borderColor: theme.colors.border }]} />
        <View
          style={[
            styles.ringFg,
            { borderColor: color, borderTopColor: color, borderRightColor: color, transform: [{ rotate: `${(score / 100) * 360 - 90}deg` }] },
          ]}
        />
        <View style={styles.center}>
          <Text style={[styles.score, { color }]}>{score}</Text>
          <Text style={styles.unit}>/ 100</Text>
        </View>
      </View>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <Text style={styles.hint}>
        {score >= 80 ? 'Strong protection' : score >= 50 ? 'Room to improve' : 'Needs attention'}
      </Text>
      <View style={styles.indicatorWrap}>
        <View style={[styles.indicatorTrack, { width: dash }]} />
      </View>
    </View>
  );
}

function buildStyles(theme: Theme) {
  const { colors, spacing, radii, typography } = theme;
  return {
    wrap: { alignItems: 'center' as const } as const,
    ringWrap: { width: 160, height: 160, alignItems: 'center' as const, justifyContent: 'center' as const } as const,
    ringBg: { position: 'absolute' as const, width: 160, height: 160, borderRadius: 80, borderWidth: 10, opacity: 0.4 } as const,
    ringFg: { position: 'absolute' as const, width: 160, height: 160, borderRadius: 80, borderWidth: 10, borderBottomColor: 'transparent', borderLeftColor: 'transparent' } as const,
    center: { alignItems: 'center' as const } as const,
    score: { fontFamily: typography.fontFamilyBold, fontSize: 42, lineHeight: 44 } as const,
    unit: { fontFamily: typography.fontFamily, fontSize: typography.sizes.sm, color: colors.textMuted, marginTop: -4 } as const,
    label: { fontFamily: typography.fontFamilyMedium, fontSize: typography.sizes.md, color: colors.textPrimary, marginTop: spacing.md } as const,
    hint: { fontFamily: typography.fontFamily, fontSize: typography.sizes.sm, color: colors.textSecondary, marginTop: spacing.xs } as const,
    indicatorWrap: { width: 120, height: 6, borderRadius: 3, backgroundColor: colors.border, marginTop: spacing.md, overflow: 'hidden' as const } as const,
    indicatorTrack: { height: 6, borderRadius: 3, backgroundColor: colors.brand } as const,
  };
}
