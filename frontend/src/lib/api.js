import axios from 'axios';

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
  return config;
}, error => {
  console.error('Request error:', error);
  return Promise.reject(error);
});

// Handle token expiration or auth errors
instance.interceptors.response.use(
  response => response,
  error => {
    const originalRequest = error.config;
    
    // Handle network errors
    if (!error.response) {
      console.error('Network Error: No response from server. Please check if the backend server is running.');
      return Promise.reject(new Error('Network error. Please check your connection and ensure the server is running.'));
    }
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Here you would typically refresh the token
      // For now, just redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      
      return Promise.reject(error);
    }
    
    return Promise.reject(error);
  }
);

// Export the api object with methods
export const api = {
  // Auth endpoints
  async login(credentials) {
    if (USE_MOCK_DATA) {
      return mockLogin(credentials);
    }
    const response = await instance.post('/auth/login', credentials);
    return response.data;
  },
  
  async logout() {
    if (USE_MOCK_DATA) {
      return { success: true };
    }
    const response = await instance.post('/auth/logout');
    return response.data;
  },
  
  // User endpoints
  async getCurrentUser() {
    if (USE_MOCK_DATA) {
      return mockCurrentUser();
    }
    const response = await instance.get('/users/me');
    return response.data;
  },
  
  // Generic CRUD operations
  async get(endpoint, params = {}) {
    if (USE_MOCK_DATA) {
      return mockGet(endpoint, params);
    }
    const response = await instance.get(endpoint, { params });
    return response.data;
  },
  
  async post(endpoint, data = {}) {
    if (USE_MOCK_DATA) {
      return mockPost(endpoint, data);
    }
    const response = await instance.post(endpoint, data);
    return response.data;
  },
  
  async put(endpoint, data = {}) {
    if (USE_MOCK_DATA) {
      return mockPut(endpoint, data);
    }
    const response = await instance.put(endpoint, data);
    return response.data;
  },
  
  async delete(endpoint) {
    if (USE_MOCK_DATA) {
      return mockDelete(endpoint);
    }
    const response = await instance.delete(endpoint);
    return response.data;
  },

  async getRoles() {
    if (USE_MOCK_DATA) {
      return [
        { id: 'admin', name: 'Admin' },
        { id: 'manager', name: 'Manager' },
        { id: 'employee', name: 'Employee' },
        { id: 'customer', name: 'Customer' }
      ];
    }
    const response = await instance.get('/roles');
    return response.data;
  }
};

// Mock data implementations
function mockLogin(credentials) {
  // Simple mock login that accepts any email/password
  if (!credentials.email || !credentials.password) {
    throw new Error('Email and password are required');
  }
  
  return {
    user: {
      id: '1',
      name: 'Admin User',
      email: credentials.email,
      role: 'admin'
    },
    token: 'mock-jwt-token'
  };
}

function mockCurrentUser() {
  return {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin'
  };
}

function mockGet(endpoint, params) {
  // Mock different endpoints
  if (endpoint.startsWith('/orders')) {
    return mockOrders(params);
  }
  
  if (endpoint.startsWith('/products')) {
    return mockProducts(params);
  }
  
  if (endpoint.startsWith('/users')) {
    return mockUsers(params);
  }
  
  // Default empty response
  return { data: [] };
}

function mockPost(endpoint, data) {
  // Return the data with an id
  return {
    ...data,
    id: Math.random().toString(36).substring(2, 15),
    createdAt: new Date().toISOString()
  };
}

function mockPut(endpoint, data) {
  // Return the updated data
  return {
    ...data,
    updatedAt: new Date().toISOString()
  };
}

function mockDelete(endpoint) {
  // Return success
  return { success: true };
}

