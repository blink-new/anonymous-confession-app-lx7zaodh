
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { MaskIcon } from '@/components/MaskIcon';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, error } = useAuth();
  const router = useRouter();

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    setLoading(true);
    await signIn(email, password);
    setLoading(false);
    
    if (!error) {
      router.replace('/(tabs)');
    }
  };

  const handleGoToSignUp = () => {
    router.push('/auth/signup');
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <ArrowLeft size={24} color="#E2E8F0" />
          </TouchableOpacity>
          
          <Animated.View 
            style={styles.header}
            entering={FadeIn.duration(400)}
          >
            <MaskIcon size={48} color="#9775fa" />
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </Animated.View>
          
          <Animated.View 
            style={styles.form}
            entering={FadeIn.duration(400).delay(100)}
          >
            <Input
              label="Email"
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            
            <Input
              label="Password"
              placeholder="Enter your password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            
            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}
            
            <Button
              title="Sign In"
              onPress={handleSignIn}
              loading={loading}
              style={styles.button}
            />
          </Animated.View>
          
          <Animated.View 
            style={styles.footer}
            entering={FadeIn.duration(400).delay(200)}
          >
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={handleGoToSignUp}>
              <Text style={styles.signUpText}>Sign Up</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121220',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  backButton: {
    marginBottom: 24,
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#E2E8F0',
    marginTop: 16,
    marginBottom: 8,
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#94A3B8',
    fontFamily: 'Inter_400Regular',
  },
  form: {
    marginBottom: 24,
  },
  errorText: {
    color: '#E53E3E',
    marginBottom: 16,
    fontFamily: 'Inter_400Regular',
  },
  button: {
    marginTop: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
    paddingVertical: 16,
  },
  footerText: {
    color: '#94A3B8',
    marginRight: 8,
    fontFamily: 'Inter_400Regular',
  },
  signUpText: {
    color: '#9775fa',
    fontWeight: '500',
    fontFamily: 'Inter_500Medium',
  },
});