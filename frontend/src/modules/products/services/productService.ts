import { apiClient } from '@/shared';
import { IProduct } from '../interfaces/IProduct';

export const productService = {
  /**
   * ดึงรายการสินค้าทั้งหมดจากฐานข้อมูล (รองรับการค้นหา)
   */
  async getProducts(sKeyword?: string): Promise<IProduct[]> {
    const url = sKeyword ? `/api/products?search=${encodeURIComponent(sKeyword)}` : '/api/products';
    const res = await apiClient.get<{ status: string; data: IProduct[] }>(url);
    if (res?.data && Array.isArray(res.data)) {
      return res.data;
    }
    return [];
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