function mockOrders(params) {
  const orders = Array(20).fill(null).map((_, index) => ({
    id: `order-${index + 1}`,
    orderNumber: `ORD-${10000 + index}`,
    customerId: `cust-${index % 10 + 1}`,
    customerName: `Customer ${index % 10 + 1}`,
    customerEmail: `customer${index % 10 + 1}@example.com`,
    total: Math.floor(Math.random() * 500) + 50,
    status: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'][Math.floor(Math.random() * 5)],
    paymentStatus: ['Paid', 'Pending', 'Failed', 'Refunded'][Math.floor(Math.random() * 4)],
    paymentMethod: ['Credit Card', 'PayPal', 'Bank Transfer', 'Cash on Delivery'][Math.floor(Math.random() * 4)],
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    company: ['Company A', 'Company B', 'Company C'][Math.floor(Math.random() * 3)]
  }));
  
  // Apply search filter if provided
  let filteredOrders = orders;
  if (params.search) {
    const search = params.search.toLowerCase();
    filteredOrders = orders.filter(order => 
      order.orderNumber.toLowerCase().includes(search) ||
      order.customerName.toLowerCase().includes(search) ||
      order.customerEmail.toLowerCase().includes(search)
    );
  }
  
  // Apply status filter if provided
  if (params.status) {
    filteredOrders = filteredOrders.filter(order => 
      order.status.toLowerCase() === params.status.toLowerCase()
    );
  }
  
  // Apply company filter if provided
  if (params.company) {
    filteredOrders = filteredOrders.filter(order => 
      order.company === params.company
    );
  }
  
  // Apply pagination
  const page = parseInt(params.page) || 1;
  const limit = parseInt(params.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
  
  return {
    data: paginatedOrders,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(filteredOrders.length / limit),
      totalItems: filteredOrders.length,
      itemsPerPage: limit
    }
  };
}

function mockProducts(params) {
  const products = Array(30).fill(null).map((_, index) => ({
    id: `product-${index + 1}`,
    name: `Product ${index + 1}`,
    description: `Description for product ${index + 1}`,
    price: Math.floor(Math.random() * 100) + 10,
    category: ['Electronics', 'Clothing', 'Food', 'Books', 'Home'][Math.floor(Math.random() * 5)],
    stock: Math.floor(Math.random() * 100),
    sku: `SKU-${10000 + index}`,
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  }));
  
  // Apply search filter if provided
  let filteredProducts = products;
  if (params.search) {
    const search = params.search.toLowerCase();
    filteredProducts = products.filter(product => 
      product.name.toLowerCase().includes(search) ||
      product.description.toLowerCase().includes(search) ||
      product.sku.toLowerCase().includes(search)
    );
  }
  
  // Apply category filter if provided
  if (params.category) {
    filteredProducts = filteredProducts.filter(product => 
      product.category.toLowerCase() === params.category.toLowerCase()
    );
  }
  
  // Apply pagination
  const page = parseInt(params.page) || 1;
  const limit = parseInt(params.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  
  return {
    data: paginatedProducts,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(filteredProducts.length / limit),
      totalItems: filteredProducts.length,
      itemsPerPage: limit
    }
  };
}

function mockUsers(params) {
  const users = Array(15).fill(null).map((_, index) => ({
    id: `user-${index + 1}`,
    name: `User ${index + 1}`,
    email: `user${index + 1}@example.com`,
    role: ['admin', 'manager', 'employee', 'customer'][Math.floor(Math.random() * 4)],
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  }));
  
  // Apply search filter if provided
  let filteredUsers = users;
  if (params.search) {
    const search = params.search.toLowerCase();
    filteredUsers = users.filter(user => 
      user.name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search)
    );
  }
  
  // Apply role filter if provided
  if (params.role) {
    filteredUsers = filteredUsers.filter(user => 
      user.role.toLowerCase() === params.role.toLowerCase()
    );
  }
  
  // Apply pagination
  const page = parseInt(params.page) || 1;
  const limit = parseInt(params.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
  
  return {
    data: paginatedUsers,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(filteredUsers.length / limit),
      totalItems: filteredUsers.length,
      itemsPerPage: limit
    }
  };
}

export default api;