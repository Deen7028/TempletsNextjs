import React from 'react';
import { Metadata } from 'next';
import { AdminDepartmentManagementContainer } from '@/modules/departments';

export const metadata: Metadata = {
  title: 'จัดการข้อมูลแผนก - ระบบสั่งของ PO/PR',
  description: 'เพิ่มและจัดการข้อมูลแผนกในองค์กร',
};

export default function AdminDepartmentsPage() {
  return <AdminDepartmentManagementContainer />;
}
