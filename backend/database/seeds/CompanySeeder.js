/**
 * Company Seeder
 * Creates default company for the system
 */
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    
    return queryInterface.bulkInsert('companies', [
      {
        name: 'Default Company',
        address: '123 Main Street, City, Country',
        phone: '+1234567890',
        email: 'info@defaultcompany.com',
        website: 'https://www.defaultcompany.com',
        tax_id: 'TAX12345',
        logo_url: null,
        settings: JSON.stringify({
          currency: 'USD',
          timezone: 'UTC',
          date_format: 'YYYY-MM-DD',
          time_format: '24h',
          default_tax_rate: 0
        }),
        status: 'active',
        created_at: now,
        updated_at: now
      },
      {
        name: 'Demo Company',
        address: '456 Demo Avenue, Demo City, Demo Country',
        phone: '+0987654321',
        email: 'info@democompany.com',
        website: 'https://www.democompany.com',
        tax_id: 'DEMO54321',
        logo_url: null,
        settings: JSON.stringify({
          currency: 'EUR',
          timezone: 'Europe/London',
          date_format: 'DD/MM/YYYY',
          time_format: '12h',
          default_tax_rate: 20
        }),
        status: 'active',
        created_at: now,
        updated_at: now
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('companies', {
      name: {
        [Sequelize.Op.in]: ['Default Company', 'Demo Company']
      }
    }, {});
  }
}; 