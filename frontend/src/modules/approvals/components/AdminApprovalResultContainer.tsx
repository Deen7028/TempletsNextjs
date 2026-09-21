'use client';

import React from 'react';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArticleIcon from '@mui/icons-material/Article';
import HomeIcon from '@mui/icons-material/Home';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface IAdminApprovalResultProps {
  nRequestId: number;
}

export const AdminApprovalResultContainer: React.FC<IAdminApprovalResultProps> = ({ nRequestId }) => {
  const searchParams = useSearchParams();
  const poNumber = searchParams.get('poNumber') || 'PO-20250920-001';

  return (
    <Box
      sx={{
        mx: 'auto',
        px: { xs: 1.5, sm: 2.5 },
        py: { xs: 4, sm: 6 },
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Card
        sx={{
          width: '100%',
          borderRadius: 3.5,
          border: '1px solid #e2e8f0',
          boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
          textAlign: 'center',
          p: { xs: 2.5, sm: 4 },
        }}
      >
        <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: '#047857',
              color: '#ffffff',
              mb: 3,
              boxShadow: '0 8px 24px rgba(4, 120, 87, 0.25)',
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 52 }} />
          </Box>

          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: '#047857',
              fontSize: { xs: '1.35rem', sm: '1.6rem' },
              mb: 1.5,
            }}
          >
            อนุมัติรายการแล้ว
          </Typography>

          <Typography variant="body1" sx={{ color: '#334155', fontWeight: 500, lineHeight: 1.6, mb: 3 }}>
            รายการสั่งซื้อเลขที่ <b>{poNumber}</b>
            <br />
            ได้ถูกส่งไปยังฝ่ายจัดซื้อเรียบร้อยแล้ว
          </Typography>

          <Button
            component={Link}
            href={`/admin/requests/${nRequestId}`}
            variant="outlined"
            fullWidth
            size="large"
            startIcon={<ArticleIcon />}
            sx={{
              mb: 1.8,
              py: 1.2,
              borderRadius: 2.5,
              borderColor: '#cbd5e1',
              color: '#334155',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': {
                borderColor: '#94a3b8',
                bgcolor: '#f8fafc',
              },
            }}
          >
            ดูรายละเอียด
          </Button>

          <Button
            component={Link}
            href="/admin/requests"
            variant="contained"
            fullWidth
            size="large"
            startIcon={<HomeIcon />}
            sx={{
              py: 1.3,
              borderRadius: 2.5,
              bgcolor: '#2563eb',
              '&:hover': { bgcolor: '#1d4ed8' },
              fontWeight: 700,
              fontSize: '1rem',
              boxShadow: '0 4px 12px rgba(37, 99, 255, 0.25)',
              textTransform: 'none',
              mb: 3,
            }}
          >
            กลับหน้าหลัก
          </Button>

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.78rem' }}>
            * หากต้องการแก้ไขรายการ สามารถติดต่อ Admin ได้ที่ ...
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};
