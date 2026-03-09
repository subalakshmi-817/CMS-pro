import { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/hooks/useAuth';
import { useComplaints } from '@/hooks/useComplaints';
import { ComplaintCard } from '@/components/ui/ComplaintCard';
import { theme } from '@/constants/theme';
import { ComplaintStatus, STATUSES } from '@/constants/config';

export default function ComplaintsScreen() {
  const { user } = useAuth();
  const { complaints, loading } = useComplaints();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | 'all'>('all');

  const filteredComplaints = useMemo(() => {
    let filtered = complaints;

    if (user?.role === 'staff') {
      filtered = filtered.filter(c => c.reporterId === user.id);
    } else if (user?.role === 'manager') {
      filtered = filtered.filter(c => c.assignedManagerId === user.id);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        c =>
          c.title.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query) ||
          c.location.toLowerCase().includes(query)
      );
    }

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [complaints, user, statusFilter, searchQuery]);

  const handleComplaintPress = (complaintId: string) => {
    router.push(`/complaint/${complaintId}`);
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <MaterialIcons name="assignment-late" size={48} color={theme.colors.textLight} />
      </View>
      <Text style={styles.emptyTitle}>No records mapping</Text>
      <Text style={styles.emptyText}>
        {user?.role === 'staff'
          ? 'Submission is empty'
          : 'Assignment list is clear'}
      </Text>
    </View>
  );

  return (
    <LinearGradient
      colors={[theme.colors.blue, theme.colors.pink]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={{ flex: 1, paddingTop: insets.top }}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {user?.role === 'staff' ? 'Reports' :
              user?.role === 'admin' ? 'Monitoring' :
                'Tasks'}
          </Text>
        </View>

        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <MaterialIcons name="search" size={20} color={theme.colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Find issues..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={theme.colors.textLight}
            />
          </View>
        </View>

        <View style={styles.filterSection}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={['all', ...STATUSES.map(s => s.id)]}
            renderItem={({ item }) => (
              <Pressable
                style={[styles.filterChip, statusFilter === item && styles.filterChipActive]}
                onPress={() => setStatusFilter(item as ComplaintStatus | 'all')}
              >
                <Text style={[styles.filterText, statusFilter === item && styles.filterTextActive]}>
                  {item === 'all' ? 'All' : STATUSES.find(s => s.id === item)?.label}
                </Text>
              </Pressable>
            )}
            keyExtractor={item => item}
            contentContainerStyle={styles.filterList}
          />
        </View>

        <FlatList
          data={filteredComplaints}
          renderItem={({ item }) => (
            <ComplaintCard
              complaint={item}
              onPress={() => handleComplaintPress(item.id)}
              showReporter={user?.role !== 'staff'}
            />
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmpty}
          refreshing={loading}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  searchSection: {
    paddingHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.xl,
    height: 50,
    ...theme.shadows.sm,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: theme.spacing.sm,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  filterSection: {
    marginBottom: theme.spacing.md,
  },
  filterList: {
    paddingHorizontal: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary,
  },
  filterText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textSecondary,
  },
  filterTextActive: {
    color: theme.colors.surface,
  },
  listContent: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  emptyTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  emptyText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});
