const { sequelize } = require('./connection');

async function seedProductTypes() {
  try {
    console.log('Seeding product types...');
    
    // Indikriti Product Types
    await sequelize.query(`
      INSERT INTO indikriti_product_types (name, description, subcategory_id, sort_order, created_at, updated_at) VALUES 
      ('Single Cotton', 'Single bed cotton sheets', 1, 1, NOW(), NOW()),
      ('Double Cotton', 'Double bed cotton sheets', 1, 2, NOW(), NOW()),
      ('Single Silk', 'Single bed silk sheets', 2, 1, NOW(), NOW()),
      ('Double Silk', 'Double bed silk sheets', 2, 2, NOW(), NOW()),
      ('Short Runner', 'Short decorative table runners', 3, 1, NOW(), NOW()),
      ('Long Runner', 'Long decorative table runners', 3, 2, NOW(), NOW()),
      ('Kurta Set', 'Traditional kurta with pajama', 5, 1, NOW(), NOW()),
      ('Sherwani', 'Formal traditional sherwani', 5, 2, NOW(), NOW())
    `);
    
    // Winsome Lane Product Types
    await sequelize.query(`
      INSERT INTO winsomelane_product_types (name, description, subcategory_id, sort_order, created_at, updated_at) VALUES 
      ('T-Shirt', 'Comfortable cotton t-shirts', 1, 1, NOW(), NOW()),
      ('Polo Shirt', 'Casual polo shirts', 1, 2, NOW(), NOW()),
      ('Business Shirt', 'Professional business shirts', 2, 1, NOW(), NOW()),
      ('Dress Shirt', 'Formal dress shirts', 2, 2, NOW(), NOW()),
      ('Cocktail Dress', 'Elegant cocktail dresses', 3, 1, NOW(), NOW()),
      ('Evening Gown', 'Formal evening gowns', 3, 2, NOW(), NOW()),
      ('Necklace', 'Fashion necklaces', 5, 1, NOW(), NOW()),
      ('Earrings', 'Stylish earrings', 5, 2, NOW(), NOW())
    `);
    
    console.log('Product types seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding product types:', error);
    process.exit(1);
  }
}

seedProductTypes();
