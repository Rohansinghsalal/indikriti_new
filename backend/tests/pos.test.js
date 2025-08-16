/**
 * POS System Tests
 * Comprehensive testing for Point of Sale functionality
 */
const request = require('supertest');
const app = require('../server');
const { sequelize } = require('../database/connection');
const { POSTransaction, POSTransactionItem, POSPayment, Product, PaymentMethod, Customer } = require('../models');

describe('POS System', () => {
  let authToken;
  let testProduct;
  let testCustomer;
  let testPaymentMethod;

  beforeAll(async () => {
    // Setup test database
    await sequelize.sync({ force: true });
    
    // Create test data
    testProduct = await Product.create({
      name: 'Test Product',
      sku: 'TEST-001',
      product_id: 'PROD-TEST-001',
      selling_price: 99.99,
      mrp: 129.99,
      stock_quantity: 100,
      status: 'active',
      company_id: 1
    });

    testCustomer = await Customer.create({
      name: 'Test Customer',
      email: 'test@example.com',
      phone: '+91 9876543210',
      company_id: 1
    });

    testPaymentMethod = await PaymentMethod.create({
      name: 'Cash',
      code: 'CASH',
      type: 'cash',
      is_active: true,
      requires_reference: false
    });

    // Login to get auth token
    const loginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'password123'
      });
    
    authToken = loginResponse.body.token;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('GET /api/v1/pos/products', () => {
    it('should get products for POS', async () => {
      const response = await request(app)
        .get('/api/v1/pos/products')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.products).toBeInstanceOf(Array);
      expect(response.body.data.products.length).toBeGreaterThan(0);
    });

    it('should filter products by search query', async () => {
      const response = await request(app)
        .get('/api/v1/pos/products?search=Test')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.products).toBeInstanceOf(Array);
    });
  });

  describe('GET /api/v1/pos/payment-methods', () => {
    it('should get active payment methods', async () => {
      const response = await request(app)
        .get('/api/v1/pos/payment-methods')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/v1/pos/transactions', () => {
    it('should create a POS transaction successfully', async () => {
      const transactionData = {
        customer_id: testCustomer.id,
        customer_name: testCustomer.name,
        customer_phone: testCustomer.phone,
        customer_email: testCustomer.email,
        items: [
          {
            product_id: testProduct.id,
            quantity: 2,
            unit_price: testProduct.selling_price,
            discount_amount: 0
          }
        ],
        payments: [
          {
            payment_method_id: testPaymentMethod.id,
            amount: testProduct.selling_price * 2
          }
        ],
        tax_amount: 18.00,
        discount_amount: 0,
        notes: 'Test transaction'
      };

      const response = await request(app)
        .post('/api/v1/pos/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send(transactionData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.transaction_number).toBeDefined();
      expect(response.body.data.status).toBe('completed');
      expect(response.body.data.payment_status).toBe('paid');
      expect(response.body.data.items).toHaveLength(1);
      expect(response.body.data.payments).toHaveLength(1);

      // Verify stock was updated
      const updatedProduct = await Product.findByPk(testProduct.id);
      expect(updatedProduct.stock_quantity).toBe(testProduct.stock_quantity - 2);
    });

    it('should fail with insufficient stock', async () => {
      const transactionData = {
        customer_name: 'Walk-in Customer',
        items: [
          {
            product_id: testProduct.id,
            quantity: 1000, // More than available stock
            unit_price: testProduct.selling_price,
            discount_amount: 0
          }
        ],
        payments: [
          {
            payment_method_id: testPaymentMethod.id,
            amount: testProduct.selling_price * 1000
          }
        ],
        tax_amount: 0,
        discount_amount: 0
      };

      const response = await request(app)
        .post('/api/v1/pos/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send(transactionData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Insufficient stock');
    });

    it('should fail with invalid product ID', async () => {
      const transactionData = {
        customer_name: 'Walk-in Customer',
        items: [
          {
            product_id: 99999, // Non-existent product
            quantity: 1,
            unit_price: 100,
            discount_amount: 0
          }
        ],
        payments: [
          {
            payment_method_id: testPaymentMethod.id,
            amount: 100
          }
        ],
        tax_amount: 0,
        discount_amount: 0
      };

      const response = await request(app)
        .post('/api/v1/pos/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send(transactionData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail with empty items array', async () => {
      const transactionData = {
        customer_name: 'Walk-in Customer',
        items: [], // Empty items
        payments: [],
        tax_amount: 0,
        discount_amount: 0
      };

      const response = await request(app)
        .post('/api/v1/pos/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send(transactionData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('At least one item is required');
    });
  });

  describe('GET /api/v1/pos/transactions', () => {
    it('should get all POS transactions', async () => {
      const response = await request(app)
        .get('/api/v1/pos/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.transactions).toBeInstanceOf(Array);
      expect(response.body.data.pagination).toBeDefined();
    });

    it('should filter transactions by status', async () => {
      const response = await request(app)
        .get('/api/v1/pos/transactions?status=completed')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.transactions).toBeInstanceOf(Array);
    });

    it('should search transactions', async () => {
      const response = await request(app)
        .get('/api/v1/pos/transactions?search=Test')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.transactions).toBeInstanceOf(Array);
    });
  });

  describe('GET /api/v1/pos/transactions/:id', () => {
    let transactionId;

    beforeAll(async () => {
      // Create a test transaction
      const transaction = await POSTransaction.create({
        customer_id: testCustomer.id,
        customer_name: testCustomer.name,
        subtotal: 99.99,
        tax_amount: 18.00,
        discount_amount: 0,
        total_amount: 117.99,
        status: 'completed',
        payment_status: 'paid',
        cashier_id: 1,
        company_id: 1
      });
      transactionId = transaction.id;
    });

    it('should get transaction by ID', async () => {
      const response = await request(app)
        .get(`/api/v1/pos/transactions/${transactionId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(transactionId);
      expect(response.body.data.customer_name).toBe(testCustomer.name);
    });

    it('should return 404 for non-existent transaction', async () => {
      const response = await request(app)
        .get('/api/v1/pos/transactions/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });
  });

  describe('Authentication', () => {
    it('should require authentication for POS endpoints', async () => {
      await request(app)
        .get('/api/v1/pos/products')
        .expect(401);

      await request(app)
        .post('/api/v1/pos/transactions')
        .send({})
        .expect(401);
    });
  });

  describe('Validation', () => {
    it('should validate transaction data', async () => {
      const invalidData = {
        // Missing required fields
        items: [
          {
            // Missing product_id
            quantity: 1,
            unit_price: 100
          }
        ]
      };

      const response = await request(app)
        .post('/api/v1/pos/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});
