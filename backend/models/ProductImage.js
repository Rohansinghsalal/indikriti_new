const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');
const Product = require('./Product');

const ProductImage = sequelize.define('ProductImage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  image_path: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  is_primary: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'product_images',
  timestamps: false // Using created_at instead
});

// Define associations
ProductImage.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product',
  onDelete: 'CASCADE'
});

Product.hasMany(ProductImage, {
  foreignKey: 'product_id',
  as: 'images',
  onDelete: 'CASCADE'
});

module.exports = ProductImage; 