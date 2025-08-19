// Import all API services
import * as ProductServices from './product';
import * as CartServices from './cart';

// Export individual services
export const { ProductService, CategoryService } = ProductServices;
export const { CartService } = CartServices;

// Export service groups
export {
  ProductServices,
  CartServices,
};

// Default export
export default {
  ProductServices,
  CartServices,
};