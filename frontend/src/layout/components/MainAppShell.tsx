'use client';

import React from 'react';
import { Box } from '@mui/material';
import { Navbar } from '@/layout';

import { useAuthStore } from '@/stores/useAuthStore';
import { usePathname } from 'next/navigation';

export function MainAppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isAuthPage = pathname?.startsWith('/login');

  // If on auth page (e.g. login), render without Navbar
  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <Navbar />
      <Box component="main" sx={{ flex: 1, py: { xs: 2, sm: 3 }, px: { xs: 1, sm: 2, md: 3 }, width: '100%' }}>
        {children}
      </Box>
    </Box>
  );
}
