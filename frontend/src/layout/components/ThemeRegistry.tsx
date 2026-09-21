'use client';

import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { getTheme, ThemeContextProvider, useThemeContext } from '@/shared';

function ThemeResolver({ children }: { children: React.ReactNode }) {
  const { sMode } = useThemeContext();
  const theme = React.useMemo(() => getTheme(sMode), [sMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

import { AuthProvider } from '@/modules/auth';
import { CartProvider } from '@/modules/purchasing';

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <ThemeContextProvider>
      <ThemeResolver>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </ThemeResolver>
    </ThemeContextProvider>
  );
}
