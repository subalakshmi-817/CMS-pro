import { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { theme } from '@/constants/theme';
import { useAlert } from '@/template';
import { DecorativeElements } from '@/components/ui/DecorativeElements';

type Role = 'staff' | 'admin' | 'manager';

export default function SignupScreen() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState<Role>('staff');
    const [department, setDepartment] = useState('');
    const [loading, setLoading] = useState(false);

    const { signup } = useAuth();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { showAlert } = useAlert();

    const validatePassword = (pass: string) => {
        const requirements = [
            { id: 1, label: 'At least 8 characters', met: pass.length >= 8 },
            { id: 2, label: 'Contains uppercase letter', met: /[A-Z]/.test(pass) },
            { id: 3, label: 'Contains lowercase letter', met: /[a-z]/.test(pass) },
            { id: 4, label: 'Contains number', met: /[0-9]/.test(pass) },
            { id: 5, label: 'Contains special character', met: /[^A-Za-z0-9]/.test(pass) },
        ];
        return requirements;
    };

    const handleSignup = async () => {
        if (!firstName || !lastName || !email || !password || !department) {
            showAlert('Error', 'Please fill in all required fields');
            return;
        }

        if (firstName.length < 2 || lastName.length < 2) {
            showAlert('Invalid Name', 'First and Last name must be at least 2 characters each.');
            return;
        }

        const requirements = validatePassword(password);
        const allMet = requirements.every(req => req.met);

        if (!allMet) {
            showAlert('Weak Password', 'Please ensure your password meets all safety requirements.');
            return;
        }

        setLoading(true);
        const fullName = `${firstName.trim()} ${lastName.trim()}`;
        const { success, message } = await signup(email, password, fullName, role, department);
        setLoading(true); // Keep loading true for a moment while redirecting

        if (success) {
            showAlert('Success', message || 'Account created successfully!', [
                { text: 'OK', onPress: () => router.replace('/(tabs)') }
            ]);
        } else {
            setLoading(false);
            showAlert('Signup Failed', message || 'Could not create account. Please try again.');
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
            <DecorativeElements />
            <KeyboardAvoidingView
                style={{ flex: 1, paddingTop: insets.top }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <MaterialIcons name="arrow-back" size={24} color={theme.colors.text} />
                    </TouchableOpacity>

                    <View style={styles.header}>
                         <View style={styles.logoContainer}>
                             <Image 
                                 source={require('@/assets/images/logo.png')} 
                                 style={{ width: 60, height: 60 }} 
                                 resizeMode="contain"
                             />
                         </View>
                         <Text style={styles.title}>Join Campus Care</Text>
                         <Text style={styles.subtitle}>Unified Platform for Resolution</Text>
                    </View>

                    <View style={styles.card}>
                        <View style={styles.roleSelector}>
                             <View style={styles.sectionHeader}>
                                 <MaterialIcons name="assignment-ind" size={20} color={theme.colors.primary} />
                                 <Text style={styles.sectionTitle}>Identification Type</Text>
                             </View>
                            <View style={styles.roleGrid}>
                                <RoleOption type="staff" label="Staff Member" icon="badge" />
                                <RoleOption type="manager" label="Dept Manager" icon="engineering" />
                                <RoleOption type="admin" label="Administrator" icon="admin-panel-settings" />
                            </View>
                        </View>

                        <View style={styles.form}>
                            <View style={styles.nameRow}>
                                <View style={styles.nameField}>
                                    <Input
                                        label="First Name"
                                        value={firstName}
                                        onChangeText={setFirstName}
                                        placeholder="First"
                                    />
                                </View>
                                <View style={styles.nameField}>
                                    <Input
                                        label="Last Name"
                                        value={lastName}
                                        onChangeText={setLastName}
                                        placeholder="Last"
                                    />
                                </View>
                            </View>

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
                                secureTextEntry={!showPassword}
                                rightIcon={showPassword ? "visibility" : "visibility-off"}
                                onRightIconPress={() => setShowPassword(!showPassword)}
                            />

                            {password.length > 0 && (
                                <View style={styles.passwordRequirements}>
                                    {validatePassword(password).map(req => (
                                        <View key={req.id} style={styles.requirementItem}>
                                            <MaterialIcons
                                                name={req.met ? "check-circle" : "radio-button-unchecked"}
                                                size={14}
                                                color={req.met ? theme.colors.success || '#4CAF50' : theme.colors.textSecondary}
                                            />
                                            <Text style={[
                                                styles.requirementText,
                                                req.met && styles.requirementMet
                                            ]}>
                                                {req.label}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            )}

                            <Input
                                label="Dept"
                                value={department}
                                onChangeText={setDepartment}
                                placeholder="e.g. IT"
                            />

                            <Button
                                title="Sign Up"
                                onPress={handleSignup}
                                loading={loading}
                                fullWidth
                                style={styles.signupButton}
                            />

                            <View style={styles.dividerContainer}>
                                <View style={styles.dividerLine} />
                                <Text style={styles.dividerText}>OR</Text>
                                <View style={styles.dividerLine} />
                            </View>

                            <TouchableOpacity 
                                style={styles.socialButton}
                                activeOpacity={0.8}
                                onPress={() => showAlert('Info', 'Google Sign-In is coming soon!')}
                            >
                                <View style={styles.googleIconContainer}>
                                    <FontAwesome name="google" size={20} color="#EA4335" />
                                </View>
                                <Text style={styles.socialButtonText}>Continue with Google</Text>
                            </TouchableOpacity>
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
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: theme.borderRadius.xl,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
        ...theme.shadows.md,
    },
    title: {
        fontSize: 32,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.text,
    },
    subtitle: {
        fontSize: theme.fontSize.md,
        color: theme.colors.primary,
        fontWeight: theme.fontWeight.medium,
        marginTop: theme.spacing.xs,
        opacity: 0.9,
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
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: theme.spacing.sm,
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
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: theme.spacing.md,
        gap: theme.spacing.sm,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: theme.colors.surfaceDark,
    },
    dividerText: {
        color: theme.colors.textSecondary,
        fontSize: 12,
        fontWeight: theme.fontWeight.semibold,
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: theme.borderRadius.xl,
        height: 56,
        borderWidth: 1,
        borderColor: theme.colors.border,
        ...theme.shadows.sm,
    },
    googleIconContainer: {
        marginRight: 12,
    },
    socialButtonText: {
        fontSize: 16,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.text,
    },
    nameRow: {
        flexDirection: 'row',
        gap: theme.spacing.md,
    },
    nameField: {
        flex: 1,
    },
    passwordRequirements: {
        backgroundColor: `${theme.colors.surfaceDark}50`,
        padding: theme.spacing.sm,
        borderRadius: theme.borderRadius.md,
        marginTop: -theme.spacing.xs,
        marginBottom: theme.spacing.sm,
        gap: 4,
    },
    requirementItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    requirementText: {
        fontSize: 11,
        color: theme.colors.textSecondary,
    },
    requirementMet: {
        color: theme.colors.success || '#4CAF50',
    },
});
