# Point of Sale (POS) System Documentation

## Overview

The POS system is a comprehensive solution for offline sales and invoice management, integrated into the admin panel. It provides real-time transaction processing, inventory management, and invoice generation capabilities.

## Features

### 1. POS Interface
- **Product Selection**: Search and select products with real-time stock checking
- **Customer Management**: Select existing customers or create new ones
- **Cart Management**: Add, remove, and modify items in the cart
- **Payment Processing**: Support for multiple payment methods
- **Real-time Calculations**: Automatic tax, discount, and total calculations

### 2. Invoice Generation
- **Professional Invoices**: Generate formatted invoices with company branding
- **PDF Export**: Download invoices as PDF files
- **Email Integration**: Send invoices directly to customers
- **Multiple Templates**: Customizable invoice templates

### 3. Inventory Integration
- **Real-time Stock Updates**: Automatic inventory updates after sales
- **Stock Validation**: Prevent overselling with real-time stock checks
- **Low Stock Alerts**: Dashboard notifications for low inventory
- **Audit Trail**: Complete tracking of inventory movements

### 4. Analytics & Reporting
- **Sales Analytics**: Real-time sales data and trends
- **Transaction Reports**: Detailed transaction history
- **Dashboard Integration**: POS metrics in the main dashboard
- **Performance Insights**: Sales performance analysis

## Database Schema

### Core Tables

#### pos_transactions
```sql
- id (Primary Key)
- transaction_number (Unique)
- customer_id (Foreign Key to customers)
- customer_name, customer_phone, customer_email
- subtotal, tax_amount, discount_amount, total_amount
- status (pending, completed, cancelled, refunded)
- payment_status (unpaid, paid, partially_paid, refunded)
- notes
- cashier_id (Foreign Key to admins)
- company_id (Foreign Key to companies)
- created_at, updated_at
```

#### pos_transaction_items
```sql
- id (Primary Key)
- transaction_id (Foreign Key to pos_transactions)
- product_id (Foreign Key to products)
- product_name, product_sku
- quantity, unit_price, discount_amount, line_total
- created_at, updated_at
```

#### pos_payments
```sql
- id (Primary Key)
- transaction_id (Foreign Key to pos_transactions)
- payment_method_id (Foreign Key to payment_methods)
- amount, reference_number
- status (pending, completed, failed, cancelled)
- created_at, updated_at
```

#### payment_methods
```sql
- id (Primary Key)
- name, code
- type (cash, card, digital, bank_transfer, other)
- is_active, requires_reference
- created_at, updated_at
```

#### invoices
```sql
- id (Primary Key)
- invoice_number (Unique)
- transaction_id (Foreign Key to pos_transactions)
- order_id (Foreign Key to orders)
- customer_id (Foreign Key to customers)
- customer_name, customer_email, customer_phone, billing_address
- subtotal, tax_amount, discount_amount, total_amount
- status (draft, sent, paid, overdue, cancelled)
- due_date, paid_date
- notes, terms
- company_id (Foreign Key to companies)
- created_by (Foreign Key to admins)
- created_at, updated_at
```

## API Endpoints

### POS Transactions
- `GET /api/v1/pos/transactions` - Get all transactions
- `GET /api/v1/pos/transactions/:id` - Get transaction by ID
- `POST /api/v1/pos/transactions` - Create new transaction
- `PUT /api/v1/pos/transactions/:id` - Update transaction
- `DELETE /api/v1/pos/transactions/:id` - Cancel transaction

### POS Products
- `GET /api/v1/pos/products` - Get products for POS
- `GET /api/v1/pos/products/search` - Search products

### Payment Methods
- `GET /api/v1/pos/payment-methods` - Get active payment methods

### Invoices
- `GET /api/v1/invoices` - Get all invoices
- `GET /api/v1/invoices/:id` - Get invoice by ID
- `POST /api/v1/invoices/from-transaction/:id` - Create invoice from transaction
- `POST /api/v1/invoices/from-order/:id` - Create invoice from order
- `GET /api/v1/invoices/:id/pdf` - Generate PDF invoice
- `PUT /api/v1/invoices/:id/status` - Update invoice status

