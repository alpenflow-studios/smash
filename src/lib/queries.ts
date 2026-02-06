import { supabase } from './supabase';
import type { Smash as DbSmash, Submission, NewSubmission, User as DbUser, Participant, NewParticipant } from './database.types';
import type { Smash, SmashCategory, SmashStatus, VerificationMethod, SmashSubmission, User } from '@/types';

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
    maxParticipants: dbSmash.max_participants || 100,
    createdAt: new Date(dbSmash.created_at),
    startsAt: dbSmash.starts_at ? new Date(dbSmash.starts_at) : new Date(),
    endsAt: dbSmash.ends_at ? new Date(dbSmash.ends_at) : new Date(),
    verificationMethod: (dbSmash.verification_method as VerificationMethod) || 'visual',
    proofRequirements: [], // Could be stored in a separate field or table
    bettingEnabled: dbSmash.betting_enabled,
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
export function transformSubmission(dbSubmission: Submission): SmashSubmission {
  return {
    id: dbSubmission.id,
    smashId: dbSubmission.smash_id || '',
    participantId: dbSubmission.user_id || '',
    proofUrl: dbSubmission.proof_url,
    proofType: (dbSubmission.proof_type as SmashSubmission['proofType']) || 'photo',
    submittedAt: new Date(dbSubmission.submitted_at),
    verified: dbSubmission.verified,
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

// Upload proof file to Supabase Storage
export async function uploadProofFile(
  file: File,
  smashId: string,
  userId: string
): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${smashId}/${userId}/${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('smash-proofs')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    console.error('Error uploading proof:', uploadError);
    throw uploadError;
  }

  const { data: urlData } = supabase.storage
    .from('smash-proofs')
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}

// Create a new submission record
export async function createSubmission(submission: NewSubmission) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('submissions')
    .insert(submission)
    .select()
    .single();

  if (error) {
    console.error('Error creating submission:', error);
    throw error;
  }

  return transformSubmission(data as Submission);
}

// Submit proof (upload file + create record)
export async function submitProof(
  file: File,
  smashId: string,
  userId: string,
  proofType: 'photo' | 'video' | 'gps' | 'document'
) {
  // Upload the file first
  const proofUrl = await uploadProofFile(file, smashId, userId);

  // Create the submission record
  const submission = await createSubmission({
    smash_id: smashId,
    user_id: userId,
    proof_url: proofUrl,
    proof_type: proofType,
  });

  return submission;
}

