import axios from 'axios';
import * as analytics from './analyticsApi';
import { createRetryableApiCall, isRetryableError } from './retryUtils';

// API base URL - use mock mode for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

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
      delete config.headers['Content-Type'];
    }
  }
  return config;
}, error => {
  console.error('Request error:', error);
  return Promise.reject(error);
});

// Token refresh state management
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
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
    const originalRequest = error.config;

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

// Mock credentials for development
const MOCK_CREDENTIALS = [
  { email: 'admin@example.com', password: 'admin123', user: MOCK_USERS[0] },
  { email: 'admin@indikriti.com', password: 'password', user: MOCK_USERS[0] },
  { email: 'test@test.com', password: 'test123', user: MOCK_USERS[1] },
  { email: 'demo@demo.com', password: 'demo123', user: MOCK_USERS[0] }
];

// Authentication endpoints
const auth = {
  login: async (email, password, userType = 'admin') => {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Validate credentials
      const validCredential = MOCK_CREDENTIALS.find(
        cred => cred.email.toLowerCase() === email.toLowerCase() && cred.password === password
      );

      if (!validCredential) {
        throw new Error('Invalid email or password');
      }

      // Store mock token
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', 'mock-jwt-token');
        localStorage.setItem('userType', 'admin');
      }

      return {
        success: true,
        token: 'mock-jwt-token',
        user: validCredential.user,
        userType: 'admin'
      };
    }

    try {
      const response = await instance.post('/auth/login', { email, password, userType });
      // Persist tokens for refresh flow
      if (typeof window !== 'undefined') {
        const token = response.data?.token;
        const refreshToken = response.data?.refreshToken;
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
  getAll: async (params = {}) => {
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

  getById: async (id) => {
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

  create: async (userData) => {
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

  update: async (id, userData) => {
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

  delete: async (id) => {
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
  getAll: async (params = {}) => {
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

  getById: async (id) => {
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

  create: async (productData) => {
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
    } catch (error) {
      console.error('Create product error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);

      // Re-throw with more context
      if (error.response?.data) {
        const apiError = new Error(error.response.data.message || error.response.data.error || 'API Error');
        apiError.response = error.response;
        throw apiError;
      }

      throw error;
    }
  },

  update: async (id, productData) => {
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

  delete: async (id) => {
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

// Direct HTTP methods for general API calls with retry logic
const httpMethods = {
  get: createRetryableApiCall(async (url, config = {}) => {
    const response = await instance.get(url, config);
    return response;
  }, {
    maxRetries: 2,
    retryCondition: isRetryableError
  }),

  post: createRetryableApiCall(async (url, data = {}, config = {}) => {
    const response = await instance.post(url, data, config);
    return response;
  }, {
    maxRetries: 2,
    retryCondition: isRetryableError
  }),

  put: createRetryableApiCall(async (url, data = {}, config = {}) => {
    const response = await instance.put(url, data, config);
    return response;
  }, {
    maxRetries: 2,
    retryCondition: isRetryableError
  }),

  delete: createRetryableApiCall(async (url, config = {}) => {
    const response = await instance.delete(url, config);
    return response;
  }, {
    maxRetries: 1, // Be more conservative with deletes
    retryCondition: isRetryableError
  }),

  patch: createRetryableApiCall(async (url, data = {}, config = {}) => {
    const response = await instance.patch(url, data, config);
    return response;
  }, {
    maxRetries: 2,
    retryCondition: isRetryableError
  })
};

// Export all API endpoints
const api = {
  auth,
  users,
  products,
  analytics,
  // Expose HTTP methods directly
  ...httpMethods,
  // Also expose the axios instance for advanced usage
  instance
};

export default api;
