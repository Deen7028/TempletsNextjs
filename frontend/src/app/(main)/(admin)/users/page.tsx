import React from 'react';
import { Metadata } from 'next';
import { AdminUserManagementContainer } from '@/modules/auth';

export const metadata: Metadata = {
  title: 'จัดการบัญชีผู้ใช้งาน | ระบบสั่งของ PO/PR',
  description: 'จัดการบทบาท (Role), แผนก และการเปิด/ปิดบัญชีผู้ใช้งาน',
};

export default function AdminUsersPage() {
  return <AdminUserManagementContainer />;
}
