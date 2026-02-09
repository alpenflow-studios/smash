// ============================================
// Auto-generated Supabase types
// Generated: 2026-02-08 via `npx supabase gen types typescript`
// Project: utbkhzooafzepabtrhnc (smash-xyz)
// ============================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ai_verification_log: {
        Row: {
          agent_model: string
          challenge_requirements: Json | null
          confidence_score: number | null
          created_at: string | null
          decision: string
          flags: string[] | null
          id: string
          processing_time_ms: number | null
          proof_id: string | null
          reasoning: string | null
          smash_id: string | null
          submitted_data: Json | null
          user_id: string
          wearable_data: Json | null
        }
        Insert: {
          agent_model: string
          challenge_requirements?: Json | null
          confidence_score?: number | null
          created_at?: string | null
          decision: string
          flags?: string[] | null
          id?: string
          processing_time_ms?: number | null
          proof_id?: string | null
          reasoning?: string | null
          smash_id?: string | null
          submitted_data?: Json | null
          user_id: string
          wearable_data?: Json | null
        }
        Update: {
          agent_model?: string
          challenge_requirements?: Json | null
          confidence_score?: number | null
          created_at?: string | null
          decision?: string
          flags?: string[] | null
          id?: string
          processing_time_ms?: number | null
          proof_id?: string | null
          reasoning?: string | null
          smash_id?: string | null
          submitted_data?: Json | null
          user_id?: string
          wearable_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_verification_log_proof_id_fkey"
            columns: ["proof_id"]
            isOneToOne: false
            referencedRelation: "proof_submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_verification_log_smash_id_fkey"
            columns: ["smash_id"]
            isOneToOne: false
            referencedRelation: "smashes"
            referencedColumns: ["id"]
          },
        ]
      }
      bets: {
        Row: {
          actual_payout: number | null
          amount: number
          bet_type: string
          id: string
          odds: number | null
          payment_token_id: string | null
          payout_tx_hash: string | null
          placed_at: string | null
          potential_payout: number | null
          settled_at: string | null
          smash_id: string | null
          status: string | null
          target_outcome: string | null
          target_user_id: string | null
          user_id: string | null
        }
        Insert: {
          actual_payout?: number | null
          amount: number
          bet_type: string
          id?: string
          odds?: number | null
          payment_token_id?: string | null
          payout_tx_hash?: string | null
          placed_at?: string | null
          potential_payout?: number | null
          settled_at?: string | null
          smash_id?: string | null
          status?: string | null
          target_outcome?: string | null
          target_user_id?: string | null
          user_id?: string | null
        }
        Update: {
          actual_payout?: number | null
          amount?: number
          bet_type?: string
          id?: string
          odds?: number | null
          payment_token_id?: string | null
          payout_tx_hash?: string | null
          placed_at?: string | null
          potential_payout?: number | null
          settled_at?: string | null
          smash_id?: string | null
          status?: string | null
          target_outcome?: string | null
          target_user_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bets_payment_token_id_fkey"
            columns: ["payment_token_id"]
            isOneToOne: false
            referencedRelation: "payment_tokens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bets_smash_id_fkey"
            columns: ["smash_id"]
            isOneToOne: false
            referencedRelation: "smashes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bets_target_user_id_fkey"
            columns: ["target_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_claims: {
        Row: {
          amount: number
          claim_date: string
          created_at: string | null
          id: string
          proof_id: string | null
          streak_count: number | null
          user_id: string
        }
        Insert: {
          amount?: number
          claim_date?: string
          created_at?: string | null
          id?: string
          proof_id?: string | null
          streak_count?: number | null
          user_id: string
        }
        Update: {
          amount?: number
          claim_date?: string
          created_at?: string | null
          id?: string
          proof_id?: string | null
          streak_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      daily_smashes: {
        Row: {
          challenge_date: string
          created_at: string | null
          difficulty: string | null
          featured_proof_ids: string[] | null
          id: string
          participant_count: number | null
          prompt: string
          smash_id: string
          theme: string | null
        }
        Insert: {
          challenge_date: string
          created_at?: string | null
          difficulty?: string | null
          featured_proof_ids?: string[] | null
          id?: string
          participant_count?: number | null
          prompt: string
          smash_id: string
          theme?: string | null
        }
        Update: {
          challenge_date?: string
          created_at?: string | null
          difficulty?: string | null
          featured_proof_ids?: string[] | null
          id?: string
          participant_count?: number | null
          prompt?: string
          smash_id?: string
          theme?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_smashes_smash_id_fkey"
            columns: ["smash_id"]
            isOneToOne: false
            referencedRelation: "smashes"
            referencedColumns: ["id"]
          },
        ]
      }
      leaderboard_entries: {
        Row: {
          category: string | null
          id: string
          leaderboard_type: string
          period_start: string
          period_type: string
          proofs_submitted: number | null
          proofs_verified: number | null
          rank: number | null
          score: number | null
          smashes_completed: number | null
          smashes_won: number | null
          streak_best: number | null
          streak_current: number | null
          total_active_minutes: number | null
          total_calories: number | null
          total_distance_miles: number | null
          total_earned: number | null
          total_steps: number | null
          updated_at: string | null
          user_id: string
          win_rate: number | null
          workouts_completed: number | null
        }
        Insert: {
          category?: string | null
          id?: string
          leaderboard_type?: string
          period_start: string
          period_type: string
          proofs_submitted?: number | null
          proofs_verified?: number | null
          rank?: number | null
          score?: number | null
          smashes_completed?: number | null
          smashes_won?: number | null
          streak_best?: number | null
          streak_current?: number | null
          total_active_minutes?: number | null
          total_calories?: number | null
          total_distance_miles?: number | null
          total_earned?: number | null
          total_steps?: number | null
          updated_at?: string | null
          user_id: string
          win_rate?: number | null
          workouts_completed?: number | null
        }
        Update: {
          category?: string | null
          id?: string
          leaderboard_type?: string
          period_start?: string
          period_type?: string
          proofs_submitted?: number | null
          proofs_verified?: number | null
          rank?: number | null
          score?: number | null
          smashes_completed?: number | null
          smashes_won?: number | null
          streak_best?: number | null
          streak_current?: number | null
          total_active_minutes?: number | null
          total_calories?: number | null
          total_distance_miles?: number | null
          total_earned?: number | null
          total_steps?: number | null
          updated_at?: string | null
          user_id?: string
          win_rate?: number | null
          workouts_completed?: number | null
        }
        Relationships: []
      }
      payment_tokens: {
        Row: {
          chain_id: number
          contract_address: string | null
          created_at: string | null
          decimals: number
          icon_url: string | null
          id: string
          is_active: boolean | null
          name: string
          symbol: string
        }
        Insert: {
          chain_id: number
          contract_address?: string | null
          created_at?: string | null
          decimals?: number
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          symbol: string
        }
        Update: {
          chain_id?: number
          contract_address?: string | null
          created_at?: string | null
          decimals?: number
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          symbol?: string
        }
        Relationships: []
      }
      payment_transactions: {
        Row: {
          amount: number
          bet_id: string | null
          block_number: number | null
          chain_id: number | null
          confirmed_at: string | null
          created_at: string | null
          id: string
          payment_token_id: string | null
          smash_id: string | null
          status: string | null
          tx_hash: string | null
          tx_type: string
          user_id: string | null
        }
        Insert: {
          amount: number
          bet_id?: string | null
          block_number?: number | null
          chain_id?: number | null
          confirmed_at?: string | null
          created_at?: string | null
          id?: string
          payment_token_id?: string | null
          smash_id?: string | null
          status?: string | null
          tx_hash?: string | null
          tx_type: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          bet_id?: string | null
          block_number?: number | null
          chain_id?: number | null
          confirmed_at?: string | null
          created_at?: string | null
          id?: string
          payment_token_id?: string | null
          smash_id?: string | null
          status?: string | null
          tx_hash?: string | null
          tx_type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_bet_id_fkey"
            columns: ["bet_id"]
            isOneToOne: false
            referencedRelation: "bets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_transactions_payment_token_id_fkey"
            columns: ["payment_token_id"]
            isOneToOne: false
            referencedRelation: "payment_tokens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_transactions_smash_id_fkey"
            columns: ["smash_id"]
            isOneToOne: false
            referencedRelation: "smashes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      proof_submissions: {
        Row: {
          ai_confidence_score: number | null
          ai_verification_notes: string | null
          ai_verified: boolean | null
          ai_verified_at: string | null
          created_at: string | null
          id: string
          proof_metadata: Json | null
          proof_text: string | null
          proof_type: string
          proof_url: string | null
          smash_id: string
          status: string | null
          updated_at: string | null
          user_id: string
          verification_method: string | null
          verification_votes_no: number | null
          verification_votes_yes: number | null
          verified_at: string | null
          wearable_data: Json | null
          wearable_screenshots: string[] | null
          wearable_source: string | null
        }
        Insert: {
          ai_confidence_score?: number | null
          ai_verification_notes?: string | null
          ai_verified?: boolean | null
          ai_verified_at?: string | null
          created_at?: string | null
          id?: string
          proof_metadata?: Json | null
          proof_text?: string | null
          proof_type: string
          proof_url?: string | null
          smash_id: string
          status?: string | null
          updated_at?: string | null
          user_id: string
          verification_method?: string | null
          verification_votes_no?: number | null
          verification_votes_yes?: number | null
          verified_at?: string | null
          wearable_data?: Json | null
          wearable_screenshots?: string[] | null
          wearable_source?: string | null
        }
        Update: {
          ai_confidence_score?: number | null
          ai_verification_notes?: string | null
          ai_verified?: boolean | null
          ai_verified_at?: string | null
          created_at?: string | null
          id?: string
          proof_metadata?: Json | null
          proof_text?: string | null
          proof_type?: string
          proof_url?: string | null
          smash_id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
          verification_method?: string | null
          verification_votes_no?: number | null
          verification_votes_yes?: number | null
          verified_at?: string | null
          wearable_data?: Json | null
          wearable_screenshots?: string[] | null
          wearable_source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "proof_submissions_smash_id_fkey"
            columns: ["smash_id"]
            isOneToOne: false
            referencedRelation: "smashes"
            referencedColumns: ["id"]
          },
        ]
      }
      proof_votes: {
        Row: {
          created_at: string | null
          id: string
          proof_id: string
          vote: boolean
          voter_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          proof_id: string
          vote: boolean
          voter_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          proof_id?: string
          vote?: boolean
          voter_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "proof_votes_proof_id_fkey"
            columns: ["proof_id"]
            isOneToOne: false
            referencedRelation: "proof_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      smash_accepted_tokens: {
        Row: {
          created_at: string | null
          id: string
          payment_token_id: string | null
          smash_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          payment_token_id?: string | null
          smash_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          payment_token_id?: string | null
          smash_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "smash_accepted_tokens_payment_token_id_fkey"
            columns: ["payment_token_id"]
            isOneToOne: false
            referencedRelation: "payment_tokens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "smash_accepted_tokens_smash_id_fkey"
            columns: ["smash_id"]
            isOneToOne: false
            referencedRelation: "smashes"
            referencedColumns: ["id"]
          },
        ]
      }
      smash_mints: {
        Row: {
          contract_address: string | null
          id: string
          image_url: string | null
          metadata_uri: string | null
          minted_at: string | null
          smash_id: string
          token_id: string | null
          tx_hash: string | null
          user_id: string
        }
        Insert: {
          contract_address?: string | null
          id?: string
          image_url?: string | null
          metadata_uri?: string | null
          minted_at?: string | null
          smash_id: string
          token_id?: string | null
          tx_hash?: string | null
          user_id: string
        }
        Update: {
          contract_address?: string | null
          id?: string
          image_url?: string | null
          metadata_uri?: string | null
          minted_at?: string | null
          smash_id?: string
          token_id?: string | null
          tx_hash?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "smash_mints_smash_id_fkey"
            columns: ["smash_id"]
            isOneToOne: false
            referencedRelation: "smashes"
            referencedColumns: ["id"]
          },
        ]
      }
      smash_participants: {
        Row: {
          entry_paid: boolean | null
          entry_tx_hash: string | null
          final_rank: number | null
          id: string
          joined_at: string | null
          payout_amount: number | null
          payout_tx_hash: string | null
          smash_id: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          entry_paid?: boolean | null
          entry_tx_hash?: string | null
          final_rank?: number | null
          id?: string
          joined_at?: string | null
          payout_amount?: number | null
          payout_tx_hash?: string | null
          smash_id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          entry_paid?: boolean | null
          entry_tx_hash?: string | null
          final_rank?: number | null
          id?: string
          joined_at?: string | null
          payout_amount?: number | null
          payout_tx_hash?: string | null
          smash_id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "smash_participants_smash_id_fkey"
            columns: ["smash_id"]
            isOneToOne: false
            referencedRelation: "smashes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "smash_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      smash_squares: {
        Row: {
          avatar_url: string | null
          base_name: string | null
          created_at: string | null
          display_name: string | null
          farcaster_fid: number | null
          farcaster_username: string | null
          id: string
          is_winner: boolean | null
          payment_token: string | null
          payout_amount: number | null
          payout_tx_hash: string | null
          price_paid: number | null
          purchase_tx_hash: string | null
          purchased_at: string | null
          smash_id: string
          square_number: number
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          base_name?: string | null
          created_at?: string | null
          display_name?: string | null
          farcaster_fid?: number | null
          farcaster_username?: string | null
          id?: string
          is_winner?: boolean | null
          payment_token?: string | null
          payout_amount?: number | null
          payout_tx_hash?: string | null
          price_paid?: number | null
          purchase_tx_hash?: string | null
          purchased_at?: string | null
          smash_id: string
          square_number: number
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          base_name?: string | null
          created_at?: string | null
          display_name?: string | null
          farcaster_fid?: number | null
          farcaster_username?: string | null
          id?: string
          is_winner?: boolean | null
          payment_token?: string | null
          payout_amount?: number | null
          payout_tx_hash?: string | null
          price_paid?: number | null
          purchase_tx_hash?: string | null
          purchased_at?: string | null
          smash_id?: string
          square_number?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "smash_squares_smash_id_fkey"
            columns: ["smash_id"]
            isOneToOne: false
            referencedRelation: "smashes"
            referencedColumns: ["id"]
          },
        ]
      }
      smashes: {
        Row: {
          betting_enabled: boolean | null
          category: string
          challenge_cadence: string | null
          challenge_series_id: string | null
          close_time: string | null
          consensus_threshold: number | null
          cover_image: string | null
          cover_image_url: string | null
          created_at: string | null
          creator_id: string | null
          description: string | null
          dispute_window_hours: number | null
          editor_notes: string | null
          end_time: string | null
          ends_at: string | null
          entry_fee: number | null
          entry_token: string | null
          farcaster_cast_hash: string | null
          id: string
          invite_code: string | null
          is_platform_challenge: boolean | null
          max_participants: number | null
          min_participants: number | null
          payment_token: string | null
          payment_token_id: string | null
          payout_distributed: boolean | null
          payout_tx_hash: string | null
          payout_type: string | null
          prize_description: string | null
          prize_pool: number | null
          proof_type: string | null
          requires_wearable: boolean | null
          rules: string | null
          smash_mode: string | null
          sponsor: string | null
          square_price: number | null
          squares_sold: number | null
          stakes_type: string | null
          start_time: string | null
          starts_at: string | null
          status: string | null
          title: string
          total_pool_eth: string | null
          total_pool_usdc: string | null
          total_squares: number | null
          updated_at: string | null
          vault_smash_id: string | null
          verification_method: string | null
          verification_type: string | null
          visibility: string | null
        }
        Insert: {
          betting_enabled?: boolean | null
          category: string
          challenge_cadence?: string | null
          challenge_series_id?: string | null
          close_time?: string | null
          consensus_threshold?: number | null
          cover_image?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          dispute_window_hours?: number | null
          editor_notes?: string | null
          end_time?: string | null
          ends_at?: string | null
          entry_fee?: number | null
          entry_token?: string | null
          farcaster_cast_hash?: string | null
          id?: string
          invite_code?: string | null
          is_platform_challenge?: boolean | null
          max_participants?: number | null
          min_participants?: number | null
          payment_token?: string | null
          payment_token_id?: string | null
          payout_distributed?: boolean | null
          payout_tx_hash?: string | null
          payout_type?: string | null
          prize_description?: string | null
          prize_pool?: number | null
          proof_type?: string | null
          requires_wearable?: boolean | null
          rules?: string | null
          smash_mode?: string | null
          sponsor?: string | null
          square_price?: number | null
          squares_sold?: number | null
          stakes_type?: string | null
          start_time?: string | null
          starts_at?: string | null
          status?: string | null
          title: string
          total_pool_eth?: string | null
          total_pool_usdc?: string | null
          total_squares?: number | null
          updated_at?: string | null
          vault_smash_id?: string | null
          verification_method?: string | null
          verification_type?: string | null
          visibility?: string | null
        }
        Update: {
          betting_enabled?: boolean | null
          category?: string
          challenge_cadence?: string | null
          challenge_series_id?: string | null
          close_time?: string | null
          consensus_threshold?: number | null
          cover_image?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          dispute_window_hours?: number | null
          editor_notes?: string | null
          end_time?: string | null
          ends_at?: string | null
          entry_fee?: number | null
          entry_token?: string | null
          farcaster_cast_hash?: string | null
          id?: string
          invite_code?: string | null
          is_platform_challenge?: boolean | null
          max_participants?: number | null
          min_participants?: number | null
          payment_token?: string | null
          payment_token_id?: string | null
          payout_distributed?: boolean | null
          payout_tx_hash?: string | null
          payout_type?: string | null
          prize_description?: string | null
          prize_pool?: number | null
          proof_type?: string | null
          requires_wearable?: boolean | null
          rules?: string | null
          smash_mode?: string | null
          sponsor?: string | null
          square_price?: number | null
          squares_sold?: number | null
          stakes_type?: string | null
          start_time?: string | null
          starts_at?: string | null
          status?: string | null
          title?: string
          total_pool_eth?: string | null
          total_pool_usdc?: string | null
          total_squares?: number | null
          updated_at?: string | null
          vault_smash_id?: string | null
          verification_method?: string | null
          verification_type?: string | null
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "smashes_payment_token_id_fkey"
            columns: ["payment_token_id"]
            isOneToOne: false
            referencedRelation: "payment_tokens"
            referencedColumns: ["id"]
          },
        ]
      }
      staking_positions: {
        Row: {
          amount: number
          id: string
          lock_until: string | null
          rewards_earned: number | null
          staked_at: string | null
          status: string | null
          tx_hash: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          id?: string
          lock_until?: string | null
          rewards_earned?: number | null
          staked_at?: string | null
          status?: string | null
          tx_hash?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          id?: string
          lock_until?: string | null
          rewards_earned?: number | null
          staked_at?: string | null
          status?: string | null
          tx_hash?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      submissions: {
        Row: {
          content_text: string | null
          content_type: string
          content_url: string | null
          downvotes: number | null
          id: string
          smash_id: string | null
          submitted_at: string | null
          upvotes: number | null
          user_id: string | null
          verification_status: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          content_text?: string | null
          content_type: string
          content_url?: string | null
          downvotes?: number | null
          id?: string
          smash_id?: string | null
          submitted_at?: string | null
          upvotes?: number | null
          user_id?: string | null
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          content_text?: string | null
          content_type?: string
          content_url?: string | null
          downvotes?: number | null
          id?: string
          smash_id?: string | null
          submitted_at?: string | null
          upvotes?: number | null
          user_id?: string | null
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "submissions_smash_id_fkey"
            columns: ["smash_id"]
            isOneToOne: false
            referencedRelation: "smashes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      token_balances: {
        Row: {
          balance: number | null
          id: string
          pending_rewards: number | null
          staked_balance: number | null
          token_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          balance?: number | null
          id?: string
          pending_rewards?: number | null
          staked_balance?: number | null
          token_type?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          balance?: number | null
          id?: string
          pending_rewards?: number | null
          staked_balance?: number | null
          token_type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      token_transactions: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          metadata: Json | null
          related_smash_id: string | null
          related_user_id: string | null
          status: string | null
          token_type: string | null
          transaction_type: string
          tx_hash: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          metadata?: Json | null
          related_smash_id?: string | null
          related_user_id?: string | null
          status?: string | null
          token_type?: string | null
          transaction_type: string
          tx_hash?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          metadata?: Json | null
          related_smash_id?: string | null
          related_user_id?: string | null
          status?: string | null
          token_type?: string | null
          transaction_type?: string
          tx_hash?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "token_transactions_related_smash_id_fkey"
            columns: ["related_smash_id"]
            isOneToOne: false
            referencedRelation: "smashes"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          base_name: string | null
          best_streak: number | null
          bio: string | null
          created_at: string | null
          current_streak: number | null
          display_name: string | null
          ens_name: string | null
          farcaster_fid: number | null
          farcaster_username: string | null
          id: string
          is_verified: boolean | null
          reputation_score: number | null
          total_earned: number | null
          total_earnings: number | null
          total_smashes_created: number | null
          total_smashes_joined: number | null
          total_smashes_won: number | null
          updated_at: string | null
          username: string | null
          wallet_address: string
          wearable_opt_in: boolean | null
          wearable_sources: string[] | null
        }
        Insert: {
          avatar_url?: string | null
          base_name?: string | null
          best_streak?: number | null
          bio?: string | null
          created_at?: string | null
          current_streak?: number | null
          display_name?: string | null
          ens_name?: string | null
          farcaster_fid?: number | null
          farcaster_username?: string | null
          id?: string
          is_verified?: boolean | null
          reputation_score?: number | null
          total_earned?: number | null
          total_earnings?: number | null
          total_smashes_created?: number | null
          total_smashes_joined?: number | null
          total_smashes_won?: number | null
          updated_at?: string | null
          username?: string | null
          wallet_address: string
          wearable_opt_in?: boolean | null
          wearable_sources?: string[] | null
        }
        Update: {
          avatar_url?: string | null
          base_name?: string | null
          best_streak?: number | null
          bio?: string | null
          created_at?: string | null
          current_streak?: number | null
          display_name?: string | null
          ens_name?: string | null
          farcaster_fid?: number | null
          farcaster_username?: string | null
          id?: string
          is_verified?: boolean | null
          reputation_score?: number | null
          total_earned?: number | null
          total_earnings?: number | null
          total_smashes_created?: number | null
          total_smashes_joined?: number | null
          total_smashes_won?: number | null
          updated_at?: string | null
          username?: string | null
          wallet_address?: string
          wearable_opt_in?: boolean | null
          wearable_sources?: string[] | null
        }
        Relationships: []
      }
      wearable_connections: {
        Row: {
          access_token: string | null
          connection_status: string | null
          created_at: string | null
          id: string
          last_sync_at: string | null
          opt_in_level: string | null
          permissions: Json | null
          refresh_token: string | null
          source: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token?: string | null
          connection_status?: string | null
          created_at?: string | null
          id?: string
          last_sync_at?: string | null
          opt_in_level?: string | null
          permissions?: Json | null
          refresh_token?: string | null
          source: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string | null
          connection_status?: string | null
          created_at?: string | null
          id?: string
          last_sync_at?: string | null
          opt_in_level?: string | null
          permissions?: Json | null
          refresh_token?: string | null
          source?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      wearable_snapshots: {
        Row: {
          created_at: string | null
          data_type: string
          id: string
          metrics: Json
          screenshot_urls: string[] | null
          snapshot_date: string
          source: string
          user_id: string
          verified_by_ai: boolean | null
        }
        Insert: {
          created_at?: string | null
          data_type: string
          id?: string
          metrics: Json
          screenshot_urls?: string[] | null
          snapshot_date: string
          source: string
          user_id: string
          verified_by_ai?: boolean | null
        }
        Update: {
          created_at?: string | null
          data_type?: string
          id?: string
          metrics?: Json
          screenshot_urls?: string[] | null
          snapshot_date?: string
          source?: string
          user_id?: string
          verified_by_ai?: boolean | null
        }
        Relationships: []
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

// ============================================
// Convenience types for Row (read) operations
// Prefixed with "Db" to distinguish from frontend types in @/types
// ============================================

export type DbUser = Database['public']['Tables']['users']['Row']
export type DbSmash = Database['public']['Tables']['smashes']['Row']
export type DbSubmission = Database['public']['Tables']['submissions']['Row']
export type DbBet = Database['public']['Tables']['bets']['Row']
export type DbProofSubmission = Database['public']['Tables']['proof_submissions']['Row']
export type DbSmashParticipant = Database['public']['Tables']['smash_participants']['Row']
export type DbSmashSquare = Database['public']['Tables']['smash_squares']['Row']
export type DbDailySmash = Database['public']['Tables']['daily_smashes']['Row']
export type DbDailyClaim = Database['public']['Tables']['daily_claims']['Row']
export type DbLeaderboardEntry = Database['public']['Tables']['leaderboard_entries']['Row']
export type DbTokenBalance = Database['public']['Tables']['token_balances']['Row']
export type DbTokenTransaction = Database['public']['Tables']['token_transactions']['Row']
export type DbStakingPosition = Database['public']['Tables']['staking_positions']['Row']
export type DbSmashMint = Database['public']['Tables']['smash_mints']['Row']
export type DbProofVote = Database['public']['Tables']['proof_votes']['Row']
export type DbWearableConnection = Database['public']['Tables']['wearable_connections']['Row']
export type DbWearableSnapshot = Database['public']['Tables']['wearable_snapshots']['Row']
export type DbPaymentToken = Database['public']['Tables']['payment_tokens']['Row']
export type DbPaymentTransaction = Database['public']['Tables']['payment_transactions']['Row']
export type DbSmashAcceptedToken = Database['public']['Tables']['smash_accepted_tokens']['Row']
export type DbAiVerificationLog = Database['public']['Tables']['ai_verification_log']['Row']

// ============================================
// Convenience types for Insert operations
// ============================================

export type NewUser = Database['public']['Tables']['users']['Insert']
export type NewSmash = Database['public']['Tables']['smashes']['Insert']
export type NewSubmission = Database['public']['Tables']['submissions']['Insert']
export type NewBet = Database['public']['Tables']['bets']['Insert']
export type NewProofSubmission = Database['public']['Tables']['proof_submissions']['Insert']
export type NewSmashParticipant = Database['public']['Tables']['smash_participants']['Insert']
export type NewSmashSquare = Database['public']['Tables']['smash_squares']['Insert']
export type NewDailyClaim = Database['public']['Tables']['daily_claims']['Insert']
export type NewTokenTransaction = Database['public']['Tables']['token_transactions']['Insert']
export type NewProofVote = Database['public']['Tables']['proof_votes']['Insert']
export type NewPaymentTransaction = Database['public']['Tables']['payment_transactions']['Insert']

// ============================================
// Status types
// ============================================

export type SmashMode = 'pool' | 'free' | 'daily'
export type SmashLifecycleStatus = 'open' | 'closed' | 'active' | 'judging' | 'payout' | 'completed'
export type ParticipantStatus = 'active' | 'withdrawn' | 'completed' | 'failed'
export type ProofStatus = 'pending' | 'ai_reviewing' | 'verified' | 'rejected' | 'disputed' | 'needs_review'
export type VerificationMethodDb = 'community' | 'ai' | 'ai_wearable' | 'creator' | 'oracle'
export type PayoutType = 'winner_take_all' | 'top_3' | 'proportional' | 'custom'
export type WearableSource = 'apple_health' | 'strava' | 'garmin' | 'fitbit' | 'whoop' | 'google_fit'
export type WearableOptInLevel = 'screenshots' | 'metrics' | 'connected'
