import React from 'react';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { AdminApprovalResultContainer } from '@/modules/approvals';
import { Box, CircularProgress } from '@mui/material';

export const metadata: Metadata = {
  title: 'แจ้งผลการตรวจสอบ - ระบบสั่งของ PO/PR',
  description: 'ผลการตรวจสอบและอนุมัติคำขอสั่งซื้อสินค้า',
};

export default async function AdminApprovalResultPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const nRequestId = parseInt(resolvedParams.id, 10) || 1;

  return (
    <Suspense
      fallback={
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      }
    >
      <AdminApprovalResultContainer nRequestId={nRequestId} />
    </Suspense>
  );
}
