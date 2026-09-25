import { apiClient } from '@/shared';
import { IPurchaseRequest } from '../interfaces/IPurchasing';

export const purchasingService = {
  /**
   * ส่งคำขอสั่งซื้อ (PR) บันทึกลงฐานข้อมูล
   */
  async createPurchaseRequest(objPayload: IPurchaseRequest): Promise<{ status: string; message: string; data?: any }> {
    const res = await apiClient.post<{ status: string; message: string; data?: any }>('/api/purchaserequests', objPayload);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('api-update', { detail: { sEntityType: 'PurchaseRequest' } }));
    }
    return res;
  },
};
