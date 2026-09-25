import { apiClient } from '@/shared';
import { IPurchaseRequest, IAdminReviewRequest, IAdminReviewResponse } from '../interfaces/IApproval';

export interface IPaginatedResult<T> {
  data: T[];
  total: number;
}

export const approvalService = {
  /**
   * ดึงรายการคำขอสั่งซื้อ (PR) ทั้งหมดสำหรับ Admin (รองรับแบ่งหน้าและค้นหา)
   */
  async getPurchaseRequests(sStatus?: string, sKeyword?: string, nPage: number = 1, nPageSize: number = 0): Promise<IPaginatedResult<IPurchaseRequest>> {
    const params = new URLSearchParams();
    if (sStatus && sStatus !== 'ALL') params.append('status', sStatus);
    if (sKeyword) params.append('search', sKeyword);
    if (nPage) params.append('page', nPage.toString());
    if (nPageSize) params.append('pageSize', nPageSize.toString());

    const queryString = params.toString();
    const url = queryString ? `/api/purchaserequests?${queryString}` : '/api/purchaserequests';
    const res = await apiClient.get<{ status: string; data: IPurchaseRequest[]; total?: number }>(url);
    const lstData = res?.data && Array.isArray(res.data) ? res.data : [];
    return {
      data: lstData,
      total: res?.total ?? lstData.length,
    };
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
