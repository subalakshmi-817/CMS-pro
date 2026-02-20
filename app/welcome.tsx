import { View, Text, StyleSheet, Image, Pressable, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { useEffect, useRef } from 'react';

export default function WelcomeScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Animated.View
                    style={[
                        styles.header,
                        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                    ]}
                >
                    <View style={styles.logoContainer}>
                        <MaterialIcons name="school" size={64} color={theme.colors.primary} />
                    </View>
                    <Text style={styles.title}>Smart Campus</Text>
                    <Text style={styles.subtitle}>Complaint Management System</Text>
                </Animated.View>

                <Animated.View
                    style={[
                        styles.illustrationContainer,
                        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                    ]}
                >
                    <View style={styles.circle} />
                    <MaterialIcons name="assignment-late" size={120} color={theme.colors.primary} style={styles.icon} />
                </Animated.View>

                <Animated.View
                    style={[
                        styles.footer,
                        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                    ]}
                >
                    <View style={styles.buttonContainer}>
                        <Button
                            title="Get Started"
                            onPress={() => router.push('/login')}
                            fullWidth
                            size="lg"
                        />
                    </View>

                    <Text style={styles.footerText}>
                        Ensuring a better campus experience for everyone.
                    </Text>
                </Animated.View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        flex: 1,
        padding: theme.spacing.xl,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        marginTop: theme.spacing.xxl,
    },
    logoContainer: {
        width: 100,
        height: 100,
        borderRadius: theme.borderRadius.xl,
        backgroundColor: `${theme.colors.primary}15`,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
    },
    title: {
        fontSize: 36,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.text,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: theme.fontSize.lg,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginTop: theme.spacing.xs,
    },
    illustrationContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    circle: {
        position: 'absolute',
        width: 250,
        height: 250,
        borderRadius: 125,
        backgroundColor: `${theme.colors.primary}08`,
    },
    icon: {
        opacity: 0.9,
    },
    footer: {
        width: '100%',
        marginBottom: theme.spacing.xl,
    },
    buttonContainer: {
        marginBottom: theme.spacing.lg,
    },
    footerText: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.textLight,
        textAlign: 'center',
    },
});
