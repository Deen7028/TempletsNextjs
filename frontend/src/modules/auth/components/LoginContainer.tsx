'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Alert,
  IconButton,
  InputAdornment,
  Link as MuiLink,
  CircularProgress,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { ILoginRequest } from '../interfaces/IAuth';

export const LoginContainer: React.FC = () => {
  const objRouter = useRouter();
  const { loginUser } = useAuth();
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sAlertError, setSAlertError] = useState<string>('');

  const [objForm, setObjForm] = useState<ILoginRequest>({
    sEmail: '',
    sPassword: '',
    isRememberMe: false,
  });

  const [objErrors, setObjErrors] = useState<{
    sEmail?: string;
    sPassword?: string;
  }>({});

  const validateForm = (): boolean => {
    const errors: { sEmail?: string; sPassword?: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!objForm.sEmail.trim()) {
      errors.sEmail = 'กรุณากรอกอีเมล';
    } else if (!emailRegex.test(objForm.sEmail.trim())) {
      errors.sEmail = 'รูปแบบอีเมลไม่ถูกต้อง (เช่น user@railayresort.com)';
    }

    if (!objForm.sPassword) {
      errors.sPassword = 'กรุณากรอกรหัสผ่าน';
    } else if (objForm.sPassword.length < 6) {
      errors.sPassword = 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร';
    }

    setObjErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setObjForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // ล้าง error ของช่องนั้นเมื่อเริ่มพิมพ์
    if (objErrors[name as keyof typeof objErrors]) {
      setObjErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSAlertError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.login({
        ...objForm,
        sEmail: objForm.sEmail.trim(),
      });
      if (res && (res.status === 'success' || res.status === '200' || res.token)) {
        if (res.objUser) {
          loginUser(res.objUser);
        }

        objRouter.push('/procurement');
      } else {
        setSAlertError(res?.message || 'อีเมล หรือรหัสผ่านไม่ถูกต้อง');
      }
    } catch (err: any) {
      setSAlertError(err?.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 440,
        mx: 'auto',
      }}
    >
      <Card
        sx={{
          width: '100%',
          borderRadius: { xs: 2.5, sm: 3 },
          boxShadow: { xs: '0 2px 12px rgba(0,0,0,0.06)', sm: '0 4px 20px rgba(0,0,0,0.08)' },
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
        }}
      >
        {/* Header แถบสีน้ำเงินเข้มตาม Mockup */}
        <Box
          sx={{
            bgcolor: '#174785',
            color: '#ffffff',
            py: { xs: 2, sm: 2.5 },
            px: { xs: 2, sm: 3 },
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.15)',
              p: 0.8,
              borderRadius: 1.5,
              display: 'flex',
            }}
          >
            <ShoppingCartIcon sx={{ color: '#ffffff', fontSize: { xs: 22, sm: 26 } }} />
          </Box>
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 700, lineHeight: 1.2, fontSize: { xs: '0.95rem', sm: '1.05rem' } }}
            >
              ระบบสั่งของ (PO/PR)
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: 'rgba(255,255,255,0.85)', fontSize: { xs: '0.72rem', sm: '0.78rem' } }}
            >
              Railay Great View Resort
            </Typography>
          </Box>
        </Box>

        <CardContent sx={{ p: { xs: 2, sm: 3.5 } }}>
          <Box sx={{ mb: { xs: 2, sm: 2.5 }, textAlign: 'center' }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: '#174785',
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
              }}
            >
              ยินดีต้อนรับเข้าสู่ระบบ
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: { xs: '0.82rem', sm: '0.875rem' } }}>
              กรอกอีเมลเพื่อเข้าสู่ระบบ
            </Typography>
          </Box>

          {sAlertError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2, fontSize: '0.85rem' }}>
              {sAlertError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              required
              type="email"
              label="อีเมล (Email)"
              name="sEmail"
              placeholder="user@railayresort.com"
              value={objForm.sEmail}
              onChange={handleChange}
              error={!!objErrors.sEmail}
              helperText={objErrors.sEmail}
              size="medium"
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              required
              type={isShowPassword ? 'text' : 'password'}
              label="รหัสผ่าน (Password)"
              name="sPassword"
              value={objForm.sPassword}
              onChange={handleChange}
              error={!!objErrors.sPassword}
              helperText={objErrors.sPassword}
              size="medium"
              sx={{ mb: 1.5 }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setIsShowPassword(!isShowPassword)}
                        edge="end"
                      >
                        {isShowPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 1,
                mb: 2.5,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    name="isRememberMe"
                    checked={objForm.isRememberMe}
                    onChange={handleChange}
                    size="small"
                    color="primary"
                  />
                }
                label={<Typography variant="body2" sx={{ fontSize: { xs: '0.82rem', sm: '0.875rem' } }}>จดจำการเข้าสู่ระบบ</Typography>}
              />

              <MuiLink
                component={Link}
                href="/reset-password"
                sx={{
                  fontSize: { xs: '0.8rem', sm: '0.85rem' },
                  color: '#2563eb',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                ลืมรหัสผ่าน?
              </MuiLink>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
              sx={{
                py: { xs: 1.1, sm: 1.25 },
                fontWeight: 600,
                fontSize: { xs: '0.95rem', sm: '1rem' },
                borderRadius: 2,
                bgcolor: '#2563eb',
                '&:hover': { bgcolor: '#1d4ed8' },
              }}
            >
              {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </Button>

            <Box sx={{ mt: 2.5, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.82rem', sm: '0.875rem' } }}>
                ยังไม่มีบัญชีใช้งาน?{' '}
                <MuiLink
                  component={Link}
                  href="/register"
                  sx={{
                    fontWeight: 600,
                    color: '#2563eb',
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  ลงทะเบียนพนักงานใหม่
                </MuiLink>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
