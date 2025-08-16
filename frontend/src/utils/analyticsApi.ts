// // mocked backend responses
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
    productType: '1',
    category: '1',
    subcategory: '1',
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
    productType: '1',
    category: '2',
    subcategory: '3',
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
    productType: '1',
    category: '3',
    subcategory: '4',
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
    productType: '2',
    category: '4',
    subcategory: '',
    brand: 'winsomeLane',
    status: 'active',
    image: '/assets/images/placeholder.jpg'
  }
];


export const getDashboardStats = async (timeRange: string) => {
  const totalRevenue = MOCK_ORDERS.reduce((sum, order) => sum + order.total, 0);
  const posRevenue = 45000; // Mock POS revenue

  return {
    success: true,
    data: {
      totalUsers: MOCK_USERS.length,
      totalProducts: MOCK_PRODUCTS.length,
      totalRevenue: totalRevenue + posRevenue,
      totalOrders: MOCK_ORDERS.length,
      userGrowth: 12,
      productGrowth: 5,
      revenueGrowth: 18,
      orderGrowth: 8,
      sales: {
        total: totalRevenue + posRevenue,
        today: 5500,
        yesterday: 4800,
        this_week: 32000,
        this_month: 89000,
        last_month: 76000,
        change: {
          daily: 14.6,
          monthly: 17.1
        }
      },
      pos: {
        total_sales: posRevenue,
        today_sales: 2200,
        total_transactions: 156,
        today_transactions: 8
      },
      orders: {
        total: MOCK_ORDERS.length,
        pending: 23,
        processing: 45,
        completed: MOCK_ORDERS.filter(o => o.status === 'completed').length,
        cancelled: 33
      },
      inventory: {
        low_stock: 12,
        out_of_stock: 3
      },
      customers: {
        total: MOCK_USERS.length,
        new_today: 5
      }
    }
  };
};

// 2️ Recent Activity (map from orders)
export const getRecentActivity = async (limit = 5) => {
  const recentOrders = MOCK_ORDERS
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);

  return {
    success: true,
    data: recentOrders.map((order) => ({
      id: order.id,
      orderNumber: `ORD-${order.id}`,                      
      customerName: order.customer,                        
      total: order.total,
      status: order.status,
      createdAt: order.date                                 
    }))
  };
};

// 3️ Notifications
type AlertType = 'info' | 'warning' | 'success' | 'error';

export const getNotifications = async () => {
  return {
    success: true,
    data: [
      {
        id: '1',
        message: 'Stock is low for Traditional Silk Suit',
        type: 'warning' as AlertType,
        createdAt: '2025-07-11T11:05:00Z'
      },
      {
        id: '2',
        message: 'New user registered: Jane Smith',
        type: 'info' as AlertType,
        createdAt: '2025-07-10T18:30:00Z'
      }
    ]
  };
};

// 4️ Dashboard Charts
export const getDashboardCharts = async (timeRange = 'monthly') => {
  return {
    success: true,
    data: [
      { label: 'Jan', value: 1200 },
      { label: 'Feb', value: 2400 },
      { label: 'Mar', value: 1800 },
      { label: 'Apr', value: 2100 },
      { label: 'May', value: 2900 }
    ]
  };
};
