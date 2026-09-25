import { apiClient } from '@/shared';
import { IDepartment } from '../interfaces/IDepartment';

export interface IPaginatedResult<T> {
  data: T[];
  total: number;
}

export const departmentService = {
  /**
   * ดึงรายการแผนกทั้งหมด (รองรับค้นหาและแบ่งหน้า)
   */
  async getDepartments(sKeyword?: string, nPage: number = 1, nPageSize: number = 0): Promise<IPaginatedResult<IDepartment>> {
    const params = new URLSearchParams();
    if (sKeyword) params.append('search', sKeyword);
    if (nPage) params.append('page', nPage.toString());
    if (nPageSize) params.append('pageSize', nPageSize.toString());

    const queryString = params.toString();
    const url = queryString ? `/api/departments?${queryString}` : '/api/departments';
    const res = await apiClient.get<{ status: string; data: IDepartment[]; total?: number }>(url);
    const lstData = res?.data && Array.isArray(res.data) ? res.data : [];
    return {
      data: lstData,
      total: res?.total ?? lstData.length,
    };
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
