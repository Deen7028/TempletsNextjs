"use client";

import React from "react";
import { useUIStore, ThemeMode } from "@/stores/useUIStore";

export const ThemeContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <>{children}</>;
};

export const useThemeContext = () => {
  const theme = useUIStore((s) => s.theme);
  const setTheme = useUIStore((s) => s.setTheme);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return {
    sMode: (theme === "dark" ? "dark" : "light") as ThemeMode,
    toggleTheme,
  };
};
