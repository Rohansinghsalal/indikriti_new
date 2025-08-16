/**
 * Employee Model
 * Stores employee information with different roles
 */
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define('Employee', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    employee_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
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
    phone: {
      type: DataTypes.STRING
    },
    address: {
      type: DataTypes.TEXT
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    department: {
      type: DataTypes.STRING,
      allowNull: true
    },
    position: {
      type: DataTypes.STRING,
      allowNull: true
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    hire_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    termination_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'on_leave', 'terminated'),
      defaultValue: 'active'
    },
    emergency_contact: {
      type: DataTypes.STRING
    },
    avatar: {
      type: DataTypes.STRING
    },
    last_login_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    admin_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'The admin responsible for this employee'
    }
  }, {
    tableName: 'employees',
    timestamps: true,
    underscored: true,
    hooks: {
      beforeCreate: async (employee) => {
        if (employee.password) {
          employee.password = await bcrypt.hash(employee.password, 10);
        }
      },
      beforeUpdate: async (employee) => {
        if (employee.changed('password')) {
          employee.password = await bcrypt.hash(employee.password, 10);
        }
      }
    },
    indexes: [
      { fields: ['email'] },
      { fields: ['employee_id'] },
      { fields: ['company_id'] },
      { fields: ['role_id'] },
      { fields: ['admin_id'] }
    ]
  });

  // Instance methods
  Employee.prototype.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  };
  
  // Add comparePassword method for authentication
  Employee.prototype.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  };

  // Associations
  Employee.associate = function(models) {
    Employee.belongsTo(models.Company, {
      foreignKey: 'company_id',
      as: 'company'
    });
    
    Employee.belongsTo(models.Role, {
      foreignKey: 'role_id',
      as: 'role'
    });
    
    // Add relationship with Admin
    Employee.belongsTo(models.Admin, {
      foreignKey: 'created_by',
      as: 'createdByAdmin'
    });
    
    // Add relationship with responsible Admin
    Employee.belongsTo(models.Admin, {
      foreignKey: 'admin_id',
      as: 'responsibleAdmin'
    });
  };

  return Employee;
}; 