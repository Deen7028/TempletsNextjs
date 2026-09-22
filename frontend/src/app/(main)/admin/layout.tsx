'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/modules/auth/context/AuthContext';
import { Box, CircularProgress, Typography, Button, Paper } from '@mui/material';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { objUser, isLoading } = useAuth();
  const objRouter = useRouter();

  // กำหนดสิทธิ์: ผู้ใช้งานที่มี role = 'Admin' หรือ 'Manager'
  const isAuthorized = objUser?.sRole === 'Admin' || objUser?.sRole === 'Manager';

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          gap: 2,
        }}
      >
        <CircularProgress size={44} sx={{ color: '#2563eb' }} />
        <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
          กำลังตรวจสอบสิทธิ์การเข้าถึงระบบ Admin...
        </Typography>
      </Box>
    );
  }

  if (!isAuthorized) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '65vh',
          px: 2,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, sm: 5 },
            maxWidth: 480,
            width: '100%',
            textAlign: 'center',
            borderRadius: 4,
            border: '1px solid #fee2e2',
            bgcolor: '#fffafb',
            boxShadow: '0 10px 25px -5px rgba(239, 68, 68, 0.08)',
          }}
        >
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              bgcolor: '#fee2e2',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2.5,
            }}
          >
            <LockPersonIcon sx={{ fontSize: 38 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#991b1b', mb: 1 }}>
            ไม่มีสิทธิ์เข้าถึงหน้านี้
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mb: 3.5, lineHeight: 1.6 }}>
            หน้านี้สงวนไว้สำหรับผู้ดูแลระบบ (Admin Only) เท่านั้น หากท่านต้องการขออนุมัติหรือสร้างคำขอสั่งซื้อ กรุณากลับสู่หน้าหลัก
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => objRouter.push('/procurement')}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1.1,
              bgcolor: '#2563eb',
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
              '&:hover': {
                bgcolor: '#1d4ed8',
              },
            }}
          >
            กลับสู่หน้ารายการสินค้า
          </Button>
        </Paper>
      </Box>
    );
  }

  return <>{children}</>;
}
