const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const WinsomeLaneBrandCategory = sequelize.define('WinsomeLaneBrandCategory', {
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
  tableName: 'winsomelane_categories',
  timestamps: false // Using created_at and updated_at instead
});

// Define associations
WinsomeLaneBrandCategory.associate = (models) => {
  // One-to-many relationship with subcategories
  WinsomeLaneBrandCategory.hasMany(models.WinsomeLaneBrandSubcategory, {
    foreignKey: 'category_id',
    as: 'winsomelane_subcategories'
  });

  // One-to-many relationship with products
  WinsomeLaneBrandCategory.hasMany(models.Product, {
    foreignKey: 'winsomelane_category_id',
    as: 'winsomelane_products'
  });
};

module.exports = WinsomeLaneBrandCategory;