// Transform database user to frontend user type
export function transformUser(dbUser: DbUser, stats?: UserStats): User {
  return {
    id: dbUser.id,
    address: dbUser.wallet_address,
    username: dbUser.username || undefined,
    avatarUrl: dbUser.avatar_url || undefined,
    smashesCreated: stats?.smashesCreated || 0,
    smashesJoined: stats?.smashesJoined || 0,
    smashesWon: stats?.smashesWon || 0,
    totalWinnings: stats?.totalWinnings || 0,
    reputationScore: dbUser.reputation_score,
    verifiedIdentity: false,
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

  // Fetch stats
  const stats = await getUserStats(address);

  return transformUser(data, stats);
}

// Fetch user stats (smashes created, joined, won, etc.)
export async function getUserStats(address: string): Promise<UserStats> {
  // Count smashes created
  const { count: createdCount } = await supabase
    .from('smashes')
    .select('*', { count: 'exact', head: true })
    .eq('creator_id', address);

  // Count submissions (proxy for joined smashes)
  const { count: joinedCount } = await supabase
    .from('submissions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', address);

  // Count verified submissions (proxy for wins)
  const { count: wonCount } = await supabase
    .from('submissions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', address)
    .eq('verified', true);

  return {
    smashesCreated: createdCount || 0,
    smashesJoined: joinedCount || 0,
    smashesWon: wonCount || 0,
    totalWinnings: 0, // Would need to calculate from completed smashes
  };
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

// Get or create user by wallet address
export async function getOrCreateUser(address: string, username?: string) {
  // Try to fetch existing user
  const existing = await getUserByAddress(address);
  if (existing) {
    return existing;
  }

  // Create new user
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('users')
    .insert({
      wallet_address: address,
      username: username || null,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating user:', error);
    throw error;
  }

  return transformUser(data as DbUser);
}

// ============================================
// Participant Functions
// ============================================

export interface SmashParticipant {
  id: string;
  smashId: string;
  userId: string;
  joinedAt: Date;
  status: 'active' | 'withdrawn' | 'completed' | 'failed';
}

// Transform database participant to frontend type
export function transformParticipant(dbParticipant: Participant): SmashParticipant {
  return {
    id: dbParticipant.id,
    smashId: dbParticipant.smash_id,
    userId: dbParticipant.user_id,
    joinedAt: new Date(dbParticipant.joined_at),
    status: dbParticipant.status as SmashParticipant['status'],
  };
}

// Get participants for a smash
export async function getParticipantsForSmash(smashId: string): Promise<SmashParticipant[]> {
  const { data, error } = await supabase
    .from('participants')
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
    .from('participants')
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

// Join a smash
export async function joinSmash(smashId: string, userId: string): Promise<SmashParticipant> {
  // Check if already joined
  const alreadyJoined = await hasUserJoinedSmash(smashId, userId);
  if (alreadyJoined) {
    throw new Error('You have already joined this smash');
  }

  // Ensure user exists in users table
  await getOrCreateUser(userId);

  // Create participant record
  const participantData: NewParticipant = {
    smash_id: smashId,
    user_id: userId,
    status: 'active',
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('participants')
    .insert(participantData)
    .select()
    .single();

  if (error) {
    console.error('Error joining smash:', error);
    throw error;
  }

  return transformParticipant(data as Participant);
}

// Join a smash with payment (records tx hash)
export async function joinSmashWithPayment(
  smashId: string,
  userId: string,
  txHash: string,
  tokenSymbol: 'ETH' | 'USDC',
  amount: string
): Promise<SmashParticipant> {
  // Check if already joined
  const alreadyJoined = await hasUserJoinedSmash(smashId, userId);
  if (alreadyJoined) {
    throw new Error('You have already joined this smash');
  }

  // Ensure user exists
  await getOrCreateUser(userId);

  // Get token ID from payment_tokens table
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: tokenData, error: tokenError } = await (supabase as any)
    .from('payment_tokens')
    .select('id')
    .eq('symbol', tokenSymbol)
    .single();

  if (tokenError || !tokenData) {
    console.error('Error finding token:', tokenError);
    throw new Error(`Token ${tokenSymbol} not found`);
  }

  // Create payment transaction record
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: txData, error: txError } = await (supabase as any)
    .from('payment_transactions')
    .insert({
      smash_id: smashId,
      user_id: userId,
      token_id: tokenData.id,
      amount,
      tx_hash: txHash,
      tx_type: 'entry',
      status: 'confirmed',
    })
    .select()
    .single();

  if (txError) {
    console.error('Error recording payment:', txError);
    throw txError;
  }

  // Create participant record with payment reference
  const participantData = {
    smash_id: smashId,
    user_id: userId,
    status: 'active',
    payment_tx_id: txData.id,
    paid_token_id: tokenData.id,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('participants')
    .insert(participantData)
    .select()
    .single();

  if (error) {
    console.error('Error joining smash:', error);
    throw error;
  }

  return transformParticipant(data as Participant);
}

// Leave/withdraw from a smash
export async function leaveSmash(smashId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('participants')
    .delete()
    .eq('smash_id', smashId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error leaving smash:', error);
    throw error;
  }
}

// Get participant count for a smash
export async function getParticipantCount(smashId: string): Promise<number> {
  const { count, error } = await supabase
    .from('participants')
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

// Get accepted payment tokens for a smash
export async function getAcceptedTokensForSmash(smashId: string): Promise<AcceptedToken[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('smash_accepted_tokens')
    .select(`
      token_id,
      payment_tokens (
        symbol,
        name,
        decimals,
        contract_address
      )
    `)
    .eq('smash_id', smashId);

  if (error) {
    console.error('Error fetching accepted tokens:', error);
    throw error;
  }

  if (!data || data.length === 0) {
    return [];
  }

  type TokenRow = {
    token_id: string;
    payment_tokens: {
      symbol: string;
      name: string;
      decimals: number;
      contract_address: string | null;
    } | null;
  };

  return (data as TokenRow[])
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
