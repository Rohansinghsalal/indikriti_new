const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

async function createAdmin() {
  try {
    // Create database connection
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'T@1234#rss',
      database: 'admin'
    });

    // Hash password
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert admin user
    const [result] = await connection.execute(
      `INSERT INTO admins (first_name, last_name, email, password, department, status, access_level, is_super_admin, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      ['Super', 'Admin', 'admin@example.com', hashedPassword, 'Management', 'active', 'super', 1]
    );

    console.log('Admin user created successfully!');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
    console.log('Admin ID:', result.insertId);

    await connection.end();
  } catch (error) {
    console.error('Error creating admin:', error.message);
  }
}

createAdmin();
