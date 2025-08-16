/**
 * Referrals Table Migration
 */
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('referrals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      referrer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'customers',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      referred_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'customers',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      referral_code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('pending', 'converted', 'expired', 'rewarded'),
        defaultValue: 'pending'
      },
      reward_type: {
        type: Sequelize.ENUM('discount', 'credit', 'points', 'product'),
        allowNull: true
      },
      reward_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      reward_issued: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      conversion_order_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'orders',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      expiry_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      notes: {
        type: Sequelize.TEXT,
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
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Add indexes
    await queryInterface.addIndex('referrals', ['referrer_id']);
    await queryInterface.addIndex('referrals', ['referred_id']);
    await queryInterface.addIndex('referrals', ['referral_code']);
    await queryInterface.addIndex('referrals', ['status']);
    await queryInterface.addIndex('referrals', ['company_id']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('referrals');
  }
}; 