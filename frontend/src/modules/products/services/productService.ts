import { apiClient } from '@/shared';
import { IProduct } from '../interfaces/IProduct';

export interface IPaginatedResult<T> {
  data: T[];
  total: number;
}

export const productService = {
  /**
   * ดึงรายการสินค้าทั้งหมดจากฐานข้อมูล (รองรับการค้นหาและแบ่งหน้า)
   */
  async getProducts(sKeyword?: string, nPage: number = 1, nPageSize: number = 0): Promise<IPaginatedResult<IProduct>> {
    const params = new URLSearchParams();
    if (sKeyword) params.append('search', sKeyword);
    if (nPage) params.append('page', nPage.toString());
    if (nPageSize) params.append('pageSize', nPageSize.toString());

    const queryString = params.toString();
    const url = queryString ? `/api/products?${queryString}` : '/api/products';
    const res = await apiClient.get<{ status: string; data: IProduct[]; total?: number }>(url);
    const lstData = res?.data && Array.isArray(res.data) ? res.data : [];
    return {
      data: lstData,
      total: res?.total ?? lstData.length,
    };
  },

  /**
   * เพิ่มสินค้าใหม่ (Admin)
   */
  async createProduct(objPayload: Partial<IProduct>): Promise<{ status: string; message: string; data?: any }> {
    return await apiClient.post<{ status: string; message: string; data?: any }>('/api/products', objPayload);
  },

  /**
   * แก้ไขข้อมูลสินค้า (Admin) - ใช้ POST
   */
  async updateProduct(nProductId: number, objPayload: Partial<IProduct>): Promise<{ status: string; message: string; data?: any }> {
    return await apiClient.post<{ status: string; message: string; data?: any }>('/api/products/update', {
      nProductId,
      ...objPayload,
    });
  },

  /**
   * ลบข้อมูลสินค้า (Admin) - ใช้ POST
   */
  async deleteProduct(nProductId: number): Promise<{ status: string; message: string }> {
    return await apiClient.post<{ status: string; message: string }>('/api/products/delete', { nProductId });
  },
};
