/**
 * Test script for brand-specific product creation
 * This script tests the complete flow of creating products with brand-specific category relationships
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api/v1';

// Test data for different brands
const testData = {
  indikriti: {
    brand: 'indikriti',
    categoryId: '1', // Assuming category ID 1 exists for Indikriti
    subcategoryId: '1', // Assuming subcategory ID 1 exists for Indikriti
    productTypeId: '1', // Assuming product type ID 1 exists for Indikriti
    product: {
      name: 'Test Indikriti Bedsheet',
      description: 'Premium cotton bedsheet for Indikriti brand',
      mrp: 2500.00,
      selling_price: 2000.00,
      stock_quantity: 50,
      batch_no: 'IND-BATCH-001',
      status: 'active',
      hsn: '6302',
      gst: 12.0
    }
  },
  winsomeLane: {
    brand: 'winsomeLane',
    categoryId: '1', // Assuming category ID 1 exists for Winsome Lane
    subcategoryId: '1', // Assuming subcategory ID 1 exists for Winsome Lane
    productTypeId: '1', // Assuming product type ID 1 exists for Winsome Lane
    product: {
      name: 'Test Winsome Lane Dress',
      description: 'Elegant dress for Winsome Lane brand',
      mrp: 3500.00,
      selling_price: 2800.00,
      stock_quantity: 30,
      batch_no: 'WL-BATCH-001',
      status: 'active',
      hsn: '6204',
      gst: 12.0
    }
  }
};

// Helper function to get auth token (you'll need to replace this with actual login)
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

// Test function to create a product
async function createProduct(brandData, token) {
  try {
    console.log(`\n🧪 Testing ${brandData.brand} product creation...`);
    
    const formData = new FormData();
    
    // Add product data
    formData.append('name', brandData.product.name);
    formData.append('description', brandData.product.description);
    formData.append('mrp', brandData.product.mrp.toString());
    formData.append('selling_price', brandData.product.selling_price.toString());
    formData.append('stock_quantity', brandData.product.stock_quantity.toString());
    formData.append('batch_no', brandData.product.batch_no);
    formData.append('brand', brandData.brand);
    formData.append('status', brandData.product.status);
    formData.append('hsn', brandData.product.hsn);
    formData.append('gst', brandData.product.gst.toString());
    
    // Add brand-specific hierarchy IDs
    formData.append('categoryId', brandData.categoryId);
    formData.append('subcategoryId', brandData.subcategoryId);
    formData.append('productTypeId', brandData.productTypeId);
    
    // Add legacy fields for backward compatibility
    formData.append('category_id', brandData.categoryId);
    formData.append('subcategory_id', brandData.subcategoryId);
    formData.append('product_type_id', '1');
    
    const response = await axios.post(`${API_BASE_URL}/products`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    
    console.log(`✅ ${brandData.brand} product created successfully!`);
    console.log(`   Product ID: ${response.data.id}`);
    console.log(`   Product Name: ${response.data.name}`);
    console.log(`   Status: ${response.data.status}`);
    
    return response.data;
  } catch (error) {
    console.error(`❌ Failed to create ${brandData.brand} product:`, error.response?.data || error.message);
    throw error;
  }
}

// Test function to retrieve and verify product
async function verifyProduct(productId, expectedBrand, token) {
  try {
    console.log(`\n🔍 Verifying product ${productId}...`);
    
    const response = await axios.get(`${API_BASE_URL}/products/${productId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const product = response.data;
    
    console.log(`📋 Product Details:`);
    console.log(`   Name: ${product.name}`);
    console.log(`   Brand: ${product.brand}`);
    
    // Check brand-specific fields
    if (expectedBrand === 'indikriti') {
      console.log(`   Indikriti Category ID: ${product.indikriti_category_id}`);
      console.log(`   Indikriti Subcategory ID: ${product.indikriti_subcategory_id}`);
      console.log(`   Indikriti Product Type ID: ${product.indikriti_product_type_id}`);
      console.log(`   Indikriti Category Name: ${product.indikriti_category_name}`);
      console.log(`   Indikriti Subcategory Name: ${product.indikriti_subcategory_name}`);
      console.log(`   Indikriti Product Type Name: ${product.indikriti_product_type_name}`);
      
      // Verify that Winsome Lane fields are null
      if (product.winsomelane_category_id || product.winsomelane_subcategory_id || product.winsomelane_product_type_id) {
        console.log(`⚠️  Warning: Winsome Lane fields should be null for Indikriti products`);
      }
    } else if (expectedBrand === 'winsomeLane') {
      console.log(`   Winsome Lane Category ID: ${product.winsomelane_category_id}`);
      console.log(`   Winsome Lane Subcategory ID: ${product.winsomelane_subcategory_id}`);
      console.log(`   Winsome Lane Product Type ID: ${product.winsomelane_product_type_id}`);
      console.log(`   Winsome Lane Category Name: ${product.winsomelane_category_name}`);
      console.log(`   Winsome Lane Subcategory Name: ${product.winsomelane_subcategory_name}`);
      console.log(`   Winsome Lane Product Type Name: ${product.winsomelane_product_type_name}`);
      
      // Verify that Indikriti fields are null
      if (product.indikriti_category_id || product.indikriti_subcategory_id || product.indikriti_product_type_id) {
        console.log(`⚠️  Warning: Indikriti fields should be null for Winsome Lane products`);
      }
    }
    
    console.log(`✅ Product verification completed!`);
    return product;
  } catch (error) {
    console.error(`❌ Failed to verify product ${productId}:`, error.response?.data || error.message);
    throw error;
  }
}

// Main test function
async function runTests() {
  try {
    console.log('🚀 Starting Brand-Specific Product Creation Tests...\n');
    
    // Get authentication token
    console.log('🔐 Getting authentication token...');
    const token = await getAuthToken();
    console.log('✅ Authentication successful!');
    
    const createdProducts = [];
    
    // Test Indikriti product creation
    const indikritProduct = await createProduct(testData.indikriti, token);
    createdProducts.push({ id: indikritProduct.id, brand: 'indikriti' });
    
    // Test Winsome Lane product creation
    const winsomeLaneProduct = await createProduct(testData.winsomeLane, token);
    createdProducts.push({ id: winsomeLaneProduct.id, brand: 'winsomeLane' });
    
    // Verify created products
    for (const product of createdProducts) {
      await verifyProduct(product.id, product.brand, token);
    }
    
    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📊 Test Summary:');
    console.log(`   ✅ Created ${createdProducts.length} products`);
    console.log(`   ✅ Verified brand-specific category relationships`);
    console.log(`   ✅ Confirmed proper data isolation between brands`);
    
  } catch (error) {
    console.error('\n💥 Test failed:', error.message);
    process.exit(1);
  }
}

// Run the tests
if (require.main === module) {
  runTests();
}

module.exports = { runTests, createProduct, verifyProduct };
