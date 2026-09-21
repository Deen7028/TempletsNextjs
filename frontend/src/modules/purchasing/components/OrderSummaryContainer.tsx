'use client';

import React, { useState } from 'react';
import { Box, Button, Card, CardContent, Typography, Divider, Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { IPurchaseRequestItem } from '../interfaces/IPurchasing';

interface IOrderSummaryProps {
  sDepartmentName: string;
  sEmployeeName: string;
  lstItems: IPurchaseRequestItem[];
  onSubmitOrder: () => void;
}

export const OrderSummaryContainer: React.FC<IOrderSummaryProps> = ({
  sDepartmentName,
  sEmployeeName,
  lstItems,
  onSubmitOrder,
}) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleConfirmSubmit = () => {
    setIsSubmitting(true);
    onSubmitOrder();
  };

  return (
    <Box sx={{ maxWidth: 720, mx: 'auto', px: { xs: 1, sm: 2 }, py: { xs: 1.5, sm: 2.5 }, width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2 }}>
        <ReceiptLongIcon sx={{ color: '#174785', fontSize: 28 }} />
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#174785' }}>
          สรุปรายการขอสั่งซื้อ (PR)
        </Typography>
      </Box>

      {/* บัตรสรุปข้อมูลผู้ขอซื้อ */}
      <Card
        sx={{
          borderRadius: 2.5,
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          mb: 2.5,
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 1.5,
            }}
          >
            <Box>
              <Typography variant="caption" color="text.secondary">
                สังกัดแผนก:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                {sDepartmentName || '-'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                ผู้ขอสั่งซื้อ (Requested By):
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                {sEmployeeName || '-'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                จำนวนรายการทั้งหมด:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#2563eb' }}>
                {lstItems.length} รายการ
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* รายการสินค้าที่เลือก */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
        {lstItems.map((objItem, index) => (
          <Card
            key={objItem.nProductId || index}
            variant="outlined"
            sx={{
              borderRadius: 2,
              borderColor: '#e2e8f0',
            }}
          >
            <CardContent
              sx={{
                py: 1.5,
                px: { xs: 1.5, sm: 2 },
                '&:last-child': { pb: 1.5 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1.5,
              }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: '#1e293b',
                    wordBreak: 'break-word',
                  }}
                >
                  {objItem.sSnapshotProductName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  หน่วย: {objItem.sSnapshotUnit}
                </Typography>
              </Box>

              <Chip
                label={`จำนวน: ${objItem.nQuantity} ${objItem.sSnapshotUnit}`}
                color="primary"
                variant="outlined"
                size="small"
                sx={{
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  borderRadius: 1.5,
                  px: 0.5,
                }}
              />
            </CardContent>
          </Card>
        ))}
      </Box>

      <Divider sx={{ my: 3 }} />

      <Button
        variant="contained"
        fullWidth
        size="large"
        disabled={isSubmitting || lstItems.length === 0}
        onClick={handleConfirmSubmit}
        startIcon={<CheckCircleIcon />}
        sx={{
          py: 1.2,
          fontWeight: 700,
          fontSize: '1rem',
          borderRadius: 2.5,
          bgcolor: '#2563eb',
          '&:hover': { bgcolor: '#1d4ed8' },
        }}
      >
        {isSubmitting ? 'กำลังส่งคำขอ...' : 'ยืนยันส่งคำขอสั่งซื้อ (Submit PR)'}
      </Button>
    </Box>
  );
};
