import { supabase } from './supabase';
import type {
  DbSmash,
  DbSubmission,
  DbUser,
  DbSmashParticipant,
  ParticipantStatus,
} from '@/types/database.types';
import type { Smash, SmashCategory, SmashStatus, VerificationMethod, SmashSubmission, User } from '@/types';
import { DEFAULT_MAX_PARTICIPANTS } from './constants';

// Transform database smash to frontend smash type
export function transformSmash(dbSmash: DbSmash): Smash {
  return {
    id: dbSmash.id,
    title: dbSmash.title,
    description: dbSmash.description || '',
    category: (dbSmash.category as SmashCategory) || 'other',
    status: (dbSmash.status as SmashStatus) || 'draft',
    entryFee: dbSmash.entry_fee || 0,
    prizePool: dbSmash.prize_pool || 0,
    stakesType: (dbSmash.stakes_type as 'monetary' | 'prize' | 'bragging') || 'monetary',
    creatorId: dbSmash.creator_id || '',
    participants: [], // Will be populated separately if needed
    maxParticipants: dbSmash.max_participants || DEFAULT_MAX_PARTICIPANTS,
    createdAt: dbSmash.created_at ? new Date(dbSmash.created_at) : new Date(),
    startsAt: dbSmash.starts_at ? new Date(dbSmash.starts_at) : new Date(),
    endsAt: dbSmash.ends_at ? new Date(dbSmash.ends_at) : new Date(),
    verificationMethod: (dbSmash.verification_method as VerificationMethod) || 'visual',
    proofRequirements: [], // Could be stored in a separate field or table
    bettingEnabled: dbSmash.betting_enabled ?? false,
    imageUrl: dbSmash.cover_image_url || undefined,
    tags: [], // Could be stored in a separate field or table
  };
}

// Fetch all public smashes
export async function getSmashes(options?: {
  category?: SmashCategory;
  status?: SmashStatus;
  limit?: number;
}) {
  let query = supabase
    .from('smashes')
    .select('*')
    .eq('visibility', 'public')
    .order('created_at', { ascending: false });

  if (options?.category) {
    query = query.eq('category', options.category);
  }

  if (options?.status) {
    query = query.eq('status', options.status);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching smashes:', error);
    throw error;
  }

  return (data || []).map(transformSmash);
}

// Fetch a single smash by ID
export async function getSmashById(id: string) {
  const { data, error } = await supabase
    .from('smashes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    console.error('Error fetching smash:', error);
    throw error;
  }

  return transformSmash(data);
}

// Fetch active smashes (for homepage)
export async function getActiveSmashes(limit = 12) {
  return getSmashes({ status: 'active', limit });
}

// Fetch smashes by creator
export async function getSmashesByCreator(creatorId: string) {
  const { data, error } = await supabase
    .from('smashes')
    .select('*')
    .eq('creator_id', creatorId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user smashes:', error);
    throw error;
  }

  return (data || []).map(transformSmash);
}

// Transform database submission to frontend submission type
export function transformSubmission(dbSubmission: DbSubmission): SmashSubmission {
  return {
    id: dbSubmission.id,
    smashId: dbSubmission.smash_id || '',
    participantId: dbSubmission.user_id || '',
    proofUrl: dbSubmission.content_url || '',
    proofType: (dbSubmission.content_type as SmashSubmission['proofType']) || 'photo',
    submittedAt: dbSubmission.submitted_at ? new Date(dbSubmission.submitted_at) : new Date(),
    verified: dbSubmission.verification_status === 'verified',
  };
}

// Fetch submissions for a smash
export async function getSubmissionsForSmash(smashId: string) {
  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .eq('smash_id', smashId)
    .order('submitted_at', { ascending: false });

  if (error) {
    console.error('Error fetching submissions:', error);
    throw error;
  }

  return (data || []).map(transformSubmission);
}

// Fetch submissions by user
export async function getSubmissionsByUser(userId: string) {
  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .eq('user_id', userId)
    .order('submitted_at', { ascending: false });

  if (error) {
    console.error('Error fetching user submissions:', error);
    throw error;
  }

  return (data || []).map(transformSubmission);
}

