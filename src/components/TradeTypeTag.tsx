import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { TradeType } from '../types/trade';
import { colors } from '../theme/colors';
import { tradeTypeLabel } from '../utils/formatters';

type Props = {
  type: TradeType;
  code?: 'P' | 'S';
};

/** Purchase/Sale is always conveyed by text + arrow icon + colour, never colour alone. */
export function TradeTypeTag({ type, code }: Props) {
  const isPurchase = type === 'purchase';
  const tone = isPurchase ? colors.purchase : colors.sale;

  return (
    <View style={[styles.tag, { backgroundColor: isPurchase ? colors.purchaseSoft : colors.saleSoft }]}>
      <Ionicons name={isPurchase ? 'arrow-up' : 'arrow-down'} size={13} color={tone} />
      <Text style={[styles.label, { color: tone }]}>
        {tradeTypeLabel(type)}
        {code ? `  ·  Code ${code}` : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
  },
});
