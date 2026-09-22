export interface IProduct {
  nProductId: number;
  sProductCode: string;
  sProductName: string;
  sUnit: string;
  sCategory?: string | null;
  sRemarks?: string | null;
  isActive: boolean;
}
