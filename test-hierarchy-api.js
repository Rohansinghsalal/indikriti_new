const fetch = require('node-fetch');

async function testHierarchyAPI() {
  try {
    // You'll need to replace this with a valid JWT token
    const token = 'your-jwt-token-here';
    
    const response = await fetch('http://localhost:5001/api/v1/products/brands/indikriti/hierarchy', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log('API Response:', JSON.stringify(data, null, 2));
      
      // Check subcategories
      if (data.data && data.data.length > 0) {
        data.data.forEach(category => {
          console.log(`\nCategory: ${category.name}`);
          console.log(`Subcategories count: ${category.subcategories ? category.subcategories.length : 0}`);
          if (category.subcategories && category.subcategories.length > 0) {
            category.subcategories.forEach(sub => {
              console.log(`  - Subcategory: ${sub.name}`);
              console.log(`    Product types count: ${sub.productTypes ? sub.productTypes.length : 0}`);
            });
          }
        });
      }
    } else {
      console.error('API Error:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

console.log('To test the API:');
console.log('1. Get a JWT token by logging into the frontend');
console.log('2. Replace the token variable above');
console.log('3. Run: node test-hierarchy-api.js');

// Uncomment to run the test
// testHierarchyAPI();
