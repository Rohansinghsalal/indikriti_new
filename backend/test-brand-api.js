/**
 * Test script to verify brand-specific API endpoints
 */

const BrandCategoryController = require('./controllers/product/BrandCategoryController');

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

async function testBrandAPIs() {
  console.log('=== Testing Brand Category APIs ===\n');

  try {
    // Test 1: Get all brands
    console.log('1. Testing getAllBrands...');
    const req1 = createMockReq();
    const res1 = createMockRes();
    await BrandCategoryController.getAllBrands(req1, res1);
    console.log('');

    // Test 2: Get Indikriti categories
    console.log('2. Testing getCategoriesByBrand for Indikriti...');
    const req2 = createMockReq({ brand: 'indikriti' });
    const res2 = createMockRes();
    await BrandCategoryController.getCategoriesByBrand(req2, res2);
    console.log('');

    // Test 3: Get Winsome Lane categories
    console.log('3. Testing getCategoriesByBrand for Winsome Lane...');
    const req3 = createMockReq({ brand: 'winsomeLane' });
    const res3 = createMockRes();
    await BrandCategoryController.getCategoriesByBrand(req3, res3);
    console.log('');

    // Test 4: Create a new category for Indikriti
    console.log('4. Testing createBrandCategory for Indikriti...');
    const req4 = createMockReq(
      { brand: 'indikriti' },
      {},
      {
        name: 'Test Category',
        description: 'A test category for Indikriti',
        sort_order: 10
      }
    );
    const res4 = createMockRes();
    await BrandCategoryController.createBrandCategory(req4, res4);
    console.log('');

    // Test 5: Create a new category for Winsome Lane
    console.log('5. Testing createBrandCategory for Winsome Lane...');
    const req5 = createMockReq(
      { brand: 'winsomeLane' },
      {},
      {
        name: 'Test Category WL',
        description: 'A test category for Winsome Lane',
        sort_order: 10
      }
    );
    const res5 = createMockRes();
    await BrandCategoryController.createBrandCategory(req5, res5);
    console.log('');

    console.log('=== All tests completed ===');

  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the tests
testBrandAPIs();
