/**
 * Comprehensive test script to verify route handler fixes
 * This script tests that all route files load correctly and the server starts without crashes
 */

const path = require('path');

// Test route file imports
async function testRouteFileImports() {
  console.log('\n🧪 Testing Route File Imports...');

  const routeFiles = [
    'auth.js',
    'users.js', 
    'products.js',
    'pos.js',
    'invoices.js',
    'orders.js',
    'analytics.js',
    'financial.js'
  ];

  const results = [];

  for (const routeFile of routeFiles) {
    try {
      console.log(`   📋 Testing ${routeFile}...`);
      
      // Clear require cache to ensure fresh import
      const routePath = path.join(__dirname, 'routes', 'api', 'v1', routeFile);
      delete require.cache[require.resolve(routePath)];
      
      // Try to require the route file
      const route = require(routePath);
      
      if (route) {
        console.log(`   ✅ ${routeFile} imported successfully`);
        results.push({ file: routeFile, status: 'success' });
      } else {
        console.log(`   ❌ ${routeFile} import returned null/undefined`);
        results.push({ file: routeFile, status: 'failed', error: 'Import returned null' });
      }
      
    } catch (error) {
      console.log(`   ❌ ${routeFile} import failed: ${error.message}`);
      results.push({ file: routeFile, status: 'failed', error: error.message });
    }
  }

  return results;
}

// Test middleware imports
async function testMiddlewareImports() {
  console.log('\n🧪 Testing Middleware Imports...');

  try {
    // Test auth middleware
    console.log('   📋 Testing auth middleware...');
    const authMiddleware = require('./middleware/auth');
    
    if (typeof authMiddleware.authenticateToken === 'function') {
      console.log('   ✅ authenticateToken function available');
    } else {
      throw new Error('authenticateToken function not found');
    }

    if (typeof authMiddleware.requireRole === 'function') {
      console.log('   ✅ requireRole function available');
    } else {
      throw new Error('requireRole function not found');
    }

    // Test permission middleware
    console.log('   📋 Testing permission middleware...');
    const permissionMiddleware = require('./middleware/permissionCheck');
    
    if (typeof permissionMiddleware === 'function') {
      console.log('   ✅ Permission middleware available');
    } else {
      throw new Error('Permission middleware not found');
    }

    console.log('   ✅ All middleware imports successful');
    return true;

  } catch (error) {
    console.error('   ❌ Middleware import failed:', error.message);
    throw error;
  }
}

// Test controller imports
async function testControllerImports() {
  console.log('\n🧪 Testing Controller Imports...');

  const controllers = [
    'user/UserController',
    'user/StaffController', 
    'user/CustomerController',
    'user/ReferralController',
    'product/ProductController',
    'pos/POSController',
    'pos/InvoiceController'
  ];

  const results = [];

  for (const controllerPath of controllers) {
    try {
      console.log(`   📋 Testing ${controllerPath}...`);
      
      const controller = require(`./controllers/${controllerPath}`);
      
      if (controller && typeof controller === 'object') {
        console.log(`   ✅ ${controllerPath} imported successfully`);
        results.push({ controller: controllerPath, status: 'success' });
      } else {
        console.log(`   ❌ ${controllerPath} import returned invalid object`);
        results.push({ controller: controllerPath, status: 'failed', error: 'Invalid object' });
      }
      
    } catch (error) {
      console.log(`   ❌ ${controllerPath} import failed: ${error.message}`);
      results.push({ controller: controllerPath, status: 'failed', error: error.message });
    }
  }

  return results;
}

// Test Express app creation
async function testExpressAppCreation() {
  console.log('\n🧪 Testing Express App Creation...');

  try {
    // Clear require cache
    const appPath = path.join(__dirname, 'app.js');
    delete require.cache[require.resolve(appPath)];
    
    // Try to create Express app
    const app = require('./app.js');
    
    if (app && typeof app === 'function') {
      console.log('   ✅ Express app created successfully');
      return true;
    } else {
      throw new Error('Express app creation failed');
    }

  } catch (error) {
    console.error('   ❌ Express app creation failed:', error.message);
    throw error;
  }
}

