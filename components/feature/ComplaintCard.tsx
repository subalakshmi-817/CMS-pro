import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Complaint } from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { COMPLAINT_CATEGORIES } from '@/constants/config';
import { theme } from '@/constants/theme';

interface ComplaintCardProps {
  complaint: Complaint;
  onPress: () => void;
  showReporter?: boolean;
}

export function ComplaintCard({ complaint, onPress, showReporter }: ComplaintCardProps) {
  const category = COMPLAINT_CATEGORIES.find(c => c.id === complaint.category);
  const timeAgo = getTimeAgo(complaint.createdAt);

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <View style={styles.categoryContainer}>
          <View style={styles.iconContainer}>
            <MaterialIcons name={category?.icon as any || 'help'} size={18} color={theme.colors.primary} />
          </View>
          <Text style={styles.category}>{category?.label || 'Others'}</Text>
        </View>
        <PriorityBadge priority={complaint.priority} size="small" />
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {complaint.title}
      </Text>

      <Text style={styles.description} numberOfLines={2}>
        {complaint.description}
      </Text>

      <View style={styles.divider} />

      <View style={styles.footer}>
        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <MaterialIcons name="location-on" size={14} color={theme.colors.textSecondary} />
            <Text style={styles.metaText}>{complaint.location}</Text>
          </View>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.metaText}>{timeAgo}</Text>
        </View>
        <StatusBadge status={complaint.status} size="small" />
      </View>

      {(showReporter || complaint.assignedManagerName) && (
        <View style={styles.peopleSection}>
          {showReporter && (
            <View style={styles.personItem}>
              <MaterialIcons name="person-outline" size={14} color={theme.colors.textLight} />
              <Text style={styles.personText}>{complaint.reporterName}</Text>
            </View>
          )}
          {complaint.assignedManagerName && (
            <View style={styles.personItem}>
              <MaterialIcons name="engineering" size={14} color={theme.colors.accent} />
              <Text style={[styles.personText, { color: theme.colors.accent }]}>{complaint.assignedManagerName}</Text>
            </View>
          )}
        </View>
      )}
    </Pressable>
  );
}

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `${diffDays}d ago`;
  if (diffHours > 0) return `${diffHours}h ago`;
  if (diffMins > 0) return `${diffMins}m ago`;
  return 'Just now';
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xxl,
    padding: theme.spacing.lg,
    ...theme.shadows.md,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(157, 157, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  category: {
    fontSize: 10,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: 6,
  },
  description: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.divider,
    marginBottom: theme.spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    fontWeight: theme.fontWeight.medium,
  },
  dot: {
    fontSize: 10,
    color: theme.colors.textLight,
  },
  peopleSection: {
    flexDirection: 'row',
    marginTop: theme.spacing.md,
    gap: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
    borderStyle: 'dashed',
  },
  personItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  personText: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    fontWeight: theme.fontWeight.medium,
  },
});
