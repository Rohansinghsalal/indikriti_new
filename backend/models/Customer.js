module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define('Customer', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    customer_number: {
      type: DataTypes.STRING,
      unique: true
    },
    company_name: {
      type: DataTypes.STRING
    },
    tax_number: {
      type: DataTypes.STRING
    },
    billing_address: {
      type: DataTypes.TEXT
    },
    shipping_address: {
      type: DataTypes.TEXT
    },
    notes: {
      type: DataTypes.TEXT
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active'
    },
    created_by: {
      type: DataTypes.INTEGER
    },
    updated_by: {
      type: DataTypes.INTEGER
    }
  }, {
    tableName: 'customers',
    timestamps: true,
    underscored: true
  });

  Customer.associate = (models) => {
    Customer.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    Customer.belongsTo(models.Company, { foreignKey: 'company_id', as: 'company' });
    Customer.hasMany(models.Order, { foreignKey: 'customer_id', as: 'orders' });
  };

  return Customer;
}; 