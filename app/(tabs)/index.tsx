import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/hooks/useAuth';
import { useComplaints } from '@/hooks/useComplaints';
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
    <View style={styles.container}>
      <ScrollView
        style={{ flex: 1, paddingTop: insets.top }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatar}>
              <MaterialIcons
                name={user?.role === 'admin' ? 'admin-panel-settings' :
                  user?.role === 'manager' ? 'engineering' : 'face'}
                size={20}
                color={theme.colors.primary}
              />
            </View>
            <View>
              <Text style={styles.userInfo}>{user?.name || 'User'} <Text style={{ color: '#D1D5DB' }}>•</Text> {user?.role || 'Staff'}</Text>
              <View style={styles.progressTrackHeader}>
                <View style={[styles.progressBarHeader, { width: '40%' }]} />
              </View>
            </View>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.iconButton}>
              <MaterialIcons name="workspace-premium" size={20} color="#9CA3AF" />
            </View>
            <View style={styles.iconButton}>
              <MaterialIcons name="notifications-none" size={20} color="#9CA3AF" />
            </View>
          </View>
        </View>

        <View style={styles.greetingSection}>
          <Text style={styles.greetingTitle}>Hi, Ready to {user?.role === 'staff' ? 'report?' : 'manage?'}</Text>
          <Text style={styles.greetingSubtitle}>Track tasks and progress everyday</Text>
        </View>

        <View style={styles.cardContainer}>
          <LinearGradient
            colors={['#C4C1E0', '#DEDCF0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.statsCard}
          >
            <View style={styles.statsCardHeader}>
              <Text style={styles.statsCardTitle}>Track your records and {"\n"}see the each day</Text>
              <MaterialIcons name="more-horiz" size={24} color="#FFF" />
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsScroll}>
              {/* Total Stats */}
              <View style={styles.statInnerCard}>
                <View style={[styles.statIconBox, { backgroundColor: '#FF9D42' }]}>
                  <MaterialIcons name="auto-awesome" size={20} color="#FFF" />
                </View>
                <Text style={[styles.statLabel, { color: '#FFF' }]}>Total</Text>
                <Text style={[styles.statValue, { color: '#FFF' }]}>{stats.total}</Text>
              </View>

              {/* Resolved Stats */}
              <View style={styles.statInnerCardInactive}>
                <View style={[styles.statIconBoxInactive]}>
                  <MaterialIcons name="check" size={20} color="#9CA3AF" />
                </View>
                <Text style={styles.statLabelInactive}>Done</Text>
                <Text style={styles.statValueInactive}>{stats.resolved}</Text>
              </View>

              {/* Pending Stats */}
              <View style={styles.statInnerCardInactive}>
                <View style={[styles.statIconBoxInactive]}>
                  <MaterialIcons name="schedule" size={20} color="#9CA3AF" />
                </View>
                <Text style={styles.statLabelInactive}>Miss</Text>
                <Text style={styles.statValueInactive}>{stats.pending}</Text>
              </View>

              {/* In Progress Stats */}
              <View style={styles.statInnerCardInactive}>
                <View style={[styles.statIconBoxInactive]}>
                  <MaterialIcons name="autorenew" size={20} color="#9CA3AF" />
                </View>
                <Text style={styles.statLabelInactive}>Doing</Text>
                <Text style={styles.statValueInactive}>{stats.inProgress}</Text>
              </View>
            </ScrollView>

            <Pressable
              style={styles.cardButton}
              onPress={() => {
                if (user?.role === 'staff') router.push('/submit-complaint')
                else router.push('/(tabs)/complaints')
              }}
            >
              <Text style={styles.cardButtonText}>
                {user?.role === 'staff' ? 'Report New Issue' : 'Review Tasks'}
              </Text>
            </Pressable>
          </LinearGradient>
        </View>

        <View style={styles.recentSection}>
          <View style={styles.recentSectionHeader}>
            <Text style={styles.recentTitle}>Ongoing tasks</Text>
            <Text style={styles.seeAll}>See all</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recentScroll}>
            <View style={styles.recentCard}>
              <FontAwesome5 name="tools" size={32} color="#1E1E2D" style={{ marginBottom: 16 }} />
              <Text style={styles.recentCardTitle}>Campus Maintenance Basics</Text>
              <View style={styles.progressTrack}>
                <View style={[styles.progressBar, { width: '30%', backgroundColor: '#F59E0B' }]} />
              </View>
              <Text style={styles.progressText}>30%</Text>
            </View>

            <View style={styles.recentCard}>
              <Text style={styles.letters}>I <Text style={{ color: '#3B82F6' }}>T</Text> <Text style={{ color: '#10B981' }}>S</Text></Text>
              <Text style={styles.recentCardTitle}>IT Support System Checks</Text>
              <View style={styles.progressTrack}>
                <View style={[styles.progressBar, { width: '80%', backgroundColor: '#F59E0B' }]} />
              </View>
              <Text style={styles.progressText}>80%</Text>
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9FF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  userInfo: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E1E2D',
  },
  progressTrackHeader: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    width: 60,
    marginTop: 4,
  },
  progressBarHeader: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 2,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  greetingSection: {
    paddingHorizontal: 20,
    marginTop: 30,
    marginBottom: 20,
  },
  greetingTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E1E2D',
    marginBottom: 8,
  },
  greetingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  cardContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  statsCard: {
    borderRadius: 30,
    padding: 20,
    ...theme.shadows.md,
  },
  statsCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  statsCardTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
  },
  statsScroll: {
    gap: 12,
    marginBottom: 20,
  },
  statInnerCard: {
    backgroundColor: '#FFB870', // Slightly lighter orange background as active state
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    minWidth: 70,
  },
  statIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  statInnerCardInactive: {
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    minWidth: 70,
  },
  statIconBoxInactive: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabelInactive: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statValueInactive: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  cardButton: {
    backgroundColor: '#1E1E2D',
    borderRadius: 20,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  recentSection: {
    marginBottom: 40,
  },
  recentSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E1E2D',
  },
  seeAll: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  recentScroll: {
    paddingHorizontal: 20,
    gap: 16,
  },
  recentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    width: 160,
    ...theme.shadows.sm,
  },
  recentCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E1E2D',
    marginBottom: 16,
    lineHeight: 20,
  },
  progressTrack: {
    height: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  letters: {
    fontSize: 24,
    fontWeight: '800',
    color: '#F59E0B',
    marginBottom: 16,
    letterSpacing: 2,
  },
});
