/**
 * Audit Logs Table Migration
 */
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('audit_logs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      action: {
        type: Sequelize.STRING,
        allowNull: false
      },
      entity: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'The entity type (e.g., user, product, order)'
      },
      entity_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'The ID of the affected entity'
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      details: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'JSON string with additional details'
      },
      ip_address: {
        type: Sequelize.STRING,
        allowNull: true
      },
      user_agent: {
        type: Sequelize.STRING,
        allowNull: true
      },
      company_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'companies',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Create system logs table
    await queryInterface.createTable('system_logs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      level: {
        type: Sequelize.ENUM('info', 'warn', 'error', 'debug'),
        allowNull: false
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      context: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'JSON string with context information'
      },
      source: {
        type: Sequelize.STRING,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Add indexes
    await queryInterface.addIndex('audit_logs', ['user_id']);
    await queryInterface.addIndex('audit_logs', ['action']);
    await queryInterface.addIndex('audit_logs', ['entity']);
    await queryInterface.addIndex('audit_logs', ['entity_id']);
    await queryInterface.addIndex('audit_logs', ['company_id']);
    await queryInterface.addIndex('audit_logs', ['created_at']);
    
    await queryInterface.addIndex('system_logs', ['level']);
    await queryInterface.addIndex('system_logs', ['source']);
    await queryInterface.addIndex('system_logs', ['created_at']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('system_logs');
    await queryInterface.dropTable('audit_logs');
  }
}; 