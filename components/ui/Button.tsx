import { ActivityIndicator, Pressable, Text, type PressableProps } from 'react-native';
import { useMemo } from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import type { Theme } from '@/theme/tokens';
import type { LucideIcon } from 'lucide-react-native';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  accessibilityHint?: string;
}

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  accessibilityHint,
  disabled,
  onPress,
  ...rest
}: ButtonProps) {
  const theme = useTheme();
  const styles = useMemo(() => buildStyles(theme), [theme]);

  const sizeStyle = styles.sizes[size];
  const variantStyle = styles.variants[variant];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!isDisabled, busy: loading }}
      accessibilityHint={accessibilityHint ?? label}
      style={({ pressed }) => [
        styles.base,
        sizeStyle,
        variantStyle,
        fullWidth && { width: '100%' as const },
        pressed && styles.pressed,
        isDisabled && styles.disabled,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={variantStyle.color?.valueOf() as string} size="small" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon size={sizeStyle.iconSize} color={variantStyle.color as unknown as string} strokeWidth={2.2} />}
          <Text style={[styles.label, { color: variantStyle.color as string }]}>{label}</Text>
          {Icon && iconPosition === 'right' && <Icon size={sizeStyle.iconSize} color={variantStyle.color as unknown as string} strokeWidth={2.2} />}
        </>
      )}
    </Pressable>
  );
}

function buildStyles(theme: Theme) {
  const { colors, spacing, radii, typography } = theme;
  return {
    base: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      gap: spacing.sm,
      borderRadius: radii.md,
      borderWidth: 1,
      borderColor: 'transparent',
    },
    label: {
      fontFamily: typography.fontFamilyMedium,
      fontSize: typography.sizes.md,
      fontWeight: typography.weights.semibold,
    },
    pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] } as const,
    disabled: { opacity: 0.5 },
    sizes: {
      sm: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, iconSize: 16, minHeight: 38 },
      md: { paddingVertical: spacing.md, paddingHorizontal: spacing.lg, iconSize: 18, minHeight: 48 },
      lg: { paddingVertical: spacing.lg, paddingHorizontal: spacing.xl, iconSize: 20, minHeight: 56 },
    } as Record<ButtonSize, any>,
    variants: {
      primary: { backgroundColor: colors.brand, color: colors.textInverse } as const,
      secondary: { backgroundColor: colors.accentSoft, color: colors.accent, borderColor: colors.accentSoft } as const,
      ghost: { backgroundColor: 'transparent', color: colors.textPrimary, borderColor: 'transparent' } as const,
      outline: { backgroundColor: 'transparent', color: colors.textPrimary, borderColor: colors.borderStrong } as const,
      danger: { backgroundColor: colors.error, color: colors.textInverse } as const,
    } as Record<ButtonVariant, any>,
  };
}
