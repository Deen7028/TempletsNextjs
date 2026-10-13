import { create } from "zustand";

export interface RouteState {
  currentPath: string;
  previousPath: string | null;
  setCurrentPath: (path: string) => void;
}

export const useRouteStore = create<RouteState>((set, get) => ({
  currentPath: "/",
  previousPath: null,
  setCurrentPath: (currentPath) => {
    const prev = get().currentPath;
    set({ currentPath, previousPath: prev !== currentPath ? prev : get().previousPath });
  },
}));
