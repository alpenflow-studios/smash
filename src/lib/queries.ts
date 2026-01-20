import { supabase } from './supabase';
import type { Smash as DbSmash, Submission, NewSubmission, User as DbUser } from './database.types';
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
