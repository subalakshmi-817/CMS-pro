import { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/constants/theme';
import { DecorativeElements } from '@/components/ui/DecorativeElements';

export default function SplashScreen() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Pulse animation for logo
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 4,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            })
        ]).start();

        // Transition logic
        if (!loading) {
            const timer = setTimeout(() => {
                if (user) {
                    router.replace('/(tabs)');
                } else {
                    router.replace('/welcome');
                }
            }, 5000); // 5 seconds splash

            return () => clearTimeout(timer);
        }
    }, [loading, user]);

    return (
        <LinearGradient
            colors={[theme.colors.blue, theme.colors.pink]}
            style={styles.container}
        >
            <View style={styles.content}>
                <Animated.View style={{ 
                    transform: [{ scale: scaleAnim }], 
                    opacity: fadeAnim,
                    alignItems: 'center' 
                }}>
                    <View style={styles.logoWrapper}>
                        <Image 
                            source={require('@/assets/images/logo.png')} 
                            style={styles.logo} 
                            resizeMode="contain"
                        />
                    </View>
                </Animated.View>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoWrapper: {
        width: 180,
        height: 180,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 90,
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.shadows.lg,
        borderWidth: 4,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    logo: {
        width: 120,
        height: 120,
    },
});
