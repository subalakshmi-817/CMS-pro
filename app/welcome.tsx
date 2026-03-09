import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/constants/theme';
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
            colors={['#D2D0F5', '#EAE0F5', '#F5E4F8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <View style={styles.starsContainer}>
                {/* Galaxy sparkles/stars */}
                <MaterialIcons name="auto-awesome" size={20} color="#FFFFFF" style={{ position: 'absolute', top: '15%', left: '10%' }} />
                <MaterialIcons name="star" size={10} color="#FFFFFF" style={{ position: 'absolute', top: '25%', left: '80%' }} />
                <MaterialIcons name="star" size={14} color="#FFFFFF" style={{ position: 'absolute', top: '45%', left: '15%' }} />
                <MaterialIcons name="auto-awesome" size={16} color="#FFFFFF" style={{ position: 'absolute', top: '30%', right: '15%' }} />
            </View>

            <View style={[styles.content, { paddingTop: insets.top + 40 }]}>
                <Animated.View
                    style={[
                        styles.illustrationContainer,
                        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                    ]}
                >
                    <View style={styles.phoneFrame}>
                        {/* Status bar mock */}
                        <View style={styles.statusBarMock} />

                        {/* Top Profile Mock */}
                        <View style={styles.phoneHeader}>
                            <View style={styles.phoneAvatar} />
                            <View>
                                <Text style={styles.phoneName}>Rara <Text style={{ color: '#D1D5DB' }}>•</Text> Beginner</Text>
                            </View>
                            <View style={{ flex: 1 }} />
                            <MaterialIcons name="stars" size={18} color={theme.colors.textSecondary} />
                        </View>

                        <Text style={styles.phoneTitle}>Good morning</Text>
                        <Text style={styles.phoneSubtitle}>Campus and progress begins</Text>

                        <View style={styles.floatingCardLeft}>
                            <FontAwesome5 name="shapes" size={24} color="#2563EB" />
                            <Text style={styles.floatingCardText}>Your campus adventure begins</Text>
                            <View style={styles.progressTrack}>
                                <View style={[styles.progressBar, { width: '30%', backgroundColor: '#F59E0B' }]} />
                            </View>
                            <Text style={styles.progressText}>30%</Text>
                        </View>

                        <View style={styles.floatingCardRight}>
                            <Text style={styles.letters}>A <Text style={{ color: '#3B82F6' }}>B</Text> <Text style={{ color: '#10B981' }}>C</Text></Text>
                            <Text style={styles.floatingCardText}>Your campus adventure begins</Text>
                            <View style={styles.progressTrack}>
                                <View style={[styles.progressBar, { width: '80%', backgroundColor: '#F59E0B' }]} />
                            </View>
                            <Text style={styles.progressText}>80%</Text>
                        </View>
                    </View>
                </Animated.View>
            </View>

            <Animated.View
                style={[
                    styles.card,
                    { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                ]}
            >
                <Text style={styles.title}>Keep going your{"\n"}learn now</Text>
                <Text style={styles.subtitle}>
                    Unlock rewards by staying consistent in your campus journey and claim your reward
                </Text>

                <View style={styles.paginationDots}>
                    <View style={[styles.paginationDotActive]} />
                    <View style={styles.paginationDot} />
                </View>

                <Pressable
                    style={styles.button}
                    onPress={() => router.push('/login')}
                >
                    <Text style={styles.buttonText}>Sign In</Text>
                </Pressable>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Have'nt an Account ? </Text>
                    <Pressable onPress={() => router.push('/signup')}>
                        <Text style={styles.signupText}>Sign Up</Text>
                    </Pressable>
                </View>
            </Animated.View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    starsContainer: {
        ...StyleSheet.absoluteFillObject,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: -40, // Let phone frame dip behind lower card
    },
    illustrationContainer: {
        width: '100%',
        alignItems: 'center',
    },
    phoneFrame: {
        width: 250,
        height: 400,
        backgroundColor: '#FCFCFF',
        borderRadius: 40,
        borderWidth: 8,
        borderColor: '#1E1E2D',
        padding: 16,
        position: 'relative',
        ...theme.shadows.lg,
    },
    statusBarMock: {
        width: 80,
        height: 20,
        backgroundColor: '#1E1E2D',
        alignSelf: 'center',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        position: 'absolute',
        top: -1,
    },
    phoneHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 16,
    },
    phoneAvatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#E5E7EB',
        marginRight: 8,
    },
    phoneName: {
        fontSize: 10,
        fontWeight: '700',
        color: '#1E1E2D',
    },
    phoneTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1E1E2D',
        marginTop: 8,
    },
    phoneSubtitle: {
        fontSize: 10,
        color: '#6B7280',
        marginBottom: 20,
    },
    floatingCardLeft: {
        position: 'absolute',
        left: -30,
        top: 150,
        width: 120,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 12,
        transform: [{ rotate: '-8deg' }],
        ...theme.shadows.md,
    },
    floatingCardRight: {
        position: 'absolute',
        right: -30,
        top: 190,
        width: 120,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 12,
        transform: [{ rotate: '5deg' }],
        ...theme.shadows.md,
    },
    letters: {
        fontSize: 18,
        fontWeight: '800',
        color: '#F59E0B',
        letterSpacing: 2,
    },
    floatingCardText: {
        fontSize: 10,
        color: '#1E1E2D',
        fontWeight: '700',
        marginTop: 8,
        marginBottom: 8,
    },
    progressTrack: {
        height: 4,
        backgroundColor: '#F3F4F6',
        borderRadius: 2,
        overflow: 'hidden',
        marginBottom: 4,
    },
    progressBar: {
        height: '100%',
        borderRadius: 2,
    },
    progressText: {
        fontSize: 10,
        color: '#9CA3AF',
        fontWeight: '700',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        width: '100%',
        padding: 30,
        paddingTop: 40,
        paddingBottom: 50,
        alignItems: 'center',
        ...theme.shadows.lg,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1E1E2D',
        textAlign: 'center',
        lineHeight: 36,
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 30,
        paddingHorizontal: 20,
    },
    paginationDots: {
        flexDirection: 'row',
        gap: 6,
        marginBottom: 30,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#E5E7EB',
    },
    paginationDotActive: {
        backgroundColor: '#1E1E2D',
        width: 20,
        height: 8,
        borderRadius: 4,
    },
    button: {
        backgroundColor: '#1E1E2D',
        borderRadius: 30,
        height: 56,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    footer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    footerText: {
        fontSize: 14,
        color: '#6B7280',
    },
    signupText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#1E1E2D',
    },
});
