// Mock data based on actual database structure
export const categories = [
  {
    id: 1,
    name: 'Handloom',
    icon: '🧵',
    subcategories: [
      {
        id: 1,
        name: 'Bedsheets',
        types: [
          { id: 1, name: 'Cotton Bedsheets' },
          { id: 2, name: 'Silk Bedsheets' },
          { id: 3, name: 'Linen Bedsheets' }
        ]
      },
      {
        id: 2,
        name: 'Sarees',
        types: [
          { id: 4, name: 'Cotton Sarees' },
          { id: 5, name: 'Silk Sarees' },
          { id: 6, name: 'Handwoven Sarees' }
        ]
      },
      {
        id: 3,
        name: 'Fabrics',
        types: [
          { id: 7, name: 'Cotton Fabric' },
          { id: 8, name: 'Silk Fabric' },
          { id: 9, name: 'Khadi Fabric' }
        ]
      }
    ]
  },
  {
    id: 2,
    name: 'Handicraft',
    icon: '🎨',
    subcategories: [
      {
        id: 4,
        name: 'Pottery',
        types: [
          { id: 10, name: 'Clay Pots' },
          { id: 11, name: 'Decorative Items' },
          { id: 12, name: 'Terracotta' }
        ]
      },
      {
        id: 5,
        name: 'Wood Craft',
        types: [
          { id: 13, name: 'Wooden Toys' },
          { id: 14, name: 'Furniture' },
          { id: 15, name: 'Decorative Items' }
        ]
      },
      {
        id: 6,
        name: 'Metal Craft',
        types: [
          { id: 16, name: 'Brass Items' },
          { id: 17, name: 'Copper Items' },
          { id: 18, name: 'Silver Items' }
        ]
      }
    ]
  },
  {
    id: 3,
    name: 'Corporate Gifts',
    icon: '🎁',
    subcategories: [
      {
        id: 7,
        name: 'Office Items',
        types: [
          { id: 19, name: 'Desk Accessories' },
          { id: 20, name: 'Stationery' },
          { id: 21, name: 'Tech Accessories' }
        ]
      },
      {
        id: 8,
        name: 'Gift Sets',
        types: [
          { id: 22, name: 'Festival Gifts' },
          { id: 23, name: 'Employee Gifts' },
          { id: 24, name: 'Client Gifts' }
        ]
      }
    ]
  },
  {
    id: 4,
    name: 'Home Decor',
    icon: '🏠',
    subcategories: [
      {
        id: 9,
        name: 'Wall Art',
        types: [
          { id: 25, name: 'Paintings' },
          { id: 26, name: 'Sculptures' },
          { id: 27, name: 'Traditional Art' }
        ]
      },
      {
        id: 10,
        name: 'Lighting',
        types: [
          { id: 28, name: 'Lamps' },
          { id: 29, name: 'Lanterns' },
          { id: 30, name: 'Candles' }
        ]
      }
    ]
  }
];

