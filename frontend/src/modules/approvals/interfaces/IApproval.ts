export interface IPurchaseRequestItem {
  nRequestItemId?: number;
  nRequestId?: number;
  nProductId?: number | null;
  sProductCode?: string;
  sSnapshotProductName: string;
  sSnapshotUnit: string;
  nQuantity: number;
  sRemarks?: string | null;
  isCustomItem?: boolean;
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
  sRemarks?: string | null;
}

export interface IPurchaseOrder {
  nPoId?: number;
  sPoNumber: string;
  nRequestId: number;
  dtPoDate: string;
  dtDeliveryDate: string;
  sStatus?: string;
  sDepartmentName?: string;
  lstItems?: IPurchaseOrderItem[];
}
