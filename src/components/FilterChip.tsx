import { Ionicons } from '@expo/vector-icons';
import { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../theme/colors';

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
  icon?: ComponentProps<typeof Ionicons>['name'];
  iconColor?: string;
};

export function FilterChip({ label, selected, onPress, icon, iconColor }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.chip, selected && styles.selected, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`${label} filter${selected ? ', selected' : ''}`}
      hitSlop={4}
    >
      {selected ? (
        <Ionicons name="checkmark" size={14} color={colors.analytics} />
      ) : icon ? (
        <Ionicons name={icon} size={14} color={iconColor ?? colors.textSecondary} />
      ) : null}
      <Text style={[styles.label, selected && styles.selectedLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 36,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  selected: {
    borderColor: colors.analytics,
    backgroundColor: colors.analyticsSoft,
  },
  pressed: {
    opacity: 0.8,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  selectedLabel: {
    color: colors.text,
  },
});