// Mock products based on actual database structure
export const mockProducts = [
  {
    id: 3,
    product_id: 'PROD-1754385888472',
    sku: 'SKU-1754385888472',
    name: 'Test Handloom Bedsheet',
    description: 'Beautiful handloom cotton bedsheet',
    mrp: 2499.99,
    selling_price: 1999.99,
    stock_quantity: 25,
    batch_no: 'B2024-001',
    product_type_id: 1,
    brand: 'indikriti',
    status: 'active',
    product_style: 'Traditional',
    discount: 20.00,
    sale_price: 1999.99,
    special_discount: 0.00,
    final_price: 1999.99,
    referral_bonus: 50.00,
    loyalty_bonus: 25.00,
    hsn: '63023000',
    gst: 12.00,
    long_description: 'Premium quality handloom cotton bedsheet with traditional patterns',
    usp1: 'Handloom crafted',
    usp2: '100% Cotton',
    usp3: 'Traditional patterns',
    indikriti_category_id: 1,
    indikriti_subcategory_id: 1,
    indikriti_product_type_id: 1,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&w=400',
    rating: 4.5,
    reviewCount: 124
  },
  {
    id: 4,
    product_id: 'PROD-1754395131357',
    sku: 'SKU-1754395131357',
    name: 'Test Frontend Product',
    description: 'A product created from frontend integration test',
    mrp: 99.99,
    selling_price: 94.99,
    stock_quantity: 10,
    batch_no: 'B2024-TEST',
    product_type_id: 1,
    brand: 'indikriti',
    status: 'active',
    product_style: 'Modern',
    discount: 10.00,
    sale_price: 99.99,
    special_discount: 5.00,
    final_price: 94.99,
    referral_bonus: 5.00,
    loyalty_bonus: 3.00,
    hsn: '1234',
    gst: 18.00,
    long_description: 'This is a detailed description from frontend',
    usp1: 'High Quality',
    usp2: 'Fast Delivery',
    usp3: 'Best Price',
    indikriti_category_id: 2,
    indikriti_subcategory_id: 4,
    indikriti_product_type_id: 10,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&w=400',
    rating: 4.2,
    reviewCount: 89
  },
  {
    id: 5,
    product_id: 'PROD-1754395521124',
    sku: 'SKU-1754395521124',
    name: 'Premium Handloom Bedsheet',
    description: 'Beautiful handwoven bedsheet with traditional patterns',
    mrp: 2249.99,
    selling_price: 2499.99,
    stock_quantity: 0,
    batch_no: '',
    product_type_id: 1,
    brand: 'indikriti',
    status: 'active',
    product_style: 'Traditional',
    discount: 15.00,
    sale_price: 2499.99,
    special_discount: 10.00,
    final_price: 2249.99,
    referral_bonus: 125.00,
    loyalty_bonus: 75.00,
    hsn: '6302',
    gst: 12.00,
    long_description: 'This premium handloom bedsheet is crafted by skilled artisans using traditional weaving techniques. Made from 100% pure cotton, it features intricate patterns and vibrant colors that add elegance to any bedroom.',
    usp1: '100% Pure Cotton',
    usp2: 'Handwoven by Artisans',
    usp3: 'Traditional Patterns',
    indikriti_category_id: 1,
    indikriti_subcategory_id: 1,
    indikriti_product_type_id: 1,
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&w=400',
    rating: 4.8,
    reviewCount: 156
  },
  {
    id: 12,
    product_id: 'PROD-1754899197680',
    sku: 'SKU-1754899197680',
    name: 'Traditional Pottery Set',
    description: 'Handcrafted pottery set for home decoration',
    mrp: 299.99,
    selling_price: 249.99,
    stock_quantity: 15,
    batch_no: 'P2024-001',
    product_type_id: 1,
    brand: 'indikriti',
    status: 'active',
    product_style: 'Traditional',
    discount: 16.67,
    sale_price: 249.99,
    special_discount: 0.00,
    final_price: 249.99,
    referral_bonus: 12.50,
    loyalty_bonus: 7.50,
    hsn: '6912',
    gst: 12.00,
    long_description: 'Beautiful handcrafted pottery set made by local artisans. Perfect for home decoration and gifting.',
    usp1: 'Handcrafted',
    usp2: 'Local Artisans',
    usp3: 'Traditional Design',
    indikriti_category_id: 2,
    indikriti_subcategory_id: 4,
    indikriti_product_type_id: 10,
    image: 'https://images.unsplash.com/photo-1578769163228-e3c1c2e0eb17?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&w=400',
    rating: 4.3,
    reviewCount: 67
  },
  {
    id: 13,
    product_id: 'PROD-1754899197681',
    sku: 'SKU-1754899197681',
    name: 'Corporate Gift Set',
    description: 'Premium corporate gift set for employees',
    mrp: 599.99,
    selling_price: 499.99,
    stock_quantity: 20,
    batch_no: 'CG2024-001',
    product_type_id: 1,
    brand: 'indikriti',
    status: 'active',
    product_style: 'Modern',
    discount: 16.67,
    sale_price: 499.99,
    special_discount: 0.00,
    final_price: 499.99,
    referral_bonus: 25.00,
    loyalty_bonus: 15.00,
    hsn: '4819',
    gst: 18.00,
    long_description: 'Premium corporate gift set including diary, pen, and traditional items perfect for employee appreciation.',
    usp1: 'Premium Quality',
    usp2: 'Corporate Ready',
    usp3: 'Gift Packaging',
    indikriti_category_id: 3,
    indikriti_subcategory_id: 7,
    indikriti_product_type_id: 19,
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&w=400',
    rating: 4.6,
    reviewCount: 203
  },
  {
    id: 14,
    product_id: 'PROD-1754899197682',
    sku: 'SKU-1754899197682',
    name: 'Wooden Wall Art',
    description: 'Handcarved wooden wall art piece',
    mrp: 799.99,
    selling_price: 649.99,
    stock_quantity: 8,
    batch_no: 'WA2024-001',
    product_type_id: 1,
    brand: 'indikriti',
    status: 'active',
    product_style: 'Traditional',
    discount: 18.75,
    sale_price: 649.99,
    special_discount: 0.00,
    final_price: 649.99,
    referral_bonus: 32.50,
    loyalty_bonus: 19.50,
    hsn: '4420',
    gst: 12.00,
    long_description: 'Exquisite handcarved wooden wall art featuring traditional Indian motifs. Perfect for home decoration.',
    usp1: 'Handcarved',
    usp2: 'Traditional Motifs',
    usp3: 'Premium Wood',
    indikriti_category_id: 4,
    indikriti_subcategory_id: 9,
    indikriti_product_type_id: 25,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&w=400',
    rating: 4.7,
    reviewCount: 89
  }
];

