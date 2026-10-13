import { create } from "zustand";

export interface SessionState {
  sessionId: string | null;
  lastActive: number | null;
  setSessionId: (id: string | null) => void;
  updateActivity: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  sessionId: null,
  lastActive: null,
  setSessionId: (sessionId) => set({ sessionId, lastActive: Date.now() }),
  updateActivity: () => set({ lastActive: Date.now() }),
}));
