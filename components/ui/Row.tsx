import { Pressable, Switch, Text, View, type ViewStyle } from 'react-native';
import { useMemo } from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import type { Theme } from '@/theme/tokens';
import type { LucideIcon } from 'lucide-react-native';

export function Row({
  icon: Icon,
  label,
  subtitle,
  right,
  onPress,
  chevron = true,
  danger = false,
  style,
  accessibilityLabel,
}: {
  icon?: LucideIcon;
  label: string;
  subtitle?: string;
  right?: React.ReactNode;
  onPress?: () => void;
  chevron?: boolean;
  danger?: boolean;
  style?: ViewStyle;
  accessibilityLabel?: string;
}) {
  const theme = useTheme();
  const styles = useMemo(() => buildStyles(theme, danger), [theme, danger]);
  const content = (
    <View style={styles.row}>
      {Icon && (
        <View style={[styles.iconWrap, { backgroundColor: danger ? theme.colors.errorSoft : theme.colors.brandSoft }]}>
          <Icon size={18} color={danger ? theme.colors.error : theme.colors.brand} strokeWidth={2.2} />
        </View>
      )}
      <View style={{ flex: 1 }}>
        <Text style={styles.label}>{label}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {right ?? (chevron && onPress ? <Text style={styles.chevron}>›</Text> : null)}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label}
        style={({ pressed }) => [styles.container, style, pressed && { opacity: 0.7 }]}
      >
        {content}
      </Pressable>
    );
  }
  return <View style={[styles.container, style]}>{content}</View>;
}

export function ToggleRow({
  icon: Icon,
  label,
  subtitle,
  value,
  onValueChange,
  accessibilityLabel,
}: {
  icon?: LucideIcon;
  label: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  accessibilityLabel?: string;
}) {
  const theme = useTheme();
  return (
    <Row
      icon={Icon}
      label={label}
      subtitle={subtitle}
      chevron={false}
      accessibilityLabel={accessibilityLabel ?? label}
      right={
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: theme.colors.borderStrong, true: theme.colors.brand }}
          thumbColor="#FFFFFF"
          accessibilityLabel={accessibilityLabel ?? label}
        />
      }
    />
  );
}

function buildStyles(theme: Theme, danger: boolean) {
  const { colors, spacing, radii, typography } = theme;
  return {
    container: {
      backgroundColor: colors.surface,
      borderRadius: radii.lg,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden' as const,
    } as ViewStyle,
    row: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: spacing.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      minHeight: 56,
    } as ViewStyle,
    iconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: 'center' as const, justifyContent: 'center' as const } as ViewStyle,
    label: { fontFamily: typography.fontFamilyMedium, fontSize: typography.sizes.md, fontWeight: '500' as const, color: danger ? colors.error : colors.textPrimary } as const,
    subtitle: { fontFamily: typography.fontFamily, fontSize: typography.sizes.sm, color: colors.textSecondary, marginTop: 2 } as const,
    chevron: { fontSize: 22, color: colors.textMuted, fontWeight: '300' as const } as const,
  };
}
