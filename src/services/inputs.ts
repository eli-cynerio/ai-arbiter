import { supabase } from '../lib/supabaseClient';
import { Input } from '../types/database';

type InputCreate = Omit<Input, 'id' | 'created_at' | 'user_id'> & { conflict_id: string };

export const inputsApi = {
  async createInput(inputData: InputCreate): Promise<Input> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('inputs')
      .insert({ ...inputData, user_id: user.id })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getInputsForConflict(conflictId: string): Promise<Input[]> {
    const { data, error } = await supabase
      .from('inputs')
      .select('*')
      .eq('conflict_id', conflictId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  }
};
