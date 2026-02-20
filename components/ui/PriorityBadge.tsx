import { View, Text, StyleSheet } from 'react-native';
import { ComplaintPriority } from '@/constants/config';
import { theme } from '@/constants/theme';

interface PriorityBadgeProps {
  priority: ComplaintPriority;
  size?: 'small' | 'medium';
}

export function PriorityBadge({ priority, size = 'medium' }: PriorityBadgeProps) {
  const getPriorityConfig = () => {
    switch (priority) {
      case 'low':
        return { label: 'Low', color: theme.colors.resolved };
      case 'medium':
        return { label: 'Medium', color: theme.colors.pending };
      case 'high':
        return { label: 'High', color: theme.colors.error };
    }
  };

  const config = getPriorityConfig();

  return (
    <View style={[styles.badge, { borderColor: config.color }, size === 'small' && styles.badgeSmall]}>
      <Text style={[styles.label, { color: config.color }, size === 'small' && styles.labelSmall]}>
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1.5,
    alignSelf: 'flex-start',
  },
  badgeSmall: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  label: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
  },
  labelSmall: {
    fontSize: 10,
  },
});
