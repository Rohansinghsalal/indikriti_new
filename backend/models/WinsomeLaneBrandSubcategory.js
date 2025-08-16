const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const WinsomeLaneBrandSubcategory = sequelize.define('WinsomeLaneBrandSubcategory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 100]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'winsomelane_categories',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active'
  },
  sort_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
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
  tableName: 'winsomelane_subcategories',
  timestamps: false // Using created_at and updated_at instead
});

// Define associations
WinsomeLaneBrandSubcategory.associate = (models) => {
  // Belongs to category
  WinsomeLaneBrandSubcategory.belongsTo(models.WinsomeLaneBrandCategory, {
    foreignKey: 'category_id',
    as: 'winsomelane_category'
  });
  
  // Has many product types
  WinsomeLaneBrandSubcategory.hasMany(models.WinsomeLaneBrandProductType, {
    foreignKey: 'subcategory_id',
    as: 'winsomelane_productTypes'
  });
  
  // Has many products
  WinsomeLaneBrandSubcategory.hasMany(models.Product, {
    foreignKey: 'winsomelane_subcategory_id',
    as: 'winsomelane_products'
  });
};

module.exports = WinsomeLaneBrandSubcategory;
