'use client';

import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { getTheme, ThemeContextProvider, useThemeContext } from '@/shared';

function ThemeResolver({ children }: { children: React.ReactNode }) {
  const { sMode } = useThemeContext();
  const normalizedMode = sMode === 'dark' ? 'dark' : 'light';
  const theme = React.useMemo(() => getTheme(normalizedMode), [normalizedMode]);

  // Synchronize CSS custom properties with theme colors
  React.useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', normalizedMode);
    root.style.setProperty('--color-primary', theme.palette.primary.main);
    root.style.setProperty('--color-primary-hover', theme.palette.primary.dark);
    root.style.setProperty('--color-primary-light', theme.palette.primary.light);
    root.style.setProperty('--color-secondary', theme.palette.secondary.main);
    root.style.setProperty('--color-background', theme.palette.background.default);
    root.style.setProperty('--color-surface', theme.palette.background.paper);
    root.style.setProperty('--color-success', theme.palette.success.main);
    root.style.setProperty('--color-warning', theme.palette.warning.main);
    root.style.setProperty('--color-danger', theme.palette.error.main);
    root.style.setProperty('--color-text', theme.palette.text.primary);
    root.style.setProperty('--color-text-secondary', theme.palette.text.secondary);
    root.style.setProperty('--color-border', theme.palette.divider);
  }, [normalizedMode, theme]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <ThemeContextProvider>
      <ThemeResolver>
        {children}
      </ThemeResolver>
    </ThemeContextProvider>
  );
}
