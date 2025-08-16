module.exports = (sequelize, DataTypes) => {
  const Inventory = sequelize.define('Inventory', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    location: {
      type: DataTypes.STRING
    },
    lot_number: {
      type: DataTypes.STRING
    },
    expiry_date: {
      type: DataTypes.DATE
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    updated_by: {
      type: DataTypes.INTEGER
    },
    notes: {
      type: DataTypes.TEXT
    }
  }, {
    tableName: 'inventory',
    timestamps: true,
    underscored: true
  });

  Inventory.associate = (models) => {
    Inventory.belongsTo(models.Product, { foreignKey: 'product_id' });
    Inventory.belongsTo(models.Company, { foreignKey: 'company_id' });
  };

  return Inventory;
}; 