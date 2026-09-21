'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeMode = 'light' | 'dark';

interface IThemeContext {
  sMode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<IThemeContext | undefined>(undefined);

export const ThemeContextProvider = ({ children }: { children: React.ReactNode }) => {
  // ตั้งค่าเริ่มต้นเป็น light mode ตาม Design mockup
  const [sMode, setSMode] = useState<ThemeMode>('light');

  useEffect(() => {
    const sSavedMode = localStorage.getItem('themeMode') as ThemeMode;
    if (sSavedMode) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSMode(sSavedMode);
    }
  }, []);

  const toggleTheme = () => {
    const sNewMode = sMode === 'light' ? 'dark' : 'light';
    setSMode(sNewMode);
    localStorage.setItem('themeMode', sNewMode);
  };

  return (
    <ThemeContext.Provider value={{ sMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeContextProvider');
  }
  return context;
};
