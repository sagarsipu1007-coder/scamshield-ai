import { useTheme } from '@/theme/ThemeProvider';
import type { RiskLevel } from '@/services/types';
import { Shield, ShieldAlert, ShieldX, HelpCircle } from 'lucide-react-native';

/**
 * Maps a risk level to its theme color and a representative icon.
 */
export function useRiskStyle() {
  const theme = useTheme();
  return {
    color: (level: RiskLevel) =>
      level === 'low'
        ? theme.colors.riskLow
        : level === 'suspicious'
          ? theme.colors.riskSuspicious
          : level === 'high'
            ? theme.colors.riskHigh
            : theme.colors.riskUnknown,
    soft: (level: RiskLevel) =>
      level === 'low'
        ? theme.colors.riskLowSoft
        : level === 'suspicious'
          ? theme.colors.riskSuspiciousSoft
          : level === 'high'
            ? theme.colors.riskHighSoft
            : theme.colors.riskUnknownSoft,
    icon: (level: RiskLevel) =>
      level === 'low' ? Shield : level === 'suspicious' ? ShieldAlert : level === 'high' ? ShieldX : HelpCircle,
  };
}
