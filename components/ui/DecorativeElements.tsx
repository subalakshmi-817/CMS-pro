import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';

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

const FloatingElement = ({ name, size, color, top, left, right, duration, delay = 0 }: FloatingElementProps) => {
  const moveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(moveAnim, {
          toValue: 1,
          duration: duration,
          useNativeDriver: true,
          delay: delay,
        }),
        Animated.timing(moveAnim, {
          toValue: 0,
          duration: duration,
          useNativeDriver: true,
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
    outputRange: ['0deg', '10deg'],
  });

  const opacity = moveAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.7, 0.3],
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
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <FloatingElement name="auto-awesome" size={24} color="#FFF" top="10%" left="5%" duration={3000} />
      <FloatingElement name="local-florist" size={20} color="rgba(255, 182, 193, 0.4)" top="15%" right="10%" duration={4000} delay={500} />
      <FloatingElement name="star" size={12} color="#FFF" top="40%" left="15%" duration={2500} delay={200} />
      <FloatingElement name="auto-awesome" size={18} color="rgba(173, 216, 230, 0.4)" top="60%" right="5%" duration={3500} />
      <FloatingElement name="local-florist" size={16} color="rgba(221, 160, 221, 0.3)" top="80%" left="20%" duration={4500} delay={1000} />
      <FloatingElement name="star" size={10} color="#FFF" top="5%" right="25%" duration={3000} delay={800} />
    </View>
  );
};

const styles = StyleSheet.create({
  element: {
    position: 'absolute',
  },
});
