//  Shared for backend calls, storage
export interface BaseCategory {
  id: string;
  name: string;
  status?: 'active' | 'inactive';
  productCount?: number;
  productTypeId?: string;
  description?: string;
}

//  Used only when slug is present (e.g. in CategoryList)
export interface Category extends BaseCategory {
  slug?: string; // required here
}