const { 
  ProductType, 
  Category, 
  Subcategory 
} = require('../../models');
const logger = require('../../utils/logger');

async function seedProductHierarchy() {
  try {
    logger.info('Starting Product Hierarchy Seeder...');
    
    // Check if there are already product types
    const existingTypes = await ProductType.count();
    if (existingTypes > 0) {
      logger.info('Product hierarchy data already exists. Skipping seeding.');
      return true;
    }
    
    // Start a transaction
    const transaction = await ProductType.sequelize.transaction();
    
    try {
      // Seed product types
      logger.info('Seeding product types...');
      const productTypes = [
        {
          name: 'Handloom',
          description: 'Traditional handloom products crafted by skilled artisans'
        },
        {
          name: 'Handicraft',
          description: 'Handcrafted artisanal products showcasing traditional craftsmanship'
        },
        {
          name: 'Apparel',
          description: 'Clothing and fashion items'
        },
        {
          name: 'Home Decor',
          description: 'Products for home decoration and enhancement'
        }
      ];
      
      const productTypeMap = {};
      
      for (const type of productTypes) {
        const createdType = await ProductType.create(type, { transaction });
        productTypeMap[type.name] = createdType.id;
      }
      
      // Seed categories
      logger.info('Seeding categories...');
      const categories = [
        {
          name: 'Bedsheets',
          product_type_id: productTypeMap['Handloom'],
          description: 'Handloom bedsheets in various designs and patterns'
        },
        {
          name: 'Sarees',
          product_type_id: productTypeMap['Handloom'],
          description: 'Traditional handloom sarees'
        },
        {
          name: 'Suits',
          product_type_id: productTypeMap['Handloom'],
          description: 'Handloom suits for various occasions'
        },
        {
          name: 'Curtains',
          product_type_id: productTypeMap['Handloom'],
          description: 'Handloom curtains for home decor'
        },
        {
          name: 'Pottery',
          product_type_id: productTypeMap['Handicraft'],
          description: 'Handcrafted pottery items'
        },
        {
          name: 'Woodcraft',
          product_type_id: productTypeMap['Handicraft'],
          description: 'Wooden handicraft items'
        },
        {
          name: 'Traditional Wear',
          product_type_id: productTypeMap['Apparel'],
          description: 'Traditional clothing options'
        },
        {
          name: 'Modern Fusion',
          product_type_id: productTypeMap['Apparel'],
          description: 'Modern fusion fashion items'
        },
        {
          name: 'Wall Decor',
          product_type_id: productTypeMap['Home Decor'],
          description: 'Items for wall decoration'
        },
        {
          name: 'Table Decor',
          product_type_id: productTypeMap['Home Decor'],
          description: 'Items for table decoration'
        }
      ];
      
      const categoryMap = {};
      
      for (const category of categories) {
        const createdCategory = await Category.create(category, { transaction });
        categoryMap[category.name] = createdCategory.id;
      }
      
      // Seed subcategories
      logger.info('Seeding subcategories...');
      const subcategories = [
        {
          name: 'Single Bedsheets',
          category_id: categoryMap['Bedsheets'],
          description: 'Single sized bedsheets'
        },
        {
          name: 'Double Bedsheets',
          category_id: categoryMap['Bedsheets'],
          description: 'Double sized bedsheets'
        },
        {
          name: 'King Size Bedsheets',
          category_id: categoryMap['Bedsheets'],
          description: 'King size bedsheets'
        },
        {
          name: 'Cotton Sarees',
          category_id: categoryMap['Sarees'],
          description: 'Sarees made from cotton'
        },
        {
          name: 'Silk Sarees',
          category_id: categoryMap['Sarees'],
          description: 'Sarees made from silk'
        },
        {
          name: 'Linen Sarees',
          category_id: categoryMap['Sarees'],
          description: 'Sarees made from linen'
        },
        {
          name: 'Punjabi Suits',
          category_id: categoryMap['Suits'],
          description: 'Traditional Punjabi suits'
        },
        {
          name: 'Designer Suits',
          category_id: categoryMap['Suits'],
          description: 'Designer suits for special occasions'
        },
        {
          name: 'Door Curtains',
          category_id: categoryMap['Curtains'],
          description: 'Curtains for doors'
        },
        {
          name: 'Window Curtains',
          category_id: categoryMap['Curtains'],
          description: 'Curtains for windows'
        }
      ];
      
      for (const subcategory of subcategories) {
        await Subcategory.create(subcategory, { transaction });
      }
      
      // Commit the transaction
      await transaction.commit();
      
      logger.info('Product hierarchy seeding completed successfully');
      return true;
    } catch (error) {
      // Rollback in case of error
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    logger.error('Error seeding product hierarchy:', error);
    return false;
  }
}

// Export the function to be called from other files
module.exports = seedProductHierarchy;

// Run the seeder if this file is executed directly
if (require.main === module) {
  seedProductHierarchy()
    .then(result => {
      if (result) {
        logger.info('Product hierarchy seeding process completed');
      } else {
        logger.error('Product hierarchy seeding failed');
      }
      process.exit(result ? 0 : 1);
    })
    .catch(error => {
      logger.error('Product hierarchy seeding failed:', error);
      process.exit(1);
    });
} 