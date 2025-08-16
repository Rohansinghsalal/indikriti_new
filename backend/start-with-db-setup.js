/**
 * Complete Database Setup and Server Start Script
 * Handles all database setup and starts the server
 */
const { exec } = require('child_process');
const path = require('path');

const runCommand = (command, description) => {
  return new Promise((resolve, reject) => {
    console.log(`🔄 ${description}...`);
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Error in ${description}:`, error.message);
        reject(error);
        return;
      }
      if (stderr && !stderr.includes('Warning')) {
        console.warn(`⚠️  ${description} warning:`, stderr);
      }
      if (stdout) {
        console.log(stdout);
      }
      console.log(`✅ ${description} completed`);
      resolve(stdout);
    });
  });
};

const setupAndStart = async () => {
  try {
    console.log('🚀 Starting complete database setup and server startup...\n');

    // Step 1: Run the simple migrator to create basic tables
    console.log('📋 Step 1: Setting up basic database structure...');
    try {
      await runCommand('node database/simple-migrator.js', 'Basic database setup');
    } catch (error) {
      console.log('⚠️  Basic setup had issues, continuing...');
    }

    // Step 2: Fix database schema
    console.log('\n🔧 Step 2: Fixing database schema...');
    try {
      await runCommand('node fix-database-schema.js', 'Database schema fix');
    } catch (error) {
      console.log('⚠️  Schema fix had issues, continuing...');
    }

    // Step 3: Run seeders
    console.log('\n🌱 Step 3: Running database seeders...');
    try {
      await runCommand('node database/seeder.js seed', 'Database seeding');
    } catch (error) {
      console.log('⚠️  Seeding had issues, continuing...');
    }

    console.log('\n🎉 Database setup completed! Starting server...\n');

    // Step 4: Start the server
    console.log('🚀 Step 4: Starting the server...');
    
    // Import and start the server
    require('./server.js');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
};

// Run setup if this file is executed directly
if (require.main === module) {
  setupAndStart();
}

module.exports = setupAndStart;
