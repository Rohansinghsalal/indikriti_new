# Admin Panel Application

This is an admin panel application with role-based authentication. The application consists of a backend API built with Node.js/Express and a frontend built with Next.js.

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MySQL database
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd admin/backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the backend directory with the following content:
   ```
   PORT=5000
   NODE_ENV=development
   
   # Database Configuration
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASS=your_mysql_password
   DB_NAME=admin_panel
   
   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=7d
   JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
   JWT_REFRESH_EXPIRES_IN=30d
   ```

4. Create the MySQL database:
   ```
   mysql -u your_mysql_username -p -e "CREATE DATABASE admin_panel"
   ```

5. Start the backend server:
   ```
   npm run dev
   ```
   
   The server will automatically run the migrations and seeders on startup.

### Admin-Employee Relationship

The system is designed with the following structure:

1. Each company can have multiple employees but only a few admins (typically 1-2).
2. Admins are organized by department and can manage employees in their department.
3. The relationship between Admin and Employee tables is as follows:
   - An Admin can manage multiple Employees
   - Employees belong to a specific Admin

This relationship is established in the database through the `admin_id` field in the `employees` table, which references the `id` field in the `admins` table.

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd admin/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file in the frontend directory with the following content:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
   ```

4. Start the frontend development server:
   ```
   npm run dev
   ```

5. Access the application at `http://localhost:3000`

## Admin Accounts

The system is seeded with the following admin accounts:

- **Super Admin**
  - Email: superadmin@example.com
  - Password: SuperAdmin@123
  - Department: Executive

- **Company Admin**
  - Email: admin@company1.com
  - Password: Admin@123
  - Department: IT

- **Finance Admin**
  - Email: finance@company1.com
  - Password: Finance@123
  - Department: Finance

- **HR Admin**
  - Email: hr@company1.com
  - Password: HR@123
  - Department: Human Resources

- **Marketing Admin**
  - Email: marketing@company1.com
  - Password: Marketing@123
  - Department: Marketing

## Password Reset

If an admin forgets their password, they need to contact the Super Admin directly.

## Features

- Admin authentication
- Role-based access control
- Dashboard with analytics
- User management
- Product management
- Order management
- System settings

## Technology Stack

- **Backend**: Node.js, Express, Sequelize ORM, MySQL
- **Frontend**: Next.js, React, Tailwind CSS
- **Authentication**: JWT (JSON Web Tokens)