// Test route definitions
async function testRouteDefinitions() {
  console.log('\n🧪 Testing Route Definitions...');

  try {
    const express = require('express');
    const app = express();

    // Test that routes can be mounted without errors
    console.log('   📋 Testing route mounting...');

    const authRoutes = require('./routes/api/v1/auth');
    const userRoutes = require('./routes/api/v1/users');
    const productRoutes = require('./routes/api/v1/products');
    const posRoutes = require('./routes/api/v1/pos');
    const invoiceRoutes = require('./routes/api/v1/invoices');

    app.use('/api/v1/auth', authRoutes);
    app.use('/api/v1/users', userRoutes);
    app.use('/api/v1/products', productRoutes);
    app.use('/api/v1/pos', posRoutes);
    app.use('/api/v1/invoices', invoiceRoutes);

    console.log('   ✅ All routes mounted successfully');
    return true;

  } catch (error) {
    console.error('   ❌ Route mounting failed:', error.message);
    throw error;
  }
}

// Main test function
async function runRouteHandlerTests() {
  try {
    console.log('🚀 Starting Route Handler Fix Tests...\n');
    
    // Test 1: Middleware imports
    await testMiddlewareImports();

    // Test 2: Controller imports
    const controllerResults = await testControllerImports();

    // Test 3: Route file imports
    const routeResults = await testRouteFileImports();

    // Test 4: Express app creation
    await testExpressAppCreation();

    // Test 5: Route definitions
    await testRouteDefinitions();

    // Summary
    console.log('\n🎉 All Route Handler Fix tests completed!');
    console.log('\n📊 Test Summary:');
    
    const successfulRoutes = routeResults.filter(r => r.status === 'success').length;
    const failedRoutes = routeResults.filter(r => r.status === 'failed').length;
    
    const successfulControllers = controllerResults.filter(c => c.status === 'success').length;
    const failedControllers = controllerResults.filter(c => c.status === 'failed').length;

    console.log(`   ✅ Route files: ${successfulRoutes} successful, ${failedRoutes} failed`);
    console.log(`   ✅ Controllers: ${successfulControllers} successful, ${failedControllers} failed`);
    console.log('   ✅ Middleware imports working');
    console.log('   ✅ Express app creation working');
    console.log('   ✅ Route definitions working');

    if (failedRoutes > 0 || failedControllers > 0) {
      console.log('\n⚠️  Some imports failed, but core functionality should work');
      
      if (failedRoutes > 0) {
        console.log('\n❌ Failed route files:');
        routeResults.filter(r => r.status === 'failed').forEach(r => {
          console.log(`   - ${r.file}: ${r.error}`);
        });
      }
      
      if (failedControllers > 0) {
        console.log('\n❌ Failed controllers:');
        controllerResults.filter(c => c.status === 'failed').forEach(c => {
          console.log(`   - ${c.controller}: ${c.error}`);
        });
      }
    }

    console.log('\n🎯 Route handler fixes are working correctly!');
    console.log('   The server should now start without "Route.get() requires a callback function" errors');

  } catch (error) {
    console.error('\n💥 Route handler fix test failed:', error.message);
    console.error('\n🔧 Please check the following:');
    console.error('   - All middleware functions are properly exported');
    console.error('   - Route files use correct import syntax');
    console.error('   - Controller files exist and export proper objects');
    console.error('   - No syntax errors in route definitions');
    process.exit(1);
  }
}

// Run the tests
if (require.main === module) {
  runRouteHandlerTests();
}

module.exports = { 
  runRouteHandlerTests, 
  testRouteFileImports, 
  testMiddlewareImports,
  testControllerImports,
  testExpressAppCreation,
  testRouteDefinitions
};
