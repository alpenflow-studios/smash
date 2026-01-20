export type SmashCategory = 'fitness' | 'gaming' | 'creative' | 'social' | 'other';

export type SmashStatus = 'draft' | 'open' | 'active' | 'verification' | 'complete' | 'disputed';

export type VerificationMethod = 'wearable' | 'visual' | 'participant' | 'audience' | 'hybrid';

export type Visibility = 'public' | 'private';

export type StakesType = 'monetary' | 'prize' | 'bragging';

export interface Smash {
  id: string;
  title: string;
  description: string;
  category: SmashCategory;
  status: SmashStatus;
  
  // Stakes
  entryFee: number; // in USDC
  prizePool: number;
  
  // Participants
  creatorId: string;
  participants: string[]; // wallet addresses
  maxParticipants: number;
  
  // Timing
  createdAt: Date;
  startsAt: Date;
  endsAt: Date;
  
  // Verification
  verificationMethod: VerificationMethod;
  proofRequirements: string[];
  
  // Prediction market
  bettingEnabled: boolean;
  
  // Metadata
  imageUrl?: string;
  tags: string[];
}

export interface SmashSubmission {
  id: string;
  smashId: string;
  participantId: string;
  proofUrl: string; // IPFS hash
  proofType: 'photo' | 'video' | 'gps' | 'document';
  submittedAt: Date;
  verified: boolean;
  verifiedAt?: Date;
}

export interface User {
  id: string;
  address: string;
  username?: string;
  avatarUrl?: string;
  
  // Stats
  smashesCreated: number;
  smashesJoined: number;
  smashesWon: number;
  totalWinnings: number;
  
  // Reputation
  reputationScore: number;
  verifiedIdentity: boolean;
}