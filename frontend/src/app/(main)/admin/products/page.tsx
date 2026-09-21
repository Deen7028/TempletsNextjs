import React from 'react';
import { Metadata } from 'next';
import { AdminProductManagementContainer } from '@/modules/products';

export const metadata: Metadata = {
  title: 'จัดการข้อมูลสินค้า (Admin) - ระบบสั่งของ PO/PR',
  description: 'เพิ่มและจัดการข้อมูลสินค้าสำหรับขอสั่งซื้อ',
};

export default function AdminProductsPage() {
  return <AdminProductManagementContainer />;
}
