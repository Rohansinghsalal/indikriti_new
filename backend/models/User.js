/**
 * User Model
 */
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended'),
      defaultValue: 'active'
    },
    email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    last_login_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING
    },
    address: {
      type: DataTypes.TEXT
    },
    created_by: {
      type: DataTypes.INTEGER
    },
    updated_by: {
      type: DataTypes.INTEGER
    }
  }, {
    tableName: 'users',
    timestamps: true,
    underscored: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      }
    },
    indexes: [
      { fields: ['email'] },
      { fields: ['role_id'] },
      { fields: ['company_id'] }
    ]
  });

  // Instance methods
  User.prototype.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  };
  
  // Add comparePassword method for authentication
  User.prototype.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  };

  // Associations
  User.associate = function(models) {
    User.belongsTo(models.Role, {
      foreignKey: 'role_id',
      as: 'role'
    });
    
    User.belongsTo(models.Company, {
      foreignKey: 'company_id',
      as: 'company'
    });
  };

  return User;
}; 