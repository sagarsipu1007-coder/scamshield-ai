import { useContext } from 'react';
import { createStaticStyleSheet, StaticStyleSheetContext } from './StaticStyleSheet';
import { useTheme } from './ThemeProvider';
import type { Theme } from './tokens';

/**
 * Helpers shared across the app for producing themed styles.
 * `useThemedStyles` binds the active theme into a StyleSheet-like map.
 */

export function useThemedStyles<T extends Record<string, any>>(
  build: (theme: Theme) => T,
): T {
  const theme = useTheme();
  return build(theme);
}

export { createStaticStyleSheet, StaticStyleSheetContext };
