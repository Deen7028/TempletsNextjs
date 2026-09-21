import { IProduct } from '@/modules/products';

export interface IPurchaseRequestItem {
  nRequestItemId?: number;
  nRequestId?: number;
  nProductId: number;
  sProductCode?: string;
  sSnapshotProductName: string;
  sSnapshotUnit: string;
  dUnitPrice?: number;
  nQuantity: number;
  dLineTotal?: number;
  sRemarks?: string | null;
}

export interface IPurchaseRequest {
  nRequestId?: number;
  sRequestNo: string;
  nDepartmentId: number;
  sDepartmentName?: string;
  sDepartmentCode?: string;
  nRequestedByEmployeeId: number;
  sRequestedByName?: string;
  sStatus: string;
  sAdminRemarks?: string | null;
  nItemCount?: number;
  dTotalAmount?: number;
  dtCreatedAt?: string;
  dtUpdatedAt?: string;
  sGeneratedPoNumber?: string | null;
  nPoId?: number | null;
  lstItems: IPurchaseRequestItem[];
}

export interface ICartItem {
  objProduct: IProduct;
  nQuantity: number;
  sRemarks?: string;
}

export interface ICartSummary {
  nTotalItems: number;
  nTotalQuantity: number;
  dSubTotal: number;
  dVatAmount: number;
  dGrandTotal: number;
}
