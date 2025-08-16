const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const IndikritiBrandCategory = sequelize.define('IndikritiBrandCategory', {
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
  tableName: 'indikriti_categories',
  timestamps: false // Using created_at and updated_at instead
});

// Define associations
IndikritiBrandCategory.associate = (models) => {
  // One-to-many relationship with subcategories
  IndikritiBrandCategory.hasMany(models.IndikritiBrandSubcategory, {
    foreignKey: 'category_id',
    as: 'indikriti_subcategories'
  });

  // One-to-many relationship with products
  IndikritiBrandCategory.hasMany(models.Product, {
    foreignKey: 'indikriti_category_id',
    as: 'indikriti_products'
  });
};

module.exports = IndikritiBrandCategory;
