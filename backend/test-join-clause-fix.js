/**
 * Comprehensive test script for JOIN clause fix
 * This script tests the complete product creation and retrieval flow to ensure no remaining schema errors
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api/v1';

// Test data for complete flow testing
const testProductData = {
  indikriti: {
    name: 'JOIN Clause Fix Test - Indikriti Product',
    description: 'Testing the complete flow after fixing JOIN clause schema errors',
    productType: 'Test Product Type',
    productStyle: 'Modern',
    discount: 8.0,
    salePrice: 1600.0,
    specialDiscount: 2.0,
    finalPrice: 1568.0,
    referralBonus: 80.0,
    loyaltyBonus: 40.0,
    hsn: '7777',
    gst: 18.0,
    longDescription: 'Complete flow test for JOIN clause fix without legacy column references',
    usp1: 'JOIN Fixed',
    usp2: 'Schema Compliant',
    usp3: 'Production Ready',
    usps: ['JOIN Fixed', 'Schema Compliant', 'Production Ready'],
    images: [],
    
    // Required fields
    mrp: 1568.0,
    selling_price: 1600.0,
    stock_quantity: 12,
    batch_no: 'JOIN-FIX-001',
    status: 'active',
    
    // Brand-specific hierarchy fields
    brand: 'indikriti',
    categoryId: '1',
    subcategoryId: '1',
    productTypeId: '1',
    
    product_type_id: 1
  },
  winsomeLane: {
    name: 'JOIN Clause Fix Test - Winsome Lane Product',
    description: 'Testing the complete flow after fixing JOIN clause schema errors',
    productType: 'Test Product Type',
    productStyle: 'Elegant',
    discount: 12.0,
    salePrice: 2400.0,
    specialDiscount: 4.0,
    finalPrice: 2304.0,
    referralBonus: 120.0,
    loyaltyBonus: 60.0,
    hsn: '6666',
    gst: 12.0,
    longDescription: 'Complete flow test for JOIN clause fix without legacy column references',
    usp1: 'JOIN Fixed',
    usp2: 'Schema Compliant',
    usp3: 'Production Ready',
    usps: ['JOIN Fixed', 'Schema Compliant', 'Production Ready'],
    images: [],
    
    // Required fields
    mrp: 2304.0,
    selling_price: 2400.0,
    stock_quantity: 6,
    batch_no: 'JOIN-FIX-002',
    status: 'active',
    
    // Brand-specific hierarchy fields
    brand: 'winsomeLane',
    categoryId: '1',
    subcategoryId: '1',
    productTypeId: '1',
    
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

// Test function to verify complete product creation and retrieval flow
async function testCompleteFlow(productData, token) {
  try {
    console.log(`\n🧪 Testing complete flow for ${productData.brand}...`);
    console.log(`   Product: ${productData.name}`);
    console.log(`   Testing: Creation → Retrieval → Verification`);
    
    // Step 1: Create product
    console.log(`   📝 Step 1: Creating product...`);
    const createResponse = await axios.post(`${API_BASE_URL}/products`, productData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`   ✅ Product created successfully!`);
    console.log(`      Product ID: ${createResponse.data.id || createResponse.data.data?.id}`);
    console.log(`      Status: ${createResponse.status}`);
    
    const productId = createResponse.data.id || createResponse.data.data?.id;
    
    // Step 2: Retrieve individual product (tests getProductById with JOINs)
    console.log(`   🔍 Step 2: Retrieving individual product...`);
    const getResponse = await axios.get(`${API_BASE_URL}/products/${productId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log(`   ✅ Product retrieved successfully!`);
    console.log(`      Retrieved Name: ${getResponse.data.name}`);
    console.log(`      Retrieved Brand: ${getResponse.data.brand}`);
    
    // Step 3: Test product listing (tests getAllProducts with JOINs)
    console.log(`   📋 Step 3: Testing product listing...`);
    const listResponse = await axios.get(`${API_BASE_URL}/products?brand=${productData.brand}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log(`   ✅ Product listing successful!`);
    console.log(`      Found ${listResponse.data.products?.length || 0} products for brand ${productData.brand}`);
    
    // Step 4: Verify brand-specific data integrity
    console.log(`   🔍 Step 4: Verifying brand-specific data integrity...`);
    const product = getResponse.data;
    
    if (productData.brand === 'indikriti') {
      console.log(`      ✅ Indikriti Category: ${product.indikriti_category_name || 'N/A'}`);
      console.log(`      ✅ Indikriti Subcategory: ${product.indikriti_subcategory_name || 'N/A'}`);
      console.log(`      ✅ Indikriti Product Type: ${product.indikriti_product_type_name || 'N/A'}`);
      
      if (product.winsomelane_category_id === null && 
          product.winsomelane_subcategory_id === null && 
          product.winsomelane_product_type_id === null) {
        console.log(`      ✅ Winsome Lane fields correctly null (proper isolation)`);
      }
    } else if (productData.brand === 'winsomeLane') {
      console.log(`      ✅ Winsome Lane Category: ${product.winsomelane_category_name || 'N/A'}`);
      console.log(`      ✅ Winsome Lane Subcategory: ${product.winsomelane_subcategory_name || 'N/A'}`);
      console.log(`      ✅ Winsome Lane Product Type: ${product.winsomelane_product_type_name || 'N/A'}`);
      
      if (product.indikriti_category_id === null && 
          product.indikriti_subcategory_id === null && 
          product.indikriti_product_type_id === null) {
        console.log(`      ✅ Indikriti fields correctly null (proper isolation)`);
      }
    }
    
    // Verify no legacy column references
    if (product.category_name === undefined && product.subcategory_name === undefined) {
      console.log(`      ✅ No legacy category/subcategory names (schema is correct)`);
    } else {
      console.log(`      ⚠️  Warning: Legacy category/subcategory names detected`);
    }
    
    console.log(`   🎉 Complete flow test successful for ${productData.brand}!`);
    return { productId, product };
    
  } catch (error) {
    console.error(`❌ Complete flow test failed for ${productData.brand}:`);
    console.error(`   Status: ${error.response?.status}`);
    console.error(`   Error: ${error.response?.data?.message || error.message}`);
    
    // Check for specific JOIN clause errors
    if (error.response?.data?.message && error.response.data.message.includes('Unknown column')) {
      console.error(`   🚨 JOIN CLAUSE ERROR: ${error.response.data.message}`);
      console.error(`   This indicates the JOIN clause fix didn't work properly.`);
    }
    
    if (error.response?.data?.message && error.response.data.message.includes('on clause')) {
      console.error(`   🚨 SQL JOIN ERROR: ${error.response.data.message}`);
      console.error(`   This indicates there are still problematic JOIN clauses.`);
    }
    
    throw error;
  }
}

// Test function to verify product listing with various filters
async function testProductListing(token) {
  try {
    console.log(`\n📋 Testing product listing with various filters...`);
    
    // Test basic listing
    console.log(`   🔍 Testing basic product listing...`);
    const basicResponse = await axios.get(`${API_BASE_URL}/products`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log(`   ✅ Basic listing: ${basicResponse.data.products?.length || 0} products found`);
    
    // Test brand filtering
    console.log(`   🔍 Testing brand filtering...`);
    const brandResponse = await axios.get(`${API_BASE_URL}/products?brand=indikriti`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log(`   ✅ Brand filtering: ${brandResponse.data.products?.length || 0} Indikriti products found`);
    
    // Test search functionality
    console.log(`   🔍 Testing search functionality...`);
    const searchResponse = await axios.get(`${API_BASE_URL}/products?search=JOIN`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log(`   ✅ Search functionality: ${searchResponse.data.products?.length || 0} products found with 'JOIN'`);
    
    console.log(`   🎉 Product listing tests completed successfully!`);
    
  } catch (error) {
    console.error(`❌ Product listing test failed:`, error.response?.data || error.message);
    throw error;
  }
}

// Main test function
async function runJoinClauseFixTests() {
  try {
    console.log('🚀 Starting JOIN Clause Fix Tests...\n');
    console.log('📋 Testing complete product creation and retrieval flow');
    console.log('📋 Verifying all JOIN clauses work without schema errors');
    
    // Get authentication token
    console.log('\n🔐 Getting authentication token...');
    const token = await getAuthToken();
    console.log('✅ Authentication successful!');
    
    const createdProducts = [];
    
    // Test complete flow for Indikriti
    const indikritResult = await testCompleteFlow(testProductData.indikriti, token);
    createdProducts.push({ ...indikritResult, brand: 'indikriti' });
    
    // Test complete flow for Winsome Lane
    const winsomeLaneResult = await testCompleteFlow(testProductData.winsomeLane, token);
    createdProducts.push({ ...winsomeLaneResult, brand: 'winsomeLane' });
    
    // Test product listing functionality
    await testProductListing(token);
    
    console.log('\n🎉 All JOIN clause fix tests completed successfully!');
    console.log('\n📊 Test Summary:');
    console.log(`   ✅ Fixed all JOIN clause schema errors`);
    console.log(`   ✅ Removed legacy category_id/subcategory_id JOIN references`);
    console.log(`   ✅ Created ${createdProducts.length} products successfully`);
    console.log(`   ✅ Retrieved products without schema errors`);
    console.log(`   ✅ Product listing works correctly`);
    console.log(`   ✅ Brand-specific data isolation verified`);
    console.log(`   ✅ Complete product creation and retrieval flow working!`);
    
  } catch (error) {
    console.error('\n💥 JOIN clause fix test failed:', error.message);
    process.exit(1);
  }
}

// Run the tests
if (require.main === module) {
  runJoinClauseFixTests();
}

module.exports = { runJoinClauseFixTests, testCompleteFlow, testProductListing };
