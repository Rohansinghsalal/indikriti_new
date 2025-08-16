/**
 * AuditLog Model
 * This model is used to keep track of all activities in the system
 */

module.exports = (sequelize, DataTypes) => {
  const AuditLog = sequelize.define('AuditLog', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    user_type: {
      type: DataTypes.ENUM('admin', 'employee', 'user'),
      allowNull: false,
      defaultValue: 'user'
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false
    },
    entity_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    entity_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT
    },
    old_values: {
      type: DataTypes.JSON,
      allowNull: true
    },
    new_values: {
      type: DataTypes.JSON,
      allowNull: true
    },
    ip_address: {
      type: DataTypes.STRING
    },
    user_agent: {
      type: DataTypes.STRING
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'audit_logs',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['action'] },
      { fields: ['entity_type', 'entity_id'] },
      { fields: ['company_id'] }
    ]
  });

  // Associations
  AuditLog.associate = function(models) {
    // Association with User
    AuditLog.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
      constraints: false,
      scope: {
        user_type: 'user'
      }
    });

    // Association with Admin
    AuditLog.belongsTo(models.Admin, {
      foreignKey: 'user_id',
      as: 'admin',
      constraints: false,
      scope: {
        user_type: 'admin'
      }
    });

    // Association with Employee
    AuditLog.belongsTo(models.Employee, {
      foreignKey: 'user_id',
      as: 'employee',
      constraints: false,
      scope: {
        user_type: 'employee'
      }
    });

    // Association with Company
    AuditLog.belongsTo(models.Company, {
      foreignKey: 'company_id',
      as: 'company'
    });
  };

  return AuditLog;
}; 