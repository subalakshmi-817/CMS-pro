import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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

    if (user?.role === 'staff') {
      filtered = complaints.filter(c => c.reporterId === user.id);
    } else if (user?.role === 'manager') {
      filtered = complaints.filter(c => c.assignedManagerId === user.id);
    }

    return {
      total: filtered.length,
      pending: filtered.filter(c => c.status === 'pending').length,
      inProgress: filtered.filter(c => c.status === 'in_progress').length,
      resolved: filtered.filter(c => c.status === 'resolved').length,
    };
  }, [complaints, user]);

  return (
    <LinearGradient
      colors={[theme.colors.blue, theme.colors.pink]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScrollView
        style={{ flex: 1, paddingTop: insets.top }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome Back</Text>
            <Text style={styles.userName}>{user?.name} ✨</Text>
          </View>
          <View style={styles.roleContainer}>
            <MaterialIcons
              name={user?.role === 'admin' ? 'admin-panel-settings' :
                user?.role === 'manager' ? 'engineering' : 'work'}
              size={24}
              color={theme.colors.accent}
            />
          </View>
        </View>

        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Overview</Text>
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
                  title="Doing"
                  value={stats.inProgress}
                  icon="autorenew"
                  color={theme.colors.inProgress}
                />
              </View>
              <View style={styles.statItem}>
                <StatCard
                  title="Done"
                  value={stats.resolved}
                  icon="check-circle"
                  color={theme.colors.resolved}
                />
              </View>
            </View>
          </View>
        </View>

        {user?.role === 'staff' && (
          <View style={styles.actions}>
            <Button
              title="+ New Complaint"
              onPress={() => router.push('/submit-complaint')}
              fullWidth
              style={styles.mainButton}
            />
          </View>
        )}

        {(user?.role === 'admin' || user?.role === 'manager') && (
          <View style={styles.quickActions}>
            <Text style={styles.sectionTitle}>Manage</Text>
            <Pressable
              style={({ pressed }) => [styles.actionCard, pressed && styles.actionCardPressed]}
              onPress={() => router.push('/(tabs)/complaints')}
            >
              <View style={styles.actionIconContainer}>
                <MaterialIcons name="assignment" size={24} color={theme.colors.primary} />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>
                  {user?.role === 'admin' ? 'Review Complaints' : 'View My Tasks'}
                </Text>
                <Text style={styles.actionDescription}>
                  {user?.role === 'admin'
                    ? 'Assign managers and track progress'
                    : 'Update status of assigned work'}
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={theme.colors.textLight} />
            </Pressable>
          </View>
        )}

        <View style={styles.footer}>
          <View style={styles.infoCard}>
            <MaterialIcons name="info" size={20} color={theme.colors.secondary} />
            <Text style={styles.footerText}>
              {user?.role === 'staff'
                ? 'Ready to make your campus better today?'
                : 'Coordinate campus maintenance requests efficiently'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
  },
  greeting: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    fontWeight: theme.fontWeight.medium,
  },
  userName: {
    fontSize: 28,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  roleContainer: {
    width: 50,
    height: 50,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.md,
  },
  statsSection: {
    padding: theme.spacing.xl,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  statsGrid: {
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
    paddingHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  mainButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.xl,
    height: 60,
  },
  quickActions: {
    padding: theme.spacing.xl,
    paddingTop: 0,
  },
  actionCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xxl,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    ...theme.shadows.md,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: 'rgba(157, 157, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
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
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
  },
  footer: {
    padding: theme.spacing.xl,
    paddingTop: 0,
    paddingBottom: theme.spacing.xl,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: theme.borderRadius.lg,
    gap: 10,
  },
  footerText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    flex: 1,
  },
});
