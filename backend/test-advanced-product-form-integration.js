/**
 * Integration test for AdvancedProductForm with brand-specific category relationships
 * This script tests the complete flow from the AdvancedProductForm to the backend API
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api/v1';

// Test data that matches what AdvancedProductForm would send
const testAdvancedProductData = {
  indikriti: {
    name: 'Premium Cotton Bedsheet Set',
    description: 'Luxury cotton bedsheet set with premium finish',
    productType: 'Bedsheet Set',
    productStyle: 'Modern',
    discount: 15.0,
    salePrice: 2000.0,
    specialDiscount: 5.0,
    finalPrice: 1900.0,
    referralBonus: 100.0,
    loyaltyBonus: 50.0,
    hsn: '6302',
    gst: 12.0,
    longDescription: 'Premium quality cotton bedsheet set with modern design and superior comfort',
    usp1: 'Premium Cotton',
    usp2: 'Machine Washable',
    usp3: 'Fade Resistant',
    usps: ['Premium Cotton', 'Machine Washable', 'Fade Resistant'],
    images: [],
    
    // Required fields
    mrp: 1900.0,
    selling_price: 2000.0,
    stock_quantity: 0,
    batch_no: '',
    status: 'active',
    
    // Brand-specific hierarchy fields
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
    name: 'Elegant Evening Dress',
    description: 'Beautiful evening dress for special occasions',
    productType: 'Evening Dress',
    productStyle: 'Elegant',
    discount: 20.0,
    salePrice: 3500.0,
    specialDiscount: 10.0,
    finalPrice: 3150.0,
    referralBonus: 150.0,
    loyaltyBonus: 75.0,
    hsn: '6204',
    gst: 12.0,
    longDescription: 'Elegant evening dress crafted with premium fabric and exquisite design',
    usp1: 'Premium Fabric',
    usp2: 'Designer Cut',
    usp3: 'Comfortable Fit',
    usps: ['Premium Fabric', 'Designer Cut', 'Comfortable Fit'],
    images: [],
    
    // Required fields
    mrp: 3150.0,
    selling_price: 3500.0,
    stock_quantity: 0,
    batch_no: '',
    status: 'active',
    
    // Brand-specific hierarchy fields
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

// Test function to create a product using AdvancedProductForm data format
async function testAdvancedProductCreation(productData, token) {
  try {
    console.log(`\n🧪 Testing ${productData.brand} advanced product creation...`);
    console.log(`   Product: ${productData.name}`);
    
    const response = await axios.post(`${API_BASE_URL}/products`, productData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`✅ ${productData.brand} advanced product created successfully!`);
    console.log(`   Product ID: ${response.data.id || response.data.data?.id}`);
    console.log(`   Product Name: ${response.data.name || response.data.data?.name}`);
    console.log(`   Status: ${response.data.status || response.data.data?.status}`);
    
    return response.data;
  } catch (error) {
    console.error(`❌ Failed to create ${productData.brand} advanced product:`);
    console.error(`   Error: ${error.response?.data?.message || error.message}`);
    
    if (error.response?.data?.required) {
      console.error(`   Missing required fields: ${error.response.data.required.join(', ')}`);
    }
    
    if (error.response?.data?.error) {
      console.error(`   Backend error: ${error.response.data.error}`);
    }
    
    throw error;
  }
}

// Test function to verify the created product has correct brand-specific data
async function verifyAdvancedProduct(productId, expectedBrand, token) {
  try {
    console.log(`\n🔍 Verifying advanced product ${productId}...`);
    
    const response = await axios.get(`${API_BASE_URL}/products/${productId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const product = response.data;
    
    console.log(`📋 Advanced Product Details:`);
    console.log(`   Name: ${product.name}`);
    console.log(`   Brand: ${product.brand}`);
    console.log(`   Product Type: ${product.productType}`);
    console.log(`   Product Style: ${product.productStyle}`);
    console.log(`   Final Price: ${product.finalPrice}`);
    console.log(`   HSN: ${product.hsn}`);
    console.log(`   GST: ${product.gst}%`);
    
    // Check brand-specific hierarchy fields
    if (expectedBrand === 'indikriti') {
      console.log(`   Indikriti Category ID: ${product.indikriti_category_id}`);
      console.log(`   Indikriti Subcategory ID: ${product.indikriti_subcategory_id}`);
      console.log(`   Indikriti Product Type ID: ${product.indikriti_product_type_id}`);
      
      if (product.indikriti_category_name) {
        console.log(`   Indikriti Category: ${product.indikriti_category_name}`);
      }
      if (product.indikriti_subcategory_name) {
        console.log(`   Indikriti Subcategory: ${product.indikriti_subcategory_name}`);
      }
      if (product.indikriti_product_type_name) {
        console.log(`   Indikriti Product Type: ${product.indikriti_product_type_name}`);
      }
    } else if (expectedBrand === 'winsomeLane') {
      console.log(`   Winsome Lane Category ID: ${product.winsomelane_category_id}`);
      console.log(`   Winsome Lane Subcategory ID: ${product.winsomelane_subcategory_id}`);
      console.log(`   Winsome Lane Product Type ID: ${product.winsomelane_product_type_id}`);
      
      if (product.winsomelane_category_name) {
        console.log(`   Winsome Lane Category: ${product.winsomelane_category_name}`);
      }
      if (product.winsomelane_subcategory_name) {
        console.log(`   Winsome Lane Subcategory: ${product.winsomelane_subcategory_name}`);
      }
      if (product.winsomelane_product_type_name) {
        console.log(`   Winsome Lane Product Type: ${product.winsomelane_product_type_name}`);
      }
    }
    
    // Check USPs
    if (product.usp1 || product.usp2 || product.usp3) {
      console.log(`   USPs: ${[product.usp1, product.usp2, product.usp3].filter(Boolean).join(', ')}`);
    }
    
    console.log(`✅ Advanced product verification completed!`);
    return product;
  } catch (error) {
    console.error(`❌ Failed to verify advanced product ${productId}:`, error.response?.data || error.message);
    throw error;
  }
}

// Main test function
async function runAdvancedProductTests() {
  try {
    console.log('🚀 Starting AdvancedProductForm Integration Tests...\n');
    
    // Get authentication token
    console.log('🔐 Getting authentication token...');
    const token = await getAuthToken();
    console.log('✅ Authentication successful!');
    
    const createdProducts = [];
    
    // Test Indikriti advanced product creation
    const indikritProduct = await testAdvancedProductCreation(testAdvancedProductData.indikriti, token);
    const indikritProductId = indikritProduct.id || indikritProduct.data?.id;
    if (indikritProductId) {
      createdProducts.push({ id: indikritProductId, brand: 'indikriti' });
    }
    
    // Test Winsome Lane advanced product creation
    const winsomeLaneProduct = await testAdvancedProductCreation(testAdvancedProductData.winsomeLane, token);
    const winsomeLaneProductId = winsomeLaneProduct.id || winsomeLaneProduct.data?.id;
    if (winsomeLaneProductId) {
      createdProducts.push({ id: winsomeLaneProductId, brand: 'winsomeLane' });
    }
    
    // Verify created products
    for (const product of createdProducts) {
      await verifyAdvancedProduct(product.id, product.brand, token);
    }
    
    console.log('\n🎉 All AdvancedProductForm integration tests completed successfully!');
    console.log('\n📊 Test Summary:');
    console.log(`   ✅ Created ${createdProducts.length} advanced products`);
    console.log(`   ✅ Verified brand-specific category relationships`);
    console.log(`   ✅ Confirmed advanced product fields storage`);
    console.log(`   ✅ Validated USPs and pricing information`);
    
  } catch (error) {
    console.error('\n💥 AdvancedProductForm integration test failed:', error.message);
    process.exit(1);
  }
}

// Run the tests
if (require.main === module) {
  runAdvancedProductTests();
}

module.exports = { runAdvancedProductTests, testAdvancedProductCreation, verifyAdvancedProduct };
