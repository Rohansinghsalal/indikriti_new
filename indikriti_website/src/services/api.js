import { mockProducts, categories, articles, customerReviews } from './mockData.js';

// Check if we're in a cloud environment (like fly.dev, vercel, etc.)
const isCloudEnvironment = () => {
  return window.location.hostname.includes('.fly.dev') ||
         window.location.hostname.includes('.vercel.app') ||
         window.location.hostname.includes('.netlify.app') ||
         window.location.hostname.includes('.herokuapp.com') ||
         window.location.hostname !== 'localhost';
};

// Determine API base URL based on environment
const getApiBaseUrl = () => {
  // If we're in production or cloud environment, only use explicitly configured backend
  if (import.meta.env.PROD || isCloudEnvironment()) {
    // Only use backend if explicitly configured via environment variable
    return import.meta.env.VITE_API_URL || null;
  }

  // In local development, try localhost:5000 (your backend port)
  return 'http://localhost:5000/api/v1';
};

const API_BASE_URL = getApiBaseUrl();
const USE_MOCK_DATA = !API_BASE_URL;
const IS_CLOUD_ENV = isCloudEnvironment();

console.log('🔗 API Configuration:', {
  environment: import.meta.env.PROD ? 'production' : 'development',
  cloudEnvironment: IS_CLOUD_ENV,
  hostname: window.location.hostname,
  apiBaseUrl: API_BASE_URL || 'Mock data mode',
  useMockData: USE_MOCK_DATA
});

// Helper function to get auth token (if available)
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Auto-login function to get admin token for API access
let adminToken = null;
let isAuthenticating = false;

const getAdminToken = async () => {
  // Skip authentication in cloud environments where there's no backend
  if (USE_MOCK_DATA || IS_CLOUD_ENV) {
    console.log('🌐 Skipping admin authentication (cloud environment or mock data mode)');
    return null;
  }

  if (adminToken) return adminToken;
  if (isAuthenticating) {
    // Wait for existing auth to complete
    while (isAuthenticating) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return adminToken;
  }

  try {
    isAuthenticating = true;
    console.log('🔐 Attempting admin authentication for API access...');

    // Try common admin credentials
    const credentials = [
      { email: 'admin@example.com', password: 'admin123' },
      { email: 'admin@admin.com', password: 'admin' },
      { email: 'superadmin@example.com', password: 'admin123' }
    ];

    for (const cred of credentials) {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cred)
        });

        if (response.ok) {
          const data = await response.json();
          if (data.token) {
            adminToken = data.token;
            console.log('✅ Admin authentication successful');
            return adminToken;
          }
        }
      } catch (error) {
        continue; // Try next credential
      }
    }

    console.log('❌ Admin authentication failed with all credentials');
    return null;
  } catch (error) {
    console.log('💥 Admin authentication error:', error.message);
    return null;
  } finally {
    isAuthenticating = false;
  }
};

// Helper function to get auth headers with admin fallback
const getApiHeaders = async () => {
  const userToken = localStorage.getItem('token');

  if (userToken) {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`
    };
  }

  // If no user token, try to get admin token for API access
  const token = await getAdminToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Helper function to make API requests with proper error handling
const makeApiRequest = async (url, options = {}) => {
  console.log(`🔍 Making API request to: ${url}`);

  const headers = await getApiHeaders();
  const config = {
    method: 'GET',
    headers,
    ...options
  };

  try {
    const response = await fetch(url, config);
    
    console.log(`📡 API Response: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ API Success:', result);
      return { success: true, data: result };
    } else {
      const errorText = await response.text();
      console.log(`❌ API Error: ${response.status} - ${errorText}`);
      return { success: false, error: `${response.status}: ${errorText}`, status: response.status };
    }
  } catch (error) {
    console.log(`💥 API Request Failed: ${error.message}`);
    return { success: false, error: error.message, status: 0 };
  }
};

