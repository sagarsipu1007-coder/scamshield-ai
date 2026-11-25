import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft, Smartphone, Landmark, Mail, MessageSquare, User, FileCode,
  CheckCircle2, Circle, Plus, Clock, Paperclip, Phone, Globe, X,
} from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Sheet } from '@/components/ui/Sheet';
import { Loading, EmptyState } from '@/components/ui/States';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { incidentService } from '@/services';
import type { IncidentReport } from '@/services/types';

type IncidentType = IncidentReport['type'];

const TYPES: { key: IncidentType; icon: any; label: string; desc: string }[] = [
  { key: 'upi', icon: Smartphone, label: 'UPI fraud', desc: 'Money sent to a scammer via UPI' },
  { key: 'banking', icon: Landmark, label: 'Banking fraud', desc: 'Unauthorized card or account activity' },
  { key: 'phishing', icon: Mail, label: 'Phishing', desc: 'Entered details on a fake page' },
  { key: 'whatsapp', icon: MessageSquare, label: 'WhatsApp compromise', desc: 'Account hacked or hijacked' },
  { key: 'identity', icon: User, label: 'Identity theft', desc: 'Personal info misused' },
  { key: 'apk', icon: FileCode, label: 'Suspicious APK', desc: 'Installed a malicious app' },
];

const RESOURCES = [
  { icon: Phone, label: 'Cybercrime helpline', detail: '1930 — report financial fraud', value: '1930' },
  { icon: Globe, label: 'cybercrime.gov.in', detail: 'File an online complaint', value: 'cybercrime.gov.in' },
  { icon: Phone, label: 'Bank customer care', detail: 'Block cards and report transactions', value: 'Contact your bank' },
];

