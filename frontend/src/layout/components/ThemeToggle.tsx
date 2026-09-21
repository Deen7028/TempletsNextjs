'use client';

import { Fab, Zoom } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useThemeContext } from '@/shared';

export const ThemeToggle = () => {
  const { sMode, toggleTheme } = useThemeContext();

  return (
    <Zoom in={true} style={{ transitionDelay: '500ms' }}>
      <Fab
        size="medium"
        onClick={toggleTheme}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          bgcolor: sMode === 'dark' ? '#1c2233' : '#ffffff',
          color: sMode === 'dark' ? '#00e5a0' : '#f59e0b',
          boxShadow: sMode === 'dark' 
            ? '0 8px 32px rgba(0, 0, 0, 0.4)' 
            : '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid',
          borderColor: sMode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
          zIndex: 1000,
          '&:hover': {
            bgcolor: sMode === 'dark' ? '#252d44' : '#f8fafc',
            transform: 'scale(1.1) rotate(12deg)',
          },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {sMode === 'dark' ? (
          <DarkModeIcon sx={{ fontSize: 24 }} />
        ) : (
          <LightModeIcon sx={{ fontSize: 24 }} />
        )}
      </Fab>
    </Zoom>
  );
};
