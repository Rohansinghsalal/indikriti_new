/**
 * Database seeder runner
 * This script runs all database seeders in the correct order
 */

const { Sequelize } = require('sequelize');
const config = require('../config/database');

// Import seeders
const AdminSeeder = require('./seeds/AdminSeeder');
const CategorySeeder = require('./seeds/CategorySeeder');
const EmployeeSeeder = require('./seeds/EmployeeSeeder');

// Create database connection
const sequelize = new Sequelize(config.development);

async function runSeeders() {
  try {
    console.log('🚀 Starting database seeders...');

    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');

    // Create query interface
    const queryInterface = sequelize.getQueryInterface();

    // Run seeders in order
    console.log('\n📋 Running AdminSeeder...');
    try {
      await AdminSeeder.up(queryInterface, Sequelize);
      console.log('✅ AdminSeeder completed');
    } catch (error) {
      console.error('❌ AdminSeeder failed:', error.message);
    }

    console.log('\n📋 Running CategorySeeder...');
    try {
      await CategorySeeder.up(queryInterface, Sequelize);
      console.log('✅ CategorySeeder completed');
    } catch (error) {
      console.error('❌ CategorySeeder failed:', error.message);
    }

    console.log('\n📋 Running EmployeeSeeder...');
    try {
      await EmployeeSeeder.seed(queryInterface);
      console.log('✅ EmployeeSeeder completed');
    } catch (error) {
      console.error('❌ EmployeeSeeder failed:', error.message);
    }

    console.log('\n🎉 All seeders completed successfully!');

  } catch (error) {
    console.error('💥 Seeder runner failed:', error.message);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Run seeders if this file is executed directly
if (require.main === module) {
  runSeeders()
    .then(() => {
      console.log('✅ Seeder process completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeder process failed:', error);
      process.exit(1);
    });
}

module.exports = { runSeeders };
