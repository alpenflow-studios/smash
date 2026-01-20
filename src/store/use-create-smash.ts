import { create } from 'zustand';
import type { SmashCategory, Visibility, StakesType, VerificationMethod } from '@/types';

// Re-export types for components that import from this file
export type { SmashCategory, Visibility, StakesType, VerificationMethod };

export interface CreateSmashState {
  // Current step
  currentStep: number;
  
  // Step 1: Basics
  title: string;
  description: string;
  category: SmashCategory;
  coverImage: File | null;
  coverImagePreview: string | null;
  
  // Step 2: Visibility & Stakes
  visibility: Visibility;
  stakesType: StakesType;
  entryFee: number;
  prizeDescription: string;
  
  // Step 3: Participants
  minParticipants: number;
  maxParticipants: number | null;
  inviteList: string[];
  
  // Step 4: Timeline
  startsAt: Date | null;
  endsAt: Date | null;
  verificationWindowHours: number;
  
  // Step 5: Verification
  verificationMethod: VerificationMethod;
  consensusThreshold: number;
  disputeWindowHours: number;
  
  // Step 6: Prediction Market
  bettingEnabled: boolean;
  
  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  
  // Setters
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setCategory: (category: SmashCategory) => void;
  setCoverImage: (file: File | null, preview: string | null) => void;
  
  setVisibility: (visibility: Visibility) => void;
  setStakesType: (type: StakesType) => void;
  setEntryFee: (fee: number) => void;
  setPrizeDescription: (desc: string) => void;
  
  setMinParticipants: (min: number) => void;
  setMaxParticipants: (max: number | null) => void;
  addToInviteList: (address: string) => void;
  removeFromInviteList: (address: string) => void;
  
  setStartsAt: (date: Date | null) => void;
  setEndsAt: (date: Date | null) => void;
  setVerificationWindowHours: (hours: number) => void;
  
  setVerificationMethod: (method: VerificationMethod) => void;
  setConsensusThreshold: (threshold: number) => void;
  setDisputeWindowHours: (hours: number) => void;
  
  setBettingEnabled: (enabled: boolean) => void;
  
  reset: () => void;
}

const initialState = {
  currentStep: 1,
  title: '',
  description: '',
  category: 'fitness' as SmashCategory,
  coverImage: null,
  coverImagePreview: null,
  visibility: 'public' as Visibility,
  stakesType: 'monetary' as StakesType,
  entryFee: 10,
  prizeDescription: '',
  minParticipants: 2,
  maxParticipants: null,
  inviteList: [],
  startsAt: null,
  endsAt: null,
  verificationWindowHours: 24,
  verificationMethod: 'visual' as VerificationMethod,
  consensusThreshold: 100,
  disputeWindowHours: 24,
  bettingEnabled: false,
};

export const useCreateSmash = create<CreateSmashState>((set) => ({
  ...initialState,
  
  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 7) })),
  prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),
  
  setTitle: (title) => set({ title }),
  setDescription: (description) => set({ description }),
  setCategory: (category) => set({ category }),
  setCoverImage: (file, preview) => set({ coverImage: file, coverImagePreview: preview }),
  
  setVisibility: (visibility) => set({ visibility }),
  setStakesType: (type) => set({ stakesType: type }),
  setEntryFee: (fee) => set({ entryFee: fee }),
  setPrizeDescription: (desc) => set({ prizeDescription: desc }),
  
  setMinParticipants: (min) => set({ minParticipants: min }),
  setMaxParticipants: (max) => set({ maxParticipants: max }),
  addToInviteList: (address) => set((state) => ({ 
    inviteList: [...state.inviteList, address] 
  })),
  removeFromInviteList: (address) => set((state) => ({ 
    inviteList: state.inviteList.filter((a) => a !== address) 
  })),
  
  setStartsAt: (date) => set({ startsAt: date }),
  setEndsAt: (date) => set({ endsAt: date }),
  setVerificationWindowHours: (hours) => set({ verificationWindowHours: hours }),
  
  setVerificationMethod: (method) => set({ verificationMethod: method }),
  setConsensusThreshold: (threshold) => set({ consensusThreshold: threshold }),
  setDisputeWindowHours: (hours) => set({ disputeWindowHours: hours }),
  
  setBettingEnabled: (enabled) => set({ bettingEnabled: enabled }),
  
  reset: () => set(initialState),
}));
