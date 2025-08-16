/**
 * Application constants
 */

// User roles
const USER_ROLES = {
  SUPER_ADMIN: 'Super Admin',
  COMPANY_ADMIN: 'Company Admin',
  MANAGER: 'Manager',
  STAFF: 'Staff',
  ACCOUNTANT: 'Accountant',
  LOGISTICS: 'Logistics'
};

// User status
const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending'
};

// Company status
const COMPANY_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending'
};

// Order status
const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded'
};

// Payment status
const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  PARTIALLY_REFUNDED: 'partially_refunded'
};

// Payment methods
const PAYMENT_METHODS = {
  CASH: 'cash',
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  UPI: 'upi',
  BANK_TRANSFER: 'bank_transfer',
  WALLET: 'wallet'
};

// Support ticket status
const TICKET_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed'
};

// Support ticket priorities
const TICKET_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

// POS transaction types
const POS_TRANSACTION_TYPES = {
  SALE: 'sale',
  REFUND: 'refund',
  VOID: 'void'
};

// API error messages
const API_ERRORS = {
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  NOT_FOUND: 'Resource not found',
  BAD_REQUEST: 'Invalid request',
  SERVER_ERROR: 'Server error',
  VALIDATION_ERROR: 'Validation error'
};

// API success messages
const API_SUCCESS = {
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully',
  FETCHED: 'Resource fetched successfully'
};

// Pagination
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
};

module.exports = {
  USER_ROLES,
  USER_STATUS,
  COMPANY_STATUS,
  ORDER_STATUS,
  PAYMENT_STATUS,
  PAYMENT_METHODS,
  TICKET_STATUS,
  TICKET_PRIORITY,
  POS_TRANSACTION_TYPES,
  API_ERRORS,
  API_SUCCESS,
  PAGINATION
}; 