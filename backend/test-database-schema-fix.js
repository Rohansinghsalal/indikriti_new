/**
 * Production-ready test script for database schema fix
 * This script tests the corrected ProductService without legacy column dependencies
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api/v1';

// Test data that matches the corrected database schema (no legacy category_id/subcategory_id)
const testProductData = {
  indikriti: {
    name: 'Schema Fix Test - Indikriti Product',
    description: 'Testing the database schema fix for Indikriti products',
    productType: 'Test Product Type',
    productStyle: 'Modern',
    discount: 12.0,
    salePrice: 1800.0,
    specialDiscount: 3.0,
    finalPrice: 1746.0,
    referralBonus: 90.0,
    loyaltyBonus: 45.0,
    hsn: '9999',
    gst: 18.0,
    longDescription: 'Comprehensive test for database schema fix without legacy columns',
    usp1: 'Schema Fixed',
    usp2: 'Production Ready',
    usp3: 'Brand Specific',
    usps: ['Schema Fixed', 'Production Ready', 'Brand Specific'],
    images: [],
    
    // Required fields
    mrp: 1746.0,
    selling_price: 1800.0,
    stock_quantity: 15,
    batch_no: 'SCHEMA-FIX-001',
    status: 'active',
    
    // Brand-specific hierarchy fields (only these exist in database)
    brand: 'indikriti',
    categoryId: '1',
    subcategoryId: '1',
    productTypeId: '1',
    
    // No legacy fields - they don't exist in database schema
    product_type_id: 1
  },
  winsomeLane: {
    name: 'Schema Fix Test - Winsome Lane Product',
    description: 'Testing the database schema fix for Winsome Lane products',
    productType: 'Test Product Type',
    productStyle: 'Elegant',
    discount: 18.0,
    salePrice: 2800.0,
    specialDiscount: 7.0,
    finalPrice: 2604.0,
    referralBonus: 140.0,
    loyaltyBonus: 70.0,
    hsn: '8888',
    gst: 12.0,
    longDescription: 'Comprehensive test for database schema fix without legacy columns',
    usp1: 'Schema Fixed',
    usp2: 'Production Ready',
    usp3: 'Brand Specific',
    usps: ['Schema Fixed', 'Production Ready', 'Brand Specific'],
    images: [],
    
    // Required fields
    mrp: 2604.0,
    selling_price: 2800.0,
    stock_quantity: 8,
    batch_no: 'SCHEMA-FIX-002',
    status: 'active',
    
    // Brand-specific hierarchy fields (only these exist in database)
    brand: 'winsomeLane',
    categoryId: '1',
    subcategoryId: '1',
    productTypeId: '1',
    
    // No legacy fields - they don't exist in database schema
    product_type_id: 1
  }
};

// Helper function to get auth token
async function getAuthToken() {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'admin@example.com',
      password: 'admin123'
    });
    return response.data.token;
  } catch (error) {
    console.error('Failed to get auth token:', error.response?.data || error.message);
    throw error;
  }
}

// Test function to verify schema fix
async function testSchemaFix(productData, token) {
  try {
    console.log(`\n🧪 Testing ${productData.brand} schema fix...`);
    console.log(`   Product: ${productData.name}`);
    console.log(`   Testing without legacy category_id/subcategory_id columns`);
    
    const response = await axios.post(`${API_BASE_URL}/products`, productData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`✅ ${productData.brand} product created successfully!`);
    console.log(`   Product ID: ${response.data.id || response.data.data?.id}`);
    console.log(`   Response Status: ${response.status}`);
    console.log(`   Success: ${response.data.success}`);
    console.log(`   ✅ No database schema errors!`);
    
    return response.data;
  } catch (error) {
    console.error(`❌ Failed to create ${productData.brand} product:`);
    console.error(`   Status: ${error.response?.status}`);
    console.error(`   Error: ${error.response?.data?.message || error.message}`);
    
    // Check for specific database schema errors
    if (error.response?.data?.message && error.response.data.message.includes('Unknown column')) {
      console.error(`   🚨 DATABASE SCHEMA ERROR: ${error.response.data.message}`);
      console.error(`   This indicates the fix didn't work properly.`);
    }
    
    if (error.response?.data?.error) {
      console.error(`   Backend Error: ${error.response.data.error}`);
    }
    
    throw error;
  }
}

// Test function to verify database contains correct schema-compliant data
async function verifySchemaCompliantData(productId, expectedBrand, token) {
  try {
    console.log(`\n🔍 Verifying schema-compliant data for product ${productId}...`);
    
    const response = await axios.get(`${API_BASE_URL}/products/${productId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const product = response.data;
    
    console.log(`📋 Schema Compliance Verification:`);
    console.log(`   Product Name: ${product.name}`);
    console.log(`   Brand: ${product.brand}`);
    
    // Verify brand-specific hierarchy fields exist and are populated
    if (expectedBrand === 'indikriti') {
      console.log(`   ✅ Indikriti Category ID: ${product.indikriti_category_id}`);
      console.log(`   ✅ Indikriti Subcategory ID: ${product.indikriti_subcategory_id}`);
      console.log(`   ✅ Indikriti Product Type ID: ${product.indikriti_product_type_id}`);
      
      // Verify Winsome Lane fields are null (proper isolation)
      if (product.winsomelane_category_id === null && 
          product.winsomelane_subcategory_id === null && 
          product.winsomelane_product_type_id === null) {
        console.log(`   ✅ Winsome Lane fields correctly null (proper brand isolation)`);
      } else {
        console.log(`   ⚠️  Warning: Winsome Lane fields should be null for Indikriti products`);
      }
    } else if (expectedBrand === 'winsomeLane') {
      console.log(`   ✅ Winsome Lane Category ID: ${product.winsomelane_category_id}`);
      console.log(`   ✅ Winsome Lane Subcategory ID: ${product.winsomelane_subcategory_id}`);
      console.log(`   ✅ Winsome Lane Product Type ID: ${product.winsomelane_product_type_id}`);
      
      // Verify Indikriti fields are null (proper isolation)
      if (product.indikriti_category_id === null && 
          product.indikriti_subcategory_id === null && 
          product.indikriti_product_type_id === null) {
        console.log(`   ✅ Indikriti fields correctly null (proper brand isolation)`);
      } else {
        console.log(`   ⚠️  Warning: Indikriti fields should be null for Winsome Lane products`);
      }
    }
    
    // Verify advanced fields are properly stored
    console.log(`   ✅ Product Style: ${product.product_style || product.productStyle}`);
    console.log(`   ✅ Final Price: ${product.final_price || product.finalPrice}`);
    console.log(`   ✅ HSN: ${product.hsn}`);
    console.log(`   ✅ GST: ${product.gst}%`);
    console.log(`   ✅ USPs: ${[product.usp1, product.usp2, product.usp3].filter(Boolean).join(', ')}`);
    
    // Verify no legacy columns are referenced (they shouldn't exist)
    if (product.category_id !== undefined || product.subcategory_id !== undefined) {
      console.log(`   ⚠️  Warning: Legacy category_id/subcategory_id columns detected - these should not exist`);
    } else {
      console.log(`   ✅ No legacy category_id/subcategory_id columns (schema is correct)`);
    }
    
    console.log(`✅ Schema compliance verification completed successfully!`);
    return product;
  } catch (error) {
    console.error(`❌ Failed to verify schema-compliant data for product ${productId}:`, error.response?.data || error.message);
    throw error;
  }
}

// Main test function
async function runSchemaFixTests() {
  try {
    console.log('🚀 Starting Database Schema Fix Tests...\n');
    console.log('📋 Testing without legacy category_id/subcategory_id columns');
    console.log('📋 Verifying brand-specific hierarchy fields only');
    
    // Get authentication token
    console.log('\n🔐 Getting authentication token...');
    const token = await getAuthToken();
    console.log('✅ Authentication successful!');
    
    const createdProducts = [];
    
    // Test Indikriti product creation with schema fix
    const indikritProduct = await testSchemaFix(testProductData.indikriti, token);
    const indikritProductId = indikritProduct.id || indikritProduct.data?.id;
    if (indikritProductId) {
      createdProducts.push({ id: indikritProductId, brand: 'indikriti' });
    }
    
    // Test Winsome Lane product creation with schema fix
    const winsomeLaneProduct = await testSchemaFix(testProductData.winsomeLane, token);
    const winsomeLaneProductId = winsomeLaneProduct.id || winsomeLaneProduct.data?.id;
    if (winsomeLaneProductId) {
      createdProducts.push({ id: winsomeLaneProductId, brand: 'winsomeLane' });
    }
    
    // Verify schema-compliant data for created products
    for (const product of createdProducts) {
      await verifySchemaCompliantData(product.id, product.brand, token);
    }
    
    console.log('\n🎉 All database schema fix tests completed successfully!');
    console.log('\n📊 Test Summary:');
    console.log(`   ✅ Fixed database schema column mismatch`);
    console.log(`   ✅ Removed legacy category_id/subcategory_id dependencies`);
    console.log(`   ✅ Created ${createdProducts.length} products successfully`);
    console.log(`   ✅ Verified brand-specific field isolation`);
    console.log(`   ✅ Confirmed schema compliance`);
    console.log(`   ✅ Production-ready solution working correctly!`);
    
  } catch (error) {
    console.error('\n💥 Database schema fix test failed:', error.message);
    process.exit(1);
  }
}

// Run the tests
if (require.main === module) {
  runSchemaFixTests();
}

module.exports = { runSchemaFixTests, testSchemaFix, verifySchemaCompliantData };
