/**
 * Support Tickets Table Migration
 */
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('support_tickets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ticket_number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      subject: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('open', 'pending', 'in_progress', 'resolved', 'closed'),
        defaultValue: 'open'
      },
      priority: {
        type: Sequelize.ENUM('low', 'medium', 'high', 'urgent'),
        defaultValue: 'medium'
      },
      category: {
        type: Sequelize.STRING,
        allowNull: true
      },
      customer_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'customers',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'orders',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      assigned_to: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      due_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      source: {
        type: Sequelize.ENUM('email', 'web', 'phone', 'chat', 'other'),
        defaultValue: 'web'
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
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        }
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

    // Create ticket replies table
    await queryInterface.createTable('support_ticket_replies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ticket_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'support_tickets',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      customer_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'customers',
          key: 'id'
        }
      },
      is_internal: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: 'Whether this is an internal note not visible to customer'
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

    // Create ticket attachments table
    await queryInterface.createTable('support_ticket_attachments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ticket_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'support_tickets',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      reply_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'support_ticket_replies',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      file_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      file_path: {
        type: Sequelize.STRING,
        allowNull: false
      },
      file_type: {
        type: Sequelize.STRING,
        allowNull: true
      },
      file_size: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      uploaded_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Create FAQ table
    await queryInterface.createTable('faqs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      question: {
        type: Sequelize.STRING,
        allowNull: false
      },
      answer: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive'),
        defaultValue: 'active'
      },
      sort_order: {
        type: Sequelize.INTEGER,
        defaultValue: 0
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
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        }
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
    await queryInterface.addIndex('support_tickets', ['ticket_number']);
    await queryInterface.addIndex('support_tickets', ['status']);
    await queryInterface.addIndex('support_tickets', ['priority']);
    await queryInterface.addIndex('support_tickets', ['customer_id']);
    await queryInterface.addIndex('support_tickets', ['assigned_to']);
    await queryInterface.addIndex('support_tickets', ['company_id']);
    await queryInterface.addIndex('support_tickets', ['created_at']);
    
    await queryInterface.addIndex('support_ticket_replies', ['ticket_id']);
    await queryInterface.addIndex('support_ticket_replies', ['user_id']);
    await queryInterface.addIndex('support_ticket_replies', ['customer_id']);
    
    await queryInterface.addIndex('support_ticket_attachments', ['ticket_id']);
    await queryInterface.addIndex('support_ticket_attachments', ['reply_id']);
    
    await queryInterface.addIndex('faqs', ['category']);
    await queryInterface.addIndex('faqs', ['status']);
    await queryInterface.addIndex('faqs', ['company_id']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('faqs');
    await queryInterface.dropTable('support_ticket_attachments');
    await queryInterface.dropTable('support_ticket_replies');
    await queryInterface.dropTable('support_tickets');
  }
}; 