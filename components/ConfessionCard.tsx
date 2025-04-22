
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { Confession } from '@/lib/supabase';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MapPin } from 'lucide-react-native';
import { useConfessions } from '@/context/ConfessionContext';

type ConfessionCardProps = {
  confession: Confession;
  onPress?: () => void;
};

export function ConfessionCard({ confession, onPress }: ConfessionCardProps) {
  const { likeConfession } = useConfessions();
  
  const handleLike = async (e: any) => {
    e.stopPropagation();
    await likeConfession(confession.id);
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.content}>
        {truncateContent(confession.content)}
      </Text>
      
      {confession.location_name && (
        <View style={styles.locationContainer}>
          <MapPin size={16} color="#9775fa" />
          <Text style={styles.locationText}>{confession.location_name}</Text>
        </View>
      )}
      
      <View style={styles.footer}>
        <Text style={styles.timestamp}>
          {formatDistanceToNow(new Date(confession.created_at), { addSuffix: true })}
        </Text>
        
        <TouchableOpacity 
          style={styles.likeButton} 
          onPress={handleLike}
          activeOpacity={0.7}
        >
          <Heart size={20} color="#9775fa" />
          <Text style={styles.likeCount}>{confession.likes}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E1E2E',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2D2D3F',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    fontSize: 16,
    color: '#E2E8F0',
    lineHeight: 24,
    marginBottom: 16,
    fontFamily: 'Inter_400Regular',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationText: {
    fontSize: 14,
    color: '#9775fa',
    marginLeft: 8,
    fontFamily: 'Inter_400Regular',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 14,
    color: '#94A3B8',
    fontFamily: 'Inter_400Regular',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  likeCount: {
    fontSize: 14,
    color: '#E2E8F0',
    marginLeft: 8,
    fontFamily: 'Inter_500Medium',
  },
});