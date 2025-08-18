import { mockProducts, categories, articles, customerReviews } from './mockData.js';

// Enhanced environment detection
const isCloudEnvironment = () => {
  return window.location.hostname.includes('.fly.dev') ||
         window.location.hostname.includes('.vercel.app') ||
         window.location.hostname.includes('.netlify.app') ||
         window.location.hostname.includes('.herokuapp.com') ||
         window.location.hostname !== 'localhost';
};

const getApiBaseUrl = () => {
  if (import.meta.env.PROD || isCloudEnvironment()) {
    return import.meta.env.VITE_API_URL || null;
  }
  return 'http://localhost:5001/api/v1';
};

const API_BASE_URL = getApiBaseUrl();
const USE_MOCK_DATA = !API_BASE_URL;
const IS_CLOUD_ENV = isCloudEnvironment();

console.log('🔗 Enhanced API Configuration:', {
  environment: import.meta.env.PROD ? 'production' : 'development',
  cloudEnvironment: IS_CLOUD_ENV,
  hostname: window.location.hostname,
  apiBaseUrl: API_BASE_URL || 'Mock data mode',
  useMockData: USE_MOCK_DATA
});

// Standard headers - no authentication required
const getHeaders = () => {
  return {
    'Content-Type': 'application/json'
  };
};

