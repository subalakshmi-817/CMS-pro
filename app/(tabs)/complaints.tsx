import { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
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

    // Role-based filtering
    if (user?.role === 'staff') {
      // Staff see what they reported
      filtered = filtered.filter(c => c.reporterId === user.id);
    } else if (user?.role === 'manager') {
      // Managers see what's assigned to them
      filtered = filtered.filter(c => c.assignedManagerId === user.id);
    }
    // Admin sees everything

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    // Search filter
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
      <MaterialIcons name="assignment-late" size={80} color={theme.colors.textLight} style={styles.emptyIcon} />
      <Text style={styles.emptyTitle}>No complaints found</Text>
      <Text style={styles.emptyText}>
        {user?.role === 'staff'
          ? 'You have not submitted any complaints yet'
          : user?.role === 'manager'
            ? 'No complaints assigned to you'
            : 'No complaints in the system'}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {user?.role === 'staff' ? 'My Reported Issues' :
            user?.role === 'admin' ? 'System Overview' :
              'Assigned Tasks'}
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={20} color={theme.colors.textLight} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by title, desc or location..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={theme.colors.textLight}
        />
      </View>

      <View style={styles.filterContainer}>
        <Pressable
          style={[styles.filterChip, statusFilter === 'all' && styles.filterChipActive]}
          onPress={() => setStatusFilter('all')}
        >
          <Text style={[styles.filterText, statusFilter === 'all' && styles.filterTextActive]}>
            All
          </Text>
        </Pressable>
        {STATUSES.map(status => (
          <Pressable
            key={status.id}
            style={[styles.filterChip, statusFilter === status.id && styles.filterChipActive]}
            onPress={() => setStatusFilter(status.id as ComplaintStatus)}
          >
            <Text style={[styles.filterText, statusFilter === status.id && styles.filterTextActive]}>
              {status.label}
            </Text>
          </Pressable>
        ))}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: theme.spacing.sm,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surfaceDark,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textSecondary,
  },
  filterTextActive: {
    color: theme.colors.surface,
  },
  listContent: {
    padding: theme.spacing.lg,
    paddingTop: 0,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyIcon: {
    marginBottom: theme.spacing.lg,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  emptyText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
});
