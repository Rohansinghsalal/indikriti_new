const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const IndikritiBrandSubcategory = sequelize.define('IndikritiBrandSubcategory', {
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
      model: 'indikriti_categories',
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
  tableName: 'indikriti_subcategories',
  timestamps: false // Using created_at and updated_at instead
});

// Define associations
IndikritiBrandSubcategory.associate = (models) => {
  // Belongs to category
  IndikritiBrandSubcategory.belongsTo(models.IndikritiBrandCategory, {
    foreignKey: 'category_id',
    as: 'indikriti_category'
  });
  
  // Has many product types
  IndikritiBrandSubcategory.hasMany(models.IndikritiBrandProductType, {
    foreignKey: 'subcategory_id',
    as: 'indikriti_productTypes'
  });
  
  // Has many products
  IndikritiBrandSubcategory.hasMany(models.Product, {
    foreignKey: 'indikriti_subcategory_id',
    as: 'indikriti_products'
  });
};

module.exports = IndikritiBrandSubcategory;
