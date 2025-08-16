// Utility to test backend API connectivity
// Only runs in development mode to avoid production errors

// Check if we're in a cloud environment
const isCloudEnvironment = () => {
  return window.location.hostname.includes('.fly.dev') ||
         window.location.hostname.includes('.vercel.app') ||
         window.location.hostname.includes('.netlify.app') ||
         window.location.hostname.includes('.herokuapp.com') ||
         window.location.hostname !== 'localhost';
};

const getApiBaseUrl = () => {
  // Skip API testing in cloud environments where there's no backend
  if (import.meta.env.PROD || isCloudEnvironment()) {
    return import.meta.env.VITE_API_URL || null;
  }
  // Updated to use port 5000 where your backend is running
  return 'http://localhost:5000/api/v1';
};

const API_BASE_URL = getApiBaseUrl();
const IS_CLOUD_ENV = isCloudEnvironment();

export const testBackendConnection = async () => {
  // Don't run tests if no API URL is configured or in cloud environment
  if (!API_BASE_URL || IS_CLOUD_ENV) {
    const reason = IS_CLOUD_ENV ? 'cloud environment detected' : 'no API URL configured';
    console.log(`🚫 Backend API testing skipped - ${reason}`);
    return [{
      name: 'Configuration Check',
      success: false,
      error: `Backend API testing skipped (${reason}). Using mock data.`,
      status: 0
    }];
  }

  const tests = [
    {
      name: 'Products Endpoint',
      url: `${API_BASE_URL}/products`,
      method: 'GET'
    },
    {
      name: 'Categories Endpoint', 
      url: `${API_BASE_URL}/products/categories`,
      method: 'GET'
    },
    {
      name: 'Brands Endpoint',
      url: `${API_BASE_URL}/products/brands`,
      method: 'GET'
    },
    {
      name: 'Indikriti Hierarchy',
      url: `${API_BASE_URL}/products/brands/indikriti/hierarchy`,
      method: 'GET'
    },
    {
      name: 'Indikriti Categories',
      url: `${API_BASE_URL}/products/brands/indikriti/categories`,
      method: 'GET'
    }
  ];

  const results = [];

  for (const test of tests) {
    try {
      console.log(`🔍 Testing ${test.name}...`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(test.url, {
        method: test.method,
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const result = {
        name: test.name,
        url: test.url,
        status: response.status,
        success: response.ok,
        error: null,
        data: null
      };

      if (response.ok) {
        try {
          const data = await response.json();
          result.data = data;
          console.log(`✅ ${test.name}: Success`, data);
        } catch (jsonError) {
          result.error = 'Invalid JSON response';
          console.log(`⚠️ ${test.name}: Success but invalid JSON`);
        }
      } else {
        const errorText = await response.text();
        result.error = errorText;
        console.log(`❌ ${test.name}: Failed (${response.status})`, errorText);
      }

      results.push(result);
    } catch (error) {
      const result = {
        name: test.name,
        url: test.url,
        status: 0,
        success: false,
        error: error.name === 'AbortError' ? 'Request timeout' : error.message,
        data: null
      };
      
      results.push(result);
      console.log(`💥 ${test.name}: Connection failed`, error.message);
    }
  }

  return results;
};

export const logApiTestResults = (results) => {
  console.group('🔍 Backend API Test Results (Port 5000)');
  
  results.forEach(result => {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${result.name} (${result.status})`);
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
    if (result.data && result.success) {
      console.log(`   Data sample:`, result.data);
    }
  });
  
  const successful = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log(`\n📊 Summary: ${successful}/${total} endpoints working`);
  
  if (successful === 0) {
    console.log('❌ Backend server appears to be down or unreachable');
    console.log('💡 Make sure your backend server is running on http://localhost:5000');
    console.log('🔧 Check if your API routes are properly configured');
  } else if (successful < total) {
    console.log('⚠️ Some endpoints are not working - check authentication or endpoint implementation');
  } else {
    console.log('🎉 All endpoints are working correctly!');
  }
  
  console.groupEnd();
  
  return {
    successful,
    total,
    allWorking: successful === total,
    noneWorking: successful === 0
  };
};

// Only auto-run test in local development mode
if (import.meta.env.DEV && API_BASE_URL && !IS_CLOUD_ENV) {
  console.log('🚀 Running API connectivity tests (Port 5000)...');
  testBackendConnection()
    .then(logApiTestResults)
    .catch(error => {
      console.error('🚨 API testing failed:', error);
    });
} else if (import.meta.env.PROD || IS_CLOUD_ENV) {
  console.log('🌐 Cloud/Production mode - Backend API testing disabled');
  console.log('📦 Using mock data for demonstration');
} else {
  console.log('🔧 Development mode - No backend API configured, using mock data');
}
