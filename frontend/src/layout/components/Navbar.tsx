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
  Menu,
  MenuItem,
  Tooltip,
  Badge,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import InventoryIcon from '@mui/icons-material/Inventory';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { useAuthStore } from '@/stores/useAuthStore';
import { onLogoutAction } from '@/modules/auth';
import { INavMenuItem, APP_NAVIGATION } from '@/shared/config';

export interface INavbarProps {
  brandTitle?: string;
  brandSubtitle?: string;
  brandHref?: string;
  logoIcon?: React.ReactNode;
  menuItems?: INavMenuItem[];
  onLogout?: () => Promise<void> | void;
}

export const Navbar: React.FC<INavbarProps> = ({
  brandTitle = APP_NAVIGATION.brandTitle,
  brandSubtitle = APP_NAVIGATION.brandSubtitle,
  brandHref = APP_NAVIGATION.brandHref || '/showcase',
  logoIcon,
  menuItems = APP_NAVIGATION.menuItems,
  onLogout,
}) => {
  const sPathname = usePathname();
  const objRouter = useRouter();

  // Auth state from Zustand store
  const currentUser = useAuthStore((s) => s.dataUser);
  const storeLogout = useAuthStore((s) => s.logout);

  const userRole = (currentUser as any)?.sRole || '';

  // Filter items by role
  const filterByRole = (items: INavMenuItem[]): INavMenuItem[] => {
    return items.filter((item) => {
      if (!item.roles || item.roles.length === 0) return true;
      return item.roles.includes(userRole);
    });
  };

  const visibleMenuItems = filterByRole(menuItems);

  // Mobile / Tablet Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Desktop User Menu State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  // Dropdown Submenu States: mapping { [menuId]: HTMLElement | null }
  const [dropdownAnchors, setDropdownAnchors] = useState<Record<string, HTMLElement | null>>({});

  const handleOpenDropdown = (id: string, event: React.MouseEvent<HTMLElement>) => {
    setDropdownAnchors((prev) => ({ ...prev, [id]: event.currentTarget }));
  };

  const handleCloseDropdown = (id: string) => {
    setDropdownAnchors((prev) => ({ ...prev, [id]: null }));
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
    if (onLogout) {
      await onLogout();
    } else {
      try {
        await onLogoutAction();
      } catch {
        // ignore
      }
      storeLogout();
    }
    objRouter.push('/login');
  };

  const getInitials = () => {
    const firstName = (currentUser as any)?.sFirstName || (currentUser as any)?.sName || '';
    if (!firstName) return 'U';
    return String(firstName)[0].toUpperCase();
  };

  const getUserFullName = () => {
    const first = (currentUser as any)?.sFirstName || (currentUser as any)?.sName || '';
    const last = (currentUser as any)?.sLastName || '';
    return `${first} ${last}`.trim() || 'User';
  };

  const getUserEmail = () => {
    return (currentUser as any)?.sEmail || (currentUser as any)?.sUsername || '';
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: (theme) => theme.palette.secondary.main,
        color: '#ffffff',
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        width: '100%',
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          minHeight: { xs: 58, sm: 64 },
          px: { xs: 2, sm: 3, md: 4 },
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand / Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2.5 } }}>
          <Box
            component={Link}
            href={brandHref}
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
              {logoIcon || <InventoryIcon sx={{ fontSize: { xs: 22, sm: 26 }, color: '#ffffff' }} />}
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
                {brandTitle}
              </Typography>
              {brandSubtitle && (
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
                  {brandSubtitle}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        {/* Desktop Menu Items */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', ml: 2, gap: 1 }}>
            {visibleMenuItems.map((menu) => {
              const hasSubmenu = menu.children && menu.children.length > 0;
              const isSubmenuOpen = Boolean(dropdownAnchors[menu.id]);
              const isActive =
                sPathname.startsWith(menu.href) ||
                (hasSubmenu && menu.children?.some((child) => sPathname.startsWith(child.href)));

              if (hasSubmenu) {
                const visibleSubmenu = filterByRole(menu.children || []);
                if (visibleSubmenu.length === 0) return null;

                return (
                  <React.Fragment key={menu.id}>
                    <Button
                      onClick={(e) => handleOpenDropdown(menu.id, e)}
                      startIcon={menu.icon}
                      endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 18 }} />}
                      sx={{
                        color: '#ffffff',
                        fontWeight: isActive ? 700 : 500,
                        px: 2,
                        py: 0.8,
                        borderRadius: 2,
                        bgcolor: isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.15)',
                        },
                        fontSize: '0.92rem',
                        textTransform: 'none',
                      }}
                    >
                      {menu.label}
                    </Button>

                    <Menu
                      anchorEl={dropdownAnchors[menu.id]}
                      open={isSubmenuOpen}
                      onClose={() => handleCloseDropdown(menu.id)}
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
                      {visibleSubmenu.map((child) => {
                        const isChildActive = sPathname === child.href;
                        return (
                          <MenuItem
                            key={child.id}
                            component={Link}
                            href={child.href}
                            onClick={() => handleCloseDropdown(menu.id)}
                            sx={{
                              py: 1.2,
                              px: 2,
                              gap: 1.5,
                              borderRadius: 2,
                              my: 0.3,
                              bgcolor: isChildActive ? '#eff6ff' : 'transparent',
                              color: isChildActive ? '#2563eb' : '#1e293b',
                              '&:hover': { bgcolor: '#f8fafc' },
                            }}
                          >
                            {child.icon}
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {child.label}
                            </Typography>
                          </MenuItem>
                        );
                      })}
                    </Menu>
                  </React.Fragment>
                );
              }

              return (
                <Button
                  key={menu.id}
                  component={Link}
                  href={menu.href}
                  startIcon={menu.icon}
                  sx={{
                    color: '#ffffff',
                    fontWeight: isActive ? 700 : 500,
                    px: 2,
                    py: 0.8,
                    borderRadius: 2,
                    bgcolor: isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.15)',
                    },
                    fontSize: '0.92rem',
                    textTransform: 'none',
                  }}
                >
                  {menu.label}
                </Button>
              );
            })}
          </Box>

          {/* Desktop User Menu */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            {currentUser ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Tooltip title="บัญชีผู้ใช้งาน">
                  <IconButton
                    onClick={handleOpenUserMenu}
                    sx={{
                      p: 0.5,
                      border: '2px solid rgba(255, 255, 255, 0.4)',
                      '&:hover': { border: '2px solid #ffffff' },
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: '#2563eb',
                        color: '#ffffff',
                        width: 36,
                        height: 36,
                        fontSize: '0.95rem',
                        fontWeight: 700,
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
                      elevation: 4,
                      sx: {
                        borderRadius: 3,
                        minWidth: 240,
                        p: 1,
                        mt: 1.5,
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                        border: '1px solid #e2e8f0',
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                      {getUserFullName()}
                    </Typography>
                    {getUserEmail() && (
                      <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                        {getUserEmail()}
                      </Typography>
                    )}
                    {userRole && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#2563eb',
                          fontWeight: 600,
                          mt: 0.5,
                          display: 'inline-block',
                          bgcolor: '#eff6ff',
                          px: 1,
                          py: 0.2,
                          borderRadius: 1,
                        }}
                      >
                        {userRole}
                      </Typography>
                    )}
                  </Box>
                  <Divider sx={{ my: 0.5 }} />
                  <MenuItem
                    onClick={handleLogout}
                    sx={{ py: 1, px: 2, gap: 1.5, borderRadius: 2, color: '#ef4444' }}
                  >
                    <LogoutIcon sx={{ fontSize: 20, color: '#ef4444' }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      ออกจากระบบ
                    </Typography>
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Button
                component={Link}
                href="/login"
                variant="contained"
                sx={{
                  bgcolor: '#ffffff',
                  color: 'secondary.main',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 2,
                  px: 2.5,
                  '&:hover': {
                    bgcolor: '#f1f5f9',
                  },
                }}
              >
                เข้าสู่ระบบ
              </Button>
            )}
          </Box>

          {/* Mobile Drawer Trigger */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              color="inherit"
              edge="end"
              onClick={() => setIsDrawerOpen(true)}
              aria-label="open drawer"
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Box>
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: { xs: 280, sm: 320 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            },
          },
        }}
      >
        <Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              borderBottom: '1px solid #e2e8f0',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
              เมนูหลัก
            </Typography>
            <IconButton onClick={() => setIsDrawerOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          <List sx={{ px: 1.5, py: 1 }}>
            {visibleMenuItems.map((menu) => {
              const hasSubmenu = menu.children && menu.children.length > 0;
              const visibleSub = filterByRole(menu.children || []);

              if (hasSubmenu && visibleSub.length > 0) {
                return (
                  <React.Fragment key={menu.id}>
                    <Divider sx={{ my: 1.5 }} />
                    <Typography
                      variant="caption"
                      sx={{
                        px: 2,
                        color: '#94a3b8',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {menu.label}
                    </Typography>
                    {visibleSub.map((sub) => (
                      <ListItem key={sub.id} disablePadding sx={{ mt: 0.8, mb: 0.5 }}>
                        <ListItemButton
                          component={Link}
                          href={sub.href}
                          onClick={() => setIsDrawerOpen(false)}
                          sx={{
                            borderRadius: 2,
                            bgcolor: sPathname === sub.href ? '#eff6ff' : 'transparent',
                            color: sPathname === sub.href ? '#2563eb' : '#334155',
                            fontWeight: sPathname === sub.href ? 700 : 500,
                            '&:hover': { bgcolor: '#f1f5f9' },
                            py: 1.1,
                          }}
                        >
                          {sub.icon && <ListItemIcon sx={{ minWidth: 36 }}>{sub.icon}</ListItemIcon>}
                          <ListItemText primary={<Typography sx={{ fontSize: '0.92rem' }}>{sub.label}</Typography>} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </React.Fragment>
                );
              }

              const isItemActive = sPathname.startsWith(menu.href);
              return (
                <ListItem key={menu.id} disablePadding sx={{ mb: 0.8 }}>
                  <ListItemButton
                    component={Link}
                    href={menu.href}
                    onClick={() => setIsDrawerOpen(false)}
                    sx={{
                      borderRadius: 2,
                      bgcolor: isItemActive ? '#eff6ff' : 'transparent',
                      color: isItemActive ? '#2563eb' : '#334155',
                      fontWeight: isItemActive ? 700 : 500,
                      '&:hover': { bgcolor: '#f1f5f9' },
                      py: 1.2,
                    }}
                  >
                    {menu.icon && <ListItemIcon sx={{ minWidth: 36 }}>{menu.icon}</ListItemIcon>}
                    <ListItemText
                      primary={
                        <Typography sx={{ fontSize: '0.92rem', fontWeight: isItemActive ? 700 : 500 }}>
                          {menu.label}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>

        {/* Drawer Bottom Logout Button */}
        <Box sx={{ p: 2, borderTop: '1px solid #e2e8f0' }}>
          {currentUser ? (
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
