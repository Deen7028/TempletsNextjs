import React from 'react';
import { Box } from '@mui/material';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        minHeight: '100dvh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#f0f4f9',
        overflowX: 'hidden',
        overflowY: 'auto',
      }}
    >
      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          py: { xs: 2, sm: 4 },
          px: { xs: 1.5, sm: 2 },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
