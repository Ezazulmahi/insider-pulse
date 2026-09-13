import { StyleSheet, Text, View } from 'react-native';
import { SignalStrength } from '../types/trade';
import { colors } from '../theme/colors';

const LEVELS: Record<SignalStrength, number> = { High: 3, Medium: 2, Low: 1 };

const TONE: Record<SignalStrength, string> = {
  High: colors.accent,
  Medium: colors.analytics,
  Low: colors.textMuted,
};

type Props = {
  strength: SignalStrength;
  compact?: boolean;
};

/** Neutral analytics colours on purpose: strength describes the data, not a buy/sell call. */
export function SignalBadge({ strength, compact = false }: Props) {
  const tone = TONE[strength];
  const filled = LEVELS[strength];

  return (
    <View
      style={[styles.badge, { borderColor: tone }]}
      accessible
      accessibilityLabel={`${strength} signal strength`}
    >
      <View style={styles.bars}>
        {[1, 2, 3].map((level) => (
          <View
            key={level}
            style={[
              styles.bar,
              { height: 4 + level * 3, backgroundColor: level <= filled ? tone : colors.borderStrong },
            ]}
          />
        ))}
      </View>
      <Text style={[styles.label, { color: tone }]}>{compact ? strength : `${strength} strength`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  bar: {
    width: 3,
    borderRadius: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});
