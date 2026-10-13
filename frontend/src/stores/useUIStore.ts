import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { cookieStorage } from "@/shared/utils/cookieStorage";

export type ThemeMode = "light" | "dark" | "system";
export type ThemeSize = "compact" | "normal" | "comfortable";

export interface UIState {
  theme: ThemeMode;
  themeSize: ThemeSize;
  sidebarOpen: boolean;
  isCollapsed: boolean;
  setTheme: (theme: ThemeMode) => void;
  setThemeSize: (size: ThemeSize) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setIsCollapsed: (collapsed: boolean) => void;
  toggleCollapsed: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: "light",
      themeSize: "normal",
      sidebarOpen: true,
      isCollapsed: false,

      setTheme: (theme) => {
        if (typeof document !== "undefined") {
          document.documentElement.setAttribute("data-theme", theme);
        }
        set({ theme });
      },
      setThemeSize: (themeSize) => set({ themeSize }),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setIsCollapsed: (isCollapsed) => set({ isCollapsed }),
      toggleCollapsed: () => set((s) => ({ isCollapsed: !s.isCollapsed })),
    }),
    {
      name: "ui-storage",
      partialize: (s) => ({
        theme: s.theme,
        themeSize: s.themeSize,
        isCollapsed: s.isCollapsed,
      }),
      storage: createJSONStorage(() => cookieStorage),
    },
  ),
);
