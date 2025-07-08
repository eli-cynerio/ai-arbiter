export type ConflictStatus = 'pending' | 'active' | 'resolved' | 'archived';
export type MemberRole = 'initiator' | 'participant' | 'arbiter';
export type ArbiterType = 'human' | 'ai';

export interface UserProfile {
  id: string;
  email: string;
  phone_hash?: string | null;
  created_at: string;
}

export interface Conflict {
  id: string;
  title: string;
  description: string;
  status: ConflictStatus;
  arbiter_type: ArbiterType;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ConflictMember {
  id: string;
  conflict_id: string;
  user_id: string;
  role: MemberRole;
  joined_at: string;
}

export interface Input {
  id: string;
  conflict_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export interface Question {
  id: string;
  conflict_id: string;
  question_text: string;
  created_at: string;
}

export interface Decision {
  id: string;
  conflict_id: string;
  decision_text: string;
  is_final: boolean;
  created_at: string;
}

export interface AuditLog {
  id: number;
  timestamp: string;
  user_id?: string | null;
  action: string;
  details?: Record<string, any> | null;
}
