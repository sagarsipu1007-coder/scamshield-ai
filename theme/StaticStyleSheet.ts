import { StyleSheet } from 'react-native';

/**
 * Minimal static StyleSheet registry. Kept for parity with the codebase
 * convention; most components build themed styles inline via useThemedStyles.
 */
export type StaticStyleSheetContext = typeof StyleSheet;

export function createStaticStyleSheet<T extends Record<string, any>>(styles: T): T {
  return StyleSheet.create(styles) as T;
}
