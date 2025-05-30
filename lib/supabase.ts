
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Use environment variables for Supabase configuration
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;

// Custom storage implementation for Supabase
const ExpoSecureStoreAdapter = {
  getItem: (key: string): Promise<string | null> => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string): Promise<void> => {
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string): Promise<void> => {
    return SecureStore.deleteItemAsync(key);
  },
};

// Create a custom storage object that works for both web and native
const createCustomStorage = () => {
  if (Platform.OS === 'web') {
    // Use localStorage for web
    return {
      getItem: (key: string): Promise<string | null> => {
        return Promise.resolve(localStorage.getItem(key));
      },
      setItem: (key: string, value: string): Promise<void> => {
        localStorage.setItem(key, value);
        return Promise.resolve();
      },
      removeItem: (key: string): Promise<void> => {
        localStorage.removeItem(key);
        return Promise.resolve();
      },
    };
  } else {
    // Use SecureStore for native platforms
    return ExpoSecureStoreAdapter;
  }
};

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: createCustomStorage(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === 'web',
  },
});

// Types for our database
export type Profile = {
  id: string;
  created_at: string;
  updated_at: string;
  last_confession_date: string | null;
};

export type Confession = {
  id: string;
  created_at: string;
  user_id: string;
  content: string;
  location_name: string | null;
  latitude: number | null;
  longitude: number | null;
  likes: number;
  is_anonymous: boolean;
};

export type Comment = {
  id: string;
  created_at: string;
  confession_id: string;
  user_id: string;
  content: string;
  is_anonymous: boolean;
};