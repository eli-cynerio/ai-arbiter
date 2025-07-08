import { supabase } from '../lib/supabaseClient';
import { Conflict } from '../types/database';

type ConflictCreate = Omit<Conflict, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'status'>;
type ConflictUpdate = Partial<Pick<Conflict, 'title' | 'description' | 'status' | 'arbiter_type'>>;

export const conflictsApi = {
  async createConflict(conflictData: ConflictCreate): Promise<Conflict> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('conflicts')
      .insert({ ...conflictData, created_by: user.id })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getConflictById(id: string): Promise<Conflict | null> {
    const { data, error } = await supabase
      .from('conflicts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async getConflictsForUser(): Promise<Conflict[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('conflicts')
      .select('*');

    if (error) throw error;
    return data || [];
  },

  async updateConflict(id: string, updates: ConflictUpdate): Promise<Conflict> {
    const { data, error } = await supabase
      .from('conflicts')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteConflict(id: string): Promise<void> {
    const { error } = await supabase
      .from('conflicts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
