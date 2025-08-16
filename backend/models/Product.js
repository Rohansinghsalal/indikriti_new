const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');
// Note: Old generic models removed - using brand-specific models only

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  product_id: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  sku: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  mrp: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  selling_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  stock_quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  batch_no: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  indikriti_category_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'indikriti_categories',
      key: 'id'
    }
  },
  winsomelane_category_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'winsomelane_categories',
      key: 'id'
    }
  },
  indikriti_subcategory_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'indikriti_subcategories',
      key: 'id'
    }
  },
  winsomelane_subcategory_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'winsomelane_subcategories',
      key: 'id'
    }
  },
  indikriti_product_type_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'indikriti_product_types',
      key: 'id'
    }
  },
  winsomelane_product_type_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'winsomelane_product_types',
      key: 'id'
    }
  },
  brand: {
    type: DataTypes.ENUM('indikriti', 'winsomeLane'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'draft'),
    defaultValue: 'draft'
  },
  // Advanced product fields
  product_style: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  discount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0
  },
  sale_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  special_discount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0
  },
  final_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  referral_bonus: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0
  },
  loyalty_bonus: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0
  },
  hsn: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  gst: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    defaultValue: 0
  },
  long_description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  usp1: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  usp2: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  usp3: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'products',
  timestamps: false // Using created_at and updated_at instead
});

// Define belongsTo associations (many-to-one)
// Note: Old ProductType association removed - using brand-specific models only

// Import brand-specific models
const IndikritiBrandCategory = require('./IndikritiBrandCategory');
const WinsomeLaneBrandCategory = require('./WinsomeLaneBrandCategory');
const IndikritiBrandSubcategory = require('./IndikritiBrandSubcategory');
const WinsomeLaneBrandSubcategory = require('./WinsomeLaneBrandSubcategory');
const IndikritiBrandProductType = require('./IndikritiBrandProductType');
const WinsomeLaneBrandProductType = require('./WinsomeLaneBrandProductType');

// Brand-specific category associations
Product.belongsTo(IndikritiBrandCategory, {
  foreignKey: 'indikriti_category_id',
  as: 'indikritiBrandCategory'
});

Product.belongsTo(WinsomeLaneBrandCategory, {
  foreignKey: 'winsomelane_category_id',
  as: 'winsomeLaneBrandCategory'
});

// Brand-specific subcategory associations
Product.belongsTo(IndikritiBrandSubcategory, {
  foreignKey: 'indikriti_subcategory_id',
  as: 'indikritiBrandSubcategory'
});

Product.belongsTo(WinsomeLaneBrandSubcategory, {
  foreignKey: 'winsomelane_subcategory_id',
  as: 'winsomeLaneBrandSubcategory'
});

// Brand-specific product type associations
Product.belongsTo(IndikritiBrandProductType, {
  foreignKey: 'indikriti_product_type_id',
  as: 'indikritiBrandProductType'
});

Product.belongsTo(WinsomeLaneBrandProductType, {
  foreignKey: 'winsomelane_product_type_id',
  as: 'winsomeLaneBrandProductType'
});

// Define hasMany associations (one-to-many) with unique aliases
// Note: Old ProductType association removed

IndikritiBrandCategory.hasMany(Product, {
  foreignKey: 'indikriti_category_id',
  as: 'indikritiBrandCategoryProducts'
});

WinsomeLaneBrandCategory.hasMany(Product, {
  foreignKey: 'winsomelane_category_id',
  as: 'winsomeLaneBrandCategoryProducts'
});

module.exports = Product;
