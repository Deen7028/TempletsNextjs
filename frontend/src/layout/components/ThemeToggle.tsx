'use client';

import { Fab, Zoom } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useUIStore } from '@/stores/useUIStore';

export const ThemeToggle = () => {
  const theme = useUIStore((s) => s.theme);
  const setTheme = useUIStore((s) => s.setTheme);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Zoom in={true} style={{ transitionDelay: '500ms' }}>
      <Fab
        size="medium"
        onClick={toggleTheme}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          bgcolor: theme === 'dark' ? '#1c2233' : '#ffffff',
          color: theme === 'dark' ? '#00e5a0' : '#f59e0b',
          boxShadow: theme === 'dark' 
            ? '0 8px 32px rgba(0, 0, 0, 0.4)' 
            : '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid',
          borderColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
          zIndex: 1000,
          '&:hover': {
            bgcolor: theme === 'dark' ? '#252d44' : '#f8fafc',
            transform: 'scale(1.1) rotate(12deg)',
          },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {theme === 'dark' ? (
          <DarkModeIcon sx={{ fontSize: 24 }} />
        ) : (
          <LightModeIcon sx={{ fontSize: 24 }} />
        )}
      </Fab>
    </Zoom>
  );
};
