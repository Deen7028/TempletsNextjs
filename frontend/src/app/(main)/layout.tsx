import React from 'react';
import { Box } from '@mui/material';
import { Navbar } from '@/layout';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <Navbar />
      <Box component="main" sx={{ flex: 1, py: { xs: 2, sm: 3 }, px: { xs: 1, sm: 2, md: 3 }, width: '100%' }}>
        {children}
      </Box>
    </Box>
  );
}
