
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator, 
  RefreshControl,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useConfessions } from '@/context/ConfessionContext';
import { useAuth } from '@/context/AuthContext';
import { ConfessionCard } from '@/components/ConfessionCard';
import { TabSegment } from '@/components/TabSegment';
import { EmptyState } from '@/components/EmptyState';
import { MaskIcon } from '@/components/MaskIcon';
import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';

type TabType = 'trending' | 'recent';

export default function HomeScreen() {
  const { 
    trendingConfessions, 
    recentConfessions, 
    loading, 
    refreshConfessions 
  } = useConfessions();
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('trending');
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const confessions = activeTab === 'trending' 
    ? trendingConfessions 
    : recentConfessions;

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshConfessions();
    setRefreshing(false);
  };

  if (authLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#9775fa" />
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <EmptyState 
          message="Sign in to view confessions" 
          subMessage="Create an account or sign in to see what people are confessing"
          actionLabel="Sign In"
          onAction={() => router.push('/auth/signin')}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <MaskIcon size={28} color="#9775fa" />
        <Text style={styles.headerTitle}>Anonymous Confessions</Text>
        <View style={styles.placeholder} />
      </View>

      <TabSegment
        tabs={[
          { key: 'trending', label: 'Trending' },
          { key: 'recent', label: 'Recent' }
        ]}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as TabType)}
      />

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#9775fa" />
        </View>
      ) : confessions.length === 0 ? (
        <EmptyState 
          message="No confessions yet" 
          subMessage="Be the first to share your thoughts anonymously"
          actionLabel="New Confession"
          onAction={() => router.push('/new-confession')}
        />
      ) : (
        <FlatList
          data={confessions}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              tintColor="#9775fa"
              colors={["#9775fa"]}
            />
          }
          renderItem={({ item, index }) => (
            <Animated.View 
              entering={FadeIn.duration(400).delay(index * 100)}
              style={styles.cardContainer}
            >
              <ConfessionCard 
                confession={item}
                onPress={() => router.push(`/confession/${item.id}`)}
              />
            </Animated.View>
          )}
        />
      )}
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
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E2E8F0',
    fontFamily: 'SpaceGrotesk_600SemiBold',
  },
  placeholder: {
    width: 28,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  cardContainer: {
    marginBottom: 16,
  },
});