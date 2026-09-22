import React from 'react';
import { Metadata } from 'next';
import { ProcurementContainer } from '@/modules/purchasing';

// บังคับให้หน้า Route นี้ดึงข้อมูลสดเสมอ ไม่ทำ Cache (Force Dynamic)
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export const metadata: Metadata = {
  title: 'สั่งซื้อสินค้า (Procurement) - ระบบสั่งของ PO/PR',
  description: 'ค้นหาและเลือกสั่งซื้อสินค้าในระบบจัดซื้อจัดจ้าง',
};

export default function ProcurementPage() {
  return <ProcurementContainer />;
}