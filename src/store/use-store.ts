import { create } from 'zustand';
import { Smash, User } from '@/types';

interface StoreState {
  // User
  user: User | null;
  setUser: (user: User | null) => void;
  
  // Smashes
  smashes: Smash[];
  setSmashes: (smashes: Smash[]) => void;
  addSmash: (smash: Smash) => void;
  
  // UI State
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
}

export const useStore = create<StoreState>((set) => ({
  // User
  user: null,
  setUser: (user) => set({ user }),
  
  // Smashes
  smashes: [],
  setSmashes: (smashes) => set({ smashes }),
  addSmash: (smash) => set((state) => ({ 
    smashes: [smash, ...state.smashes] 
  })),
  
  // UI State
  isCreateModalOpen: false,
  setIsCreateModalOpen: (open) => set({ isCreateModalOpen: open }),
}));