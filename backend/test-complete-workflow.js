/**
 * Complete Workflow Test Script
 * Tests the entire 4-level hierarchy: Brand → Category → Subcategory → Product Type
 */

const BrandCategoryController = require('./controllers/product/BrandCategoryController');
const Enhanced4LevelHierarchyController = require('./controllers/product/Enhanced4LevelHierarchyController');

// Mock request and response objects
const createMockReq = (params = {}, query = {}, body = {}) => ({
  params,
  query,
  body
});

const createMockRes = () => {
  const res = {};
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data) => {
    console.log(`Response (${res.statusCode || 200}):`, JSON.stringify(data, null, 2));
    return res;
  };
  return res;
};

async function testCompleteWorkflow() {
  console.log('=== Testing Complete 4-Level Hierarchy Workflow ===\n');

  try {
    // Step 1: Get all brands
    console.log('Step 1: Get all brands');
    const req1 = createMockReq();
    const res1 = createMockRes();
    await BrandCategoryController.getAllBrands(req1, res1);
    console.log('');

    // Step 2: Get categories for Indikriti (should include admin pre-seeded categories)
    console.log('Step 2: Get categories for Indikriti');
    const req2 = createMockReq({ brand: 'indikriti' });
    const res2 = createMockRes();
    await BrandCategoryController.getCategoriesByBrand(req2, res2);
    console.log('');

    // Step 3: Get complete hierarchy for Indikriti
    console.log('Step 3: Get complete hierarchy for Indikriti');
    const req3 = createMockReq({ brand: 'indikriti' });
    const res3 = createMockRes();
    await Enhanced4LevelHierarchyController.getCompleteHierarchyByBrand(req3, res3);
    console.log('');

    // Step 4: Get subcategories for Handloom category (ID 4)
    console.log('Step 4: Get subcategories for Handloom category');
    const req4 = createMockReq({ brand: 'indikriti', categoryId: '4' });
    const res4 = createMockRes();
    await Enhanced4LevelHierarchyController.getSubcategoriesByBrandAndCategory(req4, res4);
    console.log('');

    // Step 5: Create a new subcategory for Handloom
    console.log('Step 5: Create a new subcategory for Handloom');
    const req5 = createMockReq(
      { brand: 'indikriti', categoryId: '4' },
      {},
      {
        name: 'Cotton Handloom',
        description: 'Cotton-based handloom products',
        sort_order: 1
      }
    );
    const res5 = createMockRes();
    await Enhanced4LevelHierarchyController.createBrandSubcategory(req5, res5);
    console.log('');

    // Step 6: Get product types for the new subcategory (assuming it gets ID 1)
    console.log('Step 6: Get product types for Cotton Handloom subcategory');
    const req6 = createMockReq({ brand: 'indikriti', subcategoryId: '1' });
    const res6 = createMockRes();
    await Enhanced4LevelHierarchyController.getProductTypesByBrandAndSubcategory(req6, res6);
    console.log('');

    // Step 7: Create a new product type for Cotton Handloom
    console.log('Step 7: Create a new product type for Cotton Handloom');
    const req7 = createMockReq(
      { brand: 'indikriti', subcategoryId: '1' },
      {},
      {
        name: 'Cotton Saree',
        description: 'Traditional cotton sarees',
        sort_order: 1
      }
    );
    const res7 = createMockRes();
    await Enhanced4LevelHierarchyController.createBrandProductType(req7, res7);
    console.log('');

    // Step 8: Verify the complete hierarchy again
    console.log('Step 8: Verify complete hierarchy after additions');
    const req8 = createMockReq({ brand: 'indikriti' });
    const res8 = createMockRes();
    await Enhanced4LevelHierarchyController.getCompleteHierarchyByBrand(req8, res8);
    console.log('');

    console.log('=== Complete workflow test completed successfully ===');

  } catch (error) {
    console.error('Workflow test failed:', error);
  }
}

// Run the complete workflow test
testCompleteWorkflow();
