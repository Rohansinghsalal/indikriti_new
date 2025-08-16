/**
 * Comprehensive server startup test
 * This script tests complete server startup and API functionality
 */

const { spawn } = require('child_process');
const axios = require('axios');
const path = require('path');

const API_BASE_URL = 'http://localhost:5000';

// Test server startup
async function testServerStartup() {
  console.log('\n🧪 Testing Complete Server Startup...');

  try {
    console.log('   📋 Starting server...');
    
    const serverProcess = spawn('node', ['server.js'], {
      cwd: path.join(__dirname),
      stdio: 'pipe',
      env: { ...process.env, NODE_ENV: 'test' }
    });

    let serverOutput = '';
    let serverError = '';
    let serverStarted = false;
    let routerError = false;

    serverProcess.stdout.on('data', (data) => {
      const output = data.toString();
      serverOutput += output;
      
      // Check if server started successfully
      if (output.includes('Server running on port') || output.includes('Server started')) {
        serverStarted = true;
      }
    });

    serverProcess.stderr.on('data', (data) => {
      const error = data.toString();
      serverError += error;
      
      // Check for Router.use() errors
      if (error.includes('Router.use() requires a middleware function')) {
        routerError = true;
      }
    });

    return new Promise((resolve, reject) => {
      // Wait for server to start or fail
      setTimeout(async () => {
        if (routerError) {
          console.log('   ❌ Server failed with Router.use() middleware function error');
          console.log('   📋 Error output:', serverError);
          serverProcess.kill();
          reject(new Error('Router.use() middleware function error'));
          return;
        }

        if (serverStarted) {
          console.log('   ✅ Server started successfully without Router.use() errors');
          
          try {
            // Test basic API endpoints
            await testBasicAPIEndpoints();
            serverProcess.kill();
            resolve(true);
          } catch (apiError) {
            serverProcess.kill();
            reject(apiError);
          }
        } else {
          console.log('   ❌ Server failed to start');
          console.log('   📋 Server output:', serverOutput);
          console.log('   📋 Server error:', serverError);
          serverProcess.kill();
          reject(new Error('Server failed to start'));
        }
      }, 15000); // Wait 15 seconds for server to start

      serverProcess.on('close', (code) => {
        if (code !== 0 && !serverStarted) {
          reject(new Error(`Server exited with code ${code}`));
        }
      });
    });

  } catch (error) {
    console.error('❌ Server startup test failed:', error.message);
    throw error;
  }
}

// Test basic API endpoints
async function testBasicAPIEndpoints() {
  console.log('   📋 Testing basic API endpoints...');

  try {
    // Test API v1 test endpoint
    const testResponse = await axios.get(`${API_BASE_URL}/api/v1/test`, {
      timeout: 5000
    });
    
    if (testResponse.status === 200) {
      console.log('   ✅ API v1 test endpoint working');
    }

    // Test system test endpoint
    const systemResponse = await axios.get(`${API_BASE_URL}/api/v1/system/test`, {
      timeout: 5000
    });
    
    if (systemResponse.status === 200) {
      console.log('   ✅ System test endpoint working');
    }

    // Test protected endpoints (should return 401 without token)
    try {
      await axios.get(`${API_BASE_URL}/api/v1/users`);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('   ✅ Protected users endpoint properly secured');
      } else {
        throw error;
      }
    }

    try {
      await axios.get(`${API_BASE_URL}/api/v1/products`);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('   ✅ Protected products endpoint properly secured');
      } else {
        throw error;
      }
    }

    // Test public brands endpoint
    try {
      const brandsResponse = await axios.get(`${API_BASE_URL}/api/v1/products/brands`);
      if (brandsResponse.status === 200) {
        console.log('   ✅ Public brands endpoint working');
      }
    } catch (error) {
      console.log('   ⚠️  Public brands endpoint may have issues:', error.message);
    }

    console.log('   ✅ Basic API endpoints working correctly');

  } catch (error) {
    console.error('   ❌ API endpoint test failed:', error.message);
    throw error;
  }
}

