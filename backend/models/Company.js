/**
 * Company Model
 */
module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define('Company', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    tax_id: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    logo_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    settings: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('settings');
        return rawValue ? JSON.parse(rawValue) : {};
      },
      set(value) {
        this.setDataValue('settings', JSON.stringify(value));
      }
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active'
    }
  }, {
    tableName: 'companies',
    timestamps: true,
    underscored: true
  });

  // Associations
  Company.associate = function(models) {
    Company.hasMany(models.User, {
      foreignKey: 'company_id',
      as: 'users'
    });
    
    Company.hasMany(models.Product, {
      foreignKey: 'company_id',
      as: 'company_products'
    });
    
    Company.hasMany(models.Category, {
      foreignKey: 'company_id',
      as: 'categories'
    });
    
    Company.hasMany(models.Customer, {
      foreignKey: 'company_id',
      as: 'customers'
    });
    
    Company.hasMany(models.Order, {
      foreignKey: 'company_id',
      as: 'orders'
    });
  };

  return Company;
}; 