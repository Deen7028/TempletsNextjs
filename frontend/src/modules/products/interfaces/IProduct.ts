export interface IProduct {
  nProductId: number;
  sProductCode: string;
  sProductName: string;
  sUnit: string;
  dUnitPrice?: number;
  sCategory?: string | null;
  sImageUrl?: string | null;
  nDefaultSupplierId?: number | null;
  isActive: boolean;
}
