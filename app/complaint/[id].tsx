import { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
    <LinearGradient
      colors={[theme.colors.blue, theme.colors.pink]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={{ flex: 1, paddingTop: insets.top }}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color={theme.colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>Issue Details</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            <View style={styles.topRow}>
              <View style={styles.categoryBadge}>
                <MaterialIcons name={category?.icon as any} size={18} color={theme.colors.primary} />
                <Text style={styles.categoryText}>{category?.label}</Text>
              </View>
              <PriorityBadge priority={complaint.priority} />
            </View>

            <Text style={styles.title}>{complaint.title}</Text>
            <Text style={styles.description}>{complaint.description}</Text>

            <View style={styles.metaSection}>
              <View style={styles.metaItem}>
                <View style={styles.metaIcon}>
                  <MaterialIcons name="location-on" size={16} color={theme.colors.primary} />
                </View>
                <Text style={styles.metaText}>{complaint.location}</Text>
              </View>
              <View style={styles.metaItem}>
                <View style={styles.metaIcon}>
                  <MaterialIcons name="person" size={16} color={theme.colors.primary} />
                </View>
                <Text style={styles.metaText}>By {complaint.reporterName}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.statusRow}>
              <StatusBadge status={complaint.status} />
              <Text style={styles.dateText}>
                {new Date(complaint.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>

          {complaint.assignedManagerName && (
            <View style={styles.assignmentCard}>
              <View style={styles.assignIconBox}>
                <MaterialIcons name="engineering" size={24} color={theme.colors.surface} />
              </View>
              <View style={styles.assignmentInfo}>
                <Text style={styles.assignmentLabel}>Assigned Task Force</Text>
                <Text style={styles.assignmentName}>{complaint.assignedManagerName}</Text>
              </View>
            </View>
          )}

          {updates.length > 0 && (
            <View style={styles.timelineSection}>
              <Text style={styles.sectionTitle}>Activity</Text>
              <View style={styles.timelineCard}>
                {updates.map((update, index) => (
                  <View key={update.id} style={styles.timelineItem}>
                    <View style={styles.timelineDot} />
                    {index < updates.length - 1 && <View style={styles.timelineLine} />}
                    <View style={styles.timelineContent}>
                      <Text style={styles.timelineNote}>{update.note}</Text>
                      <Text style={styles.timelineMeta}>
                        {update.updatedByName} • {new Date(update.createdAt).toLocaleString()}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {canManage && (
            <View style={styles.actionsSection}>
              <Text style={styles.sectionTitle}>Review Actions</Text>
              <View style={styles.actionsCard}>
                {user?.role === 'admin' && !complaint.assignedManagerId && (
                  <>
                    <Pressable
                      style={styles.assignSelectionButton}
                      onPress={() => setShowManagerPicker(!showManagerPicker)}
                    >
                      <MaterialIcons name="person-add" size={20} color={theme.colors.primary} />
                      <Text style={styles.assignSelectionText}>Select Manager</Text>
                      <MaterialIcons name={showManagerPicker ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={20} color={theme.colors.textLight} />
                    </Pressable>

                    {showManagerPicker && (
                      <View style={styles.pickerOptions}>
                        {managerList.length === 0 ? (
                          <Text style={styles.emptyText}>Mapping list empty</Text>
                        ) : (
                          managerList.map(mgr => (
                            <Pressable
                              key={mgr.id}
                              style={styles.pickerOption}
                              onPress={() => handleAssignManager(mgr.id, mgr.name)}
                            >
                              <View>
                                <Text style={styles.pickerText}>{mgr.name}</Text>
                                <Text style={styles.pickerSubtext}>{mgr.department}</Text>
                              </View>
                              <MaterialIcons name="add-circle-outline" size={20} color={theme.colors.primary} />
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
                      placeholder="Enter resolution notes..."
                      value={resolutionNote}
                      onChangeText={setResolutionNote}
                      multiline
                      numberOfLines={3}
                      placeholderTextColor={theme.colors.textLight}
                    />

                    <View style={styles.statusButtons}>
                      {complaint.status !== 'in_progress' && (
                        <Button
                          title="Start Progress"
                          onPress={() => handleStatusChange('in_progress')}
                          variant="outline"
                          fullWidth
                          style={styles.outlineButton}
                        />
                      )}
                      <Button
                        title="Complete Resolution"
                        onPress={() => handleStatusChange('resolved')}
                        fullWidth
                        style={styles.solveButton}
                      />
                    </View>
                  </>
                )}
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl,
  },
  card: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.xl,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.xxl,
    ...theme.shadows.lg,
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
    gap: 8,
    backgroundColor: 'rgba(157, 157, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.lg,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 22,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  description: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    lineHeight: 22,
    marginBottom: theme.spacing.xl,
  },
  metaSection: {
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metaIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metaText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    fontWeight: theme.fontWeight.medium,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.divider,
    marginBottom: theme.spacing.md,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 10,
    color: theme.colors.textLight,
    fontWeight: 'bold',
  },
  assignmentCard: {
    backgroundColor: theme.colors.primary,
    marginHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    ...theme.shadows.md,
  },
  assignIconBox: {
    width: 44,
    height: 44,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  assignmentInfo: {
    flex: 1,
  },
  assignmentLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  assignmentName: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.surface,
  },
  timelineSection: {
    paddingHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  timelineCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.xxl,
  },
  sectionTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.lg,
    position: 'relative',
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary,
    zIndex: 1,
    marginTop: 6,
    borderWidth: 2,
    borderColor: theme.colors.surface,
  },
  timelineLine: {
    position: 'absolute',
    left: 4.5,
    top: 16,
    width: 1,
    height: '100%',
    backgroundColor: theme.colors.primary,
    opacity: 0.2,
  },
  timelineContent: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  timelineNote: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    fontWeight: theme.fontWeight.semibold,
    marginBottom: 2,
  },
  timelineMeta: {
    fontSize: 10,
    color: theme.colors.textSecondary,
  },
  actionsSection: {
    paddingHorizontal: theme.spacing.xl,
  },
  actionsCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.xxl,
    ...theme.shadows.md,
    gap: theme.spacing.md,
  },
  assignSelectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surfaceDark,
    borderRadius: theme.borderRadius.lg,
  },
  assignSelectionText: {
    flex: 1,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },
  noteInput: {
    backgroundColor: theme.colors.surfaceDark,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  statusButtons: {
    gap: theme.spacing.sm,
  },
  outlineButton: {
    height: 50,
    borderRadius: theme.borderRadius.xl,
    borderColor: theme.colors.primary,
  },
  solveButton: {
    height: 56,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: theme.colors.primary,
  },
  pickerOptions: {
    backgroundColor: theme.colors.surfaceDark,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  pickerOption: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    fontWeight: theme.fontWeight.bold,
  },
  pickerSubtext: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  emptyText: {
    padding: theme.spacing.md,
    color: theme.colors.textLight,
    fontStyle: 'italic',
    textAlign: 'center',
    fontSize: theme.fontSize.xs,
  },
  errorText: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.error,
    textAlign: 'center',
    marginTop: 100,
    fontWeight: 'bold',
  },
});
