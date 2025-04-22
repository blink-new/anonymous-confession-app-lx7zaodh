
import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { useRouter } from 'expo-router';

export default function NotFoundScreen() {
  const router = useRouter();
  
  return (
    <>
      <Stack.Screen options={{ title: 'Not Found' }} />
      <View style={styles.container}>
        <Text style={styles.title}>Page not found</Text>
        <Text style={styles.subtitle}>The page you're looking for doesn't exist or has been moved.</Text>
        <Button 
          title="Go to Home" 
          onPress={() => router.replace('/')}
          style={styles.button}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#121220',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E2E8F0',
    marginBottom: 8,
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'Inter_400Regular',
  },
  button: {
    marginTop: 16,
    width: 200,
  },
});