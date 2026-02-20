import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { theme } from '@/constants/theme';
import { useAlert } from '@/template';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCredentials, setShowCredentials] = useState(true);
  
  const { user, login } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showAlert } = useAlert();

  useEffect(() => {
    if (user) {
      router.replace('/(tabs)');
    }
  }, [user]);

  const handleLogin = async () => {
    if (!email || !password) {
      showAlert('Error', 'Please enter email and password');
      return;
    }

    setLoading(true);
    const success = await login(email, password);
    setLoading(false);

    if (success) {
      router.replace('/(tabs)');
    } else {
      showAlert('Login Failed', 'Invalid email or password. Use demo credentials above.');
    }
  };

  const fillCredentials = (role: 'student' | 'admin' | 'staff') => {
    const credentials = {
      student: { email: 'student@campus.edu', password: 'password123' },
      admin: { email: 'admin@campus.edu', password: 'password123' },
      staff: { email: 'staff@campus.edu', password: 'password123' },
    };
    setEmail(credentials[role].email);
    setPassword(credentials[role].password);
    setShowCredentials(false);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <MaterialIcons name="school" size={48} color={theme.colors.primary} />
          </View>
          <Text style={styles.title}>Smart Campus</Text>
          <Text style={styles.subtitle}>Complaint Management System</Text>
        </View>

        {showCredentials && (
          <View style={styles.demoBox}>
            <View style={styles.demoHeader}>
              <MaterialIcons name="info" size={20} color={theme.colors.info} />
              <Text style={styles.demoTitle}>MOCK LOGIN - Demo Credentials</Text>
            </View>
            <View style={styles.demoButtons}>
              <Button
                title="Login as Student"
                onPress={() => fillCredentials('student')}
                variant="outline"
              />
              <Button
                title="Login as Admin"
                onPress={() => fillCredentials('admin')}
                variant="outline"
              />
              <Button
                title="Login as Staff"
                onPress={() => fillCredentials('staff')}
                variant="outline"
              />
            </View>
          </View>
        )}

        <View style={styles.form}>
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
          />

          <Button
            title="Login"
            onPress={handleLogin}
            loading={loading}
            fullWidth
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Mock authentication using local storage
          </Text>
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
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: `${theme.colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.fontSize.xxxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  demoBox: {
    backgroundColor: `${theme.colors.info}10`,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: `${theme.colors.info}30`,
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: theme.spacing.md,
  },
  demoTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.info,
  },
  demoButtons: {
    gap: theme.spacing.sm,
  },
  form: {
    marginBottom: theme.spacing.lg,
  },
  footer: {
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: theme.spacing.lg,
  },
  footerText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textLight,
    textAlign: 'center',
  },
});
