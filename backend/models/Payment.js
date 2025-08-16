module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    payment_method: {
      type: DataTypes.STRING,
      allowNull: false
    },
    payment_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    transaction_id: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'),
      defaultValue: 'pending'
    },
    payment_details: {
      type: DataTypes.TEXT,
      get() {
        const rawValue = this.getDataValue('payment_details');
        return rawValue ? JSON.parse(rawValue) : {};
      },
      set(value) {
        this.setDataValue('payment_details', JSON.stringify(value));
      }
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created_by: {
      type: DataTypes.INTEGER
    },
    updated_by: {
      type: DataTypes.INTEGER
    }
  }, {
    tableName: 'payments',
    timestamps: true,
    underscored: true
  });

  Payment.associate = (models) => {
    Payment.belongsTo(models.Order, { foreignKey: 'order_id' });
    Payment.belongsTo(models.User, { foreignKey: 'customer_id', as: 'customer' });
    Payment.belongsTo(models.Company, { foreignKey: 'company_id' });
  };

  return Payment;
}; 