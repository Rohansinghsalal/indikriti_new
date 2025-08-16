const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  console.log('🚀 Setting up database for the application...\n');

  // Get password from user input or environment
  const password = process.argv[2] || process.env.MYSQL_ROOT_PASSWORD || '';

  if (!password) {
    console.log('❌ Please provide the MySQL root password:');
    console.log('Usage: node setup-database.js <password>');
    console.log('Or set MYSQL_ROOT_PASSWORD environment variable');
    console.log('\n💡 If you don\'t know the password, you need to reset it:');
    console.log('1. Open Command Prompt as Administrator');
    console.log('2. Run: net stop MySQL80');
    console.log('3. Run: "C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysqld.exe" --skip-grant-tables --skip-networking');
    console.log('4. In new admin cmd: "C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysql.exe" -u root');
    console.log('5. Execute: ALTER USER \'root\'@\'localhost\' IDENTIFIED BY \'newpassword123\';');
    console.log('6. Execute: FLUSH PRIVILEGES; EXIT;');
    console.log('7. Stop mysqld and run: net start MySQL80');
    process.exit(1);
  }

  try {
    console.log('🔌 Connecting to MySQL...');
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: password,
      connectTimeout: 10000
    });

    console.log('✅ Connected to MySQL successfully!');

    // Create database
    console.log('📊 Creating database "admin_panel"...');
    await connection.execute('CREATE DATABASE IF NOT EXISTS admin_panel');
    console.log('✅ Database "admin_panel" created or already exists');

    // Create application user (optional but recommended)
    console.log('👤 Creating application user...');
    try {
      await connection.execute(`CREATE USER IF NOT EXISTS 'admin_app'@'localhost' IDENTIFIED BY 'admin_app_password123'`);
      await connection.execute(`GRANT ALL PRIVILEGES ON admin_panel.* TO 'admin_app'@'localhost'`);
      await connection.execute('FLUSH PRIVILEGES');
      console.log('✅ Application user "admin_app" created with password "admin_app_password123"');
    } catch (userError) {
      console.log('⚠️  User creation failed (might already exist):', userError.message);
    }

    // Update .env file
    console.log('📝 Updating .env file...');
    const envPath = path.join(__dirname, 'backend', '.env');
    let envContent = fs.readFileSync(envPath, 'utf8');

    // Update password in .env
    envContent = envContent.replace(/DB_PASSWORD=.*/, `DB_PASSWORD=${password}`);

    fs.writeFileSync(envPath, envContent);
    console.log('✅ Updated .env file with correct password');

    await connection.end();

    // Test the backend connection
    console.log('\n🧪 Testing backend database connection...');
    const { testConnection } = require('./backend/database/connection');
    const connected = await testConnection();

    if (connected) {
      console.log('✅ Backend can connect to database successfully!');

      // Run proper migrations instead of simple migrator
      console.log('\n🔄 Running database migrations...');
      try {
        const { migrate } = require('./backend/database/migrator');
        await migrate();
        console.log('✅ Database migrations completed successfully!');
      } catch (migrationError) {
        console.log('⚠️  Migration failed, falling back to simple migrator...');
        const { run } = require('./backend/database/simple-migrator');
        await run();
      }

    } else {
      console.log('❌ Backend still cannot connect to database');
    }

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Run: cd backend && npm start');
    console.log('2. The application should now connect to the database');
    console.log('\nAlternatively, you can use the dedicated app user:');
    console.log('Update .env with: DB_USER=admin_app and DB_PASSWORD=admin_app_password123');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Make sure MySQL service is running: net start MySQL80');
    console.log('2. Verify the password is correct');
    console.log('3. Try resetting MySQL root password if needed');
    process.exit(1);
  }
}

setupDatabase();
