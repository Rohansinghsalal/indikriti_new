/**
 * Payment Methods Seeder
 * Seeds default payment methods for POS system
 */
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const paymentMethods = [
      {
        name: 'Cash',
        code: 'CASH',
        type: 'cash',
        is_active: true,
        requires_reference: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Credit Card',
        code: 'CREDIT_CARD',
        type: 'card',
        is_active: true,
        requires_reference: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Debit Card',
        code: 'DEBIT_CARD',
        type: 'card',
        is_active: true,
        requires_reference: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'UPI',
        code: 'UPI',
        type: 'digital',
        is_active: true,
        requires_reference: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'PayTM',
        code: 'PAYTM',
        type: 'digital',
        is_active: true,
        requires_reference: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Google Pay',
        code: 'GPAY',
        type: 'digital',
        is_active: true,
        requires_reference: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'PhonePe',
        code: 'PHONEPE',
        type: 'digital',
        is_active: true,
        requires_reference: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Bank Transfer',
        code: 'BANK_TRANSFER',
        type: 'bank_transfer',
        is_active: true,
        requires_reference: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Cheque',
        code: 'CHEQUE',
        type: 'other',
        is_active: true,
        requires_reference: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await queryInterface.bulkInsert('payment_methods', paymentMethods, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('payment_methods', null, {});
  }
};
