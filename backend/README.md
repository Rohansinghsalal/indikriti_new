# E-commerce Admin Panel Backend

This is the backend API for the E-commerce Admin Panel. It provides a comprehensive set of APIs for managing products, orders, customers, and more.

## Features

- User authentication and authorization
- Role-based access control
- Product management
- Order processing
- Customer management
- Inventory management
- Reports and analytics
- Point of Sale (POS) system
- Content Management System (CMS)
- Financial management

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)

## Installation

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies:
   ```bash
   npm install
   ```
4. Copy the environment example file to create your `.env` file:
   ```bash
   cp env.example .env
   ```
5. Edit the `.env` file to match your MySQL database configuration:
   ```
   # Database Configuration - MySQL
   DB_DIALECT=mysql
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=admin_panel
   DB_USER=root
   DB_PASSWORD=your_password
   ```

## Database Setup

You don't need to manually create the database. The application will handle it automatically when you run the setup or development scripts.

The database setup process includes:
1. Creating the database if it doesn't exist
2. Running migrations to create tables
3. Seeding initial data
4. Creating an admin user

### Running Setup Manually

If you want to set up the database manually:

```bash
npm run setup-mysql
```

## Running the Application

### Development Mode (with automatic database setup)

```bash
npm run dev
```

This will:
1. Set up the MySQL database if it doesn't exist
2. Run all migrations
3. Seed the database
4. Create an admin user
5. Start the development server with nodemon

### Production Mode

```bash
npm start
```

## API Testing

You can test the API using the simplified test app:

```bash
node test-app.js
```

Then access the test endpoint:

```
GET http://localhost:5000/api/test
```

## API Documentation

### Authentication

- `POST /api/v1/auth/login` - Login with email and password
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password with token

### Users

- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get a user by ID
- `POST /api/v1/users` - Create a new user
- `PUT /api/v1/users/:id` - Update a user
- `DELETE /api/v1/users/:id` - Delete a user

### Products

- `GET /api/v1/products` - Get all products
- `GET /api/v1/products/:id` - Get a product by ID
- `POST /api/v1/products` - Create a new product
- `PUT /api/v1/products/:id` - Update a product
- `DELETE /api/v1/products/:id` - Delete a product

### Orders

- `GET /api/v1/orders` - Get all orders
- `GET /api/v1/orders/:id` - Get an order by ID
- `POST /api/v1/orders` - Create a new order
- `PUT /api/v1/orders/:id` - Update an order
- `DELETE /api/v1/orders/:id` - Delete an order

## Default Users

After seeding the database, you can log in with the following credentials:

- Super Admin:
  - Email: admin@example.com
  - Password: admin123

- Company Admin:
  - Email: company@example.com
  - Password: password123

- Demo User:
  - Email: demo@example.com
  - Password: password123

## Troubleshooting

- **MySQL Connection Issues**: Make sure your MySQL server is running and that the credentials in your `.env` file are correct.
- **Permission Issues**: Ensure your MySQL user has privileges to create databases and tables.
- **Migration Errors**: If you encounter migration errors, you can reset the database setup by deleting the database and running `npm run setup-mysql` again.

## License

This project is licensed under the MIT License. 