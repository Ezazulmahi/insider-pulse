import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ComponentProps, useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackButton } from '../components/BackButton';
import { DemoBadge } from '../components/DemoBadge';
import { FilterChip } from '../components/FilterChip';
import { TradeCard } from '../components/TradeCard';
import { mockTrades } from '../data/mockTrades';
import { RootStackParamList } from '../navigation/AppNavigator';
import { colors, radius, spacing } from '../theme/colors';
import { InsiderTrade } from '../types/trade';
import {
  DEFAULT_FILTERS,
  filterTrades,
  hasActiveFilters,
  RoleFilter,
  sortByFiledDesc,
  TradeFilters,
  TypeFilter,
  ValueFilter,
} from '../utils/filterTrades';

type Props = NativeStackScreenProps<RootStackParamList, 'Screener'>;

type Option<T> = {
  value: T;
  label: string;
  icon?: ComponentProps<typeof Ionicons>['name'];
  iconColor?: string;
};

const TYPE_OPTIONS: Option<TypeFilter>[] = [
  { value: 'all', label: 'All' },
  { value: 'purchase', label: 'Purchases', icon: 'arrow-up', iconColor: colors.purchase },
  { value: 'sale', label: 'Sales', icon: 'arrow-down', iconColor: colors.sale },
];

const ROLE_OPTIONS: Option<RoleFilter>[] = [
  { value: 'all', label: 'All roles' },
  { value: 'CEO', label: 'CEO' },
  { value: 'CFO', label: 'CFO' },
  { value: 'Director', label: 'Director' },
];

const VALUE_OPTIONS: Option<ValueFilter>[] = [
  { value: 0, label: 'Any' },
  { value: 100_000, label: '$100K+' },
  { value: 500_000, label: '$500K+' },
  { value: 1_000_000, label: '$1M+' },
];

const sortedTrades = sortByFiledDesc(mockTrades);

export function ScreenerScreen({ navigation, route }: Props) {
  const [filters, setFilters] = useState<TradeFilters>(() => ({
    ...DEFAULT_FILTERS,
    ...route.params?.preset,
  }));

  const results = useMemo(() => filterTrades(sortedTrades, filters), [filters]);
  const active = hasActiveFilters(filters);

  const update = <K extends keyof TradeFilters>(key: K, value: TradeFilters[K]) =>
    setFilters((current) => ({ ...current, [key]: value }));

  const clearAll = () => setFilters(DEFAULT_FILTERS);
  const openTrade = (trade: InsiderTrade) => navigation.navigate('TradeDetails', { tradeId: trade.id });

  const renderGroup = <K extends 'type' | 'role' | 'minValue'>(
    label: string,
    key: K,
    options: Option<TradeFilters[K]>[],
  ) => (
    <View style={styles.group}>
      <Text style={styles.groupLabel}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
        {options.map((option) => (
          <FilterChip
            key={String(option.value)}
            label={option.label}
            icon={option.icon}
            iconColor={option.iconColor}
            selected={filters[key] === option.value}
            onPress={() => update(key, option.value)}
          />
        ))}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={styles.top}>
        <View style={styles.headerRow}>
          <BackButton onPress={() => navigation.goBack()} />
          <View style={styles.headerText}>
            <Text style={styles.title} accessibilityRole="header">
              Trade Screener
            </Text>
            <DemoBadge />
          </View>
        </View>

        <View style={styles.search}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            value={filters.query}
            onChangeText={(text) => update('query', text)}
            placeholder="Search ticker or company"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            autoFocus={route.params?.focusSearch}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            accessibilityLabel="Search ticker or company"
          />
          {filters.query.length > 0 && (
            <Pressable
              onPress={() => update('query', '')}
              accessibilityRole="button"
              accessibilityLabel="Clear search"
              hitSlop={10}
            >
              <Ionicons name="close-circle" size={20} color={colors.textMuted} />
            </Pressable>
          )}
        </View>

        {renderGroup('Transaction type', 'type', TYPE_OPTIONS)}
        {renderGroup('Insider role', 'role', ROLE_OPTIONS)}
        {renderGroup('Value threshold', 'minValue', VALUE_OPTIONS)}

        <View style={styles.resultBar}>
          <Text style={styles.resultCount} accessibilityLiveRegion="polite">
            {results.length} {results.length === 1 ? 'result' : 'results'}
          </Text>
          {active && (
            <Pressable onPress={clearAll} accessibilityRole="button" accessibilityLabel="Clear filters" hitSlop={10}>
              <Text style={styles.clearLink}>Clear filters</Text>
            </Pressable>
          )}
        </View>
      </View>

      <FlatList
        data={results}
        keyExtractor={(trade) => trade.id}
        renderItem={({ item }) => <TradeCard trade={item} onPress={openTrade} />}
        contentContainerStyle={[styles.listContent, results.length === 0 && styles.listEmpty]}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons name="funnel-outline" size={26} color={colors.analytics} />
            </View>
            <Text style={styles.emptyTitle}>No fictional demo trades match those filters.</Text>
            <Text style={styles.emptyBody}>Try a different ticker, or widen the role and value filters.</Text>
            <Pressable
              onPress={clearAll}
              style={({ pressed }) => [styles.emptyButton, pressed && { opacity: 0.85 }]}
              accessibilityRole="button"
              accessibilityLabel="Clear filters"
            >
              <Ionicons name="refresh" size={16} color={colors.background} />
              <Text style={styles.emptyButtonText}>Clear filters</Text>
            </Pressable>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  top: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: 48,
    paddingHorizontal: spacing.md,
    borderRadius: radius.card,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    paddingVertical: 10,
  },
  group: {
    marginTop: spacing.sm,
  },
  groupLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  chipRow: {
    gap: spacing.xs,
    paddingRight: spacing.lg,
  },
  resultBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  resultCount: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '700',
  },
  clearLink: {
    color: colors.analytics,
    fontSize: 14,
    fontWeight: '700',
  },
  listContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  listEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  separator: {
    height: spacing.sm,
  },
  empty: {
    alignItems: 'center',
    padding: spacing.xl,
    borderRadius: radius.card,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.borderStrong,
  },
  emptyIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.analyticsSoft,
    marginBottom: spacing.sm,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptyBody: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 44,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
    borderRadius: 999,
    backgroundColor: colors.analytics,
  },
  emptyButtonText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '800',
  },
});
