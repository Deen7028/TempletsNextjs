import React from 'react';
import { Metadata } from 'next';
import { CartContainer } from '@/modules/purchasing';

export const metadata: Metadata = {
  title: 'ตะกร้าสินค้า (Cart) - ระบบสั่งของ PO/PR',
  description: 'ตรวจสอบรายการสินค้าในตะกร้าและสร้างเอกสารคำขอสั่งซื้อ (PR)',
};

export default function CartPage() {
  return <CartContainer />;
}
