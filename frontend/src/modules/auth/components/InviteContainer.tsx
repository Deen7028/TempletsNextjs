'use client';

import React from 'react';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Link from 'next/link';

export const InviteContainer: React.FC = () => {
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
          textAlign: 'center',
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
            justifyContent: 'center',
            gap: 1.5,
          }}
        >
          <ShoppingCartIcon sx={{ color: '#ffffff', fontSize: { xs: 22, sm: 26 } }} />
          <Box sx={{ textAlign: 'left' }}>
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
            sx={{ fontWeight: 'bold', mb: 1, color: '#174785', fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
          >
            คำเชิญเข้าร่วมระบบสั่งของ
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontSize: { xs: '0.85rem', sm: '0.9rem' } }}>
            หากท่านได้รับคำเชิญเข้าร่วมใช้งานระบบ กรุณาลงทะเบียนบัญชีพนักงานใหม่เพื่อเริ่มต้นใช้งาน
          </Typography>
          <Button
            component={Link}
            href="/register"
            variant="contained"
            fullWidth
            size="large"
            sx={{
              py: 1.2,
              fontWeight: 600,
              borderRadius: 2,
              bgcolor: '#2563eb',
              '&:hover': { bgcolor: '#1d4ed8' },
            }}
          >
            ไปหน้าลงทะเบียนพนักงาน
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};
