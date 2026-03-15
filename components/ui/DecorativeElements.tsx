import React from 'react';
import { View, StyleSheet, Animated, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { theme } from '@/constants/theme';

interface FloatingElementProps {
  name: any;
  size: number;
  color: string;
  top: string | number;
  left?: string | number;
  right?: string | number;
  duration: number;
  delay?: number;
}

const Sprinkle = ({ top, left, size, color, duration, delay }: { top: number | string, left: number | string, size: number, color: string, duration: number, delay: number }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: duration,
          useNativeDriver: Platform.OS !== 'web',
          delay: delay,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: duration,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    ).start();
  }, []);

  const scale = anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 1.2, 0.3],
  });

  const opacity = anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.1, 1, 0.1],
  });

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -40],
  });

  return (
    <Animated.View
      style={[
        styles.element,
        {
          top,
          left,
          opacity,
          transform: [{ scale }, { translateY }],
        } as any,
      ]}
    >
      <View style={{ 
        width: size, 
        height: size, 
        borderRadius: size / 2, 
        backgroundColor: color,
        shadowColor: color,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 4
      }} />
    </Animated.View>
  );
};

const FloatingElement = ({ name, size, color, top, left, right, duration, delay = 0 }: FloatingElementProps) => {
  const moveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(moveAnim, {
          toValue: 1,
          duration: duration,
          useNativeDriver: Platform.OS !== 'web',
          delay: delay,
        }),
        Animated.timing(moveAnim, {
          toValue: 0,
          duration: duration,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    ).start();
  }, []);

  const translateY = moveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });

  const rotate = moveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '15deg'],
  });

  const opacity = moveAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.2, 0.6, 0.2],
  });

  return (
    <Animated.View
      style={[
        styles.element,
        {
          top,
          left,
          right,
          opacity,
          transform: [{ translateY }, { rotate }],
        } as any,
      ]}
    >
      <MaterialIcons name={name} size={size} color={color} />
    </Animated.View>
  );
};

export const DecorativeElements = () => {
  const sprinkles = [
    { top: '5%', left: '10%', size: 3, color: '#FFF', duration: 1500, delay: 0 },
    { top: '15%', left: '85%', size: 4, color: theme.colors.pink, duration: 2000, delay: 500 },
    { top: '30%', left: '45%', size: 2, color: '#FFF', duration: 1200, delay: 200 },
    { top: '50%', left: '25%', size: 5, color: '#FFF', duration: 2500, delay: 100 },
    { top: '70%', left: '75%', size: 3, color: theme.colors.blue, duration: 1700, delay: 400 },
    { top: '85%', left: '10%', size: 4, color: '#FFF', duration: 2300, delay: 600 },
    { top: '12%', left: '55%', size: 2, color: theme.colors.pink, duration: 1600, delay: 300 },
    { top: '42%', left: '92%', size: 4, color: '#FFF', duration: 1900, delay: 0 },
    { top: '62%', left: '8%', size: 3, color: theme.colors.blue, duration: 2200, delay: 700 },
    { top: '92%', left: '88%', size: 2, color: '#FFF', duration: 1400, delay: 100 },
    { top: '25%', left: '70%', size: 3, color: '#FFF', duration: 2000, delay: 400 },
    { top: '75%', left: '30%', size: 4, color: theme.colors.pink, duration: 2400, delay: 200 },
  ];

  return (
    <View style={[StyleSheet.absoluteFill, { pointerEvents: 'none' } as any]}>
      {sprinkles.map((s, i) => (
        <Sprinkle key={i} {...s} />
      ))}
      <FloatingElement name="auto-awesome" size={24} color="rgba(255, 255, 255, 0.4)" top="10%" left="5%" duration={3000} />
      <FloatingElement name="school" size={30} color="rgba(255, 255, 255, 0.2)" top="15%" right="10%" duration={4000} />
      <FloatingElement name="report-problem" size={25} color="rgba(255, 255, 255, 0.2)" top="45%" left="5%" duration={3500} delay={1000} />
      <FloatingElement name="assignment-turned-in" size={22} color="rgba(255, 255, 255, 0.2)" top="65%" right="5%" duration={5000} />
      <FloatingElement name="star" size={20} color="rgba(255, 255, 255, 0.3)" top="40%" right="15%" duration={3500} delay={500} />
      <FloatingElement name="auto-awesome" size={28} color="rgba(255, 255, 255, 0.2)" top="75%" left="20%" duration={4500} />
      <FloatingElement name="campaign" size={32} color="rgba(255, 255, 255, 0.15)" top="85%" right="35%" duration={6000} />
    </View>
  );
};

const styles = StyleSheet.create({
  element: {
    position: 'absolute',
  },
});
