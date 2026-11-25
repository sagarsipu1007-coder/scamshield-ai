import { Text, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { useMemo } from 'react';
import type { Theme } from '@/theme/tokens';

export function Screen({ children, style }: { children: React.ReactNode; style?: any }) {
  const theme = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background, ...style }}>{children}</View>
  );
}

export function ScreenHeader({
  title,
  subtitle,
  right,
  left,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  left?: React.ReactNode;
}) {
  const theme = useTheme();
  const styles = useMemo(() => buildHeaderStyles(theme), [theme]);
  return (
    <View style={styles.wrap}>
      <View style={styles.left}>{left}</View>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <View style={styles.right}>{right}</View>
    </View>
  );
}

function buildHeaderStyles(theme: Theme) {
  const { colors, spacing, typography } = theme;
  return {
    wrap: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: spacing.sm,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.sm,
      paddingBottom: spacing.md,
    } as const,
    left: { minWidth: 40 } as const,
    right: { minWidth: 40, alignItems: 'flex-end' as const } as const,
    title: { fontFamily: typography.fontFamilyBold, fontSize: typography.sizes.xxl, color: colors.textPrimary, lineHeight: theme.typography.lineHeight.tight } as const,
    subtitle: { fontFamily: typography.fontFamily, fontSize: typography.sizes.sm, color: colors.textSecondary, marginTop: 2 } as const,
  };
}
