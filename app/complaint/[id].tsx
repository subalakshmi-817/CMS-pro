import { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { useComplaints } from '@/hooks/useComplaints';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { Button } from '@/components/ui/Button';
import { theme } from '@/constants/theme';
import { COMPLAINT_CATEGORIES, ComplaintStatus } from '@/constants/config';
import { useAlert } from '@/template';
import { ComplaintUpdate } from '@/types';
import * as storage from '@/services/storage';

export default function ComplaintDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { complaints, updateComplaint, addComplaintUpdate } = useComplaints();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showAlert } = useAlert();

  const [showManagerPicker, setShowManagerPicker] = useState(false);
  const [resolutionNote, setResolutionNote] = useState('');
  const [managerList, setManagerList] = useState<any[]>([]);
  const [updates, setUpdates] = useState<ComplaintUpdate[]>([]);

  const complaint = complaints.find(c => c.id === id);

  useEffect(() => {
    loadManagers();
    loadUpdates();
  }, []);

  async function loadManagers() {
    const users = await storage.getAllUsers();
    setManagerList(users.filter(u => u.role === 'manager'));
  }

  async function loadUpdates() {
    if (!id) return;
    const data = await storage.getComplaintUpdates(id);
    setUpdates(data);
  }

  const handleStatusChange = async (newStatus: ComplaintStatus) => {
    if (!complaint) return;

    if (newStatus === 'resolved' && !resolutionNote.trim()) {
      showAlert('Error', 'Please add a resolution note before marking as resolved');
      return;
    }

    await updateComplaint(complaint.id, { status: newStatus });
    await addComplaintUpdate({
      complaintId: complaint.id,
      status: newStatus,
      note: resolutionNote || `Status changed to ${newStatus}`,
      updatedBy: user?.id || '',
      updatedByName: user?.name || '',
    });

    setResolutionNote('');
    await loadUpdates();
    showAlert('Success', `Complaint status updated to ${newStatus}`);
  };

  const handleAssignManager = async (managerId: string, managerName: string) => {
    if (!complaint) return;

    await updateComplaint(complaint.id, {
      assignedManagerId: managerId,
      assignedManagerName: managerName,
      status: 'in_progress',
    });

    await addComplaintUpdate({
      complaintId: complaint.id,
      status: 'in_progress',
      note: `Complaint assigned to manager ${managerName}`,
      updatedBy: user?.id || '',
      updatedByName: user?.name || '',
    });

    setShowManagerPicker(false);
    await loadUpdates();
    showAlert('Success', `Task assigned to ${managerName}`);
  };

  if (!complaint) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text style={styles.errorText}>Complaint not found</Text>
      </View>
    );
  }

  const category = COMPLAINT_CATEGORIES.find(c => c.id === complaint.category);
  const canManage = user?.role === 'admin' || (user?.role === 'manager' && complaint.assignedManagerId === user.id);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={20}>
          <MaterialIcons name="arrow-back" size={24} color={theme.colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.topRow}>
            <View style={styles.categoryBadge}>
              <MaterialIcons name={category?.icon as any} size={20} color={theme.colors.primary} />
              <Text style={styles.categoryText}>{category?.label}</Text>
            </View>
            <PriorityBadge priority={complaint.priority} />
          </View>

          <Text style={styles.title}>{complaint.title}</Text>
          <Text style={styles.description}>{complaint.description}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <MaterialIcons name="location-on" size={16} color={theme.colors.textSecondary} />
              <Text style={styles.metaText}>{complaint.location}</Text>
            </View>
            <View style={styles.metaItem}>
              <MaterialIcons name="person" size={16} color={theme.colors.textSecondary} />
              <Text style={styles.metaText}>{complaint.reporterName}</Text>
            </View>
          </View>

          <View style={styles.statusRow}>
            <StatusBadge status={complaint.status} />
            <Text style={styles.dateText}>
              {new Date(complaint.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {complaint.assignedManagerName && (
          <View style={styles.assignmentCard}>
            <MaterialIcons name="engineering" size={24} color={theme.colors.info} />
            <View style={styles.assignmentInfo}>
              <Text style={styles.assignmentLabel}>Assigned Manager</Text>
              <Text style={styles.assignmentName}>{complaint.assignedManagerName}</Text>
            </View>
          </View>
        )}

        {updates.length > 0 && (
          <View style={styles.timelineCard}>
            <Text style={styles.sectionTitle}>Status Timeline</Text>
            {updates.map((update, index) => (
              <View key={update.id} style={styles.timelineItem}>
                <View style={styles.timelineDot} />
                {index < updates.length - 1 && <View style={styles.timelineLine} />}
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineNote}>{update.note}</Text>
                  <Text style={styles.timelineMeta}>
                    By {update.updatedByName} • {new Date(update.createdAt).toLocaleString()}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {canManage && (
          <View style={styles.actionsCard}>
            <Text style={styles.sectionTitle}>Actions</Text>

            {user?.role === 'admin' && !complaint.assignedManagerId && (
              <>
                <Button
                  title="Assign to Manager"
                  onPress={() => setShowManagerPicker(!showManagerPicker)}
                  variant="outline"
                  fullWidth
                />
                {showManagerPicker && (
                  <View style={styles.pickerOptions}>
                    {managerList.length === 0 ? (
                      <Text style={styles.emptyText}>No managers available</Text>
                    ) : (
                      managerList.map(mgr => (
                        <Pressable
                          key={mgr.id}
                          style={styles.pickerOption}
                          onPress={() => handleAssignManager(mgr.id, mgr.name)}
                        >
                          <Text style={styles.pickerText}>{mgr.name}</Text>
                          <Text style={styles.pickerSubtext}>{mgr.department}</Text>
                        </Pressable>
                      ))
                    )}
                  </View>
                )}
              </>
            )}

            {complaint.status !== 'resolved' && (
              <>
                <TextInput
                  style={styles.noteInput}
                  placeholder="Add resolution note (required for resolved status)"
                  value={resolutionNote}
                  onChangeText={setResolutionNote}
                  multiline
                  numberOfLines={3}
                  placeholderTextColor={theme.colors.textLight}
                />

                <View style={styles.statusButtons}>
                  {complaint.status !== 'in_progress' && (
                    <Button
                      title="Set as In Progress"
                      onPress={() => handleStatusChange('in_progress')}
                      variant="outline"
                      fullWidth
                    />
                  )}
                  <Button
                    title="Mark as Resolved"
                    onPress={() => handleStatusChange('resolved')}
                    fullWidth
                  />
                </View>
              </>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  headerTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  content: {
    flex: 1,
  },
  card: {
    backgroundColor: theme.colors.surface,
    margin: theme.spacing.lg,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.primary,
  },
  title: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  description: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    lineHeight: 22,
    marginBottom: theme.spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textLight,
  },
  assignmentCard: {
    backgroundColor: `${theme.colors.info}10`,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  assignmentInfo: {
    flex: 1,
  },
  assignmentLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  assignmentName: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.info,
  },
  timelineCard: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.sm,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
    position: 'relative',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.primary,
    marginRight: theme.spacing.md,
    marginTop: 4,
  },
  timelineLine: {
    position: 'absolute',
    left: 5,
    top: 16,
    width: 2,
    height: '100%',
    backgroundColor: theme.colors.border,
  },
  timelineContent: {
    flex: 1,
  },
  timelineNote: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    marginBottom: 4,
  },
  timelineMeta: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textLight,
  },
  actionsCard: {
    backgroundColor: theme.colors.surface,
    margin: theme.spacing.lg,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.sm,
    gap: theme.spacing.md,
  },
  noteInput: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  statusButtons: {
    gap: theme.spacing.sm,
  },
  pickerOptions: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  pickerOption: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  pickerText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    fontWeight: theme.fontWeight.medium,
  },
  pickerSubtext: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  emptyText: {
    padding: theme.spacing.md,
    color: theme.colors.textLight,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  errorText: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.error,
    textAlign: 'center',
    marginTop: theme.spacing.xxl,
  },
});