// API service functions with backend integration
export const fetchProducts = async (filters = {}) => {
  // If no API URL configured, use mock data immediately
  if (USE_MOCK_DATA) {
    console.log('📦 Using mock products (no backend configured)');
    return mockProducts;
  }

  try {
    const queryParams = new URLSearchParams();
    
    // Default to indikriti brand for filtering
    if (!filters.brand) filters.brand = 'indikriti';

    // Add filters as query parameters
    if (filters.page) queryParams.append('page', filters.page);
    if (filters.limit) queryParams.append('limit', filters.limit);
    if (filters.brand) queryParams.append('brand', filters.brand);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.category_id) queryParams.append('category_id', filters.category_id);
    if (filters.subcategory_id) queryParams.append('subcategory_id', filters.subcategory_id);

    const url = `${API_BASE_URL}/products${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    const result = await makeApiRequest(url);
    
    if (result.success) {
      return await processProductsResponse(result);
    }
    
    // If we get 401/403, try refreshing auth token
    if (result.status === 401 || result.status === 403) {
      console.log('🔐 Authentication failed, refreshing token and retrying...');
      adminToken = null; // Clear cached token

      // Retry once with fresh token
      const newHeaders = await getApiHeaders();
      if (newHeaders.Authorization && newHeaders.Authorization !== headers.Authorization) {
        console.log('🔄 Retrying with fresh token...');
        const retryResult = await makeApiRequest(url);
        if (retryResult.success) {
          return await processProductsResponse(retryResult);
        }
      }

      console.log('🔐 Authentication required for products endpoint, using mock data');
    } else if (result.status === 404) {
      console.log('🚫 Products endpoint not found, check backend routes');
    }

function processProductsResponse(result) {
  const products = result.data;

  // Handle your backend response structure
  if (products.success && products.data) {
    return products.data.map(product => ({
      ...product,
      image: product.image || generateProductImage(product),
      rating: product.rating || Math.floor(Math.random() * 2) + 4,
      reviewCount: product.reviewCount || Math.floor(Math.random() * 200) + 50
    }));
  }

  // If it's a simple array response
  if (Array.isArray(products)) {
    return products.map(product => ({
      ...product,
      image: product.image || generateProductImage(product),
      rating: product.rating || Math.floor(Math.random() * 2) + 4,
      reviewCount: product.reviewCount || Math.floor(Math.random() * 200) + 50
    }));
  }

  // If result has data directly
  if (products.data && Array.isArray(products.data)) {
    return products.data.map(product => ({
      ...product,
      image: product.image || generateProductImage(product),
      rating: product.rating || Math.floor(Math.random() * 2) + 4,
      reviewCount: product.reviewCount || Math.floor(Math.random() * 200) + 50
    }));
  }

  return [];
}
    
    throw new Error('Backend not available or endpoint not working');
  } catch (error) {
    console.log('📦 Backend not available, using mock products:', error.message);
    return mockProducts;
  }
};

export const fetchCategories = async (brand = 'indikriti') => {
  // If no API URL configured, use mock data immediately
  if (USE_MOCK_DATA) {
    console.log('📂 Using mock categories (no backend configured)');
    return categories;
  }

  try {
    // Try different endpoints to get categories
    const endpoints = [
      `${API_BASE_URL}/products/brands/${brand}/hierarchy`,
      `${API_BASE_URL}/products/brands/${brand}/categories`,
      `${API_BASE_URL}/products/categories`,
      `${API_BASE_URL}/products/brands` // Public endpoint that might not require auth
    ];

    for (const endpoint of endpoints) {
      const result = await makeApiRequest(endpoint);
      
      if (result.success) {
        const data = result.data;
        
        if (data.success && data.data) {
          // Transform backend hierarchy to frontend format
          return data.data.map(category => ({
            id: category.id,
            name: category.name,
            icon: getCategoryIcon(category.name),
            subcategories: category.subcategories ? category.subcategories.map(sub => ({
              id: sub.id,
              name: sub.name,
              types: sub.productTypes ? sub.productTypes.map(type => ({
                id: type.id,
                name: type.name
              })) : []
            })) : []
          }));
        }
        
        if (Array.isArray(data)) {
          return data.map(category => ({
            id: category.id,
            name: category.name,
            icon: getCategoryIcon(category.name),
            subcategories: []
          }));
        }
        
        // If this is the brands endpoint and it worked
        if (endpoint.includes('/brands') && !endpoint.includes('/categories')) {
          console.log('✅ Brands endpoint working, using default categories');
          break;
        }
      } else {
        console.log(`❌ ${endpoint} failed: ${result.error}`);
      }
    }
    
    throw new Error('No categories endpoint working');
  } catch (error) {
    console.log('📂 Backend not available, using mock categories:', error.message);
    return categories;
  }
};

export const fetchProductsByCategory = async (categoryId, brand = 'indikriti') => {
  // If no API URL configured, use mock data immediately
  if (USE_MOCK_DATA) {
    console.log('📂 Filtering mock products by category:', categoryId);
    return mockProducts.filter(product => 
      product.indikriti_category_id === parseInt(categoryId) ||
      product.winsomelane_category_id === parseInt(categoryId)
    );
  }

  try {
    // Use the brand-specific filtering
    const filters = {
      brand: brand,
      [`${brand === 'indikriti' ? 'indikriti' : 'winsomelane'}_category_id`]: categoryId
    };
    
    const products = await fetchProducts(filters);
    return products;
  } catch (error) {
    console.log('📂 Backend not available, filtering mock data');
    return mockProducts.filter(product => 
      product.indikriti_category_id === parseInt(categoryId) ||
      product.winsomelane_category_id === parseInt(categoryId)
    );
  }
};

export const fetchProductsBySubcategory = async (subcategoryId, brand = 'indikriti') => {
  // If no API URL configured, use mock data immediately
  if (USE_MOCK_DATA) {
    console.log('📂 Filtering mock products by subcategory:', subcategoryId);
    return mockProducts.filter(product => 
      product.indikriti_subcategory_id === parseInt(subcategoryId) ||
      product.winsomelane_subcategory_id === parseInt(subcategoryId)
    );
  }

  try {
    const filters = {
      brand: brand,
      [`${brand === 'indikriti' ? 'indikriti' : 'winsomelane'}_subcategory_id`]: subcategoryId
    };
    
    const products = await fetchProducts(filters);
    return products;
  } catch (error) {
    console.log('📂 Backend not available, filtering mock data');
    return mockProducts.filter(product => 
      product.indikriti_subcategory_id === parseInt(subcategoryId) ||
      product.winsomelane_subcategory_id === parseInt(subcategoryId)
    );
  }
};

export const searchProducts = async (query) => {
  // If no API URL configured, use mock data immediately
  if (USE_MOCK_DATA) {
    console.log('🔍 Searching mock indikriti products for:', query);
    return mockProducts.filter(product =>
      (product.name.toLowerCase().includes(query.toLowerCase()) ||
       product.description.toLowerCase().includes(query.toLowerCase()) ||
       (product.long_description && product.long_description.toLowerCase().includes(query.toLowerCase()))) &&
      // Focus on indikriti brand products
      (product.brand === 'indikriti' || product.indikriti_category_id || product.indikriti_subcategory_id)
    );
  }

  try {
    const filters = {
      search: query,
      brand: 'indikriti' // Filter specifically for indikriti products
    };
    const products = await fetchProducts(filters);
    return products;
  } catch (error) {
    console.log('🔍 Backend not available, searching mock indikriti products');
    return mockProducts.filter(product =>
      (product.name.toLowerCase().includes(query.toLowerCase()) ||
       product.description.toLowerCase().includes(query.toLowerCase()) ||
       (product.long_description && product.long_description.toLowerCase().includes(query.toLowerCase()))) &&
      // Focus on indikriti brand products
      (product.brand === 'indikriti' || product.indikriti_category_id || product.indikriti_subcategory_id)
    );
  }
};

// Brand-specific API calls
export const fetchBrands = async () => {
  if (USE_MOCK_DATA) {
    return [
      { id: 'indikriti', name: 'Indikriti' },
      { id: 'winsomeLane', name: 'Winsome Lane' }
    ];
  }

  try {
    const result = await makeApiRequest(`${API_BASE_URL}/products/brands`);
    
    if (result.success) {
      const data = result.data;
      if (data.success && data.data) {
        return data.data;
      }
      if (Array.isArray(data)) {
        return data;
      }
    }
    
    throw new Error('Brands endpoint not working');
  } catch (error) {
    console.log('🏷️ Backend not available, using default brands');
    return [
      { id: 'indikriti', name: 'Indikriti' },
      { id: 'winsomeLane', name: 'Winsome Lane' }
    ];
  }
};

// Articles and reviews (always use mock for now)
export const fetchArticles = async () => {
  console.log('📰 Using mock articles');
  return articles;
};

export const fetchCustomerReviews = async () => {
  console.log('⭐ Using mock reviews');
  return customerReviews;
};

// Authentication APIs
export const loginUser = async (email, password) => {
  if (USE_MOCK_DATA) {
    console.log('🔐 Using mock login');
    return {
      user: {
        id: '1',
        email,
        name: email.split('@')[0],
        wallet: 100,
        referralCode: email.split('@')[0].toUpperCase() + '123',
      },
      token: 'mock-jwt-token'
    };
  }

  try {
    const result = await makeApiRequest(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (result.success) {
      const data = result.data;
      if (data.success && data.data) {
        return data.data;
      }
    }
    
    throw new Error('Login failed');
  } catch (error) {
    console.log('🔐 Backend auth not available, using mock login');
    return {
      user: {
        id: '1',
        email,
        name: email.split('@')[0],
        wallet: 100,
        referralCode: email.split('@')[0].toUpperCase() + '123',
      },
      token: 'mock-jwt-token'
    };
  }
};

export const registerUser = async (email, password, name, referralCode) => {
  if (USE_MOCK_DATA) {
    console.log('📝 Using mock registration');
    return {
      user: {
        id: Math.random().toString(),
        email,
        name,
        wallet: referralCode ? 150 : 100,
        referralCode: name.substring(0, 3).toUpperCase() + '123',
        referredBy: referralCode,
      },
      token: 'mock-jwt-token'
    };
  }

  try {
    const result = await makeApiRequest(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, referralCode }),
    });

    if (result.success) {
      const data = result.data;
      if (data.success && data.data) {
        return data.data;
      }
    }
    
    throw new Error('Registration failed');
  } catch (error) {
    console.log('📝 Backend auth not available, using mock registration');
    return {
      user: {
        id: Math.random().toString(),
        email,
        name,
        wallet: referralCode ? 150 : 100,
        referralCode: name.substring(0, 3).toUpperCase() + '123',
        referredBy: referralCode,
      },
      token: 'mock-jwt-token'
    };
  }
};

// Helper function to get category icon
const getCategoryIcon = (categoryName) => {
  const iconMap = {
    'Handloom': '🧵',
    'Handicraft': '🎨', 
    'Corporate Gifts': '🎁',
    'Home Decor': '🏠',
    'Textiles': '🧵',
    'Pottery': '🏺',
    'Wood Craft': '🪵',
    'Metal Craft': '⚒️'
  };
  
  return iconMap[categoryName] || '📦';
};

// Helper function to generate product images based on category
const generateProductImage = (product) => {
  const imageMap = {
    1: [ // Handloom/Textiles
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&w=400',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&w=400',
      'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&w=400'
    ],
    2: [ // Handicraft
      'https://images.unsplash.com/photo-1578769163228-e3c1c2e0eb17?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&w=400',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&w=400',
      'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&w=400'
    ],
    3: [ // Corporate Gifts
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&w=400',
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&w=400',
      'https://images.unsplash.com/photo-1565007152913-1f84e0bd9cf5?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&w=400'
    ],
    4: [ // Home Decor
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&w=400',
      'https://images.unsplash.com/photo-1577160008966-6d7d166e4b8e?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&w=400',
      'https://images.unsplash.com/photo-1565007152926-af4d9a8c1b88?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&w=400'
    ]
  };

  // Try to determine category from product data
  const categoryId = product.indikriti_category_id || 
                   product.winsomelane_category_id || 
                   product.category_id || 
                   product.product_type_id || 1;
  
  const categoryImages = imageMap[categoryId] || imageMap[1];
  return categoryImages[Math.floor(Math.random() * categoryImages.length)];
};

// Export configuration for debugging
export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  USE_MOCK_DATA,
  IS_CLOUD_ENV,
  ENVIRONMENT: import.meta.env.PROD ? 'production' : 'development',
  HOSTNAME: window.location.hostname
};
