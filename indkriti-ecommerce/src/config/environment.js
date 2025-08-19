// Environment configuration

// Environment variables
const ENV = {
  // App environment
  NODE_ENV: import.meta.env.MODE || 'development',
  
  // API configuration
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  
  // Feature flags
  FEATURES: {
    ENABLE_AUTH: import.meta.env.VITE_ENABLE_AUTH !== 'false',
    ENABLE_WISHLIST: import.meta.env.VITE_ENABLE_WISHLIST !== 'false',
    ENABLE_REVIEWS: import.meta.env.VITE_ENABLE_REVIEWS !== 'false',
    ENABLE_CART: import.meta.env.VITE_ENABLE_CART !== 'false',
  },
  
  // App settings
  APP: {
    NAME: import.meta.env.VITE_APP_NAME || 'Indkriti E-commerce',
    VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
    DESCRIPTION: import.meta.env.VITE_APP_DESCRIPTION || 'Modern e-commerce platform',
  },
};

// Environment specific configurations
const ENVIRONMENTS = {
  development: {
    // Development specific settings
    IS_DEV: true,
    IS_PROD: false,
    IS_TEST: false,
    API_MOCK: import.meta.env.VITE_API_MOCK === 'true',
    LOG_LEVEL: 'debug',
  },
  production: {
    // Production specific settings
    IS_DEV: false,
    IS_PROD: true,
    IS_TEST: false,
    API_MOCK: false,
    LOG_LEVEL: 'error',
  },
  test: {
    // Test specific settings
    IS_DEV: false,
    IS_PROD: false,
    IS_TEST: true,
    API_MOCK: true,
    LOG_LEVEL: 'debug',
  },
};

// Current environment configuration
const CURRENT_ENV = ENVIRONMENTS[ENV.NODE_ENV] || ENVIRONMENTS.development;

// Export combined configuration
const config = {
  ...ENV,
  ...CURRENT_ENV,
};

export default config;