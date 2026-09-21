'use client';
import React, { useState } from 'react';
import { Box, IconButton, Menu, MenuItem, Typography, Avatar } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export const TopbarProfile = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <IconButton onClick={handleOpen} size="small">
        <AccountCircleIcon fontSize="medium" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>
          <Typography variant="body2">ผู้ใช้งานระบบ</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};