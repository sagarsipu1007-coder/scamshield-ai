import { Modal, View, Pressable, Text, type ViewStyle } from 'react-native';
import { useMemo } from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import type { Theme } from '@/theme/tokens';
import { X } from 'lucide-react-native';

export function Sheet({
  visible,
  onClose,
  title,
  children,
  style,
}: {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  const theme = useTheme();
  const styles = useMemo(() => buildStyles(theme), [theme]);
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.scrim} onPress={onClose} accessibilityLabel="Close" />
      <View style={[styles.sheet, style]}>
        <View style={styles.handle} />
        {title ? (
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Pressable onPress={onClose} accessibilityLabel="Close" style={styles.closeBtn}>
              <X size={20} color={theme.colors.textSecondary} strokeWidth={2} />
            </Pressable>
          </View>
        ) : null}
        {children}
      </View>
    </Modal>
  );
}

function buildStyles(theme: Theme) {
  const { colors, spacing, radii, typography } = theme;
  return {
    scrim: { flex: 1, backgroundColor: colors.scrim } as ViewStyle,
    sheet: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: radii.xl,
      borderTopRightRadius: radii.xl,
      padding: spacing.lg,
      paddingBottom: spacing.xxl,
      maxHeight: '90%' as unknown as number,
      borderWidth: 1,
      borderColor: colors.border,
    } as ViewStyle,
    handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.borderStrong, alignSelf: 'center' as const, marginBottom: spacing.md } as ViewStyle,
    header: { flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'space-between' as const, marginBottom: spacing.md } as ViewStyle,
    title: { fontFamily: typography.fontFamilyBold, fontSize: typography.sizes.lg, color: colors.textPrimary } as const,
    closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surfaceRaised, alignItems: 'center' as const, justifyContent: 'center' as const } as ViewStyle,
  };
}
