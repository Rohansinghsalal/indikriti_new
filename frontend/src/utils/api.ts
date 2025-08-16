import axios from 'axios';
import { User } from '@/context/AuthContext';
import * as analytics from './analyticsApi';





// API base URL - use mock mode for development
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// This flag enables mock data mode when true (no real API calls)
const USE_MOCK_DATA = false;

// Create an axios instance with default config
const instance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  // Do not use withCredentials to avoid CORS issues
  withCredentials: false,
  // Add timeout to prevent hanging requests
  timeout: 10000
});

// Add authorization token to requests
instance.interceptors.request.use(config => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  // If sending FormData, let the browser set the proper Content-Type with boundary
  if (config.data instanceof FormData) {
    if (config.headers && 'Content-Type' in config.headers) {
      delete (config.headers as any)['Content-Type'];
    }
  }
  return config;
}, error => {
  console.error('Request error:', error);
  return Promise.reject(error);
});

// Token refresh state management
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

// Handle token expiration or auth errors with enhanced refresh flow
instance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config as any;

    // Handle network errors
    if (!error.response) {
      console.error('Network Error: No response from server. Please check if the backend server is running.');
      return Promise.reject(new Error('Network error. Please check your connection and ensure the server is running.'));
    }

    // Attempt refresh once on 401
    if (error.response?.status === 401 && !originalRequest?._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return instance(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
        if (!refreshToken) {
          throw new Error('Missing refresh token');
        }

        console.log('🔄 Refreshing expired token...');
        const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh-token`, { refreshToken });
        const newToken = refreshResponse?.data?.token;

        if (!newToken) {
          throw new Error('No token returned from refresh');
        }

        if (typeof window !== 'undefined') {
          localStorage.setItem('token', newToken);
        }

        console.log('✅ Token refreshed successfully');

        // Process queued requests
        processQueue(null, newToken);

        // Retry original request with new token
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return instance(originalRequest);

      } catch (refreshErr) {
        console.error('❌ Token refresh failed:', refreshErr);

        // Process queued requests with error
        processQueue(refreshErr, null);

        // On refresh failure, force logout
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('userType');
          window.location.href = '/login';
        }
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Mock data for development
const MOCK_USERS = [
  {
    id: '1',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    role: 'admin',
    permissions: ['all'],
    userType: 'admin',
    accessLevel: 'super-admin',
    isSuperAdmin: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: '2',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    role: 'manager',
    permissions: ['view', 'edit'],
    userType: 'admin',
    accessLevel: 'manager',
    isSuperAdmin: false,
    createdAt: '2023-01-02T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z'
  },
  {
    id: '3',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    role: 'staff',
    permissions: ['view'],
    userType: 'admin',
    accessLevel: 'staff',
    isSuperAdmin: false,
    createdAt: '2023-01-03T00:00:00Z',
    updatedAt: '2023-01-03T00:00:00Z'
  }
];

const MOCK_ORDERS = [
  {
    id: '1',
    customer: 'John Smith',
    status: 'completed',
    total: 99.99,
    items: 3,
    date: '2023-04-15T10:30:00Z'
  },
  {
    id: '2',
    customer: 'Jane Doe',
    status: 'processing',
    total: 149.99,
    items: 2,
    date: '2023-04-16T14:45:00Z'
  },
  {
    id: '3',
    customer: 'Bob Johnson',
    status: 'pending',
    total: 79.99,
    items: 1,
    date: '2023-04-14T09:15:00Z'
  },
  {
    id: '4',
    customer: 'Alice Brown',
    status: 'completed',
    total: 199.99,
    items: 4,
    date: '2023-04-13T16:20:00Z'
  },
  {
    id: '5',
    customer: 'Charlie Davis',
    status: 'cancelled',
    total: 49.99,
    items: 1,
    date: '2023-04-12T11:10:00Z'
  }
];

const MOCK_PRODUCTS = [
  {
    id: '1',
    productId: 'IK-BS-001',
    name: 'Handloom Cotton Bedsheet',
    sku: 'HCBS-001',
    price: 1999.99,
    mrp: 2499.99,
    stockQuantity: 25,
    batchNo: 'B2023-01',
    productType: '1', // Handloom
    category: '1', // Bedsheet
    subcategory: '1', // Cotton
    brand: 'indikriti',
    status: 'active',
    image: '/assets/images/placeholder.jpg'
  },
  {
    id: '2',
    productId: 'IK-TR-001',
    name: 'Linen Table Runner',
    sku: 'LTR-001',
    price: 799.99,
    mrp: 999.99,
    stockQuantity: 15,
    batchNo: 'B2023-02',
    productType: '1', // Handloom
    category: '2', // Runner
    subcategory: '3', // Linen
    brand: 'indikriti',
    status: 'active',
    image: '/assets/images/placeholder.jpg'
  },
  {
    id: '3',
    productId: 'WL-ST-001',
    name: 'Traditional Silk Suit',
    sku: 'TSS-001',
    price: 3999.99,
    mrp: 4999.99,
    stockQuantity: 8,
    batchNo: 'B2023-03',
    productType: '1', // Handloom
    category: '3', // Suits
    subcategory: '4', // Traditional
    brand: 'winsomeLane',
    status: 'active',
    image: '/assets/images/placeholder.jpg'
  },
  {
    id: '4',
    productId: 'WL-SH-001',
    name: 'Formal Shirt',
    sku: 'FS-001',
    price: 1499.99,
    mrp: 1799.99,
    stockQuantity: 30,
    batchNo: 'B2023-04',
    productType: '2', // Readymade
    category: '4', // Shirts
    subcategory: '',
    brand: 'winsomeLane',
    status: 'active',
    image: '/assets/images/placeholder.jpg'
  }
];

// Mock data for product hierarchy
const MOCK_PRODUCT_TYPES = [
  { id: '1', name: 'Handloom', description: 'Traditional handloom products' },
  { id: '2', name: 'Readymade', description: 'Ready to wear garments' }
];

const MOCK_CATEGORIES = [
  { id: '1', name: 'Bedsheet', productTypeId: '1', description: 'Handloom bedsheets' },
  { id: '2', name: 'Runner', productTypeId: '1', description: 'Table runners' },
  { id: '3', name: 'Suits', productTypeId: '1', description: 'Traditional suits' },
  { id: '4', name: 'Shirts', productTypeId: '2', description: 'Ready to wear shirts' }
];

const MOCK_SUBCATEGORIES = [
  { id: '1', name: 'Cotton', categoryId: '1', description: 'Cotton bedsheets' },
  { id: '2', name: 'Silk', categoryId: '1', description: 'Silk bedsheets' },
  { id: '3', name: 'Linen', categoryId: '2', description: 'Linen table runners' },
  { id: '4', name: 'Traditional', categoryId: '3', description: 'Traditional suits' },
  { id: '5', name: 'Modern', categoryId: '3', description: 'Modern suits' }
];

// Authentication endpoints
const auth = {
  login: async (email?: string, password?: string, userType: 'admin' = 'admin') => {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      // Store mock token
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', 'mock-jwt-token');
        localStorage.setItem('userType', 'admin');
      }
      return {
        success: true,
        token: 'mock-jwt-token',
        user: MOCK_USERS[0],
        userType: 'admin'
      };
    }

    try {
      const response = await instance.post('/auth/login', { email, password, userType });
      // Persist tokens for refresh flow
      if (typeof window !== 'undefined') {
        const token = (response.data as any)?.token;
        const refreshToken = (response.data as any)?.refreshToken;
        if (token) localStorage.setItem('token', token);
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('userType', 'admin');
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: async () => {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      // Clear mock token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
      }
      return { success: true };
    }

    try {
      const response = await instance.post('/auth/logout');
      return response.data;
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local storage on error
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
      }
      throw error;
    }
  },

  getMe: async () => {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return { 
        success: true,
        data: {
          user: MOCK_USERS[0],
          userType: 'admin'
        }
      };
    }

    try {
      const response = await instance.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  }
};

// User management endpoints
const users = {
  getAll: async (params: any = {}) => {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return { 
        success: true, 
        data: { 
          users: MOCK_USERS,
          total: MOCK_USERS.length,
          page: 1,
          limit: 10,
          totalPages: 1
        } 
      };
    }

    try {
      const response = await instance.get('/users', { params });
      return response.data;
    } catch (error) {
      console.error('Get users error:', error);
      throw error;
    }
  },

  getById: async (id: string | number) => {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      const user = MOCK_USERS.find(user => user.id === id.toString());
      return { 
        success: !!user, 
        data: user || null
      };
    }

    try {
      const response = await instance.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Get user ${id} error:`, error);
      throw error;
    }
  },

  create: async (userData: any) => {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      return { 
        success: true, 
        message: 'User created successfully',
        data: {
          ...userData,
          id: Math.random().toString(36).substring(2, 9)
        }
      };
    }

    try {
      const response = await instance.post('/users', userData);
      return response.data;
    } catch (error) {
      console.error('Create user error:', error);
      throw error;
    }
  },

  update: async (id: string | number, userData: any) => {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      return { 
        success: true, 
        message: 'User updated successfully',
        data: {
          ...userData,
          id
        }
      };
    }

    try {
      const response = await instance.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error(`Update user ${id} error:`, error);
      throw error;
    }
  },

  delete: async (id: string | number) => {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      return { 
        success: true, 
        message: 'User deleted successfully'
      };
    }

    try {
      const response = await instance.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Delete user ${id} error:`, error);
      throw error;
    }
  }
};

// Products endpoints
const products = {
  getAll: async (params: any = {}) => {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return { 
        success: true, 
        data: { 
          products: MOCK_PRODUCTS,
          total: MOCK_PRODUCTS.length,
          page: 1,
          limit: 10,
          totalPages: 1
        } 
      };
    }

    try {
      const response = await instance.get('/products', { params });
      return response.data;
    } catch (error) {
      console.error('Get products error:', error);
      throw error;
    }
  },

  getById: async (id: string | number) => {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      const product = MOCK_PRODUCTS.find(product => product.id === id.toString());
      return { 
        success: !!product, 
        data: product || null
      };
    }

    try {
      const response = await instance.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Get product ${id} error:`, error);
      throw error;
    }
  },

  create: async (productData: any) => {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      return { 
        success: true, 
        message: 'Product created successfully',
        data: {
          ...productData,
          id: Math.random().toString(36).substring(2, 9)
        }
      };
    }

    try {
      const response = await instance.post('/products', productData);
      console.log('API Response Status:', response.status);
      console.log('API Response Data:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Create product error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);

      // Re-throw with more context
      if (error.response?.data) {
        const apiError = new Error(error.response.data.message || error.response.data.error || 'API Error');
        (apiError as any).response = error.response;
        throw apiError;
      }

      throw error;
    }
  },

  update: async (id: string | number, productData: any) => {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      return { 
        success: true, 
        message: 'Product updated successfully',
        data: {
          ...productData,
          id
        }
      };
    }

    try {
      const response = await instance.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      console.error(`Update product ${id} error:`, error);
      throw error;
    }
  },

  delete: async (id: string | number) => {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      return { 
        success: true, 
        message: 'Product deleted successfully'
      };
    }

    try {
      const response = await instance.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Delete product ${id} error:`, error);
      throw error;
    }
  }
};

// Product Types endpoints
const productTypes = {
  getAll: async () => {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 400));
      return {
        success: true,
        data: MOCK_PRODUCT_TYPES
      };
    }

    try {
      const response = await instance.get('/product-types');
      return response.data;
    } catch (error) {
      console.error('Get product types error:', error);
      throw error;
    }
  },

  getById: async (id: string | number) => {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      const productType = MOCK_PRODUCT_TYPES.find(type => type.id === id.toString());
      return {
        success: !!productType,
        data: productType || null
      };
    }

    try {
      const response = await instance.get(`/product-types/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Get product type ${id} error:`, error);
      throw error;
    }
  },

  create: async (data: any) => {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        message: 'Product type created successfully',
        data: {
          ...data,
          id: Math.random().toString(36).substring(2, 9)
        }
      };
    }

    try {
      const response = await instance.post('/product-types', data);
      return response.data;
    } catch (error) {
      console.error('Create product type error:', error);
      throw error;
    }
  },

  update: async (id: string | number, data: any) => {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        message: 'Product type updated successfully',
        data: {
          ...data,
          id
        }
      };
    }

    try {
      const response = await instance.put(`/product-types/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Update product type ${id} error:`, error);
      throw error;
    }
  },

  delete: async (id: string | number) => {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        message: 'Product type deleted successfully'
      };
    }

    try {
      const response = await instance.delete(`/product-types/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Delete product type ${id} error:`, error);
      throw error;
    }
  }
};

// Categories endpoints
const categories = {
  getAll: async () => {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 400));
      return {
        success: true,
        data: MOCK_CATEGORIES
      };
    }

    try {
      const response = await instance.get('/categories');
      return response.data;
    } catch (error) {
      console.error('Get categories error:', error);
      throw error;
    }
  },

  getByProductType: async (productTypeId: string | number) => {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 400));
      const filteredCategories = MOCK_CATEGORIES.filter(
        category => category.productTypeId === productTypeId.toString()
      );
      return {
        success: true,
        data: filteredCategories
      };
    }

    try {
      const response = await instance.get(`/categories/by-product-type/${productTypeId}`);
      return response.data;
    } catch (error) {
      console.error(`Get categories by product type ${productTypeId} error:`, error);
      throw error;
    }
  },

  create: async (data: any) => {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        message: 'Category created successfully',
        data: {
          ...data,
          id: Math.random().toString(36).substring(2, 9)
        }
      };
    }

    try {
      const response = await instance.post('/categories', data);
      return response.data;
    } catch (error) {
      console.error('Create category error:', error);
      throw error;
    }
  },

  update: async (id: string | number, data: any) => {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        message: 'Category updated successfully',
        data: {
          ...data,
          id
        }
      };
    }

    try {
      const response = await instance.put(`/categories/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Update category ${id} error:`, error);
      throw error;
    }
  },

  delete: async (id: string | number) => {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        message: 'Category deleted successfully'
      };
    }

    try {
      const response = await instance.delete(`/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Delete category ${id} error:`, error);
      throw error;
    }
  }
};

// Subcategories endpoints
const subcategories = {
  getAll: async () => {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 400));
      return {
        success: true,
        data: MOCK_SUBCATEGORIES
      };
    }

    try {
      const response = await instance.get('/subcategories');
      return response.data;
    } catch (error) {
      console.error('Get subcategories error:', error);
      throw error;
    }
  },

  getByCategory: async (categoryId: string | number) => {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 400));
      const filteredSubcategories = MOCK_SUBCATEGORIES.filter(
        subcategory => subcategory.categoryId === categoryId.toString()
      );
      return {
        success: true,
        data: filteredSubcategories
      };
    }

    try {
      const response = await instance.get(`/subcategories/by-category/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error(`Get subcategories by category ${categoryId} error:`, error);
      throw error;
    }
  },

  create: async (data: any) => {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        message: 'Subcategory created successfully',
        data: {
          ...data,
          id: Math.random().toString(36).substring(2, 9)
        }
      };
    }

    try {
      const response = await instance.post('/subcategories', data);
      return response.data;
    } catch (error) {
      console.error('Create subcategory error:', error);
      throw error;
    }
  },

  update: async (id: string | number, data: any) => {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        message: 'Subcategory updated successfully',
        data: {
          ...data,
          id
        }
      };
    }

    try {
      const response = await instance.put(`/subcategories/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Update subcategory ${id} error:`, error);
      throw error;
    }
  },

  delete: async (id: string | number) => {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        message: 'Subcategory deleted successfully'
      };
    }

    try {
      const response = await instance.delete(`/subcategories/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Delete subcategory ${id} error:`, error);
      throw error;
    }
  }
};

