
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { RuleSection } from '@/components/RuleSection';
import { LogOut, User, Shield, Info } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function SettingsScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/auth/signin');
          },
        },
      ]
    );
  };

  const handleSignIn = () => {
    router.push('/auth/signin');
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View 
          style={styles.header}
          entering={FadeIn.duration(400)}
        >
          <Text style={styles.title}>Settings</Text>
          {user ? (
            <Text style={styles.subtitle}>
              Signed in as {user.email}
            </Text>
          ) : (
            <Text style={styles.subtitle}>
              Not signed in
            </Text>
          )}
        </Animated.View>

        <Animated.View 
          entering={FadeIn.duration(400).delay(100)}
        >
          <RuleSection 
            title="App Rules"
            icon={<Shield size={20} color="#9775fa" />}
            rules={[
              "All confessions are anonymous",
              "You can post one confession per day",
              "Be respectful to others",
              "No hate speech or harassment",
              "No personal information"
            ]}
          />
        </Animated.View>

        <Animated.View 
          style={styles.section}
          entering={FadeIn.duration(400).delay(200)}
        >
          <Text style={styles.sectionTitle}>Account</Text>
          
          {user ? (
            <TouchableOpacity 
              style={styles.button}
              onPress={handleSignOut}
            >
              <LogOut size={20} color="#E53E3E" />
              <Text style={[styles.buttonText, styles.signOutText]}>Sign Out</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.button}
              onPress={handleSignIn}
            >
              <User size={20} color="#9775fa" />
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
          )}
        </Animated.View>

        <Animated.View 
          style={styles.footer}
          entering={FadeIn.duration(400).delay(300)}
        >
          <Text style={styles.version}>Version 1.0.0</Text>
          <Text style={styles.copyright}>© 2023 Anonymous Confessions</Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121220',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#E2E8F0',
    marginBottom: 8,
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#94A3B8',
    fontFamily: 'Inter_400Regular',
  },
  section: {
    marginTop: 24,
    marginBottom: 16,
    backgroundColor: '#1E1E2E',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2D2D3F',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E2E8F0',
    marginBottom: 16,
    fontFamily: 'SpaceGrotesk_600SemiBold',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#1A1A2E',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2D2D3F',
  },
  buttonText: {
    fontSize: 16,
    color: '#E2E8F0',
    marginLeft: 12,
    fontFamily: 'Inter_500Medium',
  },
  signOutText: {
    color: '#E53E3E',
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  version: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 4,
    fontFamily: 'Inter_400Regular',
  },
  copyright: {
    fontSize: 12,
    color: '#64748B',
    fontFamily: 'Inter_400Regular',
  },
});