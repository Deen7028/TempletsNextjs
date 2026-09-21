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

export interface IAdminReviewRequest {
  sAction: 'APPROVE' | 'REVISION' | 'REJECT';
  nActionByEmployeeId: number;
  sRemarks?: string;
}

export interface IAdminReviewResponse {
  status: string;
  message: string;
  data?: {
    nRequestId: number;
    sRequestNo: string;
    sStatus: string;
    sPoNumber?: string;
    nPoId?: number;
  };
}

export interface IPurchaseOrderItem {
  nPoItemId?: number;
  nPoId?: number;
  nItemSeq: number;
  sProductCode: string;
  sProductName: string;
  nQuantity: number;
  sUnit: string;
  dUnitPrice?: number;
  dLineTotal?: number;
  sRemarks?: string | null;
}

export interface IPurchaseOrder {
  nPoId?: number;
  sPoNumber: string;
  nRequestId: number;
  nSupplierId: number;
  nLocationId: number;
  dtPoDate: string;
  dtDeliveryDate: string;
  sRequiredTime?: string | null;
  sPaymentTerm?: string | null;
  sPaymentMethod?: string | null;
  dSubTotal?: number;
  dVatAmount?: number;
  dGrandTotal?: number;
  sStatus?: string;
  sSupplierName?: string;
  sDepartmentName?: string;
  lstItems?: IPurchaseOrderItem[];
}
