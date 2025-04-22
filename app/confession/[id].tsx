
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase, Confession } from '@/lib/supabase';
import { formatDistanceToNow } from 'date-fns';
import { ArrowLeft, Heart, MapPin } from 'lucide-react-native';
import { useConfessions } from '@/context/ConfessionContext';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function ConfessionDetailScreen() {
  const { id } = useLocalSearchParams();
  const [confession, setConfession] = useState<Confession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { likeConfession } = useConfessions();
  const router = useRouter();

  useEffect(() => {
    const fetchConfession = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('confessions')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        setConfession(data as Confession);
      } catch (error: any) {
        console.error('Error fetching confession:', error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchConfession();
    }
  }, [id]);

  const handleLike = async () => {
    if (!confession) return;
    
    await likeConfession(confession.id);
    
    // Update local state
    setConfession(prev => {
      if (!prev) return null;
      return { ...prev, likes: prev.likes + 1 };
    });
  };

  const handleGoBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <ArrowLeft size={24} color="#E2E8F0" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Confession</Text>
          <View style={styles.placeholder} />
        </View>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#9775fa" />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !confession) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <ArrowLeft size={24} color="#E2E8F0" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Error</Text>
          <View style={styles.placeholder} />
        </View>
        
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {error || 'Confession not found'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#E2E8F0" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confession</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View 
          style={styles.confessionCard}
          entering={FadeIn.duration(400)}
        >
          <Text style={styles.content}>{confession.content}</Text>
          
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
        </Animated.View>
        
        {/* Comments section could be added here in the future */}
        <Animated.View 
          style={styles.commentsSection}
          entering={FadeIn.duration(400).delay(100)}
        >
          <Text style={styles.sectionTitle}>Comments</Text>
          <Text style={styles.commingSoon}>
            Comments feature coming soon...
          </Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    color: '#E53E3E',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
  confessionCard: {
    backgroundColor: '#1E1E2E',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2D2D3F',
    marginBottom: 24,
  },
  content: {
    fontSize: 18,
    color: '#E2E8F0',
    lineHeight: 28,
    marginBottom: 20,
    fontFamily: 'Inter_400Regular',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
  commentsSection: {
    backgroundColor: '#1E1E2E',
    borderRadius: 16,
    padding: 20,
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
  commingSoon: {
    fontSize: 14,
    color: '#94A3B8',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
    fontFamily: 'Inter_400Regular',
  },
});