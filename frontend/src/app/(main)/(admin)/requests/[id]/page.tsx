import React from 'react';
import { Metadata } from 'next';
import { AdminRequestDetailContainer } from '@/modules/approvals';

export const metadata: Metadata = {
  title: 'รายละเอียดคำขอ - ระบบสั่งของ PO/PR',
  description: 'ตรวจสอบรายละเอียดและอนุมัติคำขอสั่งซื้อ',
};

export default async function AdminRequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const nRequestId = parseInt(resolvedParams.id, 10) || 1;

  return <AdminRequestDetailContainer nRequestId={nRequestId} />;
}
