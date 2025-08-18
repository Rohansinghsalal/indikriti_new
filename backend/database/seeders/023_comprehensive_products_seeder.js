/**
 * Comprehensive Products Seeder
 * Creates 20+ products across different product types for testing the category navigation system
 */

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    
    // Comprehensive product data with proper hierarchy linkage
    // Using actual database IDs: Categories: 1=jwellry, 3=handloom, 4=Handicraft
    // Subcategories: 2=Fallen(jwellry), 3=234234(jwellry), 8=abc(handloom), 9=hbhb(jwellry), 10=Fallen(Handicraft)
    // Product Types: 1=asdasda(234234), 4=123123112(Fallen), 5=12(abc), 6=Wireless Headphones(Fallen), 7=Java Full Stack Developer(Fallen)
    const products = [
      // Products for Product Type 1 (asdasda under 234234 subcategory under jwellry)
      {
        product_id: 'IND-JW-001',
        sku: 'JW001',
        name: 'Premium Gold Necklace Set',
        description: 'Luxurious gold necklace set with traditional design and premium finish.',
        mrp: 25000.00,
        selling_price: 22500.00,
        stock_quantity: 15,
        brand: 'indikriti',
        status: 'active',
        indikriti_category_id: 1, // jwellry
        indikriti_subcategory_id: 3, // 234234
        indikriti_product_type_id: 1, // asdasda
        product_style: 'Traditional',
        discount: 10.00,
        sale_price: 22500.00,
        final_price: 22500.00,
        hsn: '7113',
        gst: 3.00,
        long_description: 'Exquisite gold necklace set crafted with traditional techniques and premium quality gold.',
        usp1: 'Premium Gold',
        usp2: 'Traditional Design',
        usp3: 'Handcrafted',
        created_at: now,
        updated_at: now
      },
      {
        product_id: 'IND-JW-002',
        sku: 'JW002',
        name: 'Diamond Earrings Set',
        description: 'Elegant diamond earrings with sparkling stones and premium setting.',
        mrp: 18000.00,
        selling_price: 16200.00,
        stock_quantity: 20,
        brand: 'indikriti',
        status: 'active',
        indikriti_category_id: 1, // jwellry
        indikriti_subcategory_id: 3, // 234234
        indikriti_product_type_id: 1, // asdasda
        product_style: 'Modern',
        discount: 10.00,
        sale_price: 16200.00,
        final_price: 16200.00,
        hsn: '7113',
        gst: 3.00,
        long_description: 'Beautiful diamond earrings with high-quality stones and elegant design.',
        usp1: 'Premium Diamonds',
        usp2: 'Elegant Design',
        usp3: 'Quality Setting',
        created_at: now,
        updated_at: now
      },

      // Products for Product Type 4 (123123112 under Fallen subcategory under jwellry)
      {
        product_id: 'IND-JW-003',
        sku: 'JW003',
        name: 'Silver Bracelet Collection',
        description: 'Handcrafted silver bracelet with intricate patterns and premium finish.',
        mrp: 5500.00,
        selling_price: 4950.00,
        stock_quantity: 35,
        brand: 'indikriti',
        status: 'active',
        indikriti_category_id: 1, // jwellry
        indikriti_subcategory_id: 2, // Fallen
        indikriti_product_type_id: 4, // 123123112
        product_style: 'Traditional',
        discount: 10.00,
        sale_price: 4950.00,
        final_price: 4950.00,
        hsn: '7113',
        gst: 3.00,
        long_description: 'Handcrafted silver bracelet featuring traditional patterns and premium silver quality.',
        usp1: 'Premium Silver',
        usp2: 'Handcrafted',
        usp3: 'Traditional Patterns',
        created_at: now,
        updated_at: now
      },
      {
        product_id: 'IND-JW-004',
        sku: 'JW004',
        name: 'Pearl Necklace Set',
        description: 'Elegant pearl necklace set with matching earrings and premium finish.',
        mrp: 8500.00,
        selling_price: 7650.00,
        stock_quantity: 25,
        brand: 'indikriti',
        status: 'active',
        indikriti_category_id: 1, // jwellry
        indikriti_subcategory_id: 2, // Fallen
        indikriti_product_type_id: 4, // 123123112
        product_style: 'Elegant',
        discount: 10.00,
        sale_price: 7650.00,
        final_price: 7650.00,
        hsn: '7113',
        gst: 3.00,
        long_description: 'Beautiful pearl necklace set with natural pearls and elegant design.',
        usp1: 'Natural Pearls',
        usp2: 'Elegant Design',
        usp3: 'Matching Set',
        created_at: now,
        updated_at: now
      },

      // Products for Product Type 5 (12 under abc subcategory under handloom)
      {
        product_id: 'IND-HL-001',
        sku: 'HL001',
        name: 'Handwoven Cotton Saree',
        description: 'Traditional handwoven cotton saree with beautiful patterns and vibrant colors.',
        mrp: 3500.00,
        selling_price: 2800.00,
        stock_quantity: 40,
        brand: 'indikriti',
        status: 'active',
        indikriti_category_id: 3, // handloom
        indikriti_subcategory_id: 8, // abc
        indikriti_product_type_id: 5, // 12
        product_style: 'Traditional',
        discount: 20.00,
        sale_price: 2800.00,
        final_price: 2800.00,
        hsn: '6302',
        gst: 5.00,
        long_description: 'Beautiful handwoven cotton saree featuring traditional Indian patterns and vibrant colors.',
        usp1: 'Handwoven Cotton',
        usp2: 'Traditional Patterns',
        usp3: 'Vibrant Colors',
        created_at: now,
        updated_at: now
      },
      {
        product_id: 'IND-HL-002',
        sku: 'HL002',
        name: 'Silk Handloom Dupatta',
        description: 'Elegant silk dupatta with traditional handloom work and beautiful border.',
        mrp: 2800.00,
        selling_price: 2520.00,
        stock_quantity: 30,
        brand: 'indikriti',
        status: 'active',
        indikriti_category_id: 3, // handloom
        indikriti_subcategory_id: 8, // abc
        indikriti_product_type_id: 5, // 12
        product_style: 'Elegant',
        discount: 10.00,
        sale_price: 2520.00,
        final_price: 2520.00,
        hsn: '6302',
        gst: 12.00,
        long_description: 'Beautiful silk dupatta with traditional handloom work and intricate border designs.',
        usp1: 'Pure Silk',
        usp2: 'Handloom Work',
        usp3: 'Traditional Border',
        created_at: now,
        updated_at: now
      },

      // Products for Product Type 6 (Wireless Headphones under Fallen subcategory under Handicraft)
      {
        product_id: 'IND-HC-001',
        sku: 'HC001',
        name: 'Handcrafted Wooden Bowl Set',
        description: 'Beautiful set of handcrafted wooden bowls for serving and decoration.',
        mrp: 1500.00,
        selling_price: 1200.00,
        stock_quantity: 45,
        brand: 'indikriti',
        status: 'active',
        indikriti_category_id: 4, // Handicraft
        indikriti_subcategory_id: 10, // Fallen
        indikriti_product_type_id: 6, // Wireless Headphones
        product_style: 'Traditional',
        discount: 20.00,
        sale_price: 1200.00,
        final_price: 1200.00,
        hsn: '4420',
        gst: 12.00,
        long_description: 'Set of handcrafted wooden bowls made from premium wood with traditional finishing.',
        usp1: 'Premium Wood',
        usp2: 'Handcrafted',
        usp3: 'Traditional Finish',
        created_at: now,
        updated_at: now
      },
      {
        product_id: 'IND-HC-002',
        sku: 'HC002',
        name: 'Brass Decorative Lamp',
        description: 'Traditional brass decorative lamp with intricate patterns and elegant design.',
        mrp: 2200.00,
        selling_price: 1980.00,
        stock_quantity: 25,
        brand: 'indikriti',
        status: 'active',
        indikriti_category_id: 4, // Handicraft
        indikriti_subcategory_id: 10, // Fallen
        indikriti_product_type_id: 6, // Wireless Headphones
        product_style: 'Traditional',
        discount: 10.00,
        sale_price: 1980.00,
        final_price: 1980.00,
        hsn: '7418',
        gst: 18.00,
        long_description: 'Beautiful brass decorative lamp with traditional patterns, perfect for home decoration.',
        usp1: 'Premium Brass',
        usp2: 'Traditional Patterns',
        usp3: 'Decorative',
        created_at: now,
        updated_at: now
      },

      // Products for Product Type 7 (Java Full Stack Developer under Fallen subcategory under Handicraft)
      {
        product_id: 'IND-HC-003',
        sku: 'HC003',
        name: 'Handwoven Bamboo Basket Set',
        description: 'Eco-friendly bamboo basket set for storage and decoration.',
        mrp: 1200.00,
        selling_price: 960.00,
        stock_quantity: 50,
        brand: 'indikriti',
        status: 'active',
        indikriti_category_id: 4, // Handicraft
        indikriti_subcategory_id: 10, // Fallen
        indikriti_product_type_id: 7, // Java Full Stack Developer
        product_style: 'Eco-Friendly',
        discount: 20.00,
        sale_price: 960.00,
        final_price: 960.00,
        hsn: '4602',
        gst: 12.00,
        long_description: 'Set of handwoven bamboo baskets perfect for storage and home decoration.',
        usp1: 'Eco-Friendly Bamboo',
        usp2: 'Handwoven',
        usp3: 'Multi-Purpose',
        created_at: now,
        updated_at: now
      },
      // Add a few more products to reach 10+ products total
      {
        product_id: 'IND-HC-004',
        sku: 'HC004',
        name: 'Clay Pottery Vase',
        description: 'Handcrafted clay pottery vase with traditional designs.',
        mrp: 800.00,
        selling_price: 640.00,
        stock_quantity: 35,
        brand: 'indikriti',
        status: 'active',
        indikriti_category_id: 4, // Handicraft
        indikriti_subcategory_id: 10, // Fallen
        indikriti_product_type_id: 7, // Java Full Stack Developer
        product_style: 'Traditional',
        discount: 20.00,
        sale_price: 640.00,
        final_price: 640.00,
        hsn: '6912',
        gst: 12.00,
        long_description: 'Beautiful handcrafted clay pottery vase with traditional designs and natural finish.',
        usp1: 'Handcrafted Clay',
        usp2: 'Traditional Designs',
        usp3: 'Natural Finish',
        created_at: now,
        updated_at: now
      },
      {
        product_id: 'IND-JW-005',
        sku: 'JW005',
        name: 'Traditional Gold Ring',
        description: 'Elegant gold ring with traditional patterns and premium craftsmanship.',
        mrp: 15000.00,
        selling_price: 13500.00,
        stock_quantity: 12,
        brand: 'indikriti',
        status: 'active',
        indikriti_category_id: 1, // jwellry
        indikriti_subcategory_id: 9, // hbhb
        indikriti_product_type_id: 1, // asdasda (reusing since it's under different subcategory)
        product_style: 'Traditional',
        discount: 10.00,
        sale_price: 13500.00,
        final_price: 13500.00,
        hsn: '7113',
        gst: 3.00,
        long_description: 'Beautiful gold ring with traditional patterns and premium craftsmanship.',
        usp1: 'Premium Gold',
        usp2: 'Traditional Patterns',
        usp3: 'Premium Craftsmanship',
        created_at: now,
        updated_at: now
      }
    ];

    try {
      console.log('Seeding comprehensive products for Indikriti...');
      
      // Insert products
      await queryInterface.bulkInsert('products', products);
      
      console.log(`Successfully seeded ${products.length} products for comprehensive testing!`);
      
    } catch (error) {
      console.error('Error seeding comprehensive products:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Remove all products created by this seeder
      await queryInterface.bulkDelete('products', {
        product_id: {
          [Sequelize.Op.in]: [
            'IND-JW-001', 'IND-JW-002', 'IND-JW-003', 'IND-JW-004', 'IND-JW-005',
            'IND-HL-001', 'IND-HL-002',
            'IND-HC-001', 'IND-HC-002', 'IND-HC-003', 'IND-HC-004'
          ]
        }
      });
      
      console.log('Comprehensive products seeder rolled back successfully!');
    } catch (error) {
      console.error('Error rolling back comprehensive products seeder:', error);
      throw error;
    }
  }
};
