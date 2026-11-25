import { View, Text, Pressable } from 'react-native';
import { useMemo } from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import type { Theme } from '@/theme/tokens';
import type { ScanResult } from '@/services/types';
import { Card } from '@/components/ui/Card';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { useRiskStyle } from '@/components/ui/useRiskStyle';
import { ShieldCheck, ShieldAlert, ShieldX, HelpCircle, Lightbulb, Flag, ChevronRight } from 'lucide-react-native';

export function ScanResultCard({ result, onReport }: { result: ScanResult; onReport?: () => void }) {
  const theme = useTheme();
  const risk = useRiskStyle();
  const styles = useMemo(() => buildStyles(theme), [theme]);
  const Icon = risk.icon(result.riskLevel);
  const color = risk.color(result.riskLevel);
  const soft = risk.soft(result.riskLevel);

  return (
    <View style={{ gap: theme.spacing.md }}>
      {/* Verdict hero */}
      <Card padded={false}>
        <View style={{ backgroundColor: soft, paddingVertical: theme.spacing.xl, alignItems: 'center', borderTopLeftRadius: theme.radii.lg, borderTopRightRadius: theme.radii.lg }}>
          <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#FFFFFF44', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={32} color={color} strokeWidth={2} />
          </View>
          <Text style={{ fontFamily: theme.typography.fontFamilyBold, fontSize: theme.typography.sizes.xl, color: color, marginTop: theme.spacing.md }}>
            {labelFor(result.riskLevel)}
          </Text>
          <Text style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary, marginTop: theme.spacing.xs }}>
            Risk score: {result.riskScore}/100
          </Text>
        </View>
        <View style={{ padding: theme.spacing.lg }}>
          <Text style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.md, color: theme.colors.textPrimary, lineHeight: theme.typography.lineHeight.relaxed }}>
            {result.summary}
          </Text>
        </View>
      </Card>

      {/* Signals */}
      <Card>
        <Text style={{ fontFamily: theme.typography.fontFamilyBold, fontSize: theme.typography.sizes.md, color: theme.colors.textPrimary, marginBottom: theme.spacing.md }}>
          Risk signals
        </Text>
        <View style={{ gap: theme.spacing.sm }}>
          {result.signals.map((sig, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing.md }}>
              <View style={[styles.signalDot, { backgroundColor: severityColor(sig.severity, theme) }]} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: theme.typography.fontFamilyMedium, fontSize: theme.typography.sizes.sm, color: theme.colors.textPrimary }}>
                  {sig.label}
                </Text>
                <Text style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary, marginTop: 2 }}>
                  {sig.detail}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </Card>

      {/* Recommendations */}
      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, marginBottom: theme.spacing.md }}>
          <Lightbulb size={18} color={theme.colors.warning} strokeWidth={2} />
          <Text style={{ fontFamily: theme.typography.fontFamilyBold, fontSize: theme.typography.sizes.md, color: theme.colors.textPrimary }}>
            What to do
          </Text>
        </View>
        <View style={{ gap: theme.spacing.sm }}>
          {result.recommendations.map((rec, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing.sm }}>
              <Text style={{ fontFamily: theme.typography.fontFamilyBold, fontSize: theme.typography.sizes.sm, color: theme.colors.brand, minWidth: 18 }}>{i + 1}.</Text>
              <Text style={{ flex: 1, fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.sm, color: theme.colors.textPrimary, lineHeight: theme.typography.lineHeight.relaxed }}>
                {rec}
              </Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Report CTA */}
      {onReport && result.riskLevel !== 'low' && (
        <Pressable onPress={onReport} accessibilityLabel="Start incident recovery">
          <Card padded={false} style={{ paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.md, flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, borderColor: theme.colors.error, borderWidth: 1.5 }}>
            <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: theme.colors.errorSoft, alignItems: 'center', justifyContent: 'center' }}>
              <Flag size={20} color={theme.colors.error} strokeWidth={2} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: theme.typography.fontFamilyBold, fontSize: theme.typography.sizes.sm, color: theme.colors.textPrimary }}>
                Affected by this scam?
              </Text>
              <Text style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.xs, color: theme.colors.textSecondary, marginTop: 2 }}>
                Start a guided recovery
              </Text>
            </View>
            <ChevronRight size={18} color={theme.colors.textMuted} />
          </Card>
        </Pressable>
      )}

      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <RiskBadge level={result.riskLevel} score={result.riskScore} size="lg" />
      </View>

      <Text style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.xs, color: theme.colors.textMuted, textAlign: 'center' }}>
        Mock analysis — results are simulated for demonstration.
      </Text>
    </View>
  );
}

function labelFor(level: ScanResult['riskLevel']): string {
  return level === 'low' ? 'Low Risk' : level === 'suspicious' ? 'Suspicious' : level === 'high' ? 'High Risk' : 'Unknown';
}

function severityColor(sev: 'info' | 'warning' | 'danger', theme: Theme): string {
  return sev === 'danger' ? theme.colors.error : sev === 'warning' ? theme.colors.warning : theme.colors.success;
}

function buildStyles(theme: Theme) {
  const { colors, spacing } = theme;
  return {
    signalDot: { width: 10, height: 10, borderRadius: 5, marginTop: 4 } as const,
  };
}