// Articles data
export const articles = [
  {
    id: 1,
    title: 'The Art of Handloom Weaving',
    excerpt: 'Discover the centuries-old tradition of handloom weaving and its significance in Indian culture.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&w=400',
    date: '2024-01-15',
    category: 'Handloom'
  },
  {
    id: 2,
    title: 'Supporting Local Artisans',
    excerpt: 'Learn how buying handcrafted products directly supports local communities and preserves traditional skills.',
    image: 'https://images.unsplash.com/photo-1578769163228-e3c1c2e0eb17?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&w=400',
    date: '2024-01-10',
    category: 'Handicraft'
  },
  {
    id: 3,
    title: 'Corporate Gifting Guide',
    excerpt: 'Choose the perfect corporate gifts that reflect Indian heritage and leave a lasting impression.',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&w=400',
    date: '2024-01-05',
    category: 'Corporate Gifts'
  }
];

// Customer reviews
export const customerReviews = [
  {
    id: 1,
    name: 'Priya Sharma',
    rating: 5,
    comment: 'Absolutely beautiful handloom bedsheet! The quality is exceptional and the patterns are gorgeous.',
    product_id: 'PROD-1754385888472',
    date: '2024-01-12'
  },
  {
    id: 2,
    name: 'Rajesh Kumar',
    rating: 4,
    comment: 'Great quality pottery set. Perfect for gifting. Fast delivery and good packaging.',
    product_id: 'PROD-1754899197680',
    date: '2024-01-08'
  },
  {
    id: 3,
    name: 'Anita Verma',
    rating: 5,
    comment: 'The corporate gift set was perfect for our employees. Everyone loved the traditional touch.',
    product_id: 'PROD-1754899197681',
    date: '2024-01-03'
  },
  {
    id: 4,
    name: 'Suresh Patel',
    rating: 4,
    comment: 'Beautiful wooden wall art. Adds a traditional charm to our living room.',
    product_id: 'PROD-1754899197682',
    date: '2023-12-28'
  }
];
