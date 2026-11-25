import { ActivityIndicator, Text, View, type ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import type { LucideIcon } from 'lucide-react-native';
import { useMemo } from 'react';
import type { Theme } from '@/theme/tokens';

export function Loading({ label = 'Loading…', style }: { label?: string; style?: ViewStyle }) {
  const theme = useTheme();
  return (
    <View style={[{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: theme.spacing.md }, style]}>
      <ActivityIndicator color={theme.colors.brand} size="large" />
      <Text style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary }}>
        {label}
      </Text>
    </View>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  subtitle,
  action,
}: {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  const theme = useTheme();
  const styles = useMemo(() => buildEmptyStyles(theme), [theme]);
  return (
    <View style={styles.wrap}>
      <View style={styles.iconWrap}>
        <Icon size={30} color={theme.colors.textMuted} strokeWidth={1.6} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {action}
    </View>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  const theme = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: theme.spacing.md, padding: theme.spacing.xl }}>
      <Text style={{ fontFamily: theme.typography.fontFamilyBold, fontSize: theme.typography.sizes.lg, color: theme.colors.error }}>
        Something went wrong
      </Text>
      <Text style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary, textAlign: 'center' }}>
        {message}
      </Text>
      {onRetry ? (
        <Text
          onPress={onRetry}
          style={{ fontFamily: theme.typography.fontFamilyMedium, fontSize: theme.typography.sizes.sm, color: theme.colors.brand }}
        >
          Try again
        </Text>
      ) : null}
    </View>
  );
}

function buildEmptyStyles(theme: Theme) {
  const { colors, spacing, radii, typography } = theme;
  return {
    wrap: { flex: 1, alignItems: 'center' as const, justifyContent: 'center' as const, gap: spacing.md, padding: spacing.xxl } as const,
    iconWrap: {
      width: 64,
      height: 64,
      borderRadius: radii.pill,
      backgroundColor: colors.surfaceRaised,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      borderWidth: 1,
      borderColor: colors.border,
    } as const,
    title: { fontFamily: typography.fontFamilyMedium, fontSize: typography.sizes.lg, color: colors.textPrimary, textAlign: 'center' as const } as const,
    subtitle: { fontFamily: typography.fontFamily, fontSize: typography.sizes.sm, color: colors.textSecondary, textAlign: 'center' as const } as const,
  };
}
