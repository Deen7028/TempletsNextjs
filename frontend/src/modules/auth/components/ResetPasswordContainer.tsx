'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  Link as MuiLink,
} from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Link from 'next/link';

export const ResetPasswordContainer: React.FC = () => {
  const [sEmail, setSEmail] = useState<string>('');
  const [sMessage, setSMessage] = useState<string>('');
  const [sError, setSError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSMessage('');
    setSError('');

    if (!sEmail.trim() || !sEmail.includes('@')) {
      setSError('กรุณาระบุอีเมลที่ถูกต้อง');
      return;
    }

    setSMessage('ระบบได้ส่งคำขอรีเซ็ตรหัสผ่านไปยังอีเมลของท่านแล้ว กรุณาตรวจสอบกล่องจดหมาย');
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
          <Box sx={{ bgcolor: 'rgba(255,255,255,0.15)', p: 0.8, borderRadius: 1.5, display: 'flex' }}>
            <ShoppingCartIcon sx={{ color: '#ffffff', fontSize: { xs: 22, sm: 26 } }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              ระบบสั่งของ (PO/PR)
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.85)' }}>
              Railay Great View Resort
            </Typography>
          </Box>
        </Box>

        <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: '#174785', textAlign: 'center', mb: 1, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
          >
            รีเซ็ตรหัสผ่าน
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 3, fontSize: { xs: '0.82rem', sm: '0.875rem' } }}>
            กรอกอีเมลที่ใช้ลงทะเบียนเพื่อรับคำขอตั้งรหัสผ่านใหม่
          </Typography>

          {sError && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{sError}</Alert>}
          {sMessage && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>{sMessage}</Alert>}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              required
              type="email"
              label="อีเมลที่ลงทะเบียน"
              value={sEmail}
              onChange={(e) => setSEmail(e.target.value)}
              size="medium"
              placeholder="user@railayresort.com"
              sx={{ mb: 2.5 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              startIcon={<LockResetIcon />}
              sx={{
                py: { xs: 1.1, sm: 1.25 },
                fontWeight: 600,
                fontSize: { xs: '0.95rem', sm: '1rem' },
                borderRadius: 2,
                bgcolor: '#2563eb',
                '&:hover': { bgcolor: '#1d4ed8' },
              }}
            >
              ส่งคำขอรีเซ็ตรหัสผ่าน
            </Button>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <MuiLink
                component={Link}
                href="/login"
                sx={{
                  color: '#2563eb',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                กลับสู่หน้าเข้าสู่ระบบ
              </MuiLink>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
