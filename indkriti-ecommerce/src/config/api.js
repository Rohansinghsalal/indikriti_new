// API configuration

// Base API URL
const API_BASE_URL = import.meta.env.VITE_NODE_ENV === 'production' 
  ? 'https://api.indkriti-ecommerce.com/api/v1' 
  : 'http://localhost:3000/api/v1';

// API endpoints
const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
  },
  
  // Product endpoints
  PRODUCTS: {
    LIST: '/products',
    DETAILS: (id) => `/products/${id}`,
    CATEGORIES: '/products/categories',
    CATEGORY_PRODUCTS: (categoryId) => `/categories/${categoryId}/products`,
    FEATURED: '/products/featured',
    NEW_ARRIVALS: '/products/new-arrivals',
    BEST_SELLERS: '/products/best-sellers',
    SEARCH: '/products/search',
    REVIEWS: (productId) => `/products/${productId}/reviews`,
  },
  
  // Hierarchy endpoints
  HIERARCHY: {
    BRANDS: '/products/brands',
    BRAND_CATEGORIES: (brand) => `/products/brands/${brand}/categories`,
    BRAND_SUBCATEGORIES: (brand, categoryId) => `/products/brands/${brand}/categories/${categoryId}/subcategories`,
    BRAND_PRODUCT_TYPES: (brand, subcategoryId) => `/products/brands/${brand}/subcategories/${subcategoryId}/product-types`,
    COMPLETE_HIERARCHY: (brand) => `/products/brands/${brand}/hierarchy`,
  },
  
  // Cart endpoints
  CART: {
    GET: '/cart',
    ADD: '/cart/add',
    UPDATE: '/cart/update',
    REMOVE: '/cart/remove',
    CLEAR: '/cart/clear',
  },
  
  // Order endpoints
  ORDERS: {
    CREATE: '/orders',
    LIST: '/orders',
    DETAILS: (id) => `/orders/${id}`,
    TRACK: (id) => `/orders/${id}/track`,
    CANCEL: (id) => `/orders/${id}/cancel`,
    RETURN: (id) => `/orders/${id}/return`,
  },
  
  // User profile endpoints
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
    ADDRESSES: '/user/addresses',
    WISHLIST: '/user/wishlist',
    NOTIFICATIONS: '/user/notifications',
  },
  
  // Payment endpoints
  PAYMENT: {
    METHODS: '/payment/methods',
    PROCESS: '/payment/process',
    VERIFY: '/payment/verify',
  },
};

// Request timeout in milliseconds
const REQUEST_TIMEOUT = 30000;

// Default headers
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

export {
  API_BASE_URL,
  API_ENDPOINTS,
  REQUEST_TIMEOUT,
  DEFAULT_HEADERS,
};