## Frontend Components

### Main Components
- `POSPage` - Main POS interface
- `ProductSelector` - Product selection modal
- `CustomerSelector` - Customer selection modal
- `PaymentModal` - Payment processing modal
- `InvoicesPage` - Invoice management page

### Key Features
- **Responsive Design**: Works on desktop and tablet devices
- **Real-time Updates**: Live inventory and pricing updates
- **Offline Support**: Basic offline functionality for critical operations
- **Print Integration**: Direct printing of receipts and invoices

## Usage Guide

### Creating a POS Transaction

1. **Access POS System**
   ```
   Navigate to /dashboard/pos
   ```

2. **Add Products**
   - Click "Add Product" button
   - Search for products by name, SKU, or ID
   - Select products to add to cart
   - Adjust quantities as needed

3. **Select Customer**
   - Click "Select Customer" button
   - Choose existing customer or create new one
   - Option for walk-in customers

4. **Process Payment**
   - Click "Checkout" button
   - Select payment method(s)
   - Enter payment amounts
   - Add reference numbers if required
   - Complete transaction

5. **Generate Invoice**
   - Invoices can be auto-generated after transaction
   - Manual invoice creation from transaction history
   - PDF download and email options

### Managing Invoices

1. **View Invoices**
   ```
   Navigate to /dashboard/invoices
   ```

2. **Filter and Search**
   - Filter by status (draft, sent, paid, overdue)
   - Search by invoice number or customer
   - Date range filtering

3. **Invoice Actions**
   - View invoice details
   - Download PDF
   - Mark as paid
   - Send via email

## Configuration

### Payment Methods Setup
```javascript
// Default payment methods are seeded automatically
// Additional methods can be added via admin interface
const paymentMethods = [
  { name: 'Cash', code: 'CASH', type: 'cash' },
  { name: 'Credit Card', code: 'CREDIT_CARD', type: 'card' },
  { name: 'UPI', code: 'UPI', type: 'digital' },
  // ... more methods
];
```

### Tax Configuration
```javascript
// Tax rates can be configured per company
const taxConfig = {
  defaultTaxRate: 0.18, // 18% GST
  taxInclusive: false,
  taxName: 'GST'
};
```

## Security Features

- **Authentication Required**: All POS operations require valid authentication
- **Role-based Access**: Different access levels for cashiers and managers
- **Audit Logging**: Complete audit trail of all transactions
- **Data Validation**: Comprehensive input validation and sanitization
- **Transaction Integrity**: Database transactions ensure data consistency

## Performance Considerations

- **Database Indexing**: Optimized indexes for fast queries
- **Caching**: Redis caching for frequently accessed data
- **Pagination**: Efficient pagination for large datasets
- **Real-time Updates**: WebSocket integration for live updates

## Troubleshooting

### Common Issues

1. **Stock Validation Errors**
   - Check product stock levels
   - Verify inventory sync
   - Review recent transactions

2. **Payment Processing Issues**
   - Verify payment method configuration
   - Check reference number requirements
   - Validate payment amounts

3. **Invoice Generation Problems**
   - Check PDF generation service
   - Verify customer information
   - Review invoice template configuration

### Error Codes
- `400` - Validation errors, insufficient stock
- `401` - Authentication required
- `403` - Insufficient permissions
- `404` - Resource not found
- `500` - Server error

## Future Enhancements

- **Barcode Scanning**: Integration with barcode scanners
- **Receipt Printing**: Direct thermal printer integration
- **Loyalty Programs**: Customer loyalty and rewards system
- **Multi-location**: Support for multiple store locations
- **Advanced Analytics**: Enhanced reporting and analytics
- **Mobile App**: Dedicated mobile POS application

## Support

For technical support or feature requests, please contact the development team or create an issue in the project repository.
