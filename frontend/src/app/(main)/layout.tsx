'use client';

import React, { useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { Navbar } from '@/layout';
import { useAuth } from '@/modules/auth';
import { useRouter } from 'next/navigation';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { objUser, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !objUser) {
      router.replace('/login');
    }
  }, [objUser, isLoading, router]);

  if (isLoading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!objUser) {
    return null;
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
