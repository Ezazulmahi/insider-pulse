import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

type Props = {
  ticker: string;
  size?: number;
};

/** A simple monogram tile; no logos, since every company here is invented. */
export function TickerMark({ ticker, size = 44 }: Props) {
  return (
    <View
      style={[styles.mark, { width: size, height: size, borderRadius: size * 0.3 }]}
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
    >
      <Text style={[styles.text, { fontSize: size * 0.28 }]}>{ticker.slice(0, 2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mark: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  text: {
    color: colors.analytics,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
