import { create } from "zustand";

export interface BlockUIState {
  isOpen: boolean;
  message?: string;
  show: (message?: string) => void;
  close: () => void;
}

export const useBlockUIStore = create<BlockUIState>((set) => ({
  isOpen: false,
  message: undefined,
  show: (message) => set({ isOpen: true, message }),
  close: () => set({ isOpen: false, message: undefined }),
}));

// Static helper matching README: BlockUI.Show() / BlockUI.Close()
export const BlockUI = {
  Show: (message?: string) => useBlockUIStore.getState().show(message),
  Close: () => useBlockUIStore.getState().close(),
};
