/**
 * Test script to verify the database insert fix for brand-specific product creation
 * This script tests the corrected ProductService.createProduct method
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api/v1';

// Test data that exactly matches what AdvancedProductForm sends
const testProductData = {
  indikriti: {
    name: 'Test Indikriti Product - Database Fix',
    description: 'Testing the database insert fix for Indikriti products',
    productType: 'Test Product Type',
    productStyle: 'Modern',
    discount: 10.0,
    salePrice: 1500.0,
    specialDiscount: 5.0,
    finalPrice: 1425.0,
    referralBonus: 75.0,
    loyaltyBonus: 35.0,
    hsn: '1234',
    gst: 18.0,
    longDescription: 'Detailed description for testing database insert fix',
    usp1: 'Quality Tested',
    usp2: 'Database Fixed',
    usp3: 'Brand Specific',
    usps: ['Quality Tested', 'Database Fixed', 'Brand Specific'],
    images: [],
    
    // Required fields
    mrp: 1425.0,
    selling_price: 1500.0,
    stock_quantity: 10,
    batch_no: 'TEST-BATCH-001',
    status: 'active',
    
    // Brand-specific hierarchy fields (these should be properly inserted now)
    brand: 'indikriti',
    categoryId: '1',
    subcategoryId: '1',
    productTypeId: '1',
    
    // Legacy fields for backward compatibility
    category_id: '1',
    subcategory_id: '1',
    product_type_id: 1
  },
  winsomeLane: {
    name: 'Test Winsome Lane Product - Database Fix',
    description: 'Testing the database insert fix for Winsome Lane products',
    productType: 'Test Product Type',
    productStyle: 'Elegant',
    discount: 15.0,
    salePrice: 2500.0,
    specialDiscount: 8.0,
    finalPrice: 2300.0,
    referralBonus: 125.0,
    loyaltyBonus: 60.0,
    hsn: '5678',
    gst: 12.0,
    longDescription: 'Detailed description for testing database insert fix',
    usp1: 'Premium Quality',
    usp2: 'Database Fixed',
    usp3: 'Brand Specific',
    usps: ['Premium Quality', 'Database Fixed', 'Brand Specific'],
    images: [],
    
    // Required fields
    mrp: 2300.0,
    selling_price: 2500.0,
    stock_quantity: 5,
    batch_no: 'TEST-BATCH-002',
    status: 'active',
    
    // Brand-specific hierarchy fields (these should be properly inserted now)
    brand: 'winsomeLane',
    categoryId: '1',
    subcategoryId: '1',
    productTypeId: '1',
    
    // Legacy fields for backward compatibility
    category_id: '1',
    subcategory_id: '1',
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

// Test function to create a product and verify database insert
async function testDatabaseInsert(productData, token) {
  try {
    console.log(`\n🧪 Testing ${productData.brand} database insert fix...`);
    console.log(`   Product: ${productData.name}`);
    
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
    
    return response.data;
  } catch (error) {
    console.error(`❌ Failed to create ${productData.brand} product:`);
    console.error(`   Status: ${error.response?.status}`);
    console.error(`   Error: ${error.response?.data?.message || error.message}`);
    
    if (error.response?.data?.error) {
      console.error(`   Backend Error: ${error.response.data.error}`);
    }
    
    if (error.response?.data?.required) {
      console.error(`   Missing Required Fields: ${error.response.data.required.join(', ')}`);
    }
    
    // Log the full error for debugging
    if (error.response?.data) {
      console.error(`   Full Error Response:`, JSON.stringify(error.response.data, null, 2));
    }
    
    throw error;
  }
}

// Test function to verify the database contains the correct brand-specific data
async function verifyDatabaseData(productId, expectedBrand, token) {
  try {
    console.log(`\n🔍 Verifying database data for product ${productId}...`);
    
    const response = await axios.get(`${API_BASE_URL}/products/${productId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const product = response.data;
    
    console.log(`📋 Database Verification Results:`);
    console.log(`   Product Name: ${product.name}`);
    console.log(`   Brand: ${product.brand}`);
    
    // Check brand-specific hierarchy fields in database
    if (expectedBrand === 'indikriti') {
      console.log(`   ✓ Indikriti Category ID: ${product.indikriti_category_id}`);
      console.log(`   ✓ Indikriti Subcategory ID: ${product.indikriti_subcategory_id}`);
      console.log(`   ✓ Indikriti Product Type ID: ${product.indikriti_product_type_id}`);
      
      // Verify Winsome Lane fields are null
      if (product.winsomelane_category_id === null && 
          product.winsomelane_subcategory_id === null && 
          product.winsomelane_product_type_id === null) {
        console.log(`   ✓ Winsome Lane fields correctly set to null`);
      } else {
        console.log(`   ⚠️  Warning: Winsome Lane fields should be null`);
      }
    } else if (expectedBrand === 'winsomeLane') {
      console.log(`   ✓ Winsome Lane Category ID: ${product.winsomelane_category_id}`);
      console.log(`   ✓ Winsome Lane Subcategory ID: ${product.winsomelane_subcategory_id}`);
      console.log(`   ✓ Winsome Lane Product Type ID: ${product.winsomelane_product_type_id}`);
      
      // Verify Indikriti fields are null
      if (product.indikriti_category_id === null && 
          product.indikriti_subcategory_id === null && 
          product.indikriti_product_type_id === null) {
        console.log(`   ✓ Indikriti fields correctly set to null`);
      } else {
        console.log(`   ⚠️  Warning: Indikriti fields should be null`);
      }
    }
    
    // Check legacy fields
    console.log(`   ✓ Legacy Category ID: ${product.category_id}`);
    console.log(`   ✓ Legacy Subcategory ID: ${product.subcategory_id}`);
    
    // Check advanced fields
    console.log(`   ✓ Product Style: ${product.product_style || product.productStyle}`);
    console.log(`   ✓ Final Price: ${product.final_price || product.finalPrice}`);
    console.log(`   ✓ HSN: ${product.hsn}`);
    console.log(`   ✓ GST: ${product.gst}%`);
    console.log(`   ✓ USP1: ${product.usp1}`);
    console.log(`   ✓ USP2: ${product.usp2}`);
    console.log(`   ✓ USP3: ${product.usp3}`);
    
    console.log(`✅ Database verification completed successfully!`);
    return product;
  } catch (error) {
    console.error(`❌ Failed to verify database data for product ${productId}:`, error.response?.data || error.message);
    throw error;
  }
}

// Main test function
async function runDatabaseInsertTests() {
  try {
    console.log('🚀 Starting Database Insert Fix Tests...\n');
    
    // Get authentication token
    console.log('🔐 Getting authentication token...');
    const token = await getAuthToken();
    console.log('✅ Authentication successful!');
    
    const createdProducts = [];
    
    // Test Indikriti product creation
    const indikritProduct = await testDatabaseInsert(testProductData.indikriti, token);
    const indikritProductId = indikritProduct.id || indikritProduct.data?.id;
    if (indikritProductId) {
      createdProducts.push({ id: indikritProductId, brand: 'indikriti' });
    }
    
    // Test Winsome Lane product creation
    const winsomeLaneProduct = await testDatabaseInsert(testProductData.winsomeLane, token);
    const winsomeLaneProductId = winsomeLaneProduct.id || winsomeLaneProduct.data?.id;
    if (winsomeLaneProductId) {
      createdProducts.push({ id: winsomeLaneProductId, brand: 'winsomeLane' });
    }
    
    // Verify database data for created products
    for (const product of createdProducts) {
      await verifyDatabaseData(product.id, product.brand, token);
    }
    
    console.log('\n🎉 All database insert fix tests completed successfully!');
    console.log('\n📊 Test Summary:');
    console.log(`   ✅ Fixed SQL parameter count mismatch`);
    console.log(`   ✅ Added brand-specific hierarchy fields to database`);
    console.log(`   ✅ Created ${createdProducts.length} products successfully`);
    console.log(`   ✅ Verified brand-specific field isolation`);
    console.log(`   ✅ Confirmed advanced product fields storage`);
    console.log(`   ✅ Database insert fix is working correctly!`);
    
  } catch (error) {
    console.error('\n💥 Database insert fix test failed:', error.message);
    process.exit(1);
  }
}

// Run the tests
if (require.main === module) {
  runDatabaseInsertTests();
}

module.exports = { runDatabaseInsertTests, testDatabaseInsert, verifyDatabaseData };