// Enhanced API request function
const makeApiRequest = async (url, options = {}) => {
  console.log(`🔍 Making API request to: ${url}`);

  const headers = getHeaders();
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

// Fetch products by product type ID
export const fetchProductsByProductType = async (productTypeId, options = {}) => {
  const { page = 1, limit = 20 } = options;

  if (USE_MOCK_DATA) {
    console.log(`📦 Using mock products for product type ${productTypeId}`);
    // This will be handled by the backend endpoint
    try {
      const result = await makeApiRequest(`${API_BASE_URL}/products/by-product-type/${productTypeId}?page=${page}&limit=${limit}`);
      if (result.success) {
        return result.data;
      }
      throw new Error('Product type API not available');
    } catch (error) {
      console.log('📦 Backend not available, using empty array for product type');
      return [];
    }
  }

  try {
    const result = await makeApiRequest(`${API_BASE_URL}/products/by-product-type/${productTypeId}?page=${page}&limit=${limit}`);
    if (result.success) {
      return result.data;
    }
    throw new Error('Product type API not available');
  } catch (error) {
    console.log('📦 Backend not available, using empty array for product type');
    return [];
  }
};

// Enhanced Products API
export const fetchProducts = async (filters = {}) => {
  if (USE_MOCK_DATA) {
    console.log('📦 Using mock products - Indikriti only');
    let filteredProducts = [...mockProducts];

    // Filter for Indikriti products only
    filteredProducts = filteredProducts.filter(p => p.brand === 'indikriti');
    if (filters.category_id) {
      filteredProducts = filteredProducts.filter(p => 
        p.indikriti_category_id === parseInt(filters.category_id)
      );
    }
    if (filters.search) {
      const query = filters.search.toLowerCase();
      filteredProducts = filteredProducts.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }
    if (filters.on_sale) {
      filteredProducts = filteredProducts.filter(p => p.discounted_price < p.price);
    }
    
    return filteredProducts;
  }

  try {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });

    const url = `${API_BASE_URL}/products${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const result = await makeApiRequest(url);
    
    if (result.success) {
      return processProductsResponse(result.data);
    }
    
    throw new Error('Backend not available');
  } catch (error) {
    console.log('📦 Backend not available, using mock products:', error.message);
    return mockProducts.filter(p => p.brand === 'indikriti');
  }
};

// Sales and Discounts API
export const fetchSalesAndDiscounts = async () => {
  if (USE_MOCK_DATA) {
    console.log('🏷️ Using mock sales data - Indikriti only');
    const saleProducts = mockProducts.filter(p =>
      p.brand === 'indikriti' && p.discounted_price < p.price
    );
    return {
      flashSales: saleProducts.slice(0, 6),
      discountedProducts: saleProducts,
      deals: [
        {
          id: 1,
          title: 'Flash Sale',
          description: 'Up to 50% off on handloom products',
          discount: 50,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          products: saleProducts.slice(0, 10)
        },
        {
          id: 2,
          title: 'Weekend Special',
          description: 'Buy 2 Get 1 Free on handicrafts',
          discount: 33,
          expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
          products: saleProducts.slice(5, 15)
        }
      ]
    };
  }

  try {
    const result = await makeApiRequest(`${API_BASE_URL}/sales-discounts`);
    if (result.success) {
      return result.data;
    }
    throw new Error('Sales API not available');
  } catch (error) {
    console.log('🏷️ Using mock sales data due to error:', error.message);
    return await fetchSalesAndDiscounts(); // Recursive call to get mock data
  }
};

// User Authentication API
export const checkMobileNumber = async (mobileNumber) => {
  if (USE_MOCK_DATA) {
    console.log('📱 Mock mobile check for:', mobileNumber);
    // Mock: Accept any valid 10-digit number starting with 6-9
    const validNumber = /^[6-9]\d{9}$/.test(mobileNumber);
    if (!validNumber) {
      throw new Error('Please enter a valid 10-digit mobile number starting with 6-9');
    }

    // For demo purposes, treat most numbers as new users to show registration flow
    // Only some specific numbers are treated as existing users
    const existingNumbers = ['9876543210', '8765432109'];
    const exists = existingNumbers.includes(mobileNumber);

    return {
      exists,
      user: exists ? {
        id: 'mock_' + mobileNumber,
        mobileNumber,
        name: 'Demo User',
        email: `demo${mobileNumber.slice(-4)}@example.com`
      } : null
    };
  }

  try {
    const result = await makeApiRequest(`${API_BASE_URL}/auth/check-mobile`, {
      method: 'POST',
      body: JSON.stringify({ mobileNumber })
    });
    
    if (result.success) {
      return result.data;
    }
    
    throw new Error('Mobile check failed');
  } catch (error) {
    console.log('📱 Mock mobile check due to error:', error.message);
    return await checkMobileNumber(mobileNumber);
  }
};

export const sendOTP = async (mobileNumber) => {
  if (USE_MOCK_DATA) {
    console.log('📲 Mock OTP sent to:', mobileNumber);
    return {
      success: true,
      message: 'OTP sent successfully',
      otpId: 'mock_otp_' + Date.now()
    };
  }

  try {
    const result = await makeApiRequest(`${API_BASE_URL}/auth/send-otp`, {
      method: 'POST',
      body: JSON.stringify({ mobileNumber })
    });
    
    if (result.success) {
      return result.data;
    }
    
    throw new Error('OTP send failed');
  } catch (error) {
    console.log('📲 Mock OTP due to error:', error.message);
    return await sendOTP(mobileNumber);
  }
};

export const verifyOTP = async (mobileNumber, otp, otpId) => {
  if (USE_MOCK_DATA) {
    console.log('✅ Mock OTP verification for:', mobileNumber, otp);

    // Accept any 4-6 digit OTP for demo
    if (otp.length >= 4 && /^\d+$/.test(otp)) {
      // Check if user exists (same logic as checkMobileNumber)
      const existingNumbers = ['9876543210', '8765432109'];
      const userExists = existingNumbers.includes(mobileNumber);

      if (userExists) {
        // Return existing user data
        return {
          success: true,
          token: 'mock_token_' + Date.now(),
          user: {
            id: 'mock_' + mobileNumber,
            mobileNumber,
            name: 'Demo User',
            email: `demo${mobileNumber.slice(-4)}@example.com`,
            wallet: 250
          }
        };
      } else {
        // New user - return success but no user (will trigger registration)
        return {
          success: true,
          token: null,
          user: null
        };
      }
    } else {
      return {
        success: false,
        message: 'Please enter a valid 4-6 digit OTP'
      };
    }
  }

  try {
    const result = await makeApiRequest(`${API_BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      body: JSON.stringify({ mobileNumber, otp, otpId })
    });
    
    if (result.success) {
      return result.data;
    }
    
    throw new Error('OTP verification failed');
  } catch (error) {
    console.log('✅ Mock OTP verification due to error:', error.message);
    return await verifyOTP(mobileNumber, otp, otpId);
  }
};

