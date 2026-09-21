import { apiClient } from '@/shared';
import { IPurchaseRequest, IAdminReviewRequest, IAdminReviewResponse } from '../interfaces/IApproval';

export const approvalService = {
  /**
   * ดึงรายการคำขอสั่งซื้อ (PR) ทั้งหมดสำหรับ Admin
   */
  async getPurchaseRequests(sStatus?: string): Promise<IPurchaseRequest[]> {
    const url = sStatus && sStatus !== 'ALL' 
      ? `/api/purchaserequests?status=${encodeURIComponent(sStatus)}`
      : '/api/purchaserequests';
    const res = await apiClient.get<{ status: string; data: IPurchaseRequest[] }>(url);
    if (res?.data && Array.isArray(res.data)) {
      return res.data;
    }
    return [];
  },

  /**
   * ดึงรายละเอียดคำขอสั่งซื้อ (PR) พร้อมรายการสินค้า
   */
  async getPurchaseRequestById(nRequestId: number): Promise<IPurchaseRequest | null> {
    const res = await apiClient.get<{ status: string; data: IPurchaseRequest }>(`/api/purchaserequests/${nRequestId}`);
    if (res?.data) {
      return res.data;
    }
    return null;
  },

  /**
   * อนุมัติ, ส่งกลับแก้ไข หรือ ปฏิเสธคำขอสั่งซื้อ (Admin Review)
   */
  async reviewPurchaseRequest(
    nRequestId: number,
    objPayload: IAdminReviewRequest
  ): Promise<IAdminReviewResponse> {
    return await apiClient.post<IAdminReviewResponse>(
      `/api/purchaserequests/${nRequestId}/review`,
      objPayload
    );
  },
};
