import { supabase } from '../lib/supabaseClient';
import { SignUpWithPasswordCredentials, SignInWithPasswordCredentials, Session } from '@supabase/supabase-js';

export const authApi = {
  async signUp(credentials: SignUpWithPasswordCredentials) {
    const { data, error } = await supabase.auth.signUp(credentials);
    if (error) throw error;
    return data;
  },

  async signIn(credentials: SignInWithPasswordCredentials) {
    const { data, error } = await supabase.auth.signInWithPassword(credentials);
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
    return subscription;
  }
};
