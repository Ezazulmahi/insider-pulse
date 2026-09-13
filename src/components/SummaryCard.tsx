import { Ionicons } from '@expo/vector-icons';
import { ComponentProps } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, radius, spacing } from '../theme/colors';

type Props = {
  label: string;
  value: string;
  caption: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  tone: string;
  style?: ViewStyle;
};

export function SummaryCard({ label, value, caption, icon, tone, style }: Props) {
  return (
    <View style={[styles.card, style]} accessible accessibilityLabel={`${label}: ${value}, ${caption}`}>
      <View style={styles.header}>
        <View style={[styles.iconWrap, { backgroundColor: `${tone}22` }]}>
          <Ionicons name={icon} size={15} color={tone} />
        </View>
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
      </View>
      <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
      <Text style={styles.caption}>{caption}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  iconWrap: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  value: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
  },
  caption: {
    color: colors.textMuted,
    fontSize: 12,
  },
});
