export interface IProduct {
  nProductId: number;
  sProductCode: string;
  sProductName: string;
  sUnit: string;
  sRemarks?: string | null;
  isActive: boolean;
}
