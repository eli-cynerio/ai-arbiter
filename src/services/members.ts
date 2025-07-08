import { supabase } from '../lib/supabaseClient';
import { ConflictMember, MemberRole, UserProfile } from '../types/database';

type MemberCreate = {
  conflict_id: string;
  user_id: string;
  role: MemberRole;
};

export type ConflictMemberWithProfile = ConflictMember & {
  user_profile: Pick<UserProfile, 'id' | 'email'> | null;
};

export const membersApi = {
  async addMemberToConflict(memberData: MemberCreate): Promise<ConflictMember> {
    const { data, error } = await supabase
      .from('conflict_members')
      .insert(memberData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getConflictMembers(conflictId: string): Promise<ConflictMemberWithProfile[]> {
    const { data, error } = await supabase
      .from('conflict_members')
      .select('*, user_profile:users(id, email)')
      .eq('conflict_id', conflictId);

    if (error) throw error;
    return (data as any) || [];
  },

  async updateMemberRole(memberId: string, role: MemberRole): Promise<ConflictMember> {
    const { data, error } = await supabase
      .from('conflict_members')
      .update({ role })
      .eq('id', memberId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async removeMemberFromConflict(memberId: string): Promise<void> {
    const { error } = await supabase
      .from('conflict_members')
      .delete()
      .eq('id', memberId);

    if (error) throw error;
  }
};
