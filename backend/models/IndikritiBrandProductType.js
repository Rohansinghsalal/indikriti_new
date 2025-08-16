const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const IndikritiBrandProductType = sequelize.define('IndikritiBrandProductType', {
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
  subcategory_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'indikriti_subcategories',
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
  tableName: 'indikriti_product_types',
  timestamps: false // Using created_at and updated_at instead
});

// Define associations
IndikritiBrandProductType.associate = (models) => {
  // Belongs to subcategory
  IndikritiBrandProductType.belongsTo(models.IndikritiBrandSubcategory, {
    foreignKey: 'subcategory_id',
    as: 'indikriti_subcategory'
  });
  
  // Has many products
  IndikritiBrandProductType.hasMany(models.Product, {
    foreignKey: 'indikriti_product_type_id',
    as: 'indikriti_products'
  });
};

module.exports = IndikritiBrandProductType;
