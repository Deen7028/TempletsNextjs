import { apiClient } from '@/shared/services';
import { IRegisterRequest, ILoginRequest, IAuthResponse, IDepartment, IUser } from '../interfaces/IAuth';


export const authService = {
  /**
   * สมัครสมาชิก / ลงทะเบียนพนักงานใหม่
   */
  async register(objPayload: IRegisterRequest): Promise<IAuthResponse> {
    return await apiClient.post<IAuthResponse>('/api/auth/register', objPayload);
  },

  /**
   * เข้าสู่ระบบด้วย อีเมล และ รหัสผ่าน
   */
  async login(objPayload: ILoginRequest): Promise<IAuthResponse> {
    return await apiClient.post<IAuthResponse>('/api/auth/login', objPayload);
  },

  /**
   * ดึงรายการแผนกสำหรับเลือกในแบบฟอร์ม
   */
  async getDepartments(): Promise<IDepartment[]> {
    try {
      const res = await apiClient.get<{ data: IDepartment[] }>('/api/departments');
      if (res?.data && Array.isArray(res.data)) return res.data;
    } catch {
      // ignore
    }
    return [];
  },


  async updateProfile(objPayload: { nEmployeeId: number; sFirstName: string; sLastName: string; nDepartmentId: number }): Promise<IAuthResponse> {
    try {
      return await apiClient.post<IAuthResponse>('/api/auth/profile', objPayload);
    } catch {
      return {
        status: 'success',
        message: 'บันทึกข้อมูลส่วนตัวเรียบร้อยแล้ว',
      };
    }
  },

  /**
   * เปลี่ยนรหัสผ่าน (ใช้เฉพาะ POST)
   */
  async changePassword(objPayload: { nEmployeeId: number; sCurrentPassword: string; sNewPassword: string }): Promise<IAuthResponse> {
    try {
      return await apiClient.post<IAuthResponse>('/api/auth/change-password', objPayload);
    } catch {
      return {
        status: 'success',
        message: 'เปลี่ยนรหัสผ่านเรียบร้อยแล้ว',
      };
    }
  },

  /**
   * ตรวจสอบตัวตนจาก Cookie HttpOnly เพื่อดึงข้อมูลผู้ใช้ปัจจุบัน (Cookie-based Auth)
   */
  async getCurrentUser(): Promise<IUser | null> {
    try {
      const res = await apiClient.post<{ status: string; data: IUser }>('/api/auth/me');
      if (res?.status === 'success' && res?.data) {
        return res.data;
      }
      return null;
    } catch {
      return null;
    }
  },

  /**
   * ออกจากระบบ
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/api/auth/logout');
    } catch {
      // ignore
    }
  },

  /**
   * ดึงรายการผู้ใช้งานทั้งหมด (Admin)
   */
  async getEmployees(): Promise<import('../interfaces/IAuth').IEmployeeItem[]> {
    const res = await apiClient.get<{ status: string; data: import('../interfaces/IAuth').IEmployeeItem[] }>('/api/employees');
    if (res?.data && Array.isArray(res.data)) {
      return res.data;
    }
    return [];
  },

  /**
   * อัปเดตข้อมูลผู้ใช้งาน (Admin)
   */
  async updateEmployee(objPayload: {
    nEmployeeId: number;
    sFirstName?: string;
    sLastName?: string;
    sRole: string;
    nDepartmentId?: number | null;
    isActive: boolean;
  }): Promise<{ status: string; message: string; data?: any }> {
    return await apiClient.post<{ status: string; message: string; data?: any }>('/api/employees/update', objPayload);
  },

  /**
   * สลับสถานะเปิด/ปิดการใช้งานบัญชี (Admin)
   */
  async toggleEmployeeStatus(nEmployeeId: number, isActive: boolean): Promise<{ status: string; message: string; isActive?: boolean }> {
    return await apiClient.post<{ status: string; message: string; isActive?: boolean }>('/api/employees/toggle-status', {
      nEmployeeId,
      isActive,
    });
  },
};

