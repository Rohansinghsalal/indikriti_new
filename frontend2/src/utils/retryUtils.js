/**
 * Retry utility for API calls and other async operations
 */

/**
 * Retry an async operation with exponential backoff
 * @param {Function} operation - The async operation to retry
 * @param {Object} options - Retry options
 * @returns {Promise} - The result of the operation
 */
export const retryOperation = async (operation, options = {}) => {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2,
    retryCondition = (error) => true,
    onRetry = (error, attempt) => console.log(`Retry attempt ${attempt}:`, error.message)
  } = options;

  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await operation();
      return result;
    } catch (error) {
      lastError = error;
      
      // Check if we should retry this error
      if (!retryCondition(error) || attempt === maxRetries) {
        throw error;
      }
      
      // Calculate delay with exponential backoff
      const delay = Math.min(
        baseDelay * Math.pow(backoffFactor, attempt),
        maxDelay
      );
      
      onRetry(error, attempt + 1);
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

/**
 * Retry condition for network errors
 */
export const isNetworkError = (error) => {
  return (
    error.name === 'TypeError' ||
    error.message.includes('fetch') ||
    error.message.includes('network') ||
    error.message.includes('timeout') ||
    error.message.includes('ECONNREFUSED') ||
    error.message.includes('ENOTFOUND') ||
    (error.response && error.response.status >= 500)
  );
};

/**
 * Retry condition for temporary server errors
 */
export const isRetryableError = (error) => {
  if (isNetworkError(error)) return true;
  
  // Retry on specific HTTP status codes
  if (error.response) {
    const status = error.response.status;
    return status === 408 || status === 429 || (status >= 500 && status <= 599);
  }
  
  return false;
};

/**
 * Create a retryable version of an API call
 */
export const createRetryableApiCall = (apiCall, options = {}) => {
  return async (...args) => {
    return retryOperation(
      () => apiCall(...args),
      {
        retryCondition: isRetryableError,
        onRetry: (error, attempt) => {
          console.log(`API call retry attempt ${attempt}:`, error.message);
        },
        ...options
      }
    );
  };
};

/**
 * Wrapper for fetch with retry logic
 */
export const retryableFetch = async (url, options = {}, retryOptions = {}) => {
  const fetchOperation = async () => {
    const response = await fetch(url, options);
    
    // Throw error for non-ok responses to trigger retry logic
    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
      error.response = response;
      throw error;
    }
    
    return response;
  };

  return retryOperation(fetchOperation, {
    retryCondition: isRetryableError,
    ...retryOptions
  });
};

/**
 * Circuit breaker pattern for API calls
 */
export class CircuitBreaker {
  constructor(options = {}) {
    this.failureThreshold = options.failureThreshold || 5;
    this.resetTimeout = options.resetTimeout || 60000; // 1 minute
    this.monitoringPeriod = options.monitoringPeriod || 10000; // 10 seconds
    
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.successCount = 0;
  }

  async execute(operation) {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime >= this.resetTimeout) {
        this.state = 'HALF_OPEN';
        this.successCount = 0;
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.failureCount = 0;
    
    if (this.state === 'HALF_OPEN') {
      this.successCount++;
      if (this.successCount >= 3) { // Require 3 successes to close
        this.state = 'CLOSED';
      }
    }
  }

  onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
    }
  }

  getState() {
    return this.state;
  }
}

/**
 * Default circuit breaker instance for API calls
 */
export const apiCircuitBreaker = new CircuitBreaker({
  failureThreshold: 5,
  resetTimeout: 30000, // 30 seconds
  monitoringPeriod: 10000 // 10 seconds
});

/**
 * Wrapper for API calls with circuit breaker
 */
export const circuitBreakerApiCall = async (operation) => {
  return apiCircuitBreaker.execute(operation);
};
