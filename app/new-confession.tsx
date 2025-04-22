
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
import { LocationPicker } from '@/components/LocationPicker';
import { useConfessions } from '@/context/ConfessionContext';
import { ArrowLeft, MapPin } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function NewConfessionScreen() {
  const [content, setContent] = useState('');
  const [locationName, setLocationName] = useState<string | undefined>();
  const [latitude, setLatitude] = useState<number | undefined>();
  const [longitude, setLongitude] = useState<number | undefined>();
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addConfession, canPostToday, error } = useConfessions();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!content.trim()) {
      Alert.alert('Error', 'Please enter your confession');
      return;
    }
    
    if (!canPostToday) {
      Alert.alert('Error', 'You can only post one confession per day');
      return;
    }
    
    setLoading(true);
    await addConfession(content, locationName, latitude, longitude);
    setLoading(false);
    
    if (!error) {
      Alert.alert(
        'Success', 
        'Your confession has been posted anonymously',
        [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
      );
    } else {
      Alert.alert('Error', error);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleToggleLocationPicker = () => {
    setShowLocationPicker(!showLocationPicker);
  };

  const handleLocationSelected = (name: string, lat: number, lng: number) => {
    setLocationName(name);
    setLatitude(lat);
    setLongitude(lng);
    setShowLocationPicker(false);
  };

  const handleClearLocation = () => {
    setLocationName(undefined);
    setLatitude(undefined);
    setLongitude(undefined);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <ArrowLeft size={24} color="#E2E8F0" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Confession</Text>
          <View style={styles.placeholder} />
        </View>
        
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {!canPostToday && (
            <Animated.View 
              style={styles.limitWarning}
              entering={FadeIn.duration(400)}
            >
              <Text style={styles.limitWarningText}>
                You've already posted today. Come back tomorrow to share another confession.
              </Text>
            </Animated.View>
          )}
          
          <Animated.View entering={FadeIn.duration(400).delay(100)}>
            <Input
              placeholder="What would you like to confess today?"
              multiline
              numberOfLines={6}
              maxLength={500}
              value={content}
              onChangeText={setContent}
              editable={canPostToday}
            />
            
            <Text style={styles.characterCount}>
              {content.length}/500 characters
            </Text>
          </Animated.View>
          
          <Animated.View 
            style={styles.locationSection}
            entering={FadeIn.duration(400).delay(200)}
          >
            <Text style={styles.sectionTitle}>Location (Optional)</Text>
            
            {locationName ? (
              <View style={styles.selectedLocation}>
                <View style={styles.locationInfo}>
                  <MapPin size={16} color="#9775fa" />
                  <Text style={styles.locationName}>{locationName}</Text>
                </View>
                
                <TouchableOpacity 
                  onPress={handleClearLocation}
                  style={styles.clearButton}
                >
                  <Text style={styles.clearButtonText}>Clear</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.addLocationButton}
                onPress={handleToggleLocationPicker}
                disabled={!canPostToday}
              >
                <MapPin size={20} color="#9775fa" />
                <Text style={styles.addLocationText}>Add Location</Text>
              </TouchableOpacity>
            )}
          </Animated.View>
          
          {showLocationPicker && (
            <LocationPicker 
              onLocationSelected={handleLocationSelected}
              onCancel={() => setShowLocationPicker(false)}
            />
          )}
          
          <Animated.View 
            style={styles.submitSection}
            entering={FadeIn.duration(400).delay(300)}
          >
            <Button
              title="Post Anonymously"
              onPress={handleSubmit}
              loading={loading}
              disabled={!canPostToday || !content.trim()}
            />
            
            <Text style={styles.disclaimer}>
              Your confession will be posted anonymously. No one will know it's you.
            </Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2D2D3F',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E2E8F0',
    fontFamily: 'SpaceGrotesk_600SemiBold',
  },
  backButton: {
    padding: 4,
  },
  placeholder: {
    width: 32,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  limitWarning: {
    backgroundColor: '#E53E3E20',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E53E3E',
  },
  limitWarningText: {
    color: '#E53E3E',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  characterCount: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'right',
    marginTop: 4,
    marginBottom: 24,
    fontFamily: 'Inter_400Regular',
  },
  locationSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E2E8F0',
    marginBottom: 12,
    fontFamily: 'SpaceGrotesk_600SemiBold',
  },
  addLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E2E',
    borderWidth: 1,
    borderColor: '#2D2D3F',
    borderRadius: 8,
    padding: 12,
  },
  addLocationText: {
    color: '#9775fa',
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
  },
  selectedLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E1E2E',
    borderWidth: 1,
    borderColor: '#2D2D3F',
    borderRadius: 8,
    padding: 12,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationName: {
    color: '#E2E8F0',
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  clearButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  clearButtonText: {
    color: '#9775fa',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  submitSection: {
    marginTop: 16,
  },
  disclaimer: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 16,
    fontFamily: 'Inter_400Regular',
  },
});