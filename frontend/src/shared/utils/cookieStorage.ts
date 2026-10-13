import Cookies from "js-cookie";
import { StateStorage } from "zustand/middleware";

export const cookieStorage: StateStorage = {
  getItem: (name: string): string | null => {
    return Cookies.get(name) ?? null;
  },
  setItem: (name: string, value: string): void => {
    Cookies.set(name, value, {
      expires: 3, // 3 days
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  },
  removeItem: (name: string): void => {
    Cookies.remove(name);
  },
};
