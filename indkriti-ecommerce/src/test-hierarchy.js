/**
 * Test script for the 4-level hierarchy implementation
 * This script tests the API endpoints for the hierarchy service
 */

import { HierarchyService } from './services/api/product';

// Initialize the hierarchy service
const hierarchyService = new HierarchyService();

// Test fetching brands
async function testFetchBrands() {
  console.log('Testing fetchBrands...');
  try {
    const brands = await hierarchyService.getBrands();
    console.log('Brands:', brands);
    return brands;
  } catch (error) {
    console.error('Error fetching brands:', error);
    return null;
  }
}

// Test fetching categories by brand
async function testFetchCategoriesByBrand(brandId) {
  console.log(`Testing fetchCategoriesByBrand for brand ${brandId}...`);
  try {
    const categories = await hierarchyService.getCategoriesByBrand(brandId);
    console.log('Categories:', categories);
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return null;
  }
}

// Test fetching subcategories by category
async function testFetchSubcategoriesByCategory(categoryId, brandId) {
  console.log(`Testing fetchSubcategoriesByCategory for category ${categoryId} and brand ${brandId}...`);
  try {
    const subcategories = await hierarchyService.getSubcategoriesByCategory(categoryId, brandId);
    console.log('Subcategories:', subcategories);
    return subcategories;
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return null;
  }
}

// Test fetching product types by subcategory
async function testFetchProductTypesBySubcategory(subcategoryId, brandId) {
  console.log(`Testing fetchProductTypesBySubcategory for subcategory ${subcategoryId} and brand ${brandId}...`);
  try {
    const productTypes = await hierarchyService.getProductTypesBySubcategory(subcategoryId, brandId);
    console.log('Product Types:', productTypes);
    return productTypes;
  } catch (error) {
    console.error('Error fetching product types:', error);
    return null;
  }
}

// Test fetching complete hierarchy
async function testFetchCompleteHierarchy(brandId) {
  console.log(`Testing fetchCompleteHierarchy for brand ${brandId}...`);
  try {
    const hierarchy = await hierarchyService.getCompleteHierarchy(brandId);
    console.log('Complete Hierarchy:', hierarchy);
    return hierarchy;
  } catch (error) {
    console.error('Error fetching complete hierarchy:', error);
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