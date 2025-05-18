
export interface Submission {
  id: string;
  created_at: string;
  user_name: string;
  proof_id: string;
  content: string;
  feedback: string;
  progress: number;
  duel_id?: string | null;
}

export interface Duel {
  id: string;
  created_at: string;
  code: string;
  creator_name: string;
  opponent_name: string | null;
  proof_id: string;
  creator_progress: number | null;
  opponent_progress: number | null;
  status: "waiting" | "active" | "completed";
  winner: string | null;
  started_at: string | null;
  completed_at: string | null;
}

export interface UserProfile {
  id: string;
  updated_at: string;
  username: string;
  full_name: string;
  avatar_url: string;
  website: string;
}

export interface Proof {
  id: string;
  title: string;
  author: string;
  description: string;
  content: string;
  difficulty: "easy" | "medium" | "hard";
  time_estimate: string;
  hints?: string[];
  created_at: string;
  mathematician_proof?: string;
  proof_year?: number;
  category?: string;
  source_text?: string;
  source_url?: string;
}
