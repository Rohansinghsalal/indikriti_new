/**
 * Employee Seeder
 */
const bcrypt = require('bcrypt');

module.exports = {
  seed: async (queryInterface) => {
    try {
      // Check if employees table exists and has the correct structure
      const [tableInfo] = await queryInterface.sequelize.query(
        `SHOW COLUMNS FROM employees LIKE 'employee_id'`
      );

      if (tableInfo.length === 0) {
        console.log('Employee table does not have employee_id column, skipping employee seeder');
        return Promise.resolve();
      }

      // Check if employees already exist
      const [existingEmployees] = await queryInterface.sequelize.query(
        `SELECT COUNT(*) as count FROM employees`
      );

      if (existingEmployees[0].count > 0) {
        console.log('Employees already exist, skipping employee seeder');
        return Promise.resolve();
      }

      // Get role IDs
      const [staffRole] = await queryInterface.sequelize.query(
        `SELECT id FROM roles WHERE name = 'staff' LIMIT 1`
      );
    
    const staffRoleId = staffRole[0]?.id || 4; // Staff is now 4th in our role list
    
    // Get cashier role
    const [cashierRole] = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE name = 'cashier' LIMIT 1`
    );
    
    const cashierRoleId = cashierRole[0]?.id || 5;
    
    // Get inventory manager role
    const [inventoryRole] = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE name = 'inventory_manager' LIMIT 1`
    );
    
    const inventoryRoleId = inventoryRole[0]?.id || 6;
    
    // Get company IDs
    const [companies] = await queryInterface.sequelize.query(
      `SELECT id FROM companies LIMIT 2`
    );
    
    const mainCompanyId = companies[0]?.id || 1;
    const secondCompanyId = companies[1]?.id || 2;
    
    // Get admin IDs for created_by
    const [admins] = await queryInterface.sequelize.query(
      `SELECT id FROM admins LIMIT 2`
    );
    
    const adminId = admins[0]?.id || 1;
    
    // Create employees with department-specific passwords
    const salesPassword = await bcrypt.hash('Sales@123', 10);
    const marketingPassword = await bcrypt.hash('Marketing@123', 10);
    const itPassword = await bcrypt.hash('IT@123', 10);
    const financePassword = await bcrypt.hash('Finance@123', 10);
    
      return queryInterface.bulkInsert('employees', [
      {
        employee_id: 'EMP001',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@company1.com',
        password: salesPassword,
        phone: '555-123-4567',
        role_id: staffRoleId,
        department: 'Sales',
        position: 'Sales Representative',
        company_id: mainCompanyId,
        hire_date: new Date('2023-01-15'),
        status: 'active',
        created_by: adminId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        employee_id: 'EMP002',
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane.smith@company1.com',
        password: marketingPassword,
        phone: '555-234-5678',
        role_id: staffRoleId,
        department: 'Marketing',
        position: 'Marketing Specialist',
        company_id: mainCompanyId,
        hire_date: new Date('2023-02-01'),
        status: 'active',
        created_by: adminId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        employee_id: 'EMP003',
        first_name: 'Robert',
        last_name: 'Johnson',
        email: 'robert.johnson@company2.com',
        password: itPassword,
        phone: '555-345-6789',
        role_id: staffRoleId,
        department: 'IT',
        position: 'System Administrator',
        company_id: secondCompanyId,
        hire_date: new Date('2023-01-10'),
        status: 'active',
        created_by: adminId,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        employee_id: 'EMP004',
        first_name: 'Emily',
        last_name: 'Williams',
        email: 'emily.williams@company2.com',
        password: financePassword,
        phone: '555-456-7890',
        role_id: cashierRoleId,
        department: 'Finance',
        position: 'Accountant',
        company_id: secondCompanyId,
        hire_date: new Date('2023-03-01'),
        status: 'active',
        created_by: adminId,
        created_at: new Date(),
        updated_at: new Date()
      }
      ]);
    } catch (error) {
      console.error('Error in employee seeder:', error);
      return Promise.reject(error);
    }
  }
};