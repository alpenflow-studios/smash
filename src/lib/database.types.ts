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
      users: {
        Row: {
          id: string
          wallet_address: string
          username: string | null
          avatar_url: string | null
          reputation_score: number
          created_at: string
        }
        Insert: {
          id?: string
          wallet_address: string
          username?: string | null
          avatar_url?: string | null
          reputation_score?: number
          created_at?: string
        }
        Update: {
          id?: string
          wallet_address?: string
          username?: string | null
          avatar_url?: string | null
          reputation_score?: number
          created_at?: string
        }
      }
      smashes: {
        Row: {
          id: string
          title: string
          description: string | null
          category: string
          status: string
          entry_fee: number | null
          prize_pool: number | null
          creator_id: string | null
          max_participants: number | null
          min_participants: number
          starts_at: string | null
          ends_at: string | null
          verification_method: string | null
          betting_enabled: boolean
          visibility: string
          stakes_type: string
          invite_code: string | null
          consensus_threshold: number
          dispute_window_hours: number
          cover_image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          category: string
          status?: string
          entry_fee?: number | null
          prize_pool?: number | null
          creator_id?: string | null
          max_participants?: number | null
          min_participants?: number
          starts_at?: string | null
          ends_at?: string | null
          verification_method?: string | null
          betting_enabled?: boolean
          visibility?: string
          stakes_type?: string
          invite_code?: string | null
          consensus_threshold?: number
          dispute_window_hours?: number
          cover_image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          category?: string
          status?: string
          entry_fee?: number | null
          prize_pool?: number | null
          creator_id?: string | null
          max_participants?: number | null
          min_participants?: number
          starts_at?: string | null
          ends_at?: string | null
          verification_method?: string | null
          betting_enabled?: boolean
          visibility?: string
          stakes_type?: string
          invite_code?: string | null
          consensus_threshold?: number
          dispute_window_hours?: number
          cover_image_url?: string | null
          created_at?: string
        }
      }
      submissions: {
        Row: {
          id: string
          smash_id: string | null
          user_id: string | null
          proof_url: string
          proof_type: string | null
          verified: boolean
          submitted_at: string
        }
        Insert: {
          id?: string
          smash_id?: string | null
          user_id?: string | null
          proof_url: string
          proof_type?: string | null
          verified?: boolean
          submitted_at?: string
        }
        Update: {
          id?: string
          smash_id?: string | null
          user_id?: string | null
          proof_url?: string
          proof_type?: string | null
          verified?: boolean
          submitted_at?: string
        }
      }
      bets: {
        Row: {
          id: string
          smash_id: string | null
          bettor_id: string | null
          target_user_id: string | null
          amount: number | null
          prediction: string | null
          outcome: string | null
          created_at: string
        }
        Insert: {
          id?: string
          smash_id?: string | null
          bettor_id?: string | null
          target_user_id?: string | null
          amount?: number | null
          prediction?: string | null
          outcome?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          smash_id?: string | null
          bettor_id?: string | null
          target_user_id?: string | null
          amount?: number | null
          prediction?: string | null
          outcome?: string | null
          created_at?: string
        }
      }
      participants: {
        Row: {
          id: string
          smash_id: string
          user_id: string
          joined_at: string
          status: string
        }
        Insert: {
          id?: string
          smash_id: string
          user_id: string
          joined_at?: string
          status?: string
        }
        Update: {
          id?: string
          smash_id?: string
          user_id?: string
          joined_at?: string
          status?: string
        }
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
  }
}

// Convenience types
export type User = Database['public']['Tables']['users']['Row']
export type Smash = Database['public']['Tables']['smashes']['Row']
export type Submission = Database['public']['Tables']['submissions']['Row']
export type Bet = Database['public']['Tables']['bets']['Row']

export type NewUser = Database['public']['Tables']['users']['Insert']
export type NewSmash = Database['public']['Tables']['smashes']['Insert']
export type NewSubmission = Database['public']['Tables']['submissions']['Insert']
export type NewBet = Database['public']['Tables']['bets']['Insert']
export type Participant = Database['public']['Tables']['participants']['Row']
export type NewParticipant = Database['public']['Tables']['participants']['Insert']
