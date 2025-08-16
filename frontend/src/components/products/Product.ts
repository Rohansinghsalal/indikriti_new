// Define Product type
export interface Product {
  id: string;
  productId: string;
  sku: string;
  name: string;
  description: string;
  mrp: number;
  sellingPrice: number;
  stockQuantity: number;
  batchNo: string;
  productType: string;
  category: string;
  subcategory: string;
  brand: string;
  status: 'active' | 'inactive' | 'draft';
  images?: string[];
  price: number;
  image?: string;
  salePrice?: number;
  createdAt: string;
  updatedAt: string;

  // advanced fields below:
  discount?: number;
  specialDiscount?: number;
  longDescription?: string;
  finalPrice?: number;
  referralBonus?: number;
  loyaltyBonus?: number;
  usp1?: string;
  usp2?: string;
  usp3?: string;
  usps?: string[];
  hsn?: string;
  gst?: number;
  productStyle?: string;
}