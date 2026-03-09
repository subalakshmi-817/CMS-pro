import { View, Text, StyleSheet, Image, Pressable, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { useEffect, useRef } from 'react';

export default function WelcomeScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <LinearGradient
            colors={[theme.colors.blue, theme.colors.pink]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <View style={[styles.content, { paddingTop: insets.top + 40 }]}>
                <Animated.View
                    style={[
                        styles.illustrationContainer,
                        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                    ]}
                >
                    <View style={styles.floatingCard}>
                        <View style={styles.cardHeader}>
                            <View style={[styles.dot, { backgroundColor: theme.colors.accent }]} />
                            <View style={[styles.dot, { backgroundColor: theme.colors.secondary }]} />
                            <View style={[styles.dot, { backgroundColor: theme.colors.textLight }]} />
                        </View>
                        <MaterialIcons name="auto-awesome" size={60} color={theme.colors.accent} />
                    </View>
                </Animated.View>

                <Animated.View
                    style={[
                        styles.card,
                        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                    ]}
                >
                    <Text style={styles.title}>Make campus life easier now</Text>
                    <Text style={styles.subtitle}>
                        Quickly report issues and track your complaints with our smart management system
                    </Text>

                    <View style={styles.paginationDots}>
                        <View style={[styles.paginationDot, styles.paginationDotActive]} />
                        <View style={styles.paginationDot} />
                    </View>

                    <Button
                        title="Sign In"
                        onPress={() => router.push('/login')}
                        fullWidth
                        size="lg"
                        style={styles.button}
                    />

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Have'nt an Account? </Text>
                        <Pressable onPress={() => router.push('/signup')}>
                            <Text style={styles.signupText}>Sign Up</Text>
                        </Pressable>
                    </View>
                </Animated.View>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: theme.spacing.xl,
        justifyContent: 'flex-end',
        paddingBottom: theme.spacing.xxl,
    },
    illustrationContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    floatingCard: {
        width: 140,
        height: 140,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: theme.borderRadius.xxl,
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.shadows.lg,
    },
    cardHeader: {
        flexDirection: 'row',
        position: 'absolute',
        top: 20,
        gap: 6,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.xxl,
        padding: theme.spacing.xl,
        alignItems: 'center',
        ...theme.shadows.lg,
    },
    title: {
        fontSize: 32,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.text,
        textAlign: 'center',
        lineHeight: 40,
        marginBottom: theme.spacing.md,
    },
    subtitle: {
        fontSize: theme.fontSize.md,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: theme.spacing.xl,
    },
    paginationDots: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: theme.spacing.xl,
    },
    paginationDot: {
        width: 24,
        height: 8,
        borderRadius: 4,
        backgroundColor: theme.colors.surfaceDark,
    },
    paginationDotActive: {
        backgroundColor: theme.colors.primary,
        width: 32,
    },
    button: {
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borderRadius.xl,
        height: 60,
    },
    footer: {
        flexDirection: 'row',
        marginTop: theme.spacing.lg,
    },
    footerText: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.textSecondary,
    },
    signupText: {
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.text,
    },
});
