import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

type Props = {
  label?: string;
};

export function DemoBadge({ label = 'Fictional demo data' }: Props) {
  return (
    <View style={styles.badge}>
      <Ionicons name="flask-outline" size={12} color={colors.demo} />
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    backgroundColor: colors.demoSoft,
    borderColor: 'rgba(250, 204, 21, 0.35)',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  text: {
    color: colors.demo,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