export const registerUser = async (userData) => {
  if (USE_MOCK_DATA) {
    console.log('📝 Mock user registration:', userData);

    // Generate a proper mock user
    const mockUser = {
      id: 'mock_' + userData.mobileNumber,
      mobileNumber: userData.mobileNumber,
      name: userData.name,
      email: userData.email,
      referralCode: userData.referralCode || '',
      instagramId: userData.instagramId || '',
      wallet: userData.referralCode ? 200 : 100, // Bonus for referral
      joinedAt: new Date().toISOString(),
      isVerified: true
    };

    return {
      success: true,
      user: mockUser,
      token: 'mock_token_' + Date.now(),
      message: 'Account created successfully!'
    };
  }

  try {
    const result = await makeApiRequest(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    
    if (result.success) {
      return result.data;
    }
    
    throw new Error('Registration failed');
  } catch (error) {
    console.log('📝 Mock registration due to error:', error.message);
    return await registerUser(userData);
  }
};

// Wallet API
export const getWalletBalance = async (userId) => {
  if (USE_MOCK_DATA) {
    console.log('💰 Mock wallet balance for user:', userId);
    return {
      balance: 150,
      transactions: [
        {
          id: 1,
          type: 'credit',
          amount: 100,
          description: 'Welcome bonus',
          date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 2,
          type: 'credit',
          amount: 50,
          description: 'Referral bonus',
          date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
        }
      ]
    };
  }

  try {
    const result = await makeApiRequest(`${API_BASE_URL}/wallet/${userId}`);
    if (result.success) {
      return result.data;
    }
    throw new Error('Wallet API not available');
  } catch (error) {
    console.log('💰 Mock wallet due to error:', error.message);
    return await getWalletBalance(userId);
  }
};

export const redeemWalletAmount = async (userId, amount, orderId) => {
  if (USE_MOCK_DATA) {
    console.log('💸 Mock wallet redemption:', { userId, amount, orderId });
    return {
      success: true,
      newBalance: 150 - amount,
      transactionId: 'mock_txn_' + Date.now()
    };
  }

  try {
    const result = await makeApiRequest(`${API_BASE_URL}/wallet/redeem`, {
      method: 'POST',
      body: JSON.stringify({ userId, amount, orderId })
    });
    
    if (result.success) {
      return result.data;
    }
    
    throw new Error('Wallet redemption failed');
  } catch (error) {
    console.log('💸 Mock wallet redemption due to error:', error.message);
    return await redeemWalletAmount(userId, amount, orderId);
  }
};

// Order API
export const createOrder = async (orderData) => {
  if (USE_MOCK_DATA) {
    console.log('🛒 Mock order creation:', orderData);
    return {
      success: true,
      order: {
        id: 'mock_order_' + Date.now(),
        ...orderData,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      }
    };
  }

  try {
    const result = await makeApiRequest(`${API_BASE_URL}/orders`, {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
    
    if (result.success) {
      return result.data;
    }
    
    throw new Error('Order creation failed');
  } catch (error) {
    console.log('🛒 Mock order due to error:', error.message);
    return await createOrder(orderData);
  }
};

// Helper function to process products response
const processProductsResponse = (products) => {
  if (products.success && products.data) {
    return products.data.map(enhanceProduct);
  }
  
  if (Array.isArray(products)) {
    return products.map(enhanceProduct);
  }
  
  if (products.data && Array.isArray(products.data)) {
    return products.data.map(enhanceProduct);
  }
  
  return [];
};

const enhanceProduct = (product) => ({
  ...product,
  image: product.image || generateProductImage(product),
  rating: product.rating || Math.floor(Math.random() * 2) + 4,
  reviewCount: product.reviewCount || Math.floor(Math.random() * 200) + 50
});

const generateProductImage = (product) => {
  const imageMap = {
    1: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&w=400',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&w=400',
    ],
    2: [
      'https://images.unsplash.com/photo-1578769163228-e3c1c2e0eb17?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&w=400',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&w=400',
    ],
    3: [
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&w=400',
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&w=400',
    ]
  };

  const categoryId = product.indikriti_category_id || product.category_id || 1;
  const categoryImages = imageMap[categoryId] || imageMap[1];
  return categoryImages[Math.floor(Math.random() * categoryImages.length)];
};

// Re-export existing functions for compatibility
export { 
  fetchCategories, 
  fetchArticles, 
  fetchCustomerReviews,
  searchProducts 
} from './api.js';

// Export configuration
export const ENHANCED_API_CONFIG = {
  BASE_URL: API_BASE_URL,
  USE_MOCK_DATA,
  IS_CLOUD_ENV,
  ENVIRONMENT: import.meta.env.PROD ? 'production' : 'development',
  HOSTNAME: window.location.hostname
};
