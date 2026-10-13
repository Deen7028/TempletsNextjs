import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { cookieStorage } from "@/shared/utils/cookieStorage";

export interface IUserData {
  id?: string;
  sUsername?: string;
  sName?: string;
  sEmail?: string;
  sRole?: string;
  [key: string]: unknown;
}

export interface AuthState {
  token: string | null;
  refreshToken: string | null;
  dataUser: IUserData | null;
  isAuthenticated: boolean;
  setAuth: (token: string, refreshToken: string | null, user: IUserData) => void;
  setUser: (user: Partial<IUserData>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      dataUser: null,
      isAuthenticated: false,

      setAuth: (token, refreshToken, user) =>
        set({
          token,
          refreshToken,
          dataUser: user,
          isAuthenticated: true,
        }),

      setUser: (user) =>
        set((s) => ({
          dataUser: s.dataUser ? { ...s.dataUser, ...user } : null,
        })),

      logout: () =>
        set({
          token: null,
          refreshToken: null,
          dataUser: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage",
      partialize: (s) => ({ token: s.token, refreshToken: s.refreshToken }),
      storage: createJSONStorage(() => cookieStorage),
    },
  ),
);