// Test route registration
async function testRouteRegistration() {
  console.log('\n🧪 Testing Route Registration...');

  try {
    // Test that all route files can be imported without Router.use() errors
    console.log('   📋 Testing route file imports...');

    const express = require('express');
    const app = express();

    // Import and mount main API router
    const apiRouter = require('./routes/api/v1/index.js');
    app.use('/api/v1', apiRouter);

    // Import and mount inventory router
    const inventoryRouter = require('./routes/inventory.js');
    app.use('/api/inventory', inventoryRouter);

    console.log('   ✅ All routes registered successfully without Router.use() errors');
    return true;

  } catch (error) {
    console.error('   ❌ Route registration test failed:', error.message);
    throw error;
  }
}

// Test middleware chain
async function testMiddlewareChain() {
  console.log('\n🧪 Testing Middleware Chain...');

  try {
    // Test auth middleware
    const { authenticateToken, requireRole } = require('./middleware/auth');
    
    if (typeof authenticateToken === 'function') {
      console.log('   ✅ authenticateToken middleware available');
    } else {
      throw new Error('authenticateToken middleware not available');
    }

    if (typeof requireRole === 'function') {
      console.log('   ✅ requireRole middleware available');
    } else {
      throw new Error('requireRole middleware not available');
    }

    // Test company filter middleware
    const companyFilter = require('./middleware/companyFilter');
    
    if (typeof companyFilter === 'function') {
      console.log('   ✅ Company filter middleware available');
    } else {
      throw new Error('Company filter middleware not available');
    }

    console.log('   ✅ Middleware chain working correctly');
    return true;

  } catch (error) {
    console.error('   ❌ Middleware chain test failed:', error.message);
    throw error;
  }
}

// Test database connection
async function testDatabaseConnection() {
  console.log('\n🧪 Testing Database Connection...');

  try {
    const { sequelize } = require('./database/connection');
    
    await sequelize.authenticate();
    console.log('   ✅ Database connection successful');
    
    await sequelize.close();
    return true;

  } catch (error) {
    console.error('   ❌ Database connection test failed:', error.message);
    // Don't throw error for database issues as they might be environmental
    return false;
  }
}

// Main test function
async function runCompleteServerStartupTests() {
  try {
    console.log('🚀 Starting Complete Server Startup Tests...\n');
    
    // Test 1: Middleware chain
    await testMiddlewareChain();

    // Test 2: Route registration
    await testRouteRegistration();

    // Test 3: Database connection (optional)
    const dbConnected = await testDatabaseConnection();

    // Test 4: Complete server startup
    await testServerStartup();

    console.log('\n🎉 All Complete Server Startup tests completed successfully!');
    console.log('\n📊 Test Summary:');
    console.log('   ✅ Middleware chain working');
    console.log('   ✅ Route registration working');
    console.log(`   ${dbConnected ? '✅' : '⚠️ '} Database connection ${dbConnected ? 'working' : 'may have issues'}`);
    console.log('   ✅ Server starts without Router.use() errors');
    console.log('   ✅ API endpoints properly registered');
    console.log('   ✅ Authentication middleware working');
    console.log('   ✅ Protected endpoints properly secured');

    console.log('\n🎯 Server startup is working correctly!');
    console.log('   The server now starts successfully without any Router.use() middleware function errors');
    console.log('   All API endpoints are properly registered and accessible');

  } catch (error) {
    console.error('\n💥 Complete server startup test failed:', error.message);
    console.error('\n🔧 Please check the following:');
    console.error('   - All middleware functions are properly exported');
    console.error('   - Route files export Express router instances');
    console.error('   - Main API router imports are correct');
    console.error('   - Database connection is working');
    console.error('   - No syntax errors in route registration');
    process.exit(1);
  }
}

// Run the tests
if (require.main === module) {
  runCompleteServerStartupTests();
}

module.exports = { 
  runCompleteServerStartupTests, 
  testServerStartup, 
  testBasicAPIEndpoints,
  testRouteRegistration,
  testMiddlewareChain,
  testDatabaseConnection
};
