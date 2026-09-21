import { apiClient } from '@/shared';
import { IDepartment } from '../interfaces/IDepartment';

export const departmentService = {
  /**
   * ดึงรายการแผนกทั้งหมด
   */
  async getDepartments(): Promise<IDepartment[]> {
    const res = await apiClient.get<{ status: string; data: IDepartment[] }>('/api/departments');
    if (res?.data && Array.isArray(res.data)) {
      return res.data;
    }
    return [];
  },

  /**
   * เพิ่มแผนกใหม่ (Admin)
   */
  async createDepartment(objPayload: { sDepartmentCode: string; sDepartmentName: string }): Promise<{ status: string; message: string; data?: any }> {
    return await apiClient.post<{ status: string; message: string; data?: any }>('/api/departments', objPayload);
  },

  /**
   * แก้ไขข้อมูลแผนก (Admin) - ใช้ POST
   */
  async updateDepartment(nDepartmentId: number, objPayload: { sDepartmentName: string }): Promise<{ status: string; message: string; data?: any }> {
    return await apiClient.post<{ status: string; message: string; data?: any }>('/api/departments/update', {
      nDepartmentId,
      ...objPayload,
    });
  },

  /**
   * ลบข้อมูลแผนก (Admin) - ใช้ POST
   */
  async deleteDepartment(nDepartmentId: number): Promise<{ status: string; message: string }> {
    return await apiClient.post<{ status: string; message: string }>('/api/departments/delete', { nDepartmentId });
  },
};
