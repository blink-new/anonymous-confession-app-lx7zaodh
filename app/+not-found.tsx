
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { Ghost } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function NotFoundScreen() {
  const router = useRouter();

  const handleGoHome = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Animated.View 
        style={styles.content}
        entering={FadeIn.duration(600)}
      >
        <Ghost size={80} color="#9775fa" />
        
        <Text style={styles.title}>Page Not Found</Text>
        
        <Text style={styles.message}>
          The page you're looking for doesn't exist or has been moved.
        </Text>
        
        <Button
          title="Go to Home"
          onPress={handleGoHome}
          style={styles.button}
        />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121220',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#E2E8F0',
    marginTop: 24,
    marginBottom: 12,
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  message: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 32,
    fontFamily: 'Inter_400Regular',
  },
  button: {
    width: '60%',
  },
});