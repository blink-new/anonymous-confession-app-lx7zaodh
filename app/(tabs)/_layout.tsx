
import { Tabs } from 'expo-router';
import { Home, Settings, PlusCircle } from 'lucide-react-native';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { SpaceGrotesk_400Regular, SpaceGrotesk_600SemiBold, SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk';
import { useRouter } from 'expo-router';
import { AuthProvider } from '@/context/AuthContext';
import { ConfessionProvider } from '@/context/ConfessionContext';

export default function TabLayout() {
  const router = useRouter();
  
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    SpaceGrotesk_400Regular,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <ConfessionProvider>
        <Tabs
          screenOptions={{
            headerShown: true,
            tabBarActiveTintColor: '#9775fa',
            tabBarInactiveTintColor: '#94A3B8',
            tabBarStyle: {
              backgroundColor: '#1A1A2E',
              borderTopWidth: 1,
              borderTopColor: '#2D2D3F',
              height: 60,
              paddingBottom: 8,
              paddingTop: 8,
            },
            headerStyle: {
              backgroundColor: '#121220',
              borderBottomWidth: 1,
              borderBottomColor: '#2D2D3F',
            },
            headerTitleStyle: {
              fontWeight: '600',
              color: '#E2E8F0',
              fontFamily: 'SpaceGrotesk_600SemiBold',
            },
            tabBarLabelStyle: {
              fontFamily: 'Inter_500Medium',
              fontSize: 12,
            }
          }}>
          <Tabs.Screen
            name="index"
            options={{
              title: 'Confessions',
              tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
            }}
          />
          <Tabs.Screen
            name="new-confession"
            options={{
              title: '',
              tabBarButton: (props) => (
                <TouchableOpacity
                  {...props}
                  style={styles.newConfessionButton}
                  onPress={() => router.push('/new-confession')}
                >
                  <View style={styles.plusButtonContainer}>
                    <PlusCircle size={28} color="#FFFFFF" />
                  </View>
                </TouchableOpacity>
              ),
            }}
          />
          <Tabs.Screen
            name="settings"
            options={{
              title: 'Settings',
              tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
            }}
          />
        </Tabs>
      </ConfessionProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  newConfessionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusButtonContainer: {
    backgroundColor: '#9775fa',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
    shadowColor: '#9775fa',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});