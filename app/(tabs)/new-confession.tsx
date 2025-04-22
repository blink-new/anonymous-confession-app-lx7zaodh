
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function NewConfessionTab() {
  const router = useRouter();
  
  // This is just a placeholder - the actual new confession screen is at /app/new-confession.tsx
  React.useEffect(() => {
    router.replace('/new-confession');
  }, []);
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Redirecting...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121220',
  },
  text: {
    color: '#E2E8F0',
    fontSize: 16,
  },
});