// Orders endpoints
const orders = {
  getAll: async (params: any = {}) => {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return { 
        success: true, 
        data: { 
          orders: MOCK_ORDERS,
          total: MOCK_ORDERS.length,
          page: 1,
          limit: 10,
          totalPages: 1
        } 
      };
    }

    try {
      const response = await instance.get('/orders', { params });
      return response.data;
    } catch (error) {
      console.error('Get orders error:', error);
      throw error;
    }
  },

  getById: async (id: string | number) => {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      const order = MOCK_ORDERS.find(order => order.id === id.toString());
      return { 
        success: !!order, 
        data: order || null
      };
    }

    try {
      const response = await instance.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Get order ${id} error:`, error);
      throw error;
    }
  },
  update: async (id: string | number, data: any) => {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = MOCK_ORDERS.findIndex(order => order.id === id.toString());
    if (index !== -1) {
      MOCK_ORDERS[index] = { ...MOCK_ORDERS[index], ...data };
      return {
        success: true,
        message: 'Order updated successfully',
        data: MOCK_ORDERS[index]
      };
    } else {
      return {
        success: false,
        message: 'Order not found',
        data: null
      };
    }
  }

  try {
    const response = await instance.put(`/orders/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Update order ${id} error:`, error);
    throw error;
  }
}
};

// POS API endpoints
const pos = {
  // Get products for POS
  getProducts: async (params: any = {}) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        data: {
          products: [
            {
              id: 1,
              product_id: 'PROD-001',
              sku: 'SKU-001',
              name: 'Sample Product 1',
              selling_price: 299.99,
              mrp: 399.99,
              stock_quantity: 50,
              category: { id: 1, name: 'Electronics' },
              brand: 'indikriti',
              status: 'active'
            },
            {
              id: 2,
              product_id: 'PROD-002',
              sku: 'SKU-002',
              name: 'Sample Product 2',
              selling_price: 199.99,
              mrp: 249.99,
              stock_quantity: 25,
              category: { id: 2, name: 'Clothing' },
              brand: 'winsomeLane',
              status: 'active'
            }
          ],
          pagination: {
            current_page: 1,
            per_page: 50,
            total: 2,
            total_pages: 1
          }
        }
      };
    }

    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await instance.get(`/pos/products?${queryParams}`);
      return response.data;
    } catch (error: any) {
      console.error('Get POS products error:', error);
      throw error;
    }
  },

  // Get payment methods
  getPaymentMethods: async () => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        success: true,
        data: [
          { id: 1, name: 'Cash', code: 'CASH', type: 'cash', requires_reference: false },
          { id: 2, name: 'Credit Card', code: 'CREDIT_CARD', type: 'card', requires_reference: true },
          { id: 3, name: 'UPI', code: 'UPI', type: 'digital', requires_reference: true },
          { id: 4, name: 'Google Pay', code: 'GPAY', type: 'digital', requires_reference: true }
        ]
      };
    }

    try {
      const response = await instance.get('/pos/payment-methods');
      return response.data;
    } catch (error: any) {
      console.error('Get payment methods error:', error);
      throw error;
    }
  },

  // Create POS transaction
  createTransaction: async (transactionData: any) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        success: true,
        message: 'Transaction created successfully',
        data: {
          id: Date.now(),
          transaction_number: `TXN-${Date.now()}`,
          ...transactionData,
          status: 'completed',
          payment_status: 'paid',
          created_at: new Date().toISOString()
        }
      };
    }

    try {
      const response = await instance.post('/pos/transactions', transactionData);
      return response.data;
    } catch (error: any) {
      console.error('Create POS transaction error:', error);
      throw error;
    }
  },

  // Get POS transactions
  getTransactions: async (params: any = {}) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        data: {
          transactions: [],
          pagination: {
            current_page: 1,
            per_page: 20,
            total: 0,
            total_pages: 0
          }
        }
      };
    }

    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await instance.get(`/pos/transactions?${queryParams}`);
      return response.data;
    } catch (error: any) {
      console.error('Get POS transactions error:', error);
      throw error;
    }
  },

  // Get transaction by ID
  getTransactionById: async (id: string | number) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        success: true,
        data: {
          id,
          transaction_number: `TXN-${id}`,
          customer_name: 'Sample Customer',
          total_amount: 299.99,
          status: 'completed',
          payment_status: 'paid',
          items: [],
          payments: []
        }
      };
    }

    try {
      const response = await instance.get(`/pos/transactions/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Get POS transaction error:', error);
      throw error;
    }
  }
};

