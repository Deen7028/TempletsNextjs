import React from 'react';
import { Metadata } from 'next';
import { AdminRequestListContainer } from '@/modules/approvals';

export const metadata: Metadata = {
  title: 'รายการที่รอตรวจสอบ - ระบบสั่งของ PO/PR',
  description: 'ตรวจสอบและอนุมัติคำขอสั่งซื้อสินค้า',
};

export default function AdminRequestsPage() {
  return <AdminRequestListContainer />;
}
