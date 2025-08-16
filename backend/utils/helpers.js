/**
 * Helper utilities for the application
 */

/**
 * Format error response
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {*} errors - Additional error details
 * @returns {Object} Error response object
 */
const errorResponse = (message = 'Server Error', statusCode = 500, errors = null) => {
  return {
    success: false,
    message,
    statusCode,
    ...(errors && { errors })
  };
};

/**
 * Format success response
 * @param {string} message - Success message
 * @param {*} data - Response data
 * @param {number} statusCode - HTTP status code
 * @returns {Object} Success response object
 */
const successResponse = (message = 'Success', data = null, statusCode = 200) => {
  return {
    success: true,
    message,
    statusCode,
    ...(data && { data })
  };
};

/**
 * Generate a random string
 * @param {number} length - Length of the string
 * @returns {string} Random string
 */
const generateRandomString = (length = 10) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  
  return result;
};

/**
 * Format date to YYYY-MM-DD
 * @param {Date} date - Date to format
 * @returns {string} Formatted date
 */
const formatDate = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} Formatted currency
 */
const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount);
};

/**
 * Paginate array
 * @param {Array} array - Array to paginate
 * @param {number} pageSize - Items per page
 * @param {number} pageNumber - Page number (1-based)
 * @returns {Object} Paginated result
 */
const paginateArray = (array, pageSize, pageNumber) => {
  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const totalItems = array.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  
  return {
    data: array.slice(startIndex, endIndex),
    pagination: {
      totalItems,
      pageSize,
      currentPage: pageNumber,
      totalPages,
      hasNextPage: pageNumber < totalPages,
      hasPrevPage: pageNumber > 1
    }
  };
};

module.exports = {
  errorResponse,
  successResponse,
  generateRandomString,
  formatDate,
  formatCurrency,
  paginateArray
}; 