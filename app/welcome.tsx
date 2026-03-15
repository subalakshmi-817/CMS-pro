import { View, Text, StyleSheet, Pressable, Animated, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/constants/theme';
import { DecorativeElements } from '@/components/ui/DecorativeElements';
import { useEffect, useRef } from 'react';

export default function WelcomeScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const blinkAnim = useRef(new Animated.Value(0.4)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: false,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: false,
            }),
        ]).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(blinkAnim, {
                    toValue: 1,
                    duration: 1200,
                    useNativeDriver: false,
                }),
                Animated.timing(blinkAnim, {
                    toValue: 0.4,
                    duration: 1200,
                    useNativeDriver: false,
                }),
            ])
        ).start();
    }, []);

    return (
        <LinearGradient
            colors={[theme.colors.blue, theme.colors.pink]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <DecorativeElements />
            <View style={[styles.content, { paddingTop: insets.top + 20 }]}>
                <View style={styles.mainLogoContainer}>
                    <Image 
                        source={require('@/assets/images/logo.png')} 
                        style={styles.mainLogo} 
                        resizeMode="contain"
                    />
                </View>
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

                        <Text style={styles.phoneTitle}>Campus Status</Text>
                        <Text style={styles.phoneSubtitle}>Active issue tracking & resolution</Text>

                        <View style={styles.floatingCardLeft}>
                            <MaterialIcons name="report-problem" size={24} color="#EF4444" />
                            <Text style={styles.floatingCardText}>Street Light Repair</Text>
                            <View style={styles.statusBadgePending}>
                                <Text style={styles.statusText}>PENDING</Text>
                            </View>
                        </View>

                        <View style={styles.floatingCardRight}>
                            <MaterialIcons name="check-circle" size={24} color="#10B981" />
                            <Text style={styles.floatingCardText}>Wi-Fi Restored</Text>
                            <View style={styles.progressTrack}>
                                <View style={[styles.progressBar, { width: '100%', backgroundColor: '#10B981' }]} />
                            </View>
                            <Text style={styles.progressText}>RESOLVED</Text>
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
                <LinearGradient
                    colors={[theme.colors.lightBlue, theme.colors.lightPink]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.cardGradient}
                >
                    <Text style={styles.title}>Campus Care:{"\n"}Resolution Hub</Text>
                    <Animated.Text style={[styles.subtitle, { opacity: blinkAnim }]}>
                        Empowering students and staff to maintain a better campus environment through streamlined reporting.
                    </Animated.Text>

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
                </LinearGradient>
            </Animated.View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mainLogoContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    mainLogo: {
        width: 100,
        height: 100,
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
        color: '#10B981',
        fontWeight: '800',
    },
    statusBadgePending: {
        backgroundColor: '#FEF2F2',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        alignSelf: 'flex-start',
    },
    statusText: {
        fontSize: 8,
        color: '#EF4444',
        fontWeight: '800',
    },
    card: {
        backgroundColor: 'transparent',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        width: '100%',
        overflow: 'hidden',
        ...theme.shadows.lg,
    },
    cardGradient: {
        padding: 30,
        paddingTop: 40,
        paddingBottom: 50,
        alignItems: 'center',
        width: '100%',
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
        fontSize: 22,
        color: '#001A33', // Unique Deep Obsidian Navy
        textAlign: 'center',
        lineHeight: 30,
        marginBottom: 30,
        paddingHorizontal: 15,
        fontWeight: '900', 
        textShadowColor: '#00F7FF', // Radiant Electric Cyan Glow
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 18,
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
        backgroundColor: theme.colors.blue,
        borderRadius: 30,
        height: 56,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: theme.colors.pink,
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
