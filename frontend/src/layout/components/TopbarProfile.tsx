'use client';

import React, { useState } from 'react';
import { Box, IconButton, Menu, MenuItem, Typography, Avatar, Divider, ListItemIcon } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';

export const TopbarProfile = () => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const dataUser = useAuthStore((s) => s.dataUser);
  const logout = useAuthStore((s) => s.logout);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleClose();
    router.push('/profile');
  };

  const handleLogout = () => {
    handleClose();
    logout();
    router.push('/login');
  };

  const displayName = dataUser?.sName || (dataUser?.sUsername as string) || 'ผู้ใช้งานระบบ';
  const role = (dataUser?.sRole as string) || '';

  return (
    <Box>
      <IconButton onClick={handleOpen} size="small">
        <AccountCircleIcon fontSize="medium" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {displayName}
          </Typography>
          {role && (
            <Typography variant="caption" sx={{ color: 'var(--color-text-secondary)' }}>
              สถานะ: {role}
            </Typography>
          )}
        </Box>
        <Divider />
        <MenuItem onClick={handleProfile}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          ข้อมูลส่วนตัว
        </MenuItem>
        <MenuItem onClick={handleLogout} sx={{ color: 'var(--color-danger)' }}>
          <ListItemIcon sx={{ color: 'inherit' }}>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          ออกจากระบบ
        </MenuItem>
      </Menu>
    </Box>
  );
};