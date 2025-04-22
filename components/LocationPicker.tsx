
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { MapPin, X } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

type LocationPickerProps = {
  onLocationSelect: (locationName: string, latitude: number, longitude: number) => void;
  onLocationClear: () => void;
  selectedLocation?: { name: string; latitude: number; longitude: number } | null;
};

export function LocationPicker({ 
  onLocationSelect, 
  onLocationClear,
  selectedLocation 
}: LocationPickerProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getLocationName = async (latitude: number, longitude: number) => {
    try {
      const response = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (response && response.length > 0) {
        const { city, region, country } = response[0];
        return [city, region, country].filter(Boolean).join(', ');
      }
      
      return 'Unknown location';
    } catch (error) {
      console.error('Error getting location name:', error);
      return 'Unknown location';
    }
  };

  const getCurrentLocation = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setError('Permission to access location was denied');
        return;
      }
      
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      const locationName = await getLocationName(latitude, longitude);
      onLocationSelect(locationName, latitude, longitude);
    } catch (error) {
      console.error('Error getting location:', error);
      setError('Could not get your location');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {selectedLocation ? (
        <Animated.View 
          style={styles.selectedLocation}
          entering={FadeIn.duration(300)}
        >
          <View style={styles.locationInfo}>
            <MapPin size={16} color="#9775fa" />
            <Text style={styles.locationText}>{selectedLocation.name}</Text>
          </View>
          
          <TouchableOpacity 
            onPress={onLocationClear}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <X size={16} color="#94A3B8" />
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <TouchableOpacity 
          style={styles.button} 
          onPress={getCurrentLocation}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#9775fa" />
          ) : (
            <>
              <MapPin size={16} color="#9775fa" />
              <Text style={styles.buttonText}>Add your location</Text>
            </>
          )}
        </TouchableOpacity>
      )}
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  buttonText: {
    fontSize: 14,
    color: '#9775fa',
    marginLeft: 8,
    fontFamily: 'Inter_500Medium',
  },
  selectedLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(151, 117, 250, 0.1)',
    borderRadius: 8,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: '#E2E8F0',
    marginLeft: 8,
    fontFamily: 'Inter_400Regular',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'Inter_400Regular',
  },
});