/**
 * Centralized theme tokens for ScamShield AI.
 * Light, Dark, and System themes are driven by Redux preference.
 */

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
  // Surfaces
  background: string;
  surface: string;
  surfaceRaised: string;
  surfaceOverlay: string;

  // Text
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;

  // Brand
  brand: string;
  brandDeep: string;
  brandSoft: string;

  // Accent
  accent: string;
  accentSoft: string;

  // Risk
  riskLow: string;
  riskLowSoft: string;
  riskSuspicious: string;
  riskSuspiciousSoft: string;
  riskHigh: string;
  riskHighSoft: string;
  riskUnknown: string;
  riskUnknownSoft: string;

  // Semantic
  success: string;
  successSoft: string;
  warning: string;
  warningSoft: string;
  error: string;
  errorSoft: string;

  // Borders & misc
  border: string;
  borderStrong: string;
  overlay: string;
  scrim: string;
}

export interface ThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

export interface ThemeRadii {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  pill: number;
}

export interface ThemeTypography {
  fontFamily: string;
  fontFamilyMedium: string;
  fontFamilyBold: string;
  sizes: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    display: number;
  };
  weights: {
    regular: '400';
    medium: '500';
    semibold: '600';
    bold: '700';
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
}

export interface Theme {
  mode: 'light' | 'dark';
  colors: ThemeColors;
  spacing: ThemeSpacing;
  radii: ThemeRadii;
  typography: ThemeTypography;
}

export const spacing: ThemeSpacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radii: ThemeRadii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
};

export const typography: ThemeTypography = {
  fontFamily: 'Inter-Regular',
  fontFamilyMedium: 'Inter-Medium',
  fontFamilyBold: 'Inter-Bold',
  sizes: { xs: 11, sm: 13, md: 15, lg: 17, xl: 22, xxl: 28, display: 36 },
  weights: { regular: '400', medium: '500', semibold: '600', bold: '700' },
  lineHeight: { tight: 1.2, normal: 1.5, relaxed: 1.7 },
};

const lightColors: ThemeColors = {
  background: '#F4F6FB',
  surface: '#FFFFFF',
  surfaceRaised: '#FFFFFF',
  surfaceOverlay: '#FFFFFFF2',

  textPrimary: '#0B1424',
  textSecondary: '#44516B',
  textMuted: '#8A95AB',
  textInverse: '#FFFFFF',

  brand: '#0E7C66',
  brandDeep: '#0A5C4D',
  brandSoft: '#E6F4F0',

  accent: '#1F6FEB',
  accentSoft: '#E6EFFE',

  riskLow: '#1A9E6B',
  riskLowSoft: '#E4F5EE',
  riskSuspicious: '#D98A00',
  riskSuspiciousSoft: '#FBF0DC',
  riskHigh: '#D92D2D',
  riskHighSoft: '#FCE6E6',
  riskUnknown: '#5B6478',
  riskUnknownSoft: '#EDEFF3',

  success: '#1A9E6B',
  successSoft: '#E4F5EE',
  warning: '#D98A00',
  warningSoft: '#FBF0DC',
  error: '#D92D2D',
  errorSoft: '#FCE6E6',

  border: '#E3E7EF',
  borderStrong: '#CBD2E0',
  overlay: '#0B14240D',
  scrim: '#0B142499',
};

const darkColors: ThemeColors = {
  background: '#070C16',
  surface: '#0F1623',
  surfaceRaised: '#151E2E',
  surfaceOverlay: '#0F1623F2',

  textPrimary: '#F2F5FB',
  textSecondary: '#AEB9CE',
  textMuted: '#6B7691',
  textInverse: '#0B1424',

  brand: '#2FBFA0',
  brandDeep: '#27A88C',
  brandSoft: '#0E2B26',

  accent: '#4B9BFF',
  accentSoft: '#0E1F3A',

  riskLow: '#3BD68E',
  riskLowSoft: '#0E2418',
  riskSuspicious: '#F0B23B',
  riskSuspiciousSoft: '#2A2008',
  riskHigh: '#FF6B6B',
  riskHighSoft: '#2A1010',
  riskUnknown: '#8A95AB',
  riskUnknownSoft: '#1A2030',

  success: '#3BD68E',
  successSoft: '#0E2418',
  warning: '#F0B23B',
  warningSoft: '#2A2008',
  error: '#FF6B6B',
  errorSoft: '#2A1010',

  border: '#1F2A3D',
  borderStrong: '#2C3A52',
  overlay: '#FFFFFF0D',
  scrim: '#000000CC',
};

export const lightTheme: Theme = {
  mode: 'light',
  colors: lightColors,
  spacing,
  radii,
  typography,
};

export const darkTheme: Theme = {
  mode: 'dark',
  colors: darkColors,
  spacing,
  radii,
  typography,
};
