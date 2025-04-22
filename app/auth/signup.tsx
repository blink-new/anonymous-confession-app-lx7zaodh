
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

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, error } = useAuth();
  const router = useRouter();

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    setLoading(true);
    await signUp(email, password);
    setLoading(false);
    
    if (!error) {
      Alert.alert(
        'Success', 
        'Account created successfully! You can now sign in.',
        [{ text: 'OK', onPress: () => router.replace('/auth/signin') }]
      );
    }
  };

  const handleGoToSignIn = () => {
    router.push('/auth/signin');
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to get started</Text>
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
              placeholder="Create a password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            
            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            
            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}
            
            <Button
              title="Sign Up"
              onPress={handleSignUp}
              loading={loading}
              style={styles.button}
            />
          </Animated.View>
          
          <Animated.View 
            style={styles.footer}
            entering={FadeIn.duration(400).delay(200)}
          >
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={handleGoToSignIn}>
              <Text style={styles.signInText}>Sign In</Text>
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
  signInText: {
    color: '#9775fa',
    fontWeight: '500',
    fontFamily: 'Inter_500Medium',
  },
});