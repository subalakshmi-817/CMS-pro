import { View, Text, StyleSheet } from 'react-native';
import { ComplaintStatus } from '@/constants/config';
import { theme } from '@/constants/theme';

interface StatusBadgeProps {
  status: ComplaintStatus;
  size?: 'small' | 'medium';
}

export function StatusBadge({ status, size = 'medium' }: StatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'pending':
        return { label: 'Pending', color: theme.colors.pending };
      case 'in_progress':
        return { label: 'In Progress', color: theme.colors.inProgress };
      case 'resolved':
        return { label: 'Resolved', color: theme.colors.resolved };
    }
  };

  const config = getStatusConfig();

  return (
    <View style={[styles.badge, { backgroundColor: `${config.color}20` }, size === 'small' && styles.badgeSmall]}>
      <View style={[styles.dot, { backgroundColor: config.color }]} />
      <Text style={[styles.label, { color: config.color }, size === 'small' && styles.labelSmall]}>
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.full,
    alignSelf: 'flex-start',
  },
  badgeSmall: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  label: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
  },
  labelSmall: {
    fontSize: theme.fontSize.xs,
  },
});
