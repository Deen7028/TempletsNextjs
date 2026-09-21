import { apiClient } from '@/shared';
import { IPurchaseRequest } from '../interfaces/IPurchasing';

export const purchasingService = {
  /**
   * ส่งคำขอสั่งซื้อ (PR) บันทึกลงฐานข้อมูล
   */
  async createPurchaseRequest(objPayload: IPurchaseRequest): Promise<{ status: string; message: string; data?: any }> {
    return await apiClient.post<{ status: string; message: string; data?: any }>('/api/purchaserequests', objPayload);
  },
};
