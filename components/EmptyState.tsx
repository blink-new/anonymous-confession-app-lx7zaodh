
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Ghost } from 'lucide-react-native';

type EmptyStateProps = {
  message: string;
  subMessage?: string;
};

export function EmptyState({ message, subMessage }: EmptyStateProps) {
  return (
    <Animated.View 
      style={styles.container}
      entering={FadeIn.duration(400)}
    >
      <Ghost size={48} color="#9775fa" />
      <Text style={styles.message}>{message}</Text>
      {subMessage && <Text style={styles.subMessage}>{subMessage}</Text>}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  message: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E2E8F0',
    textAlign: 'center',
    marginTop: 16,
    fontFamily: 'SpaceGrotesk_600SemiBold',
  },
  subMessage: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 8,
    fontFamily: 'Inter_400Regular',
  },
});