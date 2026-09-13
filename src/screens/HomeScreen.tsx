import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DemoBadge } from '../components/DemoBadge';
import { SummaryCard } from '../components/SummaryCard';
import { TradeCard } from '../components/TradeCard';
import { DEMO_SNAPSHOT_DATE, mockTrades } from '../data/mockTrades';
import { RootStackParamList } from '../navigation/AppNavigator';
import { colors, radius, spacing } from '../theme/colors';
import { InsiderTrade } from '../types/trade';
import { sortByFiledDesc } from '../utils/filterTrades';
import { formatCompactUsd, formatDate } from '../utils/formatters';
import { countForTheme, SIGNAL_THEMES, summarizeTrades } from '../utils/summary';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const summary = summarizeTrades(mockTrades);
const latestTrades = sortByFiledDesc(mockTrades).slice(0, 4);

export function HomeScreen({ navigation }: Props) {
  const openTrade = (trade: InsiderTrade) => navigation.navigate('TradeDetails', { tradeId: trade.id });

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Demo snapshot · {formatDate(DEMO_SNAPSHOT_DATE)}</Text>
          <View style={styles.titleRow}>
            <Text style={styles.title} accessibilityRole="header">
              Market Pulse
            </Text>
            <DemoBadge />
          </View>
        </View>

        {/* Search entry */}
        <Pressable
          onPress={() => navigation.navigate('Screener', { focusSearch: true })}
          style={({ pressed }) => [styles.search, pressed && styles.searchPressed]}
          accessibilityRole="search"
          accessibilityLabel="Search ticker or company. Opens the trade screener."
        >
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <Text style={styles.searchText}>Search ticker or company</Text>
          <Ionicons name="options-outline" size={18} color={colors.analytics} />
        </Pressable>

        {/* Summary cards */}
        <View style={styles.summaryGrid}>
          <SummaryCard
            label="Transactions"
            value={`${summary.transactionCount} filings`}
            caption={`${summary.highStrengthCount} high-strength demo signals`}
            icon="document-text-outline"
            tone={colors.analytics}
          />
          <View style={styles.summaryRow}>
            <SummaryCard
              style={styles.half}
              label="Purchases"
              value={formatCompactUsd(summary.purchaseValue)}
              caption={`${summary.purchaseCount} demo buys`}
              icon="arrow-up"
              tone={colors.purchase}
            />
            <SummaryCard
              style={styles.half}
              label="Sales"
              value={formatCompactUsd(summary.saleValue)}
              caption={`${summary.saleCount} demo sales`}
              icon="arrow-down"
              tone={colors.sale}
            />
          </View>
        </View>

        {/* Top signals */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle} accessibilityRole="header">
            Top Signals Today
          </Text>
          <Text style={styles.sectionHint}>Tap to filter</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.signalRow}>
          {SIGNAL_THEMES.map((theme) => {
            const tone = theme.tone === 'purchase' ? colors.purchase : colors.sale;
            const count = countForTheme(mockTrades, theme);
            return (
              <Pressable
                key={theme.id}
                onPress={() => navigation.navigate('Screener', { preset: theme.preset })}
                style={({ pressed }) => [styles.signalCard, pressed && styles.signalPressed]}
                accessibilityRole="button"
                accessibilityLabel={`${theme.title}: ${count} demo trades, ${theme.description}. Opens filtered screener.`}
              >
                <View style={[styles.signalIcon, { backgroundColor: `${tone}22` }]}>
                  <Ionicons name={theme.icon} size={20} color={tone} />
                </View>
                <Text style={styles.signalCount}>{count}</Text>
                <Text style={styles.signalTitle}>{theme.title}</Text>
                <Text style={styles.signalDesc}>{theme.description}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Latest activity */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle} accessibilityRole="header">
            Latest Activity
          </Text>
          <Pressable
            onPress={() => navigation.navigate('Screener')}
            accessibilityRole="button"
            accessibilityLabel="View all trades"
            hitSlop={10}
          >
            <Text style={styles.link}>View all</Text>
          </Pressable>
        </View>
        <View style={styles.list}>
          {latestTrades.map((trade) => (
            <TradeCard key={trade.id} trade={trade} onPress={openTrade} />
          ))}
        </View>

        <Pressable
          onPress={() => navigation.navigate('Screener')}
          style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
          accessibilityRole="button"
          accessibilityLabel={`Browse all ${summary.transactionCount} demo trades`}
        >
          <Text style={styles.ctaText}>Browse all {summary.transactionCount} demo trades</Text>
          <Ionicons name="arrow-forward" size={18} color={colors.background} />
        </Pressable>

        <Text style={styles.footnote}>
          Original concept prototype. Every company, person and figure is fictional mock data.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  header: {
    marginBottom: spacing.md,
  },
  eyebrow: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: 4,
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '800',
    marginRight: 4,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 50,
    paddingHorizontal: spacing.md,
    borderRadius: radius.card,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchPressed: {
    borderColor: colors.analytics,
  },
  searchText: {
    flex: 1,
    color: colors.textMuted,
    fontSize: 15,
  },
  summaryGrid: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  half: {
    flex: 1,
    minWidth: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  sectionHint: {
    color: colors.textMuted,
    fontSize: 12,
  },
  link: {
    color: colors.analytics,
    fontSize: 14,
    fontWeight: '700',
  },
  signalRow: {
    gap: spacing.sm,
    paddingRight: spacing.lg,
  },
  signalCard: {
    width: 148,
    padding: spacing.md,
    borderRadius: radius.card,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  signalPressed: {
    borderColor: colors.analytics,
  },
  signalIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signalCount: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '800',
    marginTop: spacing.sm,
  },
  signalTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  signalDesc: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  list: {
    gap: spacing.sm,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    minHeight: 52,
    marginTop: spacing.lg,
    borderRadius: radius.card,
    backgroundColor: colors.analytics,
  },
  ctaPressed: {
    opacity: 0.85,
  },
  ctaText: {
    color: colors.background,
    fontSize: 15,
    fontWeight: '800',
  },
  footnote: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
