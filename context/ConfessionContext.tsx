
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase, Confession } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { format } from 'date-fns';

type ConfessionContextType = {
  confessions: Confession[];
  trendingConfessions: Confession[];
  recentConfessions: Confession[];
  loading: boolean;
  error: string | null;
  canPostToday: boolean;
  addConfession: (content: string, locationName?: string, latitude?: number, longitude?: number) => Promise<void>;
  likeConfession: (id: string) => Promise<void>;
  refreshConfessions: () => Promise<void>;
};

const ConfessionContext = createContext<ConfessionContextType>({
  confessions: [],
  trendingConfessions: [],
  recentConfessions: [],
  loading: true,
  error: null,
  canPostToday: false,
  addConfession: async () => {},
  likeConfession: async () => {},
  refreshConfessions: async () => {},
});

export const ConfessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [trendingConfessions, setTrendingConfessions] = useState<Confession[]>([]);
  const [recentConfessions, setRecentConfessions] = useState<Confession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canPostToday, setCanPostToday] = useState(false);
  const { user } = useAuth();

  // Check if user can post today
  const checkCanPostToday = async () => {
    if (!user) {
      setCanPostToday(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('last_confession_date')
        .eq('id', user.id)
        .single();

      if (error) {
        throw error;
      }

      // If no last confession date or it's not today, user can post
      const today = format(new Date(), 'yyyy-MM-dd');
      setCanPostToday(!data.last_confession_date || data.last_confession_date !== today);
    } catch (error: any) {
      console.error('Error checking post eligibility:', error.message);
      setCanPostToday(false);
    }
  };

  // Fetch all confessions
  const fetchConfessions = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get all confessions
      const { data, error } = await supabase
        .from('confessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setConfessions(data || []);

      // Set trending confessions (most likes)
      const trending = [...(data || [])].sort((a, b) => b.likes - a.likes).slice(0, 10);
      setTrendingConfessions(trending);

      // Set recent confessions
      const recent = [...(data || [])].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ).slice(0, 10);
      setRecentConfessions(recent);

      await checkCanPostToday();
    } catch (error: any) {
      setError(error.message);
      console.error('Error fetching confessions:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Add a new confession
  const addConfession = async (
    content: string, 
    locationName?: string, 
    latitude?: number, 
    longitude?: number
  ) => {
    if (!user) {
      setError('You must be logged in to post a confession');
      return;
    }

    if (!canPostToday) {
      setError('You can only post one confession per day');
      return;
    }

    try {
      setError(null);
      
      const newConfession = {
        user_id: user.id,
        content,
        location_name: locationName || null,
        latitude: latitude || null,
        longitude: longitude || null,
        is_anonymous: true,
      };

      const { error } = await supabase
        .from('confessions')
        .insert([newConfession]);

      if (error) {
        throw error;
      }

      // Update local state
      setCanPostToday(false);
      await fetchConfessions();
    } catch (error: any) {
      setError(error.message);
      console.error('Error adding confession:', error.message);
    }
  };

  // Like a confession
  const likeConfession = async (id: string) => {
    try {
      setError(null);
      
      // Get current likes
      const { data, error: fetchError } = await supabase
        .from('confessions')
        .select('likes')
        .eq('id', id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      // Increment likes
      const { error: updateError } = await supabase
        .from('confessions')
        .update({ likes: (data?.likes || 0) + 1 })
        .eq('id', id);

      if (updateError) {
        throw updateError;
      }

      // Update local state
      setConfessions(confessions.map(confession => 
        confession.id === id 
          ? { ...confession, likes: confession.likes + 1 } 
          : confession
      ));

      // Update trending confessions
      setTrendingConfessions(trendingConfessions.map(confession => 
        confession.id === id 
          ? { ...confession, likes: confession.likes + 1 } 
          : confession
      ).sort((a, b) => b.likes - a.likes));

      // Update recent confessions
      setRecentConfessions(recentConfessions.map(confession => 
        confession.id === id 
          ? { ...confession, likes: confession.likes + 1 } 
          : confession
      ));
    } catch (error: any) {
      setError(error.message);
      console.error('Error liking confession:', error.message);
    }
  };

  // Refresh confessions
  const refreshConfessions = async () => {
    await fetchConfessions();
  };

  // Initial fetch
  useEffect(() => {
    if (user) {
      fetchConfessions();
    } else {
      setConfessions([]);
      setTrendingConfessions([]);
      setRecentConfessions([]);
      setCanPostToday(false);
    }
  }, [user]);

  return (
    <ConfessionContext.Provider 
      value={{ 
        confessions, 
        trendingConfessions, 
        recentConfessions, 
        loading, 
        error, 
        canPostToday,
        addConfession, 
        likeConfession,
        refreshConfessions
      }}
    >
      {children}
    </ConfessionContext.Provider>
  );
};

export const useConfessions = () => useContext(ConfessionContext);