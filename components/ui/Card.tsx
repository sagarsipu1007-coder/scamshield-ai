import { useMemo, type ReactNode } from 'react';
import { View, Text, type ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import type { Theme } from '@/theme/tokens';
import type { LucideIcon } from 'lucide-react-native';

export function Card({
  children,
  style,
  padded = true,
  raised = false,
  accessibilityLabel,
}: {
  children: ReactNode;
  style?: ViewStyle;
  padded?: boolean;
  raised?: boolean;
  accessibilityLabel?: string;
}) {
  const theme = useTheme();
  const styles = useMemo(() => buildStyles(theme, padded, raised), [theme, padded, raised]);
  return (
    <View style={[styles.card, style]} accessibilityLabel={accessibilityLabel}>
      {children}
    </View>
  );
}

export function CardHeader({
  icon: Icon,
  title,
  subtitle,
  action,
  accent,
}: {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  accent?: string;
}) {
  const theme = useTheme();
  const styles = useMemo(() => buildHeaderStyles(theme), [theme]);
  const iconColor = accent ?? theme.colors.brand;
  return (
    <View style={styles.header}>
      <View style={styles.titleRow}>
        {Icon && (
          <View style={[styles.iconWrap, { backgroundColor: theme.colors.brandSoft }]}>
            <Icon size={18} color={iconColor} strokeWidth={2.2} />
          </View>
        )}
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {action}
      </View>
    </View>
  );
}

function buildStyles(theme: Theme, padded: boolean, raised: boolean) {
  const { colors, spacing, radii } = theme;
  return {
    card: {
      backgroundColor: raised ? colors.surfaceRaised : colors.surface,
      borderRadius: radii.lg,
      padding: padded ? spacing.lg : 0,
      borderWidth: 1,
      borderColor: colors.border,
    } as ViewStyle,
  };
}

function buildHeaderStyles(theme: Theme) {
  const { colors, spacing, typography } = theme;
  return {
    header: { marginBottom: spacing.md } as ViewStyle,
    titleRow: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: spacing.md } as ViewStyle,
    iconWrap: { width: 38, height: 38, borderRadius: 12, alignItems: 'center' as const, justifyContent: 'center' as const } as ViewStyle,
    title: { fontFamily: typography.fontFamilyMedium, fontSize: typography.sizes.md, fontWeight: '600' as const, color: colors.textPrimary } as const,
    subtitle: { fontFamily: typography.fontFamily, fontSize: typography.sizes.sm, color: colors.textSecondary, marginTop: 2 } as const,
  };
}
