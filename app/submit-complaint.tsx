import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/hooks/useAuth';
import { useComplaints } from '@/hooks/useComplaints';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { theme } from '@/constants/theme';
import { COMPLAINT_CATEGORIES, LOCATIONS } from '@/constants/config';
import { categorizeComplaint } from '@/services/aiCategorization';
import { useAlert } from '@/template';
import { ComplaintCategory, ComplaintPriority } from '@/constants/config';

export default function SubmitComplaintScreen() {
  const { user } = useAuth();
  const { createComplaint } = useComplaints();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showAlert } = useAlert();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ComplaintCategory>('others');
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [priority, setPriority] = useState<ComplaintPriority>('low');
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  const analyzeWithAI = () => {
    if (!title || !description) return;

    const suggestion = categorizeComplaint(title, description);
    setCategory(suggestion.category);
    setPriority(suggestion.priority);

    const categoryLabel = COMPLAINT_CATEGORIES.find(c => c.id === suggestion.category)?.label || 'Others';
    const confidence = Math.round(suggestion.confidence * 100);
    setAiSuggestion(`AI detected: ${categoryLabel} | Priority: ${suggestion.priority.toUpperCase()} (${confidence}% confidence)`);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      showAlert('Error', 'Please fill in all required fields');
      return;
    }

    if (!user) return;

    setSubmitting(true);

    try {
      await createComplaint({
        title: title.trim(),
        description: description.trim(),
        category,
        location,
        priority,
        status: 'pending',
        reporterId: user.id,
        reporterName: user.name,
      });

      showAlert('Success', 'Complaint submitted successfully', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      showAlert('Error', 'Failed to submit complaint. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <LinearGradient
      colors={[theme.colors.blue, theme.colors.pink]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <KeyboardAvoidingView
        style={{ flex: 1, paddingTop: insets.top }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color={theme.colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>New Issue</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            <Input
              label="Issue Title"
              value={title}
              onChangeText={setTitle}
              placeholder="What is the problem?"
              onBlur={analyzeWithAI}
            />

            <Input
              label="Details"
              value={description}
              onChangeText={setDescription}
              placeholder="Provide details for our task team..."
              multiline
              numberOfLines={4}
              style={{ minHeight: 120, textAlignVertical: 'top' }}
              onBlur={analyzeWithAI}
            />

            {aiSuggestion && (
              <View style={styles.aiSuggestion}>
                <MaterialIcons name="auto-awesome" size={16} color={theme.colors.accent} />
                <Text style={styles.aiText}>{aiSuggestion}</Text>
              </View>
            )}
          </View>

          <View style={styles.card}>
            <View style={styles.pickerContainer}>
              <Text style={styles.label}>Category</Text>
              <Pressable
                style={styles.picker}
                onPress={() => setShowCategoryPicker(!showCategoryPicker)}
              >
                <View style={styles.pickerValue}>
                  <MaterialIcons
                    name={COMPLAINT_CATEGORIES.find(c => c.id === category)?.icon as any}
                    size={20}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.pickerText}>
                    {COMPLAINT_CATEGORIES.find(c => c.id === category)?.label}
                  </Text>
                </View>
                <MaterialIcons name="arrow-drop-down" size={24} color={theme.colors.textLight} />
              </Pressable>
              {showCategoryPicker && (
                <View style={styles.pickerOptions}>
                  {COMPLAINT_CATEGORIES.map(cat => (
                    <Pressable
                      key={cat.id}
                      style={styles.pickerOption}
                      onPress={() => {
                        setCategory(cat.id as ComplaintCategory);
                        setShowCategoryPicker(false);
                      }}
                    >
                      <MaterialIcons name={cat.icon as any} size={20} color={theme.colors.textSecondary} />
                      <Text style={styles.pickerOptionText}>{cat.label}</Text>
                      {category === cat.id && (
                        <MaterialIcons name="check" size={20} color={theme.colors.primary} />
                      )}
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.pickerContainer}>
              <Text style={styles.label}>Location</Text>
              <Pressable
                style={styles.picker}
                onPress={() => setShowLocationPicker(!showLocationPicker)}
              >
                <View style={styles.pickerValue}>
                  <MaterialIcons name="location-on" size={20} color={theme.colors.primary} />
                  <Text style={styles.pickerText}>{location}</Text>
                </View>
                <MaterialIcons name="arrow-drop-down" size={24} color={theme.colors.textLight} />
              </Pressable>
              {showLocationPicker && (
                <View style={styles.pickerOptions}>
                  {LOCATIONS.map(loc => (
                    <Pressable
                      key={loc}
                      style={styles.pickerOption}
                      onPress={() => {
                        setLocation(loc);
                        setShowLocationPicker(false);
                      }}
                    >
                      <Text style={styles.pickerOptionText}>{loc}</Text>
                      {location === loc && (
                        <MaterialIcons name="check" size={20} color={theme.colors.primary} />
                      )}
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          </View>

          <View style={styles.prioritySection}>
            <Text style={styles.label}>Urgency</Text>
            <View style={styles.priorityOptions}>
              {(['low', 'medium', 'high'] as ComplaintPriority[]).map(p => (
                <Pressable
                  key={p}
                  style={[
                    styles.priorityChip,
                    priority === p && styles.priorityChipActive,
                  ]}
                  onPress={() => setPriority(p)}
                >
                  <Text
                    style={[
                      styles.priorityText,
                      priority === p && styles.priorityTextActive,
                    ]}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.actions}>
            <Button
              title="Send for Review"
              onPress={handleSubmit}
              loading={submitting}
              fullWidth
              style={styles.submitButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    padding: theme.spacing.xl,
    gap: theme.spacing.lg,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xxl,
    padding: theme.spacing.lg,
    ...theme.shadows.md,
  },
  aiSuggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 157, 66, 0.1)',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.sm,
    gap: 8,
  },
  aiText: {
    flex: 1,
    fontSize: 10,
    color: theme.colors.accent,
    fontWeight: theme.fontWeight.bold,
  },
  pickerContainer: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  picker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surfaceDark,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 14,
  },
  pickerValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pickerText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    fontWeight: theme.fontWeight.medium,
  },
  pickerOptions: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    marginTop: theme.spacing.sm,
    ...theme.shadows.lg,
    overflow: 'hidden',
  },
  pickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  pickerOptionText: {
    flex: 1,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  prioritySection: {
    paddingHorizontal: theme.spacing.xs,
  },
  priorityOptions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  priorityChip: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
  },
  priorityChipActive: {
    backgroundColor: theme.colors.primary,
  },
  priorityText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textSecondary,
  },
  priorityTextActive: {
    color: theme.colors.surface,
  },
  actions: {
    marginTop: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  submitButton: {
    height: 60,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: theme.colors.primary,
  },
});
