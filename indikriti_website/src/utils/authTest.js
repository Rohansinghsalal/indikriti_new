/**
 * Authentication testing utility to debug 401 errors
 */

// Check if we're in a cloud environment
const isCloudEnvironment = () => {
  return window.location.hostname.includes('.fly.dev') ||
         window.location.hostname.includes('.vercel.app') ||
         window.location.hostname.includes('.netlify.app') ||
         window.location.hostname.includes('.herokuapp.com') ||
         window.location.hostname !== 'localhost';
};

const API_BASE_URL = 'http://localhost:5000/api/v1';
const IS_CLOUD_ENV = isCloudEnvironment();

// Test different admin credentials
const TEST_CREDENTIALS = [
  { email: 'admin@example.com', password: 'admin123' },
  { email: 'admin@admin.com', password: 'admin' },
  { email: 'superadmin@example.com', password: 'admin123' },
  { email: 'test@test.com', password: 'test123' },
  { email: 'user@example.com', password: 'password' }
];

export const testAuthentication = async () => {
  if (IS_CLOUD_ENV) {
    console.log('🌐 Skipping authentication test in cloud environment');
    return {
      success: false,
      error: 'Authentication testing skipped (cloud environment)'
    };
  }

  console.log('🔍 Testing authentication with your backend...');
  
  for (const creds of TEST_CREDENTIALS) {
    try {
      console.log(`Trying: ${creds.email} / ${creds.password}`);
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(creds)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Login successful!', data);
        
        if (data.token) {
          // Test protected endpoint with token
          const productResponse = await fetch(`${API_BASE_URL}/products?brand=indikriti`, {
            headers: {
              'Authorization': `Bearer ${data.token}`,
              'Content-Type': 'application/json'
            }
          });
          
          console.log(`Product endpoint test: ${productResponse.status}`);
          
          if (productResponse.ok) {
            const products = await productResponse.json();
            console.log('✅ Products endpoint working!', products);
            return {
              success: true,
              credentials: creds,
              token: data.token,
              products: products
            };
          } else {
            console.log(`❌ Products endpoint failed: ${productResponse.status}`);
          }
        }
      } else {
        console.log(`❌ Login failed: ${response.status}`);
      }
    } catch (error) {
      console.log(`💥 Error with ${creds.email}:`, error.message);
    }
  }
  
  return { success: false };
};

export const debugApiCall = async (endpoint, token = null) => {
  try {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    console.log(`🔍 Testing endpoint: ${endpoint}`);
    console.log(`Headers:`, headers);
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers
    });
    
    console.log(`Status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Success:', data);
      return { success: true, data };
    } else {
      const errorText = await response.text();
      console.log('❌ Error:', errorText);
      return { success: false, error: errorText, status: response.status };
    }
  } catch (error) {
    console.log('💥 Request failed:', error.message);
    return { success: false, error: error.message };
  }
};

// Auto-run in local development only
if (import.meta.env.DEV && !IS_CLOUD_ENV) {
  console.log('🚀 Running authentication tests...');
  testAuthentication().then(result => {
    if (result.success) {
      console.log('🎉 Authentication working! Found valid credentials:', result.credentials);

      // Store working credentials for the API service
      window.WORKING_AUTH = {
        credentials: result.credentials,
        token: result.token
      };
    } else {
      console.log('❌ No working authentication found');
      console.log('💡 Solutions:');
      console.log('1. Check if your backend has any admin users created');
      console.log('2. Verify the database is properly seeded');
      console.log('3. Check if authentication endpoints are working');
    }
  });
} else if (IS_CLOUD_ENV) {
  console.log('🌐 Authentication testing skipped (cloud environment)');
}
