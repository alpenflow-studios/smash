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
          payment_tx_id: string | null
          refund_tx_id: string | null
          paid_amount: string | null
          paid_token_id: string | null
        }
        Insert: {
          id?: string
          smash_id: string
          user_id: string
          joined_at?: string
          status?: string
          payment_tx_id?: string | null
          refund_tx_id?: string | null
          paid_amount?: string | null
          paid_token_id?: string | null
        }
        Update: {
          id?: string
          smash_id?: string
          user_id?: string
          joined_at?: string
          status?: string
          payment_tx_id?: string | null
          refund_tx_id?: string | null
          paid_amount?: string | null
          paid_token_id?: string | null
        }
      }
      payment_tokens: {
        Row: {
          id: string
          symbol: string
          name: string
          contract_address: string | null
          decimals: number
          chain_id: number
          logo_url: string | null
          is_active: boolean
        }
        Insert: {
          id?: string
          symbol: string
          name: string
          contract_address?: string | null
          decimals?: number
          chain_id?: number
          logo_url?: string | null
          is_active?: boolean
        }
        Update: {
          id?: string
          symbol?: string
          name?: string
          contract_address?: string | null
          decimals?: number
          chain_id?: number
          logo_url?: string | null
          is_active?: boolean
        }
      }
      smash_accepted_tokens: {
        Row: {
          id: string
          smash_id: string
          token_id: string
        }
        Insert: {
          id?: string
          smash_id: string
          token_id: string
        }
        Update: {
          id?: string
          smash_id?: string
          token_id?: string
        }
      }
      payment_transactions: {
        Row: {
          id: string
          smash_id: string
          user_id: string
          token_id: string
          amount: string
          amount_usd: number | null
          tx_hash: string
          tx_type: string
          status: string
          block_number: number | null
          created_at: string
          confirmed_at: string | null
        }
        Insert: {
          id?: string
          smash_id: string
          user_id: string
          token_id: string
          amount: string
          amount_usd?: number | null
          tx_hash: string
          tx_type: string
          status?: string
          block_number?: number | null
          created_at?: string
          confirmed_at?: string | null
        }
        Update: {
          id?: string
          smash_id?: string
          user_id?: string
          token_id?: string
          amount?: string
          amount_usd?: number | null
          tx_hash?: string
          tx_type?: string
          status?: string
          block_number?: number | null
          created_at?: string
          confirmed_at?: string | null
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

// ============================================
// Status types (for consistent enum-like behavior)
// ============================================

// Participant status values used throughout the app
export type ParticipantStatus = 'active' | 'withdrawn' | 'completed' | 'failed';

// Convenience types for Row (read) operations
// Prefixed with "Db" to distinguish from frontend types in @/types
export type DbUser = Database['public']['Tables']['users']['Row']
export type DbSmash = Database['public']['Tables']['smashes']['Row']
export type DbSubmission = Database['public']['Tables']['submissions']['Row']
export type DbBet = Database['public']['Tables']['bets']['Row']

// Convenience types for Insert operations
export type NewUser = Database['public']['Tables']['users']['Insert']
export type NewSmash = Database['public']['Tables']['smashes']['Insert']
export type NewSubmission = Database['public']['Tables']['submissions']['Insert']
export type NewBet = Database['public']['Tables']['bets']['Insert']
export type Participant = Database['public']['Tables']['participants']['Row']
export type NewParticipant = Database['public']['Tables']['participants']['Insert']
export type PaymentToken = Database['public']['Tables']['payment_tokens']['Row']
export type SmashAcceptedToken = Database['public']['Tables']['smash_accepted_tokens']['Row']
export type PaymentTransaction = Database['public']['Tables']['payment_transactions']['Row']
export type NewPaymentTransaction = Database['public']['Tables']['payment_transactions']['Insert']

// ============================================
// Helper types for Supabase query operations
// ============================================

// Response type for insert operations with .select()
export type InsertResponse<T> = {
  data: T | null;
  error: { message: string; code?: string } | null;
};

// Type for smash_accepted_tokens with joined payment_tokens
export type SmashAcceptedTokenWithPaymentToken = SmashAcceptedToken & {
  payment_tokens: PaymentToken | null;
};
