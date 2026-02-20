import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { useComplaints } from '@/hooks/useComplaints';
import { StatCard } from '@/components/ui/StatCard';
import { Button } from '@/components/ui/Button';
import { theme } from '@/constants/theme';
import { useMemo } from 'react';

export default function DashboardScreen() {
  const { user } = useAuth();
  const { complaints } = useComplaints();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const stats = useMemo(() => {
    let filtered = complaints;

    if (user?.role === 'student') {
      filtered = complaints.filter(c => c.studentId === user.id);
    } else if (user?.role === 'staff') {
      filtered = complaints.filter(c => c.assignedStaffId === user.id);
    }

    return {
      total: filtered.length,
      pending: filtered.filter(c => c.status === 'pending').length,
      inProgress: filtered.filter(c => c.status === 'in_progress').length,
      resolved: filtered.filter(c => c.status === 'resolved').length,
    };
  }, [complaints, user]);

  const handleSubmitComplaint = () => {
    router.push('/submit-complaint');
  };

  return (
    <ScrollView 
      style={[styles.container, { paddingTop: insets.top }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            {user?.role === 'admin' ? 'Admin Dashboard' : 
             user?.role === 'staff' ? 'My Assigned Tasks' : 
             'My Dashboard'}
          </Text>
          <Text style={styles.userName}>{user?.name}</Text>
        </View>
        <View style={styles.roleContainer}>
          <MaterialIcons 
            name={user?.role === 'admin' ? 'admin-panel-settings' : 
                  user?.role === 'staff' ? 'work' : 'school'} 
            size={24} 
            color={theme.colors.primary} 
          />
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <StatCard
              title="Total"
              value={stats.total}
              icon="assignment"
              color={theme.colors.primary}
            />
          </View>
          <View style={styles.statItem}>
            <StatCard
              title="Pending"
              value={stats.pending}
              icon="schedule"
              color={theme.colors.pending}
            />
          </View>
        </View>

        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <StatCard
              title="In Progress"
              value={stats.inProgress}
              icon="autorenew"
              color={theme.colors.inProgress}
            />
          </View>
          <View style={styles.statItem}>
            <StatCard
              title="Resolved"
              value={stats.resolved}
              icon="check-circle"
              color={theme.colors.resolved}
            />
          </View>
        </View>
      </View>

      {user?.role === 'student' && (
        <View style={styles.actions}>
          <Button
            title="+ Submit New Complaint"
            onPress={handleSubmitComplaint}
            fullWidth
          />
        </View>
      )}

      {user?.role === 'admin' && (
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <Pressable 
            style={({ pressed }) => [styles.actionCard, pressed && styles.actionCardPressed]}
            onPress={() => router.push('/(tabs)/complaints')}
          >
            <MaterialIcons name="assignment" size={32} color={theme.colors.primary} />
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Manage All Complaints</Text>
              <Text style={styles.actionDescription}>
                View, assign, and update complaint status
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={theme.colors.textLight} />
          </Pressable>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {user?.role === 'student' 
            ? 'Submit complaints and track their progress in real-time'
            : user?.role === 'admin'
            ? 'Manage and resolve campus complaints efficiently'
            : 'View and update your assigned complaints'}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  greeting: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  userName: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  roleContainer: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.md,
    backgroundColor: `${theme.colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsGrid: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  statRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  statItem: {
    flex: 1,
  },
  actions: {
    padding: theme.spacing.lg,
  },
  quickActions: {
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  actionCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    ...theme.shadows.sm,
  },
  actionCardPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  footer: {
    padding: theme.spacing.lg,
    paddingTop: 0,
  },
  footerText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
