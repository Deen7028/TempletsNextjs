import { create } from "zustand";

export interface IMenuItem {
  id: string | number;
  label: string;
  icon?: string;
  href?: string;
  children?: IMenuItem[];
  permissions?: string[];
}

export type MenuFetchStatus = "idle" | "loading" | "success" | "error";

export interface MenuState {
  menuItems: IMenuItem[];
  status: MenuFetchStatus;
  lastFetched: number | null; // timestamp ms
  setMenuItems: (items: IMenuItem[]) => void;
  setStatus: (status: MenuFetchStatus) => void;
  isStale: () => boolean;
}

const MENU_STALE_MS = 5 * 60 * 1000; // 5 mins cache

export const useMenuStore = create<MenuState>((set, get) => ({
  menuItems: [],
  status: "idle",
  lastFetched: null,

  setMenuItems: (menuItems) =>
    set({ menuItems, status: "success", lastFetched: Date.now() }),

  setStatus: (status) => set({ status }),

  isStale: () => {
    const { lastFetched } = get();
    if (!lastFetched) return true;
    return Date.now() - lastFetched > MENU_STALE_MS;
  },
}));
