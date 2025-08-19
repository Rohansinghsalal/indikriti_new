/**
 * Test script for the 4-level hierarchy implementation
 * This script tests the API endpoints for the hierarchy service
 */

const axios = require('axios');

// Base URL for API calls
const BASE_URL = 'http://localhost:3000/api';

// API endpoints
const API_ENDPOINTS = {
  HIERARCHY: {
    BRANDS: '/hierarchy/brands',
    BRAND_CATEGORIES: '/hierarchy/brands/:brandId/categories',
    BRAND_SUBCATEGORIES: '/hierarchy/brands/:brandId/categories/:categoryId/subcategories',
    BRAND_PRODUCT_TYPES: '/hierarchy/brands/:brandId/subcategories/:subcategoryId/product-types',
    COMPLETE_HIERARCHY: '/hierarchy/brands/:brandId/complete'
  }
};

// Test fetching brands
async function testFetchBrands() {
  console.log('Testing fetchBrands...');
  try {
    const response = await axios.get(`${BASE_URL}${API_ENDPOINTS.HIERARCHY.BRANDS}`);
    console.log('Brands:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching brands:', error.message);
    return null;
  }
}

// Test fetching categories by brand
async function testFetchCategoriesByBrand(brandId) {
  console.log(`Testing fetchCategoriesByBrand for brand ${brandId}...`);
  try {
    const url = `${BASE_URL}${API_ENDPOINTS.HIERARCHY.BRAND_CATEGORIES.replace(':brandId', brandId)}`;
    const response = await axios.get(url);
    console.log('Categories:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error.message);
    return null;
  }
}

// Test fetching subcategories by category
async function testFetchSubcategoriesByCategory(categoryId, brandId) {
  console.log(`Testing fetchSubcategoriesByCategory for category ${categoryId} and brand ${brandId}...`);
  try {
    const url = `${BASE_URL}${API_ENDPOINTS.HIERARCHY.BRAND_SUBCATEGORIES
      .replace(':brandId', brandId)
      .replace(':categoryId', categoryId)}`;
    const response = await axios.get(url);
    console.log('Subcategories:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching subcategories:', error.message);
    return null;
  }
}

// Test fetching product types by subcategory
async function testFetchProductTypesBySubcategory(subcategoryId, brandId) {
  console.log(`Testing fetchProductTypesBySubcategory for subcategory ${subcategoryId} and brand ${brandId}...`);
  try {
    const url = `${BASE_URL}${API_ENDPOINTS.HIERARCHY.BRAND_PRODUCT_TYPES
      .replace(':brandId', brandId)
      .replace(':subcategoryId', subcategoryId)}`;
    const response = await axios.get(url);
    console.log('Product Types:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching product types:', error.message);
    return null;
  }
}

// Test fetching complete hierarchy
async function testFetchCompleteHierarchy(brandId) {
  console.log(`Testing fetchCompleteHierarchy for brand ${brandId}...`);
  try {
    const url = `${BASE_URL}${API_ENDPOINTS.HIERARCHY.COMPLETE_HIERARCHY.replace(':brandId', brandId)}`;
    const response = await axios.get(url);
    console.log('Complete Hierarchy:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching complete hierarchy:', error.message);
    return null;
  }
}

// Run all tests
async function runTests() {
  console.log('Starting hierarchy API tests...');
  
  // Test fetching brands
  const brands = await testFetchBrands();
  if (!brands || brands.length === 0) {
    console.error('No brands found, cannot continue tests.');
    return;
  }
  
  // Use the first brand for testing
  const testBrand = brands[0];
  console.log(`Using brand ${testBrand.name} (${testBrand._id}) for testing...`);
  
  // Test fetching categories
  const categories = await testFetchCategoriesByBrand(testBrand._id);
  if (!categories || categories.length === 0) {
    console.error('No categories found, cannot continue subcategory tests.');
    return;
  }
  
  // Use the first category for testing
  const testCategory = categories[0];
  console.log(`Using category ${testCategory.name} (${testCategory._id}) for testing...`);
  
  // Test fetching subcategories
  const subcategories = await testFetchSubcategoriesByCategory(testCategory._id, testBrand._id);
  if (!subcategories || subcategories.length === 0) {
    console.error('No subcategories found, cannot continue product type tests.');
    return;
  }
  
  // Use the first subcategory for testing
  const testSubcategory = subcategories[0];
  console.log(`Using subcategory ${testSubcategory.name} (${testSubcategory._id}) for testing...`);
  
  // Test fetching product types
  await testFetchProductTypesBySubcategory(testSubcategory._id, testBrand._id);
  
  // Test fetching complete hierarchy
  await testFetchCompleteHierarchy(testBrand._id);
  
  console.log('All hierarchy API tests completed.');
}

// Run the tests
runTests().catch(error => {
  console.error('Error running tests:', error);
});