
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase, Confession, Comment } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MapPin, ArrowLeft, Send } from 'lucide-react-native';
import { EmptyState } from '@/components/EmptyState';
import MapView, { Marker } from 'react-native-maps';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function ConfessionDetailScreen() {
  const { id } = useLocalSearchParams();
  const [confession, setConfession] = useState<Confession | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchConfession();
    fetchComments();
  }, [id]);

  const fetchConfession = async () => {
    try {
      if (!id) return;
      
      const { data, error } = await supabase
        .from('confessions')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      setConfession(data);
    } catch (error) {
      console.error('Error fetching confession:', error);
      Alert.alert('Error', 'Failed to load confession');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      if (!id) return;
      
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('confession_id', id)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleLike = async () => {
    if (!confession) return;
    
    try {
      // Optimistic update
      setConfession({
        ...confession,
        likes: confession.likes + 1
      });
      
      const { error } = await supabase
        .from('confessions')
        .update({ likes: confession.likes + 1 })
        .eq('id', confession.id);
        
      if (error) throw error;
    } catch (error) {
      console.error('Error liking confession:', error);
      // Revert optimistic update
      if (confession) {
        setConfession({
          ...confession,
          likes: confession.likes - 1
        });
      }
    }
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim() || !user || !confession) return;
    
    setSubmitting(true);
    
    try {
      const newComment = {
        confession_id: confession.id,
        user_id: user.id,
        content: commentText.trim(),
        is_anonymous: true
      };
      
      const { data, error } = await supabase
        .from('comments')
        .insert([newComment])
        .select();
        
      if (error) throw error;
      
      // Add new comment to the list
      if (data && data.length > 0) {
        setComments([...comments, data[0]]);
      }
      
      setCommentText('');
    } catch (error) {
      console.error('Error submitting comment:', error);
      Alert.alert('Error', 'Failed to submit comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#9775fa" />
        </View>
      </SafeAreaView>
    );
  }

  if (!confession) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState 
          message="Confession not found" 
          subMessage="The confession you're looking for doesn't exist or has been removed"
        />
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
      
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Animated.View 
            style={styles.confessionCard}
            entering={FadeIn.duration(400)}
          >
            <Text style={styles.confessionContent}>{confession.content}</Text>
            
            {confession.location_name && (
              <View style={styles.locationContainer}>
                <MapPin size={16} color="#9775fa" />
                <Text style={styles.locationText}>{confession.location_name}</Text>
              </View>
            )}
            
            {confession.latitude && confession.longitude && (
              <View style={styles.mapContainer}>
                <MapView
                  style={styles.map}
                  initialRegion={{
                    latitude: confession.latitude,
                    longitude: confession.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                  customMapStyle={mapStyle}
                >
                  <Marker
                    coordinate={{
                      latitude: confession.latitude,
                      longitude: confession.longitude,
                    }}
                    pinColor="#9775fa"
                  />
                </MapView>
              </View>
            )}
            
            <View style={styles.confessionFooter}>
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
          
          <View style={styles.commentsSection}>
            <Text style={styles.commentsTitle}>Comments</Text>
            
            {comments.length === 0 ? (
              <Text style={styles.noCommentsText}>No comments yet. Be the first to comment!</Text>
            ) : (
              comments.map((comment, index) => (
                <Animated.View 
                  key={comment.id} 
                  style={styles.commentCard}
                  entering={FadeIn.duration(400).delay(index * 100)}
                >
                  <Text style={styles.commentContent}>{comment.content}</Text>
                  <Text style={styles.commentTimestamp}>
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                  </Text>
                </Animated.View>
              ))
            )}
          </View>
        </ScrollView>
        
        <View style={styles.commentInputContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="Add a comment..."
            placeholderTextColor="#94A3B8"
            value={commentText}
            onChangeText={setCommentText}
            multiline
          />
          <TouchableOpacity 
            style={[
              styles.sendButton,
              (!commentText.trim() || submitting) && styles.sendButtonDisabled
            ]} 
            onPress={handleSubmitComment}
            disabled={!commentText.trim() || submitting}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Send size={20} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confessionCard: {
    backgroundColor: '#1E1E2E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#2D2D3F',
  },
  confessionContent: {
    fontSize: 16,
    color: '#E2E8F0',
    lineHeight: 24,
    marginBottom: 16,
    fontFamily: 'SpaceGrotesk_400Regular',
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
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  confessionFooter: {
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
    marginBottom: 16,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E2E8F0',
    marginBottom: 16,
    fontFamily: 'SpaceGrotesk_600SemiBold',
  },
  noCommentsText: {
    fontSize: 14,
    color: '#94A3B8',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 16,
    fontFamily: 'Inter_400Regular',
  },
  commentCard: {
    backgroundColor: '#1E1E2E',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2D2D3F',
  },
  commentContent: {
    fontSize: 14,
    color: '#E2E8F0',
    lineHeight: 20,
    marginBottom: 8,
    fontFamily: 'Inter_400Regular',
  },
  commentTimestamp: {
    fontSize: 12,
    color: '#94A3B8',
    fontFamily: 'Inter_400Regular',
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#2D2D3F',
    backgroundColor: '#1A1A2E',
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#1E1E2E',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: '#E2E8F0',
    maxHeight: 100,
    fontFamily: 'Inter_400Regular',
  },
  sendButton: {
    backgroundColor: '#9775fa',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#2D2D3F',
  },
});

const mapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8ec3b9"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1a3646"
      }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#4b6878"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#64779e"
      }
    ]
  },
  {
    "featureType": "administrative.province",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#4b6878"
      }
    ]
  },
  {
    "featureType": "landscape.man_made",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#334e87"
      }
    ]
  },
  {
    "featureType": "landscape.natural",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#023e58"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#283d6a"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#6f9ba5"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#023e58"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#3C7680"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#304a7d"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#98a5be"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#2c6675"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#255763"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#b0d5ce"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#023e58"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#98a5be"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#283d6a"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#3a4762"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#0e1626"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#4e6d70"
      }
    ]
  }
];