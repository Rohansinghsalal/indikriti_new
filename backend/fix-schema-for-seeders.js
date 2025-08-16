const { sequelize } = require('./database/connection');

async function columnExists(table, column, schema = 'admin') {
  const [rows] = await sequelize.query(`
    SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = :schema AND TABLE_NAME = :table AND COLUMN_NAME = :column
  `, { replacements: { schema, table, column }});
  return rows.length > 0;
}

async function addColumnIfMissing({ table, column, definition }) {
  const exists = await columnExists(table, column);
  if (!exists) {
    console.log(`➕ Adding ${table}.${column} ...`);
    await sequelize.query(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
    console.log(`✅ Added ${table}.${column}`);
  } else {
    console.log(`✅ ${table}.${column} already exists`);
  }
}

async function run() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to DB');

    // Companies: add tax_id, logo_url, settings
    await addColumnIfMissing({ table: 'companies', column: 'tax_id', definition: 'VARCHAR(255) NULL' });
    await addColumnIfMissing({ table: 'companies', column: 'logo_url', definition: 'VARCHAR(255) NULL' });
    // JSON type is available in MySQL 8; fallback to TEXT if needed in future
    await addColumnIfMissing({ table: 'companies', column: 'settings', definition: 'JSON NULL' });

    // Roles: add is_system
    await addColumnIfMissing({ table: 'roles', column: 'is_system', definition: 'TINYINT(1) DEFAULT 0' });

    // Permissions: add module, action
    await addColumnIfMissing({ table: 'permissions', column: 'module', definition: 'VARCHAR(100) NULL' });
    await addColumnIfMissing({ table: 'permissions', column: 'action', definition: 'VARCHAR(50) NULL' });

    console.log('\n🎉 Schema fix complete.');
  } catch (err) {
    console.error('❌ Schema fix failed:', err.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

if (require.main === module) {
  run();
}

module.exports = { run };

