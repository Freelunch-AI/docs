import { create } from 'zustand';
import type { Block, SystemState } from '../types';

interface PlaygroundStore {
  currentBranch: 'main' | 'feature/add-recommendations';
  selectedBlock: Block | null;
  systemState: SystemState | null;
  
  // Actions
  selectBlock: (block: Block | null) => void;
  switchBranch: (branch: 'main' | 'feature/add-recommendations') => void;
  setSystemState: (state: SystemState) => void;
}

export const usePlaygroundStore = create<PlaygroundStore>((set) => ({
  currentBranch: 'main',
  selectedBlock: null,
  systemState: null,
  
  selectBlock: (block) => set({ selectedBlock: block }),
  switchBranch: (branch) => set({ currentBranch: branch }),
  setSystemState: (state) => set({ systemState: state }),
}));
