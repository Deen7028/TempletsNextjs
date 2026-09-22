'use client';
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
  Chip,
  Menu,
  MenuItem,
  Tooltip,
  Badge,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import InventoryIcon from '@mui/icons-material/Inventory';
import BusinessIcon from '@mui/icons-material/Business';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth, authService } from '@/modules/auth';
import { useCart } from '@/modules/purchasing';


export const Navbar = () => {
  const sPathname = usePathname();
  const objRouter = useRouter();
  const { objUser, logoutUser } = useAuth();
  const { nTotalItems } = useCart();

  // Mobile / Tablet Drawer State

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Desktop User Menu State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  // Desktop Admin Menu State
  const [anchorAdminEl, setAnchorAdminEl] = useState<null | HTMLElement>(null);
  const isAdminMenuOpen = Boolean(anchorAdminEl);

  const handleOpenAdminMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorAdminEl(event.currentTarget);
  };

  const handleCloseAdminMenu = () => {
    setAnchorAdminEl(null);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleCloseUserMenu();
    setIsDrawerOpen(false);
    await authService.logout();
    logoutUser();
    objRouter.push('/login');
  };

  const getInitials = () => {
    if (!objUser?.sFirstName) return 'U';
    return objUser.sFirstName[0].toUpperCase();
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: '#174785', // สีน้ำเงินหลักของระบบ
        color: '#ffffff',
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        width: '100%',
      }}
    >
      {/* Toolbar ชิดซ้ายและชิดขวาแบบเต็มหน้าจอ (px 2-3) disableGutters */}
      <Toolbar
        disableGutters
        sx={{
          minHeight: { xs: 58, sm: 64 },
          px: { xs: 2, sm: 3, md: 4 },
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between', // ชิดซ้ายและชิดขวา
        }}
      >
        {/* ฝั่งซ้าย: โลโก้ และ เมนูสั่งซื้อสินค้า (PR) */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2.5 } }}>
          <Box
            component={Link}
            href="/procurement"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              textDecoration: 'none',
              color: '#ffffff',
            }}
          >
            <Box
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.15)',
                p: 0.8,
                borderRadius: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShoppingCartIcon sx={{ fontSize: { xs: 22, sm: 26 }, color: '#ffffff' }} />
            </Box>
            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  lineHeight: 1.2,
                  color: '#ffffff',
                  fontSize: { xs: '0.95rem', sm: '1.05rem' },
                }}
              >
                ระบบสั่งของ (PO/PR)
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(255, 255, 255, 0.82)',
                  display: 'block',
                  fontSize: '0.72rem',
                  lineHeight: 1,
                  mt: 0.2,
                }}
              >
                Railay Great View Resort
              </Typography>
            </Box>
          </Box>


        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>


          {/* ปุ่มสั่งซื้อสินค้า (PR) สำหรับหน้าจอ PC Desktop */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', ml: 2, gap: 1 }}>
            <Button
              component={Link}
              href="/procurement"
              startIcon={<ShoppingCartIcon sx={{ fontSize: 18 }} />}
              sx={{
                color: '#ffffff',
                fontWeight: sPathname === '/procurement' ? 700 : 500,
                px: 2,
                py: 0.8,
                borderRadius: 2,
                bgcolor: sPathname === '/procurement' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.15)',
                },
                fontSize: '0.92rem',
                textTransform: 'none',
              }}
            >
              สั่งซื้อสินค้า (PR)
            </Button>

            <Button
              component={Link}
              href="/cart"
              startIcon={
                <Badge badgeContent={nTotalItems} color="error">
                  <ShoppingCartIcon sx={{ fontSize: 18 }} />
                </Badge>
              }
              sx={{
                color: '#ffffff',
                fontWeight: sPathname === '/cart' ? 700 : 500,
                px: 2,
                py: 0.8,
                borderRadius: 2,
                bgcolor: sPathname === '/cart' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.15)',
                },
                fontSize: '0.92rem',
                textTransform: 'none',
              }}
            >
              ตะกร้าสินค้า
            </Button>

            {(objUser?.sRole === 'Admin' || objUser?.sRole === 'Manager') && (
              <>
                <Button
                  onClick={handleOpenAdminMenu}
                  startIcon={<AdminPanelSettingsIcon sx={{ fontSize: 18 }} />}
                  endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 18 }} />}
                  sx={{
                    color: '#ffffff',
                    fontWeight: sPathname.startsWith('/admin') ? 700 : 500,
                    px: 2,
                    py: 0.8,
                    borderRadius: 2,
                    bgcolor: sPathname.startsWith('/admin') ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.15)',
                    },
                    fontSize: '0.92rem',
                    textTransform: 'none',
                  }}
                >
                  {objUser?.sRole === 'Admin' ? 'จัดการระบบ (Admin)' : 'จัดการระบบ (Manager)'}
                </Button>

                <Menu
                  anchorEl={anchorAdminEl}
                  open={isAdminMenuOpen}
                  onClose={handleCloseAdminMenu}
                  slotProps={{
                    paper: {
                      elevation: 4,
                      sx: {
                        borderRadius: 3,
                        minWidth: 220,
                        p: 0.8,
                        mt: 1.5,
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                        border: '1px solid #e2e8f0',
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                >
                  <MenuItem
                    component={Link}
                    href="/admin/requests"
                    onClick={handleCloseAdminMenu}
                    sx={{
                      py: 1.2,
                      px: 2,
                      gap: 1.5,
                      borderRadius: 2,
                      my: 0.3,
                      bgcolor: sPathname === '/admin/requests' ? '#eff6ff' : 'transparent',
                      color: sPathname === '/admin/requests' ? '#2563eb' : '#1e293b',
                      '&:hover': { bgcolor: '#f8fafc' },
                    }}
                  >
                    <PlaylistAddCheckIcon sx={{ fontSize: 20, color: sPathname === '/admin/requests' ? '#2563eb' : '#64748b' }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      ตรวจสอบคำขอ (PR)
                    </Typography>
                  </MenuItem>

                  <MenuItem
                    component={Link}
                    href="/admin/products"
                    onClick={handleCloseAdminMenu}
                    sx={{
                      py: 1.2,
                      px: 2,
                      gap: 1.5,
                      borderRadius: 2,
                      my: 0.3,
                      bgcolor: sPathname === '/admin/products' ? '#eff6ff' : 'transparent',
                      color: sPathname === '/admin/products' ? '#2563eb' : '#1e293b',
                      '&:hover': { bgcolor: '#f8fafc' },
                    }}
                  >
                    <InventoryIcon sx={{ fontSize: 20, color: sPathname === '/admin/products' ? '#2563eb' : '#64748b' }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      จัดการข้อมูลสินค้า
                    </Typography>
                  </MenuItem>

                  <MenuItem
                    component={Link}
                    href="/admin/departments"
                    onClick={handleCloseAdminMenu}
                    sx={{
                      py: 1.2,
                      px: 2,
                      gap: 1.5,
                      borderRadius: 2,
                      my: 0.3,
                      bgcolor: sPathname === '/admin/departments' ? '#eff6ff' : 'transparent',
                      color: sPathname === '/admin/departments' ? '#2563eb' : '#1e293b',
                      '&:hover': { bgcolor: '#f8fafc' },
                    }}
                  >
                    <BusinessIcon sx={{ fontSize: 20, color: sPathname === '/admin/departments' ? '#2563eb' : '#64748b' }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      จัดการข้อมูลแผนก
                    </Typography>
                  </MenuItem>

                  {/* เฉพาะ Admin เท่านั้นที่เห็นเมนูจัดการบัญชีผู้ใช้ */}
                  {objUser?.sRole === 'Admin' && (
                    <MenuItem
                      component={Link}
                      href="/admin/users"
                      onClick={handleCloseAdminMenu}
                      sx={{
                        py: 1.2,
                        px: 2,
                        gap: 1.5,
                        borderRadius: 2,
                        my: 0.3,
                        bgcolor: sPathname === '/admin/users' ? '#eff6ff' : 'transparent',
                        color: sPathname === '/admin/users' ? '#2563eb' : '#1e293b',
                        '&:hover': { bgcolor: '#f8fafc' },
                      }}
                    >
                      <ManageAccountsIcon sx={{ fontSize: 20, color: sPathname === '/admin/users' ? '#2563eb' : '#64748b' }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        จัดการบัญชีผู้ใช้
                      </Typography>
                    </MenuItem>
                  )}
                </Menu>
              </>
            )}
          </Box>

          {/* ฝั่งขวา: โปรไฟล์ผู้ใช้สำหรับ Desktop (PC) */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            {objUser ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Tooltip title="บัญชีผู้ใช้งาน">
                  <IconButton
                    onClick={handleOpenUserMenu}
                    sx={{
                      p: 0.5,
                      transition: 'transform 0.15s ease',
                      '&:hover': { transform: 'scale(1.05)' },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: '#2563eb',
                        fontSize: '1.05rem',
                        fontWeight: 700,
                        border: '2px solid rgba(255,255,255,0.85)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        cursor: 'pointer',
                      }}
                    >
                      {getInitials()}
                    </Avatar>
                  </IconButton>
                </Tooltip>

                <Menu
                  anchorEl={anchorEl}
                  open={isMenuOpen}
                  onClose={handleCloseUserMenu}
                  slotProps={{
                    paper: {
                      sx: {
                        width: 250,
                        mt: 1.5,
                        borderRadius: 3,
                        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                        border: '1px solid #e2e8f0',
                        p: 0.5,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  {/* Header การ์ดโปรไฟล์เหมือนในภาพ */}
                  <Box sx={{ px: 2, pt: 1.8, pb: 1.5 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 700, color: '#0f172a', lineHeight: 1.2, fontSize: '1rem' }}
                    >
                      {objUser.sFirstName} {objUser.sLastName}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ display: 'block', mt: 0.3, fontSize: '0.82rem' }}
                    >
                      {objUser.sEmail}
                    </Typography>
                    <Chip
                      size="small"
                      label={objUser.sRole || 'Employee'}
                      sx={{
                        mt: 1.2,
                        fontWeight: 700,
                        fontSize: '0.72rem',
                        height: 22,
                        bgcolor:
                          objUser.sRole === 'Admin'
                            ? '#fef3c7'
                            : objUser.sRole === 'Manager'
                            ? '#ede9fe'
                            : '#e0f2fe',
                        color:
                          objUser.sRole === 'Admin'
                            ? '#b45309'
                            : objUser.sRole === 'Manager'
                            ? '#6d28d9'
                            : '#0284c7',
                        borderRadius: 1.5,
                        px: 0.5,
                      }}
                    />
                  </Box>
                  <Divider sx={{ my: 0.5 }} />

                  {/* เมนูโปรไฟล์ส่วนตัว */}
                  <MenuItem
                    component={Link}
                    href="/profile"
                    onClick={handleCloseUserMenu}
                    sx={{
                      py: 1.2,
                      px: 2,
                      gap: 1.5,
                      borderRadius: 2,
                      my: 0.3,
                      bgcolor: sPathname === '/profile' ? '#f1f5f9' : 'transparent',
                      '&:hover': { bgcolor: '#f8fafc' },
                    }}
                  >
                    <PersonIcon sx={{ fontSize: 20, color: '#64748b' }} />
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#1e293b' }}>
                      โปรไฟล์ส่วนตัว
                    </Typography>
                  </MenuItem>

                  {/* เมนูออกจากระบบ */}
                  <MenuItem
                    onClick={handleLogout}
                    sx={{
                      py: 1.2,
                      px: 2,
                      gap: 1.5,
                      color: '#dc2626',
                      borderRadius: 2,
                      my: 0.3,
                      '&:hover': { bgcolor: '#fef2f2' },
                    }}
                  >
                    <LogoutIcon sx={{ fontSize: 20, color: '#dc2626' }} />
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#dc2626' }}>
                      ออกจากระบบ
                    </Typography>
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Button
                component={Link}
                href="/login"
                variant="outlined"
                size="small"
                sx={{
                  color: '#ffffff',
                  borderColor: 'rgba(255,255,255,0.6)',
                  '&:hover': { borderColor: '#ffffff', bgcolor: 'rgba(255,255,255,0.1)' },
                  borderRadius: 2,
                }}
              >
                เข้าสู่ระบบ
              </Button>
            )}
          </Box>
        </Box>

        {/* ฝั่งขวาสำหรับมือถือ (Phone) และแท็บเล็ต (Tablet): แตะรูปโปรไฟล์เพื่อเปิด Sidebar */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
          {objUser ? (
            <IconButton
              onClick={() => setIsDrawerOpen(true)}
              sx={{
                p: 0.5,
                transition: 'transform 0.15s ease',
                '&:hover': { transform: 'scale(1.05)' },
              }}
              aria-label="open user menu"
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: '#2563eb',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  border: '2px solid rgba(255,255,255,0.85)',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                  cursor: 'pointer',
                }}
              >
                {getInitials()}
              </Avatar>
            </IconButton>
          ) : (
            <Button
              component={Link}
              href="/login"
              variant="outlined"
              size="small"
              sx={{
                color: '#ffffff',
                borderColor: 'rgba(255,255,255,0.6)',
                '&:hover': { borderColor: '#ffffff', bgcolor: 'rgba(255,255,255,0.1)' },
                borderRadius: 2,
                fontSize: '0.8rem',
                py: 0.5,
                px: 1.5,
              }}
            >
              เข้าสู่ระบบ
            </Button>
          )}
        </Box>
      </Toolbar>

      {/* Drawer เมนูสำหรับ Tablet & Mobile */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: { xs: '80%', sm: 320 },
              maxWidth: 340,
              bgcolor: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
            },
          },
        }}
      >
        {/* Drawer Header */}
        <Box
          sx={{
            p: 2,
            bgcolor: '#174785',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ShoppingCartIcon sx={{ fontSize: 22 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: '0.95rem' }}>
              เมนูระบบ
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={() => setIsDrawerOpen(false)}
            sx={{ color: '#ffffff', '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' } }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* ข้อมูลผู้ใช้งานในการ์ด Drawer */}
        {objUser && (
          <Box sx={{ p: 2.5, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: '#2563eb',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              >
                {getInitials()}
              </Avatar>
              <Box sx={{ overflow: 'hidden' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b' }} noWrap>
                  {objUser.sFirstName} {objUser.sLastName}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }} noWrap>
                  {objUser.sEmail}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
              <Chip
                size="small"
                label={objUser.sRole || 'Employee'}
                sx={{
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  bgcolor:
                    objUser.sRole === 'Admin'
                      ? '#fef3c7'
                      : objUser.sRole === 'Manager'
                      ? '#ede9fe'
                      : '#e0f2fe',
                  color:
                    objUser.sRole === 'Admin'
                      ? '#b45309'
                      : objUser.sRole === 'Manager'
                      ? '#6d28d9'
                      : '#0284c7',
                }}
              />
              {objUser.sDepartmentName && (
                <Chip
                  size="small"
                  variant="outlined"
                  label={objUser.sDepartmentName}
                  sx={{ fontSize: '0.7rem', borderColor: '#cbd5e1' }}
                />
              )}
            </Box>
          </Box>
        )}

        {/* รายการลิงก์เมนู (สำหรับมือถือ/แท็บเล็ต) */}
        <List sx={{ px: 1.5, py: 2, flex: 1 }}>
          <ListItem disablePadding sx={{ mb: 0.8 }}>
            <ListItemButton
              component={Link}
              href="/procurement"
              onClick={() => setIsDrawerOpen(false)}
              sx={{
                borderRadius: 2,
                bgcolor: sPathname === '/procurement' ? '#eff6ff' : 'transparent',
                color: sPathname === '/procurement' ? '#2563eb' : '#334155',
                fontWeight: sPathname === '/procurement' ? 700 : 500,
                '&:hover': { bgcolor: '#f1f5f9' },
                py: 1.2,
              }}
            >
              <ListItemIcon sx={{ minWidth: 38, color: sPathname === '/procurement' ? '#2563eb' : '#64748b' }}>
                <ShoppingCartIcon sx={{ fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography sx={{ fontSize: '0.92rem', fontWeight: sPathname === '/procurement' ? 700 : 500 }}>
                    สั่งซื้อสินค้า (PR)
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding sx={{ mb: 0.8 }}>
            <ListItemButton
              component={Link}
              href="/cart"
              onClick={() => setIsDrawerOpen(false)}
              sx={{
                borderRadius: 2,
                bgcolor: sPathname === '/cart' ? '#eff6ff' : 'transparent',
                color: sPathname === '/cart' ? '#2563eb' : '#334155',
                fontWeight: sPathname === '/cart' ? 700 : 500,
                '&:hover': { bgcolor: '#f1f5f9' },
                py: 1.2,
              }}
            >
              <ListItemIcon sx={{ minWidth: 38, color: sPathname === '/cart' ? '#2563eb' : '#64748b' }}>
                <Badge badgeContent={nTotalItems} color="error">
                  <ShoppingCartIcon sx={{ fontSize: 20 }} />
                </Badge>
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography sx={{ fontSize: '0.92rem', fontWeight: sPathname === '/cart' ? 700 : 500 }}>
                    ตะกร้าสินค้า
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>


          {(objUser?.sRole === 'Admin' || objUser?.sRole === 'Manager') && (
            <>
              <Divider sx={{ my: 1.5 }} />
              <Typography variant="caption" sx={{ px: 2, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {objUser?.sRole === 'Admin' ? 'เมนูผู้ดูแลระบบ (Admin)' : 'เมนูผู้จัดการ (Manager)'}
              </Typography>

              <ListItem disablePadding sx={{ mt: 1, mb: 0.8 }}>
                <ListItemButton
                  component={Link}
                  href="/admin/requests"
                  onClick={() => setIsDrawerOpen(false)}
                  sx={{
                    borderRadius: 2,
                    bgcolor: sPathname === '/admin/requests' ? '#eff6ff' : 'transparent',
                    color: sPathname === '/admin/requests' ? '#2563eb' : '#334155',
                    fontWeight: sPathname === '/admin/requests' ? 700 : 500,
                    '&:hover': { bgcolor: '#f1f5f9' },
                    py: 1.2,
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 38, color: sPathname === '/admin/requests' ? '#2563eb' : '#64748b' }}>
                    <PlaylistAddCheckIcon sx={{ fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography sx={{ fontSize: '0.92rem', fontWeight: sPathname === '/admin/requests' ? 700 : 500 }}>
                        ตรวจสอบคำขอ (PR)
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding sx={{ mb: 0.8 }}>
                <ListItemButton
                  component={Link}
                  href="/admin/products"
                  onClick={() => setIsDrawerOpen(false)}
                  sx={{
                    borderRadius: 2,
                    bgcolor: sPathname === '/admin/products' ? '#eff6ff' : 'transparent',
                    color: sPathname === '/admin/products' ? '#2563eb' : '#334155',
                    fontWeight: sPathname === '/admin/products' ? 700 : 500,
                    '&:hover': { bgcolor: '#f1f5f9' },
                    py: 1.2,
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 38, color: sPathname === '/admin/products' ? '#2563eb' : '#64748b' }}>
                    <InventoryIcon sx={{ fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography sx={{ fontSize: '0.92rem', fontWeight: sPathname === '/admin/products' ? 700 : 500 }}>
                        จัดการข้อมูลสินค้า
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding sx={{ mb: 0.8 }}>
                <ListItemButton
                  component={Link}
                  href="/admin/departments"
                  onClick={() => setIsDrawerOpen(false)}
                  sx={{
                    borderRadius: 2,
                    bgcolor: sPathname === '/admin/departments' ? '#eff6ff' : 'transparent',
                    color: sPathname === '/admin/departments' ? '#2563eb' : '#334155',
                    fontWeight: sPathname === '/admin/departments' ? 700 : 500,
                    '&:hover': { bgcolor: '#f1f5f9' },
                    py: 1.2,
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 38, color: sPathname === '/admin/departments' ? '#2563eb' : '#64748b' }}>
                    <BusinessIcon sx={{ fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography sx={{ fontSize: '0.92rem', fontWeight: sPathname === '/admin/departments' ? 700 : 500 }}>
                        จัดการข้อมูลแผนก
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>

              {/* เฉพาะ Admin เท่านั้นที่เห็นเมนูจัดการบัญชีผู้ใช้ */}
              {objUser?.sRole === 'Admin' && (
                <ListItem disablePadding sx={{ mb: 0.8 }}>
                  <ListItemButton
                    component={Link}
                    href="/admin/users"
                    onClick={() => setIsDrawerOpen(false)}
                    sx={{
                      borderRadius: 2,
                      bgcolor: sPathname === '/admin/users' ? '#eff6ff' : 'transparent',
                      color: sPathname === '/admin/users' ? '#2563eb' : '#334155',
                      fontWeight: sPathname === '/admin/users' ? 700 : 500,
                      '&:hover': { bgcolor: '#f1f5f9' },
                      py: 1.2,
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 38, color: sPathname === '/admin/users' ? '#2563eb' : '#64748b' }}>
                      <ManageAccountsIcon sx={{ fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography sx={{ fontSize: '0.92rem', fontWeight: sPathname === '/admin/users' ? 700 : 500 }}>
                          จัดการบัญชีผู้ใช้
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              )}

              <Divider sx={{ my: 1.5 }} />
            </>
          )}

          <ListItem disablePadding sx={{ mb: 0.8 }}>
            <ListItemButton
              component={Link}
              href="/profile"
              onClick={() => setIsDrawerOpen(false)}
              sx={{
                borderRadius: 2,
                bgcolor: sPathname === '/profile' ? '#eff6ff' : 'transparent',
                color: sPathname === '/profile' ? '#2563eb' : '#334155',
                fontWeight: sPathname === '/profile' ? 700 : 500,
                '&:hover': { bgcolor: '#f1f5f9' },
                py: 1.2,
              }}
            >
              <ListItemIcon sx={{ minWidth: 38, color: sPathname === '/profile' ? '#2563eb' : '#64748b' }}>
                <PersonIcon sx={{ fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography sx={{ fontSize: '0.92rem', fontWeight: sPathname === '/profile' ? 700 : 500 }}>
                    โปรไฟล์ส่วนตัว
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        </List>

        {/* ปุ่มออกจากระบบ / เข้าสู่ระบบ ด้านล่าง Drawer */}
        <Box sx={{ p: 2, borderTop: '1px solid #e2e8f0' }}>
          {objUser ? (
            <Button
              fullWidth
              variant="outlined"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                borderRadius: 2,
                py: 1,
                fontWeight: 600,
                textTransform: 'none',
              }}
            >
              ออกจากระบบ
            </Button>
          ) : (
            <Button
              fullWidth
              component={Link}
              href="/login"
              variant="contained"
              onClick={() => setIsDrawerOpen(false)}
              sx={{
                bgcolor: '#2563eb',
                '&:hover': { bgcolor: '#1d4ed8' },
                borderRadius: 2,
                py: 1,
                fontWeight: 600,
                textTransform: 'none',
              }}
            >
              เข้าสู่ระบบ
            </Button>
          )}
        </Box>
      </Drawer>
    </AppBar>
  );
};
