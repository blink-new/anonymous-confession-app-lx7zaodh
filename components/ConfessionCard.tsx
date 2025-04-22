
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { Heart, MapPin, MessageCircle } from 'lucide-react-native';
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { formatDistanceToNow } from 'date-fns';
import { Confession } from '@/lib/supabase';

type ConfessionCardProps = {
  confession: Confession;
  onLike: (id: string) => void;
  onPress: (confession: Confession) => void;
};

export function ConfessionCard({ confession, onLike, onPress }: ConfessionCardProps) {
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handleLike = () => {
    onLike(confession.id);
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={() => onPress(confession)}
    >
      <Animated.View 
        style={[styles.card, animatedStyle]}
        entering={FadeIn.duration(400)}
      >
        <View style={styles.cardContent}>
          <Text style={styles.content}>{confession.content}</Text>
          
          {confession.location_name && (
            <View style={styles.locationContainer}>
              <MapPin size={14} color="#9775fa" />
              <Text style={styles.locationText}>{confession.location_name}</Text>
            </View>
          )}
          
          <View style={styles.cardFooter}>
            <Text style={styles.timestamp}>
              {formatDistanceToNow(new Date(confession.created_at), { addSuffix: true })}
            </Text>
            
            <View style={styles.actions}>
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={handleLike}
                activeOpacity={0.7}
              >
                <Heart size={18} color="#9775fa" />
                <Text style={styles.actionText}>{confession.likes}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton}
                activeOpacity={0.7}
              >
                <MessageCircle size={18} color="#9775fa" />
                <Text style={styles.actionText}>0</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E1E2E',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#2D2D3F',
  },
  cardContent: {
    padding: 16,
  },
  content: {
    fontSize: 16,
    color: '#E2E8F0',
    lineHeight: 24,
    marginBottom: 12,
    fontFamily: 'SpaceGrotesk_400Regular',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 12,
    color: '#9775fa',
    marginLeft: 4,
    fontFamily: 'Inter_400Regular',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#94A3B8',
    fontFamily: 'Inter_400Regular',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  actionText: {
    fontSize: 12,
    color: '#94A3B8',
    marginLeft: 4,
    fontFamily: 'Inter_400Regular',
  },
});