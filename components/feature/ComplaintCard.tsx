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
  showStudent?: boolean;
}

export function ComplaintCard({ complaint, onPress, showStudent }: ComplaintCardProps) {
  const category = COMPLAINT_CATEGORIES.find(c => c.id === complaint.category);
  const timeAgo = getTimeAgo(complaint.createdAt);

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <View style={styles.categoryContainer}>
          <MaterialIcons name={category?.icon as any || 'help'} size={20} color={theme.colors.primary} />
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

      <View style={styles.meta}>
        <View style={styles.metaItem}>
          <MaterialIcons name="location-on" size={14} color={theme.colors.textSecondary} />
          <Text style={styles.metaText}>{complaint.location}</Text>
        </View>
        <Text style={styles.metaText}>•</Text>
        <Text style={styles.metaText}>{timeAgo}</Text>
      </View>

      {showStudent && (
        <View style={styles.studentInfo}>
          <MaterialIcons name="person" size={14} color={theme.colors.textSecondary} />
          <Text style={styles.studentName}>{complaint.studentName}</Text>
        </View>
      )}

      {complaint.assignedStaffName && (
        <View style={styles.assignedInfo}>
          <MaterialIcons name="assignment-ind" size={14} color={theme.colors.info} />
          <Text style={styles.assignedText}>Assigned to {complaint.assignedStaffName}</Text>
        </View>
      )}

      <View style={styles.footer}>
        <StatusBadge status={complaint.status} size="small" />
      </View>
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
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  cardPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  category: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.primary,
  },
  title: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  description: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: theme.spacing.sm,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: theme.spacing.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: theme.spacing.xs,
  },
  studentName: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    fontWeight: theme.fontWeight.medium,
  },
  assignedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: theme.spacing.xs,
  },
  assignedText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.info,
    fontWeight: theme.fontWeight.medium,
  },
  footer: {
    marginTop: theme.spacing.xs,
  },
});
