import { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
                <MaterialIcons name={icon as any} size={20} color={role === type ? theme.colors.surface : theme.colors.textSecondary} />
            </View>
            <Text style={[styles.roleLabel, role === type && styles.roleLabelActive]}>{label}</Text>
        </TouchableOpacity>
    );

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
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <MaterialIcons name="arrow-back" size={24} color={theme.colors.text} />
                    </TouchableOpacity>

                    <View style={styles.header}>
                        <Text style={styles.title}>Join Us</Text>
                        <Text style={styles.subtitle}>Create your staff account today</Text>
                    </View>

                    <View style={styles.card}>
                        <View style={styles.roleSelector}>
                            <Text style={styles.sectionTitle}>Select Role</Text>
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
                                placeholder="Full name"
                            />

                            <Input
                                label="Email Address"
                                value={email}
                                onChangeText={setEmail}
                                placeholder="Official email"
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />

                            <Input
                                label="Password"
                                value={password}
                                onChangeText={setPassword}
                                placeholder="Password"
                                secureTextEntry
                            />

                            <View style={styles.row}>
                                <View style={{ flex: 1 }}>
                                    <Input
                                        label="ID"
                                        value={employeeId}
                                        onChangeText={setEmployeeId}
                                        placeholder="EMP123"
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Input
                                        label="Dept"
                                        value={department}
                                        onChangeText={setDepartment}
                                        placeholder="e.g. IT"
                                    />
                                </View>
                            </View>

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
    scrollContent: {
        padding: theme.spacing.lg,
    },
    backButton: {
        marginBottom: theme.spacing.md,
    },
    header: {
        marginBottom: theme.spacing.xl,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.text,
    },
    subtitle: {
        fontSize: theme.fontSize.md,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.xs,
    },
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.xxl,
        padding: theme.spacing.xl,
        ...theme.shadows.lg,
    },
    roleSelector: {
        marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
    },
    roleGrid: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
    },
    roleOption: {
        flex: 1,
        backgroundColor: theme.colors.surfaceDark,
        padding: theme.spacing.sm,
        borderRadius: theme.borderRadius.md,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    roleOptionActive: {
        borderColor: theme.colors.primary,
        backgroundColor: `${theme.colors.primary}05`,
    },
    roleIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.xs,
    },
    roleIconActive: {
        backgroundColor: theme.colors.primary,
    },
    roleLabel: {
        fontSize: 10,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.textSecondary,
    },
    roleLabelActive: {
        color: theme.colors.primary,
    },
    form: {
        gap: theme.spacing.xs,
    },
    row: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
    },
    signupButton: {
        marginTop: theme.spacing.md,
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borderRadius.xl,
        height: 56,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: theme.spacing.lg,
    },
    footerText: {
        color: theme.colors.textSecondary,
    },
    loginLink: {
        color: theme.colors.primary,
        fontWeight: theme.fontWeight.bold,
    },
});
