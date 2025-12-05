// Componente Card com animação

import React, { useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Card } from './Card';
import { theme } from '../theme';

interface AnimatedCardProps {
  children: React.ReactNode;
  style?: any;
  delay?: number;
}

export function AnimatedCard({ children, style, delay = 0 }: AnimatedCardProps) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}

