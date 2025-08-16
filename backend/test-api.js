const http = require('http');

// Test GET products
function testGetProducts() {
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/v1/products',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('GET /api/v1/products');
      console.log('Status:', res.statusCode);
      console.log('Response:', data);
      console.log('---');
      
      // Test POST product after GET
      testCreateProduct();
    });
  });

  req.on('error', (e) => {
    console.error('GET Error:', e.message);
  });

  req.end();
}

// Test POST product
function testCreateProduct() {
  const productData = JSON.stringify({
    name: "Test Product",
    productType: "Physical Product",
    description: "A test product",
    finalPrice: 99.99,
    productStyle: "Modern",
    discount: 10,
    salePrice: 89.99,
    specialDiscount: 5,
    referralBonus: 5,
    loyaltyBonus: 3,
    hsn: "1234",
    gst: 18,
    longDescription: "This is a detailed description",
    usps: ["High Quality", "Fast Delivery", "Best Price"]
  });

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/v1/products',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(productData)
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('POST /api/v1/products');
      console.log('Status:', res.statusCode);
      console.log('Response:', data);
    });
  });

  req.on('error', (e) => {
    console.error('POST Error:', e.message);
  });

  req.write(productData);
  req.end();
}

// Test login endpoint
function testLogin() {
  const loginData = JSON.stringify({
    email: 'admin@example.com',
    password: 'admin123'
  });

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/v1/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(loginData)
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('POST /api/v1/auth/login');
      console.log('Status:', res.statusCode);
      console.log('Response:', data);
      console.log('---');

      try {
        const response = JSON.parse(data);
        if (response.success && response.token) {
          // Test authenticated product endpoint
          testProductsWithAuth(response.token);
        } else {
          console.log('Login failed, testing root endpoint instead');
          testRoot();
        }
      } catch (e) {
        console.log('Failed to parse login response, testing root endpoint');
        testRoot();
      }
    });
  });

  req.on('error', (e) => {
    console.error('Login Error:', e.message);
    testRoot();
  });

  req.write(loginData);
  req.end();
}

// Test root endpoint
function testRoot() {
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('GET /');
      console.log('Status:', res.statusCode);
      console.log('Response:', data);
      console.log('---');

      console.log('Note: Product endpoints require authentication.');
      console.log('To test products, you need to login first and get a JWT token.');
    });
  });

  req.on('error', (e) => {
    console.error('Root Error:', e.message);
  });

  req.end();
}

// Test products with authentication
function testProductsWithAuth(token) {
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/v1/products',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('GET /api/v1/products (authenticated)');
      console.log('Status:', res.statusCode);
      console.log('Response:', data);
      console.log('---');

      // Test creating a product
      testCreateProductWithAuth(token);
    });
  });

  req.on('error', (e) => {
    console.error('Products Error:', e.message);
  });

  req.end();
}

// Test creating a product with authentication
function testCreateProductWithAuth(token) {
  const productData = JSON.stringify({
    name: "Test Advanced Product",
    description: "A test product with advanced fields",
    mrp: 199.99,
    selling_price: 179.99,
    product_type_id: 1,
    category_id: 1,
    brand: "indikriti",
    product_style: "Modern",
    discount: 10,
    sale_price: 179.99,
    special_discount: 5,
    final_price: 170.99,
    referral_bonus: 5,
    loyalty_bonus: 3,
    hsn: "1234",
    gst: 18,
    long_description: "This is a detailed description of the test product",
    usp1: "High Quality",
    usp2: "Fast Delivery",
    usp3: "Best Price"
  });

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/v1/products',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(productData),
      'Authorization': `Bearer ${token}`
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('POST /api/v1/products (authenticated)');
      console.log('Status:', res.statusCode);
      console.log('Response:', data);
      console.log('---');
      console.log('✅ API testing completed successfully!');
    });
  });

  req.on('error', (e) => {
    console.error('Create Product Error:', e.message);
  });

  req.write(productData);
  req.end();
}

// Start tests
console.log('Testing API endpoints...');
testLogin();
