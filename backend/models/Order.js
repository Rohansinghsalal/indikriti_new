/**
 * Order Model
 */
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    order_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
      defaultValue: 'pending'
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    tax_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    discount_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    shipping_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    grand_total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    shipping_address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    billing_address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    payment_method: {
      type: DataTypes.STRING,
      allowNull: true
    },
    payment_status: {
      type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
      defaultValue: 'pending'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'orders',
    timestamps: true,
    underscored: true
  });

  // Associations
  Order.associate = function(models) {
    Order.belongsTo(models.Customer, {
      foreignKey: 'customer_id',
      as: 'customer'
    });
    
    Order.belongsTo(models.Company, {
      foreignKey: 'company_id',
      as: 'company'
    });
    
    Order.hasMany(models.OrderItem, {
      foreignKey: 'order_id',
      as: 'items'
    });
    
    Order.hasMany(models.Payment, {
      foreignKey: 'order_id',
      as: 'payments'
    });
    
    Order.belongsTo(models.User, {
      foreignKey: 'created_by',
      as: 'creator'
    });
  };

  return Order;
}; 