const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const WinsomeLaneBrandProductType = sequelize.define('WinsomeLaneBrandProductType', {
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
      model: 'winsomelane_subcategories',
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
  tableName: 'winsomelane_product_types',
  timestamps: false // Using created_at and updated_at instead
});

// Define associations
WinsomeLaneBrandProductType.associate = (models) => {
  // Belongs to subcategory
  WinsomeLaneBrandProductType.belongsTo(models.WinsomeLaneBrandSubcategory, {
    foreignKey: 'subcategory_id',
    as: 'winsomelane_subcategory'
  });
  
  // Has many products
  WinsomeLaneBrandProductType.hasMany(models.Product, {
    foreignKey: 'winsomelane_product_type_id',
    as: 'winsomelane_products'
  });
};

module.exports = WinsomeLaneBrandProductType;
