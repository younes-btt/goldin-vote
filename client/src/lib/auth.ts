import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Voter } from '@shared/schema';

interface VoterState {
  voter: Voter | null;
  setVoter: (voter: Voter | null) => void;
  clearVoter: () => void;
}

export const useVoterStore = create<VoterState>()(
  persist(
    (set) => ({
      voter: null,
      setVoter: (voter) => set({ voter }),
      clearVoter: () => set({ voter: null }),
    }),
    {
      name: 'voter-storage',
    }
  )
);

interface AdminState {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      login: () => set({ isAuthenticated: true }),
      logout: () => set({ isAuthenticated: false }),
    }),
    {
      name: 'admin-storage',
    }
  )
);