// Customers API endpoints
const customers = {
  // Get all customers
  getAll: async (params: any = {}) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        data: {
          customers: [
            {
              id: 1,
              name: 'John Doe',
              email: 'john@example.com',
              phone: '+91 9876543210',
              total_orders: 5,
              total_spent: 2499.95
            },
            {
              id: 2,
              name: 'Jane Smith',
              email: 'jane@example.com',
              phone: '+91 9876543211',
              total_orders: 3,
              total_spent: 1299.97
            }
          ],
          pagination: {
            current_page: 1,
            per_page: 50,
            total: 2,
            total_pages: 1
          }
        }
      };
    }

    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await instance.get(`/customers?${queryParams}`);
      return response.data;
    } catch (error: any) {
      console.error('Get customers error:', error);
      throw error;
    }
  },

  // Create customer
  create: async (customerData: any) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return {
        success: true,
        message: 'Customer created successfully',
        data: {
          id: Date.now(),
          ...customerData,
          total_orders: 0,
          total_spent: 0,
          created_at: new Date().toISOString()
        }
      };
    }

    try {
      const response = await instance.post('/customers', customerData);
      return response.data;
    } catch (error: any) {
      console.error('Create customer error:', error);
      throw error;
    }
  }
};

// Invoice API endpoints
const invoices = {
  // Get all invoices
  getAll: async (params: any = {}) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        data: {
          invoices: [
            {
              id: 1,
              invoice_number: 'INV-2024-001',
              customer_name: 'John Doe',
              customer_email: 'john@example.com',
              total_amount: 2999.99,
              status: 'sent',
              created_at: new Date().toISOString(),
              due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              id: 2,
              invoice_number: 'INV-2024-002',
              customer_name: 'Jane Smith',
              customer_email: 'jane@example.com',
              total_amount: 1599.99,
              status: 'paid',
              created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              paid_date: new Date().toISOString()
            }
          ],
          pagination: {
            current_page: 1,
            per_page: 20,
            total: 2,
            total_pages: 1
          }
        }
      };
    }

    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await instance.get(`/invoices?${queryParams}`);
      return response.data;
    } catch (error: any) {
      console.error('Get invoices error:', error);
      throw error;
    }
  },

  // Get invoice by ID
  getById: async (id: string | number) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        success: true,
        data: {
          id,
          invoice_number: `INV-2024-${id}`,
          customer_name: 'Sample Customer',
          total_amount: 299.99,
          status: 'sent'
        }
      };
    }

    try {
      const response = await instance.get(`/invoices/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Get invoice error:', error);
      throw error;
    }
  },

  // Create invoice from transaction
  createFromTransaction: async (transactionId: string | number, invoiceData: any) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return {
        success: true,
        message: 'Invoice created successfully',
        data: {
          id: Date.now(),
          invoice_number: `INV-${Date.now()}`,
          transaction_id: transactionId,
          ...invoiceData
        }
      };
    }

    try {
      const response = await instance.post(`/invoices/from-transaction/${transactionId}`, invoiceData);
      return response.data;
    } catch (error: any) {
      console.error('Create invoice from transaction error:', error);
      throw error;
    }
  },

  // Generate PDF
  generatePDF: async (id: string | number) => {
    if (USE_MOCK_DATA) {
      // Create a mock PDF blob
      const pdfContent = `Mock PDF content for invoice ${id}`;
      return new Blob([pdfContent], { type: 'application/pdf' });
    }

    try {
      const response = await instance.get(`/invoices/${id}/pdf`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error: any) {
      console.error('Generate invoice PDF error:', error);
      throw error;
    }
  }
};

// Brand-specific categories API
const brandCategories = {
  // Get all available brands
  getBrands: async () => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        success: true,
        data: [
          { id: 'indikriti', name: 'Indikriti' },
          { id: 'winsomeLane', name: 'Winsome Lane' }
        ]
      };
    }

    try {
      const response = await instance.get('/products/brands');
      return response.data;
    } catch (error) {
      console.error('Get brands error:', error);
      throw error;
    }
  },

  // Get categories by brand
  getByBrand: async (brand: string) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const mockCategories = {
        indikriti: [
          { id: 1, name: 'Bedsheets', description: 'Premium bedsheets and bed linens', status: 'active' },
          { id: 2, name: 'Runners', description: 'Table runners and decorative runners', status: 'active' },
          { id: 3, name: 'Suits', description: 'Traditional and modern suits', status: 'active' }
        ],
        winsomeLane: [
          { id: 1, name: 'Shirts', description: 'Casual and formal shirts', status: 'active' },
          { id: 2, name: 'Dresses', description: 'Elegant dresses for all occasions', status: 'active' },
          { id: 3, name: 'Accessories', description: 'Fashion accessories and jewelry', status: 'active' }
        ]
      };

      return {
        success: true,
        data: mockCategories[brand as keyof typeof mockCategories] || [],
        brand
      };
    }

    try {
      const response = await instance.get(`/products/brands/${brand}/categories`);
      return response.data;
    } catch (error) {
      console.error(`Get categories by brand ${brand} error:`, error);
      throw error;
    }
  },

  // Create brand category
  create: async (brand: string, categoryData: any) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        data: {
          id: Date.now(),
          ...categoryData,
          status: 'active',
          created_at: new Date().toISOString()
        },
        message: 'Category created successfully'
      };
    }

    try {
      const response = await instance.post(`/products/brands/${brand}/categories`, categoryData);
      return response.data;
    } catch (error) {
      console.error(`Create brand category error:`, error);
      throw error;
    }
  },

  // Update brand category
  update: async (brand: string, id: string | number, categoryData: any) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        data: {
          id,
          ...categoryData,
          updated_at: new Date().toISOString()
        },
        message: 'Category updated successfully'
      };
    }

    try {
      const response = await instance.put(`/products/brands/${brand}/categories/${id}`, categoryData);
      return response.data;
    } catch (error) {
      console.error(`Update brand category error:`, error);
      throw error;
    }
  },

  // Delete brand category
  delete: async (brand: string, id: string | number) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        message: 'Category deleted successfully'
      };
    }

    try {
      const response = await instance.delete(`/products/brands/${brand}/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Delete brand category error:`, error);
      throw error;
    }
  }
};

// Enhanced 4-Level Hierarchy API
const enhanced4LevelHierarchy = {
  // Get complete hierarchy for a brand
  getCompleteHierarchy: async (brand: string) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockHierarchy = {
        indikriti: [
          {
            id: 1,
            name: 'Bedsheets',
            subcategories: [
              {
                id: 1,
                name: 'Cotton Bedsheets',
                productTypes: [
                  { id: 1, name: 'Single Cotton' },
                  { id: 2, name: 'Double Cotton' }
                ]
              },
              {
                id: 2,
                name: 'Silk Bedsheets',
                productTypes: [
                  { id: 3, name: 'Single Silk' },
                  { id: 4, name: 'Double Silk' }
                ]
              }
            ]
          }
        ],
        winsomeLane: [
          {
            id: 1,
            name: 'Shirts',
            subcategories: [
              {
                id: 1,
                name: 'Casual Shirts',
                productTypes: [
                  { id: 1, name: 'T-Shirt' },
                  { id: 2, name: 'Polo Shirt' }
                ]
              }
            ]
          }
        ]
      };

      return {
        success: true,
        data: mockHierarchy[brand as keyof typeof mockHierarchy] || [],
        brand
      };
    }

    try {
      const response = await instance.get(`/products/brands/${brand}/hierarchy`);
      return response.data;
    } catch (error) {
      console.error(`Get complete hierarchy error:`, error);
      throw error;
    }
  },

  // Get subcategories by brand and category
  getSubcategories: async (brand: string, categoryId: string | number) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        success: true,
        data: [
          { id: 1, name: 'Cotton Bedsheets', description: 'Premium cotton bedsheets' },
          { id: 2, name: 'Silk Bedsheets', description: 'Luxurious silk bedsheets' }
        ],
        brand,
        categoryId
      };
    }

    try {
      const response = await instance.get(`/products/brands/${brand}/categories/${categoryId}/subcategories`);
      return response.data;
    } catch (error) {
      console.error(`Get subcategories error:`, error);
      throw error;
    }
  },

  // Get product types by brand and subcategory
  getProductTypes: async (brand: string, subcategoryId: string | number) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        success: true,
        data: [
          { id: 1, name: 'Single Cotton', description: 'Single bed cotton sheets' },
          { id: 2, name: 'Double Cotton', description: 'Double bed cotton sheets' }
        ],
        brand,
        subcategoryId
      };
    }

    try {
      const response = await instance.get(`/products/brands/${brand}/subcategories/${subcategoryId}/product-types`);
      return response.data;
    } catch (error) {
      console.error(`Get product types error:`, error);
      throw error;
    }
  },

  // Create subcategory
  createSubcategory: async (brand: string, categoryId: string | number, subcategoryData: any) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        data: {
          id: Date.now(),
          ...subcategoryData,
          category_id: categoryId,
          status: 'active'
        },
        message: 'Subcategory created successfully'
      };
    }

    try {
      const response = await instance.post(`/products/brands/${brand}/categories/${categoryId}/subcategories`, subcategoryData);
      return response.data;
    } catch (error) {
      console.error(`Create subcategory error:`, error);
      throw error;
    }
  },

  // Create product type
  createProductType: async (brand: string, subcategoryId: string | number, productTypeData: any) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        data: {
          id: Date.now(),
          ...productTypeData,
          subcategory_id: subcategoryId,
          status: 'active'
        },
        message: 'Product type created successfully'
      };
    }

    try {
      const response = await instance.post(`/products/brands/${brand}/subcategories/${subcategoryId}/product-types`, productTypeData);
      return response.data;
    } catch (error) {
      console.error(`Create product type error:`, error);
      throw error;
    }
  },

  // Update subcategory
  updateSubcategory: async (brand: string, subcategoryId: string | number, subcategoryData: any) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        data: {
          id: subcategoryId,
          ...subcategoryData,
          status: 'active'
        },
        message: 'Subcategory updated successfully'
      };
    }

    try {
      const response = await instance.put(`/products/brands/${brand}/subcategories/${subcategoryId}`, subcategoryData);
      return response.data;
    } catch (error) {
      console.error(`Update subcategory error:`, error);
      throw error;
    }
  },

  // Delete subcategory
  deleteSubcategory: async (brand: string, subcategoryId: string | number) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        message: 'Subcategory deleted successfully'
      };
    }

    try {
      const response = await instance.delete(`/products/brands/${brand}/subcategories/${subcategoryId}`);
      return response.data;
    } catch (error) {
      console.error(`Delete subcategory error:`, error);
      throw error;
    }
  },

  // Update product type
  updateProductType: async (brand: string, productTypeId: string | number, productTypeData: any) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        data: {
          id: productTypeId,
          ...productTypeData,
          status: 'active'
        },
        message: 'Product type updated successfully'
      };
    }

    try {
      const response = await instance.put(`/products/brands/${brand}/product-types/${productTypeId}`, productTypeData);
      return response.data;
    } catch (error) {
      console.error(`Update product type error:`, error);
      throw error;
    }
  },

  // Delete product type
  deleteProductType: async (brand: string, productTypeId: string | number) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        message: 'Product type deleted successfully'
      };
    }

    try {
      const response = await instance.delete(`/products/brands/${brand}/product-types/${productTypeId}`);
      return response.data;
    } catch (error) {
      console.error(`Delete product type error:`, error);
      throw error;
    }
  }
};

// Inventory API methods
const inventory = {
  // Get all inventory with filters and pagination
  getAll: async (params: {
    page?: number;
    limit?: number;
    brand?: string;
    status?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    lowStock?: boolean;
    outOfStock?: boolean;
  } = {}) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        data: {
          products: [
            {
              id: 1,
              product_id: 'IND-001',
              sku: 'IND-SKU-001',
              name: 'Premium Cotton Bedsheet',
              brand: 'indikriti',
              status: 'active',
              stock_quantity: 25,
              selling_price: 1500.00,
              mrp: 1500.00,
              inventoryValue: '37500.00',
              isLowStock: false,
              isOutOfStock: false,
              categoryDisplay: {
                category: 'Bedsheets',
                subcategory: 'Cotton Bedsheets',
                productType: 'Single Cotton'
              },
              createdAtFormatted: '2024-01-15',
              updatedAtFormatted: '2024-01-20'
            },
            {
              id: 2,
              product_id: 'WL-001',
              sku: 'WL-SKU-001',
              name: 'Elegant Evening Dress',
              brand: 'winsomeLane',
              status: 'active',
              stock_quantity: 5,
              selling_price: 3500.00,
              mrp: 3500.00,
              inventoryValue: '17500.00',
              isLowStock: true,
              isOutOfStock: false,
              categoryDisplay: {
                category: 'Dresses',
                subcategory: 'Evening Dresses',
                productType: 'Formal Dress'
              },
              createdAtFormatted: '2024-01-10',
              updatedAtFormatted: '2024-01-18'
            }
          ],
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalProducts: 2,
            limit: 50
          },
          stats: {
            totalProducts: 2,
            totalValue: '55000.00',
            byBrand: {
              indikriti: { count: 1, value: '37500.00' },
              winsomeLane: { count: 1, value: '17500.00' }
            },
            byStatus: {
              active: 2,
              inactive: 0,
              draft: 0
            },
            stockStatus: {
              inStock: 1,
              lowStock: 1,
              outOfStock: 0
            }
          }
        }
      };
    }

    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });

      const response = await instance.get(`/inventory?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Get inventory error:', error);
      throw error;
    }
  },

  // Get inventory statistics
  getStats: async (brand?: string) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        success: true,
        data: {
          totalProducts: 150,
          totalValue: '2500000.00',
          byBrand: {
            indikriti: { count: 80, value: '1200000.00' },
            winsomeLane: { count: 70, value: '1300000.00' }
          },
          byStatus: {
            active: 120,
            inactive: 20,
            draft: 10
          },
          stockStatus: {
            inStock: 100,
            lowStock: 35,
            outOfStock: 15
          }
        }
      };
    }

    try {
      const params = brand ? `?brand=${brand}` : '';
      const response = await instance.get(`/inventory/stats${params}`);
      return response.data;
    } catch (error) {
      console.error('Get inventory stats error:', error);
      throw error;
    }
  },

  // Get low stock products
  getLowStock: async (threshold: number = 10, brand?: string) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        success: true,
        data: {
          products: [
            {
              id: 2,
              name: 'Elegant Evening Dress',
              brand: 'winsomeLane',
              stock_quantity: 5,
              selling_price: 3500.00
            }
          ],
          count: 1,
          threshold: threshold
        }
      };
    }

    try {
      const params = new URLSearchParams({ threshold: threshold.toString() });
      if (brand) params.append('brand', brand);

      const response = await instance.get(`/inventory/low-stock?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Get low stock products error:', error);
      throw error;
    }
  },

  // Get out of stock products
  getOutOfStock: async (brand?: string) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        success: true,
        data: {
          products: [],
          count: 0
        }
      };
    }

    try {
      const params = brand ? `?brand=${brand}` : '';
      const response = await instance.get(`/inventory/out-of-stock${params}`);
      return response.data;
    } catch (error) {
      console.error('Get out of stock products error:', error);
      throw error;
    }
  }
};

// Brands API (alias for brandCategories.getBrands for convenience)
const brands = {
  getAll: () => brandCategories.getBrands()
};

// Export API functions
const api = {
  auth,
  users,
  products,
  productTypes,
  categories,
  subcategories,
  brandCategories,
  brands,
  enhanced4LevelHierarchy,
  orders,
  analytics,
  pos,
  customers,
  invoices,
  inventory
};

export { api };
export default api;