// Transform database user to frontend user type
export function transformUser(dbUser: DbUser, stats?: UserStats): User {
  return {
    id: dbUser.id,
    address: dbUser.wallet_address,
    username: dbUser.username || undefined,
    avatarUrl: dbUser.avatar_url || undefined,
    smashesCreated: stats?.smashesCreated || dbUser.total_smashes_created || 0,
    smashesJoined: stats?.smashesJoined || dbUser.total_smashes_joined || 0,
    smashesWon: stats?.smashesWon || dbUser.total_smashes_won || 0,
    totalWinnings: stats?.totalWinnings || 0,
    reputationScore: dbUser.reputation_score ?? 0,
    verifiedIdentity: dbUser.is_verified ?? false,
  };
}

interface UserStats {
  smashesCreated: number;
  smashesJoined: number;
  smashesWon: number;
  totalWinnings: number;
}

// Fetch user by wallet address
export async function getUserByAddress(address: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('wallet_address', address)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    console.error('Error fetching user:', error);
    throw error;
  }

  return transformUser(data);
}

// ============================================
// Participant Functions (now uses smash_participants)
// ============================================

export interface SmashParticipantFrontend {
  id: string;
  smashId: string;
  userId: string;
  joinedAt: Date;
  status: ParticipantStatus;
}

// Transform database participant to frontend type
export function transformParticipant(dbParticipant: DbSmashParticipant): SmashParticipantFrontend {
  return {
    id: dbParticipant.id,
    smashId: dbParticipant.smash_id || '',
    userId: dbParticipant.user_id || '',
    joinedAt: new Date(dbParticipant.joined_at || Date.now()),
    status: (dbParticipant.status as ParticipantStatus) || 'active',
  };
}

// Get participants for a smash
export async function getParticipantsForSmash(smashId: string): Promise<SmashParticipantFrontend[]> {
  const { data, error } = await supabase
    .from('smash_participants')
    .select('*')
    .eq('smash_id', smashId)
    .order('joined_at', { ascending: true });

  if (error) {
    console.error('Error fetching participants:', error);
    throw error;
  }

  return (data || []).map(transformParticipant);
}

// Check if user has joined a smash
export async function hasUserJoinedSmash(smashId: string, userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('smash_participants')
    .select('id')
    .eq('smash_id', smashId)
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return false; // Not found
    }
    console.error('Error checking participation:', error);
    throw error;
  }

  return !!data;
}

// Get participant count for a smash
export async function getParticipantCount(smashId: string): Promise<number> {
  const { count, error } = await supabase
    .from('smash_participants')
    .select('*', { count: 'exact', head: true })
    .eq('smash_id', smashId);

  if (error) {
    console.error('Error counting participants:', error);
    throw error;
  }

  return count || 0;
}

// ============================================
// Payment Token Functions
// ============================================

export interface AcceptedToken {
  symbol: 'ETH' | 'USDC';
  name: string;
  decimals: number;
  contractAddress: string | null;
}

// Type for the joined query result
type SmashTokenWithPayment = {
  payment_token_id: string;
  payment_tokens: {
    symbol: string;
    name: string;
    decimals: number;
    contract_address: string | null;
  } | null;
};

// Get accepted payment tokens for a smash
export async function getAcceptedTokensForSmash(smashId: string): Promise<AcceptedToken[]> {
  const { data, error } = await supabase
    .from('smash_accepted_tokens')
    .select(`
      payment_token_id,
      payment_tokens (
        symbol,
        name,
        decimals,
        contract_address
      )
    `)
    .eq('smash_id', smashId)
    .returns<SmashTokenWithPayment[]>();

  if (error) {
    console.error('Error fetching accepted tokens:', error);
    throw error;
  }

  if (!data || data.length === 0) {
    return [];
  }

  return data
    .filter((row) => row.payment_tokens)
    .map((row) => {
      const token = row.payment_tokens!;
      return {
        symbol: token.symbol as 'ETH' | 'USDC',
        name: token.name,
        decimals: token.decimals,
        contractAddress: token.contract_address,
      };
    });
}
