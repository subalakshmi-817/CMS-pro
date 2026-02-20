import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
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
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={20}>
          <MaterialIcons name="arrow-back" size={24} color={theme.colors.text} />
        </Pressable>
        <Text style={styles.title}>Submit Complaint</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Input
          label="Title *"
          value={title}
          onChangeText={setTitle}
          placeholder="Brief description of the issue"
          onBlur={analyzeWithAI}
        />

        <Input
          label="Description *"
          value={description}
          onChangeText={setDescription}
          placeholder="Provide detailed information about the complaint"
          multiline
          numberOfLines={4}
          style={{ minHeight: 100, textAlignVertical: 'top' }}
          onBlur={analyzeWithAI}
        />

        {aiSuggestion && (
          <View style={styles.aiSuggestion}>
            <MaterialIcons name="auto-awesome" size={16} color={theme.colors.primary} />
            <Text style={styles.aiText}>{aiSuggestion}</Text>
          </View>
        )}

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
                color={theme.colors.text}
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
                  <MaterialIcons name={cat.icon as any} size={20} color={theme.colors.text} />
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
              <MaterialIcons name="location-on" size={20} color={theme.colors.text} />
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

        <View style={styles.priorityContainer}>
          <Text style={styles.label}>Priority</Text>
          <View style={styles.priorityOptions}>
            {(['low', 'medium', 'high'] as ComplaintPriority[]).map(p => (
              <Pressable
                key={p}
                style={[
                  styles.priorityChip,
                  priority === p && styles.priorityChipActive,
                  p === 'low' && { borderColor: theme.colors.resolved },
                  p === 'medium' && { borderColor: theme.colors.pending },
                  p === 'high' && { borderColor: theme.colors.error },
                  priority === p && p === 'low' && { backgroundColor: `${theme.colors.resolved}20` },
                  priority === p && p === 'medium' && { backgroundColor: `${theme.colors.pending}20` },
                  priority === p && p === 'high' && { backgroundColor: `${theme.colors.error}20` },
                ]}
                onPress={() => setPriority(p)}
              >
                <Text
                  style={[
                    styles.priorityText,
                    p === 'low' && { color: theme.colors.resolved },
                    p === 'medium' && { color: theme.colors.pending },
                    p === 'high' && { color: theme.colors.error },
                  ]}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.actions}>
          <Button title="Submit Complaint" onPress={handleSubmit} loading={submitting} fullWidth />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  title: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  aiSuggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${theme.colors.primary}10`,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    gap: 8,
  },
  aiText: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.medium,
  },
  pickerContainer: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  picker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 12,
  },
  pickerValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pickerText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  pickerOptions: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.sm,
    ...theme.shadows.md,
  },
  pickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  pickerOptionText: {
    flex: 1,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  priorityContainer: {
    marginBottom: theme.spacing.lg,
  },
  priorityOptions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  priorityChip: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    alignItems: 'center',
  },
  priorityChipActive: {
    borderWidth: 2,
  },
  priorityText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
  },
  actions: {
    marginBottom: theme.spacing.xl,
  },
});
