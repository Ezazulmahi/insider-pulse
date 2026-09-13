import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackButton } from '../components/BackButton';
import { DemoBadge } from '../components/DemoBadge';
import { MockActivityChart } from '../components/MockActivityChart';
import { SignalBadge } from '../components/SignalBadge';
import { TickerMark } from '../components/TickerMark';
import { TradeTypeTag } from '../components/TradeTypeTag';
import { getTradeById } from '../data/mockTrades';
import { RootStackParamList } from '../navigation/AppNavigator';
import { colors, radius, spacing } from '../theme/colors';
import { InsiderTrade } from '../types/trade';
import { formatCompactUsd, formatDate, formatDateTime, formatShares, formatUsd } from '../utils/formatters';

type Props = NativeStackScreenProps<RootStackParamList, 'TradeDetails'>;

export const REQUIRED_DISCLAIMER =
  'This prototype uses mock data for demonstration only. Insider-trading filings are public disclosures and do not constitute investment advice. Past activity does not guarantee future stock performance.';

function whyItMatters(trade: InsiderTrade): string {
  if (trade.type === 'purchase') {
    return `When a ${trade.role === 'Officer' ? 'company officer' : trade.role} spends their own money on shares, it is one disclosed fact worth noting while researching a company. On its own it says nothing certain about the insider's wider finances, their reasons, or where the share price goes next.`;
  }
  return `Insiders sell for many ordinary reasons — taxes, diversification, a pre-planned schedule, or a personal expense. A ${trade.role === 'Officer' ? 'company officer' : trade.role} sale is a disclosed fact to put in context, not a verdict on the company's outlook.`;
}

function DetailCell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={styles.cell}>
      <Text style={styles.cellLabel}>{label}</Text>
      {children}
    </View>
  );
}

export function TradeDetailsScreen({ navigation, route }: Props) {
  const trade = getTradeById(route.params.tradeId);

  if (!trade) {
    return (
      <SafeAreaView style={[styles.safe, styles.missing]}>
        <Text style={styles.cellValue}>This demo trade could not be found.</Text>
        <Pressable onPress={() => navigation.goBack()} accessibilityRole="button" style={styles.missingButton}>
          <Text style={styles.link}>Go back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const isPurchase = trade.type === 'purchase';
  const tone = isPurchase ? colors.purchase : colors.sale;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <BackButton onPress={() => navigation.goBack()} />
          <DemoBadge label="FICTIONAL DEMO DATA" />
        </View>

        {/* Company header */}
        <View style={styles.companyRow}>
          <TickerMark ticker={trade.ticker} size={56} />
          <View style={styles.companyText}>
            <Text style={styles.company} accessibilityRole="header">
              {trade.company}
            </Text>
            <Text style={styles.tickerLine}>
              {trade.ticker} · {trade.sector}
            </Text>
          </View>
        </View>

        {/* Signal card */}
        <View style={[styles.signalCard, { borderColor: tone }]}>
          <View style={[styles.signalGlow, { backgroundColor: isPurchase ? colors.purchaseSoft : colors.saleSoft }]} />
          <View style={styles.signalTop}>
            <View style={styles.signalLabelRow}>
              <Ionicons name="pulse" size={16} color={colors.accent} />
              <Text style={styles.signalEyebrow}>Signal</Text>
            </View>
            <SignalBadge strength={trade.signalStrength} />
          </View>
          <Text style={styles.signalName}>{trade.signal}</Text>
          <Text style={styles.signalValue}>
            <Text style={{ color: tone }}>{formatCompactUsd(trade.value)}</Text> fictional demo insider{' '}
            {isPurchase ? 'buy' : 'sale'}
          </Text>
        </View>

        {/* Metrics grid */}
        <Text style={styles.sectionTitle} accessibilityRole="header">
          Filing details
        </Text>
        <View style={styles.grid}>
          <DetailCell label="Insider">
            <Text style={styles.cellValue}>{trade.insider}</Text>
            <Text style={styles.cellSub}>{trade.role}</Text>
          </DetailCell>
          <DetailCell label="Transaction">
            <TradeTypeTag type={trade.type} code={trade.transactionCode} />
          </DetailCell>
          <DetailCell label="Shares">
            <Text style={styles.cellValue}>{formatShares(trade.shares)}</Text>
          </DetailCell>
          <DetailCell label="Price per share">
            <Text style={styles.cellValue}>{formatUsd(trade.pricePerShare)}</Text>
            <Text style={styles.cellSub}>(demo)</Text>
          </DetailCell>
          <DetailCell label="Total value">
            <Text style={[styles.cellValue, { color: tone }]}>{formatCompactUsd(trade.value)}</Text>
            <Text style={styles.cellSub}>(demo)</Text>
          </DetailCell>
          <DetailCell label="Transaction date">
            <Text style={styles.cellValue}>{formatDate(trade.transactionDate)}</Text>
          </DetailCell>
          <DetailCell label="Filed date">
            <Text style={styles.cellValue}>{formatDateTime(trade.filedAt)}</Text>
          </DetailCell>
          <DetailCell label="Signal strength">
            <Text style={styles.cellValue}>{trade.signalStrength}</Text>
            <Text style={styles.cellSub}>{trade.signal}</Text>
          </DetailCell>
        </View>

        {/* Chart */}
        <View style={styles.section}>
          <MockActivityChart values={trade.activity} />
        </View>

        {/* Education */}
        <View style={[styles.section, styles.infoCard]}>
          <View style={styles.infoHeader}>
            <Ionicons name="school-outline" size={18} color={colors.analytics} />
            <Text style={styles.infoTitle}>Why this matters</Text>
          </View>
          <Text style={styles.infoBody}>{whyItMatters(trade)}</Text>
        </View>

        {/* Required disclaimer */}
        <View style={[styles.section, styles.disclaimer]} accessible accessibilityLabel={`Disclaimer. ${REQUIRED_DISCLAIMER}`}>
          <View style={styles.infoHeader}>
            <Ionicons name="shield-checkmark-outline" size={18} color={colors.demo} />
            <Text style={styles.infoTitle}>Disclaimer</Text>
          </View>
          <Text style={styles.disclaimerText}>{REQUIRED_DISCLAIMER}</Text>
        </View>
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
    paddingTop: spacing.xs,
    paddingBottom: spacing.xl * 2,
  },
  missing: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  missingButton: {
    padding: spacing.sm,
  },
  link: {
    color: colors.analytics,
    fontWeight: '700',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  companyText: {
    flex: 1,
    minWidth: 0,
  },
  company: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
  },
  tickerLine: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 2,
  },
  signalCard: {
    marginTop: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.card,
    borderWidth: 1,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  signalGlow: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  signalTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  signalLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  signalEyebrow: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  signalName: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '800',
    marginTop: spacing.sm,
  },
  signalValue: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
    marginTop: 4,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  cell: {
    flexGrow: 1,
    flexBasis: '46%',
    minWidth: 140,
    padding: spacing.sm,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  cellLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  cellValue: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  cellSub: {
    color: colors.textMuted,
    fontSize: 12,
  },
  section: {
    marginTop: spacing.md,
  },
  infoCard: {
    padding: spacing.md,
    borderRadius: radius.card,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  infoTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  infoBody: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
  },
  disclaimer: {
    padding: spacing.md,
    borderRadius: radius.card,
    backgroundColor: colors.demoSoft,
    borderWidth: 1,
    borderColor: 'rgba(250, 204, 21, 0.35)',
  },
  disclaimerText: {
    color: colors.text,
    fontSize: 13,
    lineHeight: 20,
  },
});
