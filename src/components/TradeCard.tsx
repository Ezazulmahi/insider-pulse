import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { InsiderTrade } from '../types/trade';
import { colors, radius, spacing } from '../theme/colors';
import { formatCompactUsd, formatShortDateTime, tradeTypeLabel } from '../utils/formatters';
import { SignalBadge } from './SignalBadge';
import { TickerMark } from './TickerMark';
import { TradeTypeTag } from './TradeTypeTag';

type Props = {
  trade: InsiderTrade;
  onPress: (trade: InsiderTrade) => void;
};

export function TradeCard({ trade, onPress }: Props) {
  const tone = trade.type === 'purchase' ? colors.purchase : colors.sale;

  return (
    <Pressable
      onPress={() => onPress(trade)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`${trade.ticker}, ${trade.company}. ${tradeTypeLabel(trade.type)} of ${formatCompactUsd(
        trade.value,
      )} by ${trade.insider}, ${trade.role}. ${trade.signalStrength} signal. Fictional demo data. Opens details.`}
    >
      <View style={styles.topRow}>
        <TickerMark ticker={trade.ticker} />
        <View style={styles.identity}>
          <Text style={styles.ticker}>{trade.ticker}</Text>
          <Text style={styles.company} numberOfLines={1}>
            {trade.company}
          </Text>
        </View>
        <View style={styles.valueBlock}>
          <Text style={[styles.value, { color: tone }]}>{formatCompactUsd(trade.value)}</Text>
          <TradeTypeTag type={trade.type} />
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.metaRow}>
        <View style={styles.metaLeft}>
          <Text style={styles.insider} numberOfLines={1}>
            {trade.insider} <Text style={styles.role}>· {trade.role}</Text>
          </Text>
          <View style={styles.filedRow}>
            <Ionicons name="time-outline" size={12} color={colors.textMuted} />
            <Text style={styles.filed}>Filed {formatShortDateTime(trade.filedAt)}</Text>
          </View>
        </View>
        <SignalBadge strength={trade.signalStrength} compact />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  pressed: {
    borderColor: colors.analytics,
    opacity: 0.9,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  identity: {
    flex: 1,
    minWidth: 0,
  },
  ticker: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  company: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  valueBlock: {
    alignItems: 'flex-end',
    gap: 4,
  },
  value: {
    fontSize: 17,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metaLeft: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  insider: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  role: {
    color: colors.textMuted,
    fontWeight: '500',
  },
  filedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  filed: {
    color: colors.textMuted,
    fontSize: 12,
  },
});
