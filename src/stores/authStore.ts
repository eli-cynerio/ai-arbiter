import { create } from 'zustand';
import { authApi } from '../services/auth';
import { User, Session, SignInWithPasswordCredentials, SignUpWithPasswordCredentials } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  initialize: () => void;
  signUp: (credentials: SignUpWithPasswordCredentials) => Promise<void>;
  signIn: (credentials: SignInWithPasswordCredentials) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: true,

  initialize: () => {
    authApi.getSession().then(session => {
      set({ 
        session, 
        user: session?.user ?? null, 
        isAuthenticated: !!session, 
        isLoading: false 
      });
    });

    const subscription = authApi.onAuthStateChange((_event, session) => {
      set({ 
        session, 
        user: session?.user ?? null, 
        isAuthenticated: !!session, 
        isLoading: false 
      });
    });

    return () => {
      subscription?.unsubscribe();
    };
  },

  signUp: async (credentials) => {
    set({ isLoading: true });
    try {
      await authApi.signUp(credentials);
      // Supabase onAuthStateChange will handle setting the user/session state
    } catch (error) {
      console.error('Sign up failed:', error);
      throw error;
    } finally {
      // isLoading will be set to false by onAuthStateChange listener
    }
  },

  signIn: async (credentials) => {
    set({ isLoading: true });
    try {
      await authApi.signIn(credentials);
      // Supabase onAuthStateChange will handle setting the user/session state
    } catch (error) {
      console.error('Sign in failed:', error);
      throw error;
    } finally {
      // isLoading will be set to false by onAuthStateChange listener
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    await authApi.signOut();
    set({ user: null, session: null, isAuthenticated: false, isLoading: false });
  },
}));

// Initialize the store and listeners when the app loads
useAuthStore.getState().initialize();
