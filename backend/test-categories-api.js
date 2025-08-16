/**
 * Test Script for Categories API
 * Tests the brand-specific categories management endpoints
 */
const axios = require('axios');

const API_BASE_URL = 'http://localhost:5001/api/v1';
const TEST_TOKEN = 'your-jwt-token-here'; // Replace with actual token

// Test configuration
const testBrand = 'indikriti';
let createdCategoryId = null;
let createdSubcategoryId = null;
let createdProductTypeId = null;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${TEST_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

async function testCategoriesAPI() {
  console.log('🧪 Testing Categories Management API...\n');

  try {
    // Test 1: Get hierarchy (should work even if empty)
    console.log('1️⃣ Testing GET hierarchy...');
    try {
      const hierarchyResponse = await api.get(`/products/brands/${testBrand}/hierarchy`);
      console.log('✅ Hierarchy endpoint working');
      console.log('📊 Current hierarchy:', JSON.stringify(hierarchyResponse.data, null, 2));
    } catch (error) {
      console.log('❌ Hierarchy endpoint failed:', error.response?.data || error.message);
    }

    // Test 2: Create a category
    console.log('\n2️⃣ Testing POST category...');
    try {
      const categoryData = {
        name: 'Test Category',
        description: 'A test category for API testing',
        sort_order: 1
      };
      
      const categoryResponse = await api.post(`/products/brands/${testBrand}/categories`, categoryData);
      createdCategoryId = categoryResponse.data.data.id;
      console.log('✅ Category created successfully');
      console.log('📝 Created category ID:', createdCategoryId);
    } catch (error) {
      console.log('❌ Category creation failed:', error.response?.data || error.message);
    }

    // Test 3: Create a subcategory (if category was created)
    if (createdCategoryId) {
      console.log('\n3️⃣ Testing POST subcategory...');
      try {
        const subcategoryData = {
          name: 'Test Subcategory',
          description: 'A test subcategory for API testing',
          sort_order: 1
        };
        
        const subcategoryResponse = await api.post(
          `/products/brands/${testBrand}/categories/${createdCategoryId}/subcategories`,
          subcategoryData
        );
        createdSubcategoryId = subcategoryResponse.data.data.id;
        console.log('✅ Subcategory created successfully');
        console.log('📝 Created subcategory ID:', createdSubcategoryId);
      } catch (error) {
        console.log('❌ Subcategory creation failed:', error.response?.data || error.message);
      }
    }

    // Test 4: Create a product type (if subcategory was created)
    if (createdSubcategoryId) {
      console.log('\n4️⃣ Testing POST product type...');
      try {
        const productTypeData = {
          name: 'Test Product Type',
          description: 'A test product type for API testing',
          sort_order: 1
        };
        
        const productTypeResponse = await api.post(
          `/products/brands/${testBrand}/subcategories/${createdSubcategoryId}/product-types`,
          productTypeData
        );
        createdProductTypeId = productTypeResponse.data.data.id;
        console.log('✅ Product type created successfully');
        console.log('📝 Created product type ID:', createdProductTypeId);
      } catch (error) {
        console.log('❌ Product type creation failed:', error.response?.data || error.message);
      }
    }

    // Test 5: Get updated hierarchy
    console.log('\n5️⃣ Testing GET updated hierarchy...');
    try {
      const updatedHierarchyResponse = await api.get(`/products/brands/${testBrand}/hierarchy`);
      console.log('✅ Updated hierarchy retrieved');
      console.log('📊 Updated hierarchy:', JSON.stringify(updatedHierarchyResponse.data, null, 2));
    } catch (error) {
      console.log('❌ Updated hierarchy failed:', error.response?.data || error.message);
    }

    // Test 6: Update operations
    if (createdCategoryId) {
      console.log('\n6️⃣ Testing PUT category...');
      try {
        const updateData = {
          name: 'Updated Test Category',
          description: 'Updated description',
          sort_order: 2
        };
        
        await api.put(`/products/brands/${testBrand}/categories/${createdCategoryId}`, updateData);
        console.log('✅ Category updated successfully');
      } catch (error) {
        console.log('❌ Category update failed:', error.response?.data || error.message);
      }
    }

    // Cleanup: Delete created items
    console.log('\n🧹 Cleaning up test data...');
    
    if (createdProductTypeId) {
      try {
        await api.delete(`/products/brands/${testBrand}/product-types/${createdProductTypeId}`);
        console.log('✅ Product type deleted');
      } catch (error) {
        console.log('❌ Product type deletion failed:', error.response?.data || error.message);
      }
    }
    
    if (createdSubcategoryId) {
      try {
        await api.delete(`/products/brands/${testBrand}/subcategories/${createdSubcategoryId}`);
        console.log('✅ Subcategory deleted');
      } catch (error) {
        console.log('❌ Subcategory deletion failed:', error.response?.data || error.message);
      }
    }
    
    if (createdCategoryId) {
      try {
        await api.delete(`/products/brands/${testBrand}/categories/${createdCategoryId}`);
        console.log('✅ Category deleted');
      } catch (error) {
        console.log('❌ Category deletion failed:', error.response?.data || error.message);
      }
    }

    console.log('\n🎉 API testing completed!');

  } catch (error) {
    console.error('💥 Test suite failed:', error.message);
  }
}

// Instructions for running the test
console.log('📋 Categories API Test Instructions:');
console.log('1. Make sure the backend server is running on port 5001');
console.log('2. Get a valid JWT token by logging in');
console.log('3. Replace TEST_TOKEN variable with your actual token');
console.log('4. Run: node test-categories-api.js');
console.log('5. Check the output for test results\n');

// Uncomment the line below to run the test (after setting up the token)
// testCategoriesAPI();

module.exports = testCategoriesAPI;
