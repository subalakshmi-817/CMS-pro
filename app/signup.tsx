import { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { theme } from '@/constants/theme';
import { useAlert } from '@/template';

type Role = 'staff' | 'admin' | 'manager';

export default function SignupScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<Role>('staff');
    const [employeeId, setEmployeeId] = useState('');
    const [department, setDepartment] = useState('');
    const [loading, setLoading] = useState(false);

    const { signup } = useAuth();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { showAlert } = useAlert();

    const handleSignup = async () => {
        if (!name || !email || !password || !employeeId || !department) {
            showAlert('Error', 'Please fill in all required fields');
            return;
        }

        setLoading(true);
        const success = await signup(email, password, name, role, employeeId, department);
        setLoading(false);

        if (success) {
            showAlert('Success', 'Account created successfully!', [
                { text: 'OK', onPress: () => router.replace('/(tabs)') }
            ]);
        } else {
            showAlert('Signup Failed', 'Could not create account. Please try again.');
        }
    };

    const RoleOption = ({ type, label, icon }: { type: Role, label: string, icon: string }) => (
        <TouchableOpacity
            style={[styles.roleOption, role === type && styles.roleOptionActive]}
            onPress={() => setRole(type)}
        >
            <View style={[styles.roleIcon, role === type && styles.roleIconActive]}>
                <MaterialIcons name={icon as any} size={24} color={role === type ? theme.colors.surface : theme.colors.textSecondary} />
            </View>
            <Text style={[styles.roleLabel, role === type && styles.roleLabelActive]}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <KeyboardAvoidingView
            style={[styles.container, { paddingTop: insets.top }]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <MaterialIcons name="arrow-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>

                <View style={styles.header}>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Join the Campus Management Team</Text>
                </View>

                <View style={styles.roleSelector}>
                    <Text style={styles.sectionTitle}>Select Your Role</Text>
                    <View style={styles.roleGrid}>
                        <RoleOption type="staff" label="Staff" icon="work" />
                        <RoleOption type="manager" label="Manager" icon="engineering" />
                        <RoleOption type="admin" label="Admin" icon="admin-panel-settings" />
                    </View>
                </View>

                <View style={styles.form}>
                    <Input
                        label="Full Name"
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter your full name"
                    />

                    <Input
                        label="Email Address"
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Enter your official email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <Input
                        label="Password"
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Create a password"
                        secureTextEntry
                    />

                    <Input
                        label="Employee ID"
                        value={employeeId}
                        onChangeText={setEmployeeId}
                        placeholder="e.g. EMP123"
                    />

                    <Input
                        label="Department"
                        value={department}
                        onChangeText={setDepartment}
                        placeholder="e.g. Maintenance, IT, HR"
                    />

                    <Button
                        title="Sign Up"
                        onPress={handleSignup}
                        loading={loading}
                        fullWidth
                        style={styles.signupButton}
                    />
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => router.push('/login')}>
                        <Text style={styles.loginLink}>Login</Text>
                    </TouchableOpacity>
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
        padding: theme.spacing.lg,
    },
    backButton: {
        marginBottom: theme.spacing.lg,
    },
    header: {
        marginBottom: theme.spacing.xl,
    },
    title: {
        fontSize: theme.fontSize.xxxl,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.text,
    },
    subtitle: {
        fontSize: theme.fontSize.md,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.xs,
    },
    roleSelector: {
        marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: theme.spacing.md,
    },
    roleGrid: {
        flexDirection: 'row',
        gap: theme.spacing.md,
    },
    roleOption: {
        flex: 1,
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
        ...theme.shadows.sm,
    },
    roleOptionActive: {
        borderColor: theme.colors.primary,
        backgroundColor: `${theme.colors.primary}05`,
    },
    roleIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: theme.colors.surfaceDark,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    roleIconActive: {
        backgroundColor: theme.colors.primary,
    },
    roleLabel: {
        fontSize: theme.fontSize.xs,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.textSecondary,
    },
    roleLabelActive: {
        color: theme.colors.primary,
    },
    form: {
        gap: theme.spacing.sm,
    },
    signupButton: {
        marginTop: theme.spacing.md,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: theme.spacing.xl,
        marginBottom: theme.spacing.xl,
    },
    footerText: {
        color: theme.colors.textSecondary,
    },
    loginLink: {
        color: theme.colors.primary,
        fontWeight: theme.fontWeight.bold,
    },
});
