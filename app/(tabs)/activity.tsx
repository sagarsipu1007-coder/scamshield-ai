import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, ScrollView, TextInput, Pressable } from 'react-native';
import { Search, Filter, ScanLine, Flag, Bot, Shield, X } from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Screen, ScreenHeader } from '@/components/ui/Screen';
import { Card } from '@/components/ui/Card';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { EmptyState, Loading } from '@/components/ui/States';
import { useQuery } from '@tanstack/react-query';
import { activityService } from '@/services';
import type { ActivityRecord } from '@/services/types';

const FILTERS: { key: ActivityRecord['kind'] | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'scan', label: 'Scans' },
  { key: 'incident', label: 'Incidents' },
  { key: 'ai', label: 'AI' },
  { key: 'auth', label: 'Security' },
];

const KIND_ICONS: Record<ActivityRecord['kind'], any> = {
  scan: ScanLine,
  incident: Flag,
  ai: Bot,
  auth: Shield,
};

export default function ActivityScreen() {
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<ActivityRecord['kind'] | 'all'>('all');

  const { data, isLoading } = useQuery({
    queryKey: ['activity', query, filter],
    queryFn: () =>
      activityService.search(
        query,
        filter === 'all' ? [] : [filter],
      ),
  });

  const records = data ?? [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: theme.spacing.xxl }}>
        <ScreenHeader title="Activity" subtitle="Your security timeline" />

        <View style={{ paddingHorizontal: theme.spacing.lg, gap: theme.spacing.lg }}>
          {/* Search */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, backgroundColor: theme.colors.surface, borderRadius: theme.radii.md, borderWidth: 1, borderColor: theme.colors.border, paddingHorizontal: theme.spacing.md }}>
            <Search size={18} color={theme.colors.textMuted} strokeWidth={2} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search activity…"
              placeholderTextColor={theme.colors.textMuted}
              accessibilityLabel="Search activity"
              style={{ flex: 1, fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.md, color: theme.colors.textPrimary, paddingVertical: theme.spacing.md }}
            />
            {query ? (
              <Pressable onPress={() => setQuery('')} accessibilityLabel="Clear search">
                <X size={18} color={theme.colors.textMuted} />
              </Pressable>
            ) : null}
          </View>

          {/* Filters */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: theme.spacing.sm }}>
            {FILTERS.map((f) => {
              const active = filter === f.key;
              return (
                <Pressable
                  key={f.key}
                  onPress={() => setFilter(f.key)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: theme.spacing.xs,
                    paddingHorizontal: theme.spacing.md,
                    paddingVertical: theme.spacing.sm,
                    borderRadius: theme.radii.pill,
                    borderWidth: 1,
                    borderColor: active ? theme.colors.brand : theme.colors.border,
                    backgroundColor: active ? theme.colors.brandSoft : theme.colors.surface,
                  }}
                  accessibilityLabel={`Filter by ${f.label}`}
                >
                  {f.key !== 'all' && <Filter size={14} color={active ? theme.colors.brand : theme.colors.textMuted} strokeWidth={2} />}
                  <Text style={{ fontFamily: theme.typography.fontFamilyMedium, fontSize: theme.typography.sizes.sm, color: active ? theme.colors.brand : theme.colors.textPrimary }}>
                    {f.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Results */}
          {isLoading ? (
            <Loading label="Loading activity…" />
          ) : records.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No results found"
              subtitle={query ? `Nothing matches "${query}".` : 'No activity yet. Start scanning to build your history.'}
            />
          ) : (
            <View style={{ gap: theme.spacing.sm }}>
              {records.map((record) => {
                const Icon = KIND_ICONS[record.kind];
                return (
                  <Card key={record.id} padded={false} style={{ paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.md }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md }}>
                      <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: theme.colors.surfaceRaised, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: theme.colors.border }}>
                        <Icon size={20} color={theme.colors.textSecondary} strokeWidth={2} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontFamily: theme.typography.fontFamilyMedium, fontSize: theme.typography.sizes.sm, color: theme.colors.textPrimary }} numberOfLines={1}>
                          {record.title}
                        </Text>
                        <Text style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.xs, color: theme.colors.textMuted, marginTop: 2 }} numberOfLines={1}>
                          {record.subtitle}
                        </Text>
                        <Text style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.xs, color: theme.colors.textMuted, marginTop: 4 }}>
                          {formatTime(record.createdAt)}
                        </Text>
                      </View>
                      {record.riskLevel ? <RiskBadge level={record.riskLevel} size="sm" /> : null}
                    </View>
                  </Card>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function formatTime(ts: number): string {
  const diff = Date.now() - ts;
  const hour = 1000 * 60 * 60;
  const day = hour * 24;
  if (diff < hour) return `${Math.max(1, Math.round(diff / (1000 * 60)))}m ago`;
  if (diff < day) return `${Math.round(diff / hour)}h ago`;
  return `${Math.round(diff / day)}d ago`;
}