export default function IncidentScreen() {
  const theme = useTheme();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [activeReport, setActiveReport] = useState<IncidentReport | null>(null);
  const [evidenceName, setEvidenceName] = useState('');
  const [evidenceSheet, setEvidenceSheet] = useState(false);

  const { data: reports, isLoading } = useQuery({
    queryKey: ['incidents'],
    queryFn: () => incidentService.listReports(),
  });

  const createMutation = useMutation({
    mutationFn: (type: IncidentType) => incidentService.createReport(type),
    onSuccess: (report) => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
      setActiveReport(report);
      setPickerOpen(false);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ reportId, stepId }: { reportId: string; stepId: string }) => incidentService.toggleStep(reportId, stepId),
    onSuccess: (report) => {
      setActiveReport(report);
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    },
  });

  const evidenceMutation = useMutation({
    mutationFn: ({ reportId, name, kind }: { reportId: string; name: string; kind: 'image' | 'note' }) => incidentService.addEvidence(reportId, name, kind),
    onSuccess: (report) => {
      setActiveReport(report);
      setEvidenceSheet(false);
      setEvidenceName('');
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    },
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top', 'bottom']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.md, borderBottomWidth: 1, borderBottomColor: theme.colors.border }}>
        <Pressable onPress={() => (activeReport ? setActiveReport(null) : router.back())} accessibilityLabel="Go back">
          <ArrowLeft size={22} color={theme.colors.textPrimary} strokeWidth={2} />
        </Pressable>
        <Text style={{ fontFamily: theme.typography.fontFamilyBold, fontSize: theme.typography.sizes.xl, color: theme.colors.textPrimary }}>
          {activeReport ? 'Recovery' : 'Incident Recovery'}
        </Text>
      </View>

      {!activeReport ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: theme.spacing.lg, gap: theme.spacing.lg, paddingBottom: theme.spacing.xxl }}>
          <Text style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.md, color: theme.colors.textSecondary, lineHeight: theme.typography.lineHeight.relaxed }}>
            If you have been scammed or suspect fraud, start a guided recovery. We will walk you through every step, help you collect evidence, and connect you with official reporting resources.
          </Text>

          {isLoading ? (
            <Loading label="Loading incidents…" />
          ) : (reports ?? []).length > 0 ? (
            <View style={{ gap: theme.spacing.sm }}>
              <Text style={{ fontFamily: theme.typography.fontFamilyBold, fontSize: theme.typography.sizes.md, color: theme.colors.textPrimary }}>
                Your incidents
              </Text>
              {(reports ?? []).map((r) => (
                <Pressable key={r.id} onPress={() => setActiveReport(r)}>
                  <Card padded={false} style={{ paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.md, flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md }}>
                    <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: theme.colors.errorSoft, alignItems: 'center', justifyContent: 'center' }}>
                      <FileCode size={20} color={theme.colors.error} strokeWidth={2} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontFamily: theme.typography.fontFamilyMedium, fontSize: theme.typography.sizes.sm, color: theme.colors.textPrimary }}>{r.title}</Text>
                      <Text style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.xs, color: theme.colors.textMuted, marginTop: 2 }}>
                        {r.steps.filter((s) => s.done).length}/{r.steps.length} steps · {formatTime(r.createdAt)}
                      </Text>
                    </View>
                  </Card>
                </Pressable>
              ))}
            </View>
          ) : null}

          <View>
            <Text style={{ fontFamily: theme.typography.fontFamilyBold, fontSize: theme.typography.sizes.lg, color: theme.colors.textPrimary, marginBottom: theme.spacing.md }}>
              What happened?
            </Text>
            <View style={{ gap: theme.spacing.sm }}>
              {TYPES.map((t) => (
                <Pressable key={t.key} onPress={() => createMutation.mutate(t.key)} disabled={createMutation.isPending}>
                  <Card padded={false} style={{ paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.md, flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md }}>
                    <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: theme.colors.brandSoft, alignItems: 'center', justifyContent: 'center' }}>
                      <t.icon size={22} color={theme.colors.brand} strokeWidth={2} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontFamily: theme.typography.fontFamilyBold, fontSize: theme.typography.sizes.sm, color: theme.colors.textPrimary }}>{t.label}</Text>
                      <Text style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.xs, color: theme.colors.textMuted, marginTop: 2 }}>{t.desc}</Text>
                    </View>
                  </Card>
                </Pressable>
              ))}
            </View>
          </View>

          {createMutation.isPending && <Loading label="Creating recovery plan…" />}

          {/* Resources */}
          <Card>
            <CardHeader icon={Phone} title="Report to authorities" subtitle="Indian cybercrime resources" />
            <View style={{ gap: theme.spacing.sm }}>
              {RESOURCES.map((r) => (
                <View key={r.label} style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md }}>
                  <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: theme.colors.accentSoft, alignItems: 'center', justifyContent: 'center' }}>
                    <r.icon size={18} color={theme.colors.accent} strokeWidth={2} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: theme.typography.fontFamilyMedium, fontSize: theme.typography.sizes.sm, color: theme.colors.textPrimary }}>{r.label}</Text>
                    <Text style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.xs, color: theme.colors.textMuted, marginTop: 2 }}>{r.detail}</Text>
                  </View>
                  <Text style={{ fontFamily: theme.typography.fontFamilyBold, fontSize: theme.typography.sizes.sm, color: theme.colors.accent }}>{r.value}</Text>
                </View>
              ))}
            </View>
          </Card>
        </ScrollView>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: theme.spacing.lg, gap: theme.spacing.lg, paddingBottom: theme.spacing.xxl }}>
          {/* Progress */}
          <Card>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: theme.spacing.sm }}>
              <Text style={{ fontFamily: theme.typography.fontFamilyBold, fontSize: theme.typography.sizes.md, color: theme.colors.textPrimary }}>{activeReport.title}</Text>
              <Text style={{ fontFamily: theme.typography.fontFamilyMedium, fontSize: theme.typography.sizes.sm, color: theme.colors.brand }}>
                {activeReport.steps.filter((s) => s.done).length}/{activeReport.steps.length}
              </Text>
            </View>
            <View style={{ height: 8, borderRadius: 4, backgroundColor: theme.colors.border, overflow: 'hidden' }}>
              <View style={{ height: 8, borderRadius: 4, backgroundColor: theme.colors.brand, width: `${(activeReport.steps.filter((s) => s.done).length / activeReport.steps.length) * 100}%` }} />
            </View>
          </Card>

          {/* Steps */}
          <View style={{ gap: theme.spacing.sm }}>
            {activeReport.steps.map((step) => (
              <Pressable key={step.id} onPress={() => toggleMutation.mutate({ reportId: activeReport.id, stepId: step.id })} accessibilityLabel={`${step.done ? 'Completed' : 'Incomplete'}: ${step.label}`}>
                <Card padded={false} style={{ paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.md, flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, borderColor: step.done ? theme.colors.success : theme.colors.border, borderWidth: step.done ? 1.5 : 1 }}>
                  {step.done ? <CheckCircle2 size={22} color={theme.colors.success} strokeWidth={2} /> : <Circle size={22} color={theme.colors.textMuted} strokeWidth={2} />}
                  <Text style={{ flex: 1, fontFamily: theme.typography.fontFamilyMedium, fontSize: theme.typography.sizes.sm, color: theme.colors.textPrimary, textDecorationLine: step.done ? 'line-through' : 'none' }}>
                    {step.label}
                  </Text>
                </Card>
              </Pressable>
            ))}
          </View>

          {/* Evidence */}
          <Card>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: theme.spacing.md }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }}>
                <Paperclip size={18} color={theme.colors.brand} strokeWidth={2} />
                <Text style={{ fontFamily: theme.typography.fontFamilyBold, fontSize: theme.typography.sizes.md, color: theme.colors.textPrimary }}>Evidence</Text>
              </View>
              <Pressable onPress={() => setEvidenceSheet(true)} accessibilityLabel="Add evidence">
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs, backgroundColor: theme.colors.brandSoft, paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.xs, borderRadius: theme.radii.pill }}>
                  <Plus size={14} color={theme.colors.brand} strokeWidth={2.4} />
                  <Text style={{ fontFamily: theme.typography.fontFamilyMedium, fontSize: theme.typography.sizes.xs, color: theme.colors.brand }}>Add</Text>
                </View>
              </Pressable>
            </View>
            {activeReport.evidence.length === 0 ? (
              <Text style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.sm, color: theme.colors.textMuted, textAlign: 'center', paddingVertical: theme.spacing.md }}>
                No evidence collected yet. Add screenshots, transaction IDs, or notes.
              </Text>
            ) : (
              <View style={{ gap: theme.spacing.sm }}>
                {activeReport.evidence.map((e) => (
                  <View key={e.id} style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, paddingVertical: theme.spacing.xs }}>
                    <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: theme.colors.surfaceRaised, alignItems: 'center', justifyContent: 'center' }}>
                      {e.kind === 'image' ? <Paperclip size={14} color={theme.colors.textSecondary} /> : <FileCode size={14} color={theme.colors.textSecondary} />}
                    </View>
                    <Text style={{ flex: 1, fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.sm, color: theme.colors.textPrimary }}>{e.name}</Text>
                    <Text style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.xs, color: theme.colors.textMuted }}>{formatTime(e.addedAt)}</Text>
                  </View>
                ))}
              </View>
            )}
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader icon={Clock} title="Timeline" />
            <View style={{ gap: theme.spacing.md }}>
              {activeReport.timeline.map((t, i) => (
                <View key={t.id} style={{ flexDirection: 'row', gap: theme.spacing.md }}>
                  <View style={{ alignItems: 'center' }}>
                    <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: i === 0 ? theme.colors.brand : theme.colors.borderStrong }} />
                    {i < activeReport.timeline.length - 1 && <View style={{ width: 2, flex: 1, backgroundColor: theme.colors.border, marginTop: 2 }} />}
                  </View>
                  <View style={{ paddingBottom: theme.spacing.sm }}>
                    <Text style={{ fontFamily: theme.typography.fontFamilyMedium, fontSize: theme.typography.sizes.sm, color: theme.colors.textPrimary }}>{t.label}</Text>
                    <Text style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.xs, color: theme.colors.textMuted, marginTop: 2 }}>{formatTime(t.at)}</Text>
                  </View>
                </View>
              ))}
            </View>
          </Card>

          {/* Resources */}
          <Card>
            <CardHeader icon={Phone} title="Official reporting" subtitle="Contact these immediately" />
            <View style={{ gap: theme.spacing.sm }}>
              {RESOURCES.map((r) => (
                <View key={r.label} style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md }}>
                  <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: theme.colors.accentSoft, alignItems: 'center', justifyContent: 'center' }}>
                    <r.icon size={18} color={theme.colors.accent} strokeWidth={2} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: theme.typography.fontFamilyMedium, fontSize: theme.typography.sizes.sm, color: theme.colors.textPrimary }}>{r.label}</Text>
                    <Text style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.xs, color: theme.colors.textMuted, marginTop: 2 }}>{r.detail}</Text>
                  </View>
                  <Text style={{ fontFamily: theme.typography.fontFamilyBold, fontSize: theme.typography.sizes.sm, color: theme.colors.accent }}>{r.value}</Text>
                </View>
              ))}
            </View>
          </Card>
        </ScrollView>
      )}

      {/* Evidence sheet */}
      <Sheet visible={evidenceSheet} onClose={() => setEvidenceSheet(false)} title="Add evidence">
        <View style={{ gap: theme.spacing.md }}>
          <TextInput
            value={evidenceName}
            onChangeText={setEvidenceName}
            placeholder="e.g. Screenshot of chat or transaction ID"
            placeholderTextColor={theme.colors.textMuted}
            accessibilityLabel="Evidence description"
            style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.md, color: theme.colors.textPrimary, backgroundColor: theme.colors.surfaceRaised, borderRadius: theme.radii.md, paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.md, borderWidth: 1, borderColor: theme.colors.border }}
          />
          <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
            <View style={{ flex: 1 }}>
              <Button label="Add as image" variant="outline" icon={Paperclip} onPress={() => activeReport && evidenceName.trim() && evidenceMutation.mutate({ reportId: activeReport.id, name: evidenceName, kind: 'image' })} />
            </View>
            <View style={{ flex: 1 }}>
              <Button label="Add as note" variant="outline" icon={FileCode} onPress={() => activeReport && evidenceName.trim() && evidenceMutation.mutate({ reportId: activeReport.id, name: evidenceName, kind: 'note' })} />
            </View>
          </View>
        </View>
      </Sheet>
    </SafeAreaView>
  );
}

function formatTime(ts: number): string {
  const diff = Date.now() - ts;
  const min = 1000 * 60;
  const hour = min * 60;
  const day = hour * 24;
  if (diff < min) return 'just now';
  if (diff < hour) return `${Math.round(diff / min)}m ago`;
  if (diff < day) return `${Math.round(diff / hour)}h ago`;
  return `${Math.round(diff / day)}d ago`;
}
