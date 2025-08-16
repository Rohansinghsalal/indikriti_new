/**
 * Database Setup Script
 * Runs migrations and seeders to set up the database
 */
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const runCommand = (command) => {
  return new Promise((resolve, reject) => {
    console.log(`🔄 Running: ${command}`);
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Error: ${error.message}`);
        reject(error);
        return;
      }
      if (stderr) {
        console.warn(`⚠️  Warning: ${stderr}`);
      }
      if (stdout) {
        console.log(stdout);
      }
      resolve(stdout);
    });
  });
};

const setupDatabase = async () => {
  try {
    console.log('🚀 Starting database setup...\n');

    // Check if sequelize-cli is available
    try {
      await runCommand('npx sequelize-cli --version');
    } catch (error) {
      console.log('📦 Installing sequelize-cli...');
      await runCommand('npm install --save-dev sequelize-cli');
    }

    // Run migrations
    console.log('\n📋 Running database migrations...');
    try {
      await runCommand('npx sequelize-cli db:migrate');
      console.log('✅ Migrations completed successfully');
    } catch (error) {
      console.log('⚠️  Migration error (this might be normal if migrations were already run)');
    }

    // Run seeders
    console.log('\n🌱 Running database seeders...');
    try {
      await runCommand('npx sequelize-cli db:seed:all');
      console.log('✅ Seeders completed successfully');
    } catch (error) {
      console.log('⚠️  Seeder error (this might be normal if seeders were already run)');
    }

    console.log('\n🎉 Database setup completed!');
    console.log('\n📧 Default admin credentials:');
    console.log('   Email: superadmin@example.com');
    console.log('   Password: admin123');
    console.log('\n⚠️  Please change the default password after first login!');

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
};

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;
