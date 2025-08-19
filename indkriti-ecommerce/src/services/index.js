// Import all services
import * as ApiServices from './api';
import * as UtilsServices from './utils';

// Export individual services
export const { ProductService, CategoryService, CartService } = ApiServices;
export const { HttpService } = UtilsServices;

// Export service groups
export {
  ApiServices,
  UtilsServices,
};

// Default export
export default {
  ApiServices,
  UtilsServices,
};