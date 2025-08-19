// Import all hooks
import * as ProductHooks from './product';
import * as CartHooks from './cart';

// Export individual hooks
export const { useProducts, useProductDetail, useCategories, useProductFilters } = ProductHooks;
export const { useCart } = CartHooks;

// Export hook groups
export {
  ProductHooks,
  CartHooks,
};

// Default export
export default {
  ProductHooks,
  CartHooks,
};