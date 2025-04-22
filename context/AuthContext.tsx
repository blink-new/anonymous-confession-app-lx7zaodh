
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';

// Define the context type
type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
};

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
  error: null,
});

// Create a provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get the current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign up function
  const signUp = async (email: string, password: string) => {
    try {
      setError(null);
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      // Create a profile for the new user
      if (user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{ id: user.id }]);
          
        if (profileError) {
          throw profileError;
        }
      }
    } catch (error: any) {
      setError(error.message);
      console.error('Error signing up:', error.message);
    }
  };

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
    } catch (error: any) {
      setError(error.message);
      console.error('Error signing in:', error.message);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
    } catch (error: any) {
      setError(error.message);
      console.error('Error signing out:', error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signUp, signIn, signOut, error }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);