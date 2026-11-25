import { useMemo } from 'react';
import { View, Text, TextInput, type TextInputProps } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import type { Theme } from '@/theme/tokens';
import type { LucideIcon } from 'lucide-react-native';

interface FieldProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  hint?: string;
}

export function Field({ label, error, icon: Icon, hint, ...inputProps }: FieldProps) {
  const theme = useTheme();
  const styles = useMemo(() => buildStyles(theme, !!error), [theme, !!error]);

  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.inputRow}>
        {Icon && <Icon size={18} color={theme.colors.textMuted} strokeWidth={2} />}
        <TextInput
          style={styles.input}
          placeholderTextColor={theme.colors.textMuted}
          autoCorrect={false}
          {...inputProps}
        />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

function buildStyles(theme: Theme, hasError: boolean) {
  const { colors, spacing, radii, typography } = theme;
  return {
    wrap: { gap: spacing.xs } as const,
    label: { fontFamily: typography.fontFamilyMedium, fontSize: typography.sizes.sm, fontWeight: '500' as const, color: colors.textSecondary } as const,
    inputRow: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: spacing.sm,
      paddingHorizontal: spacing.md,
      height: 52,
      borderRadius: radii.md,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: hasError ? colors.error : colors.border,
    } as const,
    input: {
      flex: 1,
      fontFamily: typography.fontFamily,
      fontSize: typography.sizes.md,
      color: colors.textPrimary,
      height: '100%' as unknown as number,
    } as const,
    error: { fontFamily: typography.fontFamily, fontSize: typography.sizes.xs, color: colors.error } as const,
    hint: { fontFamily: typography.fontFamily, fontSize: typography.sizes.xs, color: colors.textMuted } as const,
  };
}
