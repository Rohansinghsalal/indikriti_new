// Shared type definitions for product-related entities

export interface Brand {
  id: string;
  name: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  status: string;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface BrandCategory {
  id: number;
  name: string;
  description?: string;
  status: string;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Subcategory {
  id: number;
  name: string;
  description?: string;
  category_id: number;
  status: string;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface BrandSubcategory {
  id: number;
  name: string;
  description?: string;
  category_id: number;
  status: string;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProductType {
  id: number;
  name: string;
  description?: string;
  subcategory_id: number;
  status: string;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface BrandProductType {
  id: number;
  name: string;
  description?: string;
  subcategory_id: number;
  status: string;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

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
  
  // Advanced fields
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

export interface ProductFormData {
  name: string;
  description: string;
  mrp: number;
  sellingPrice: number;
  stockQuantity: number;
  batchNo: string;
  brand: string;
  categoryId: string;
  productTypeId: string;
  status: 'draft' | 'active' | 'inactive';
  hsn?: string;
  gst?: number;
}

export interface HierarchyFormData {
  name: string;
  description: string;
  sort_order: number;
}

export type HierarchyLevel = 'category' | 'subcategory' | 'productType';

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
