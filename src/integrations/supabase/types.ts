export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      duels: {
        Row: {
          code: string
          completed_at: string | null
          created_at: string
          creator_name: string
          creator_progress: number | null
          id: string
          opponent_name: string | null
          opponent_progress: number | null
          proof_id: string
          started_at: string | null
          status: string
          winner: string | null
        }
        Insert: {
          code: string
          completed_at?: string | null
          created_at?: string
          creator_name: string
          creator_progress?: number | null
          id?: string
          opponent_name?: string | null
          opponent_progress?: number | null
          proof_id: string
          started_at?: string | null
          status?: string
          winner?: string | null
        }
        Update: {
          code?: string
          completed_at?: string | null
          created_at?: string
          creator_name?: string
          creator_progress?: number | null
          id?: string
          opponent_name?: string | null
          opponent_progress?: number | null
          proof_id?: string
          started_at?: string | null
          status?: string
          winner?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "duels_proof_id_fkey"
            columns: ["proof_id"]
            isOneToOne: false
            referencedRelation: "proofs"
            referencedColumns: ["id"]
          },
        ]
      }
      proof_feedback: {
        Row: {
          created_at: string
          feedback_text: string | null
          id: string
          is_correct: boolean | null
          on_right_track: boolean | null
          submission_id: string
        }
        Insert: {
          created_at?: string
          feedback_text?: string | null
          id?: string
          is_correct?: boolean | null
          on_right_track?: boolean | null
          submission_id: string
        }
        Update: {
          created_at?: string
          feedback_text?: string | null
          id?: string
          is_correct?: boolean | null
          on_right_track?: boolean | null
          submission_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "proof_feedback_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      proofs: {
        Row: {
          author: string
          category: string
          content: string
          created_at: string
          description: string
          difficulty: string
          hints: string[]
          id: string
          mathematician_proof: string | null
          proof_year: number | null
          source_text: string | null
          source_url: string | null
          time_estimate: string
          title: string
        }
        Insert: {
          author: string
          category: string
          content: string
          created_at?: string
          description: string
          difficulty: string
          hints?: string[]
          id?: string
          mathematician_proof?: string | null
          proof_year?: number | null
          source_text?: string | null
          source_url?: string | null
          time_estimate: string
          title: string
        }
        Update: {
          author?: string
          category?: string
          content?: string
          created_at?: string
          description?: string
          difficulty?: string
          hints?: string[]
          id?: string
          mathematician_proof?: string | null
          proof_year?: number | null
          source_text?: string | null
          source_url?: string | null
          time_estimate?: string
          title?: string
        }
        Relationships: []
      }
      submissions: {
        Row: {
          content: string
          created_at: string
          duel_id: string | null
          feedback: string | null
          id: string
          progress: number | null
          proof_id: string
          user_name: string
        }
        Insert: {
          content: string
          created_at?: string
          duel_id?: string | null
          feedback?: string | null
          id?: string
          progress?: number | null
          proof_id: string
          user_name: string
        }
        Update: {
          content?: string
          created_at?: string
          duel_id?: string | null
          feedback?: string | null
          id?: string
          progress?: number | null
          proof_id?: string
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "submissions_duel_id_fkey"
            columns: ["duel_id"]
            isOneToOne: false
            referencedRelation: "duels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_proof_id_fkey"
            columns: ["proof_id"]
            isOneToOne: false
            referencedRelation: "proofs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
