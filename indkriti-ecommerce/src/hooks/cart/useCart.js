import { useState, useEffect, useCallback, useContext } from 'react';
import { CartService } from '../../services';

/**
 * Hook for managing shopping cart functionality
 * @returns {Object} - Cart data and methods
 */
const useCart = () => {
  const [cart, setCart] = useState({
    items: [],
    totalItems: 0,
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Calculate cart totals based on items
   * @param {Array} items - Cart items
   * @returns {Object} - Updated cart with calculated totals
   */
  const calculateTotals = useCallback((items) => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1; // Assuming 10% tax rate
    const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const total = subtotal + tax + shipping;
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    
    return {
      items,
      totalItems,
      subtotal,
      tax,
      shipping,
      total,
    };
  }, []);

  /**
   * Fetch cart contents
   */
  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await CartService.getCart();
      const cartData = response.data || { items: [] };
      
      setCart(calculateTotals(cartData.items));
    } catch (err) {
      setError(err.message || 'Failed to fetch cart');
      // If API fails, try to get cart from local storage
      const localCart = JSON.parse(localStorage.getItem('cart') || '{ "items": [] }');
      setCart(calculateTotals(localCart.items));
    } finally {
      setLoading(false);
    }
  }, [calculateTotals]);

  /**
   * Add item to cart
   * @param {Object} product - Product to add
   * @param {number} quantity - Quantity to add
   * @returns {Object} - Result of operation
   */
  const addToCart = useCallback(async (product, quantity = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const item = {
        product_id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity,
      };
      
      await CartService.addToCart(item);
      await fetchCart(); // Refresh cart after adding item
      
      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to add item to cart');
      return { 
        success: false, 
        message: err.message || 'Failed to add item to cart'
      };
    } finally {
      setLoading(false);
    }
  }, [fetchCart]);

  /**
   * Update cart item quantity
   * @param {string|number} itemId - Cart item ID
   * @param {number} quantity - New quantity
   * @returns {Object} - Result of operation
   */
  const updateCartItem = useCallback(async (itemId, quantity) => {
    try {
      setLoading(true);
      setError(null);
      
      if (quantity <= 0) {
        return removeCartItem(itemId);
      }
      
      await CartService.updateCartItem(itemId, { quantity });
      await fetchCart(); // Refresh cart after updating item
      
      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to update cart item');
      return { 
        success: false, 
        message: err.message || 'Failed to update cart item'
      };
    } finally {
      setLoading(false);
    }
  }, [fetchCart]);

  /**
   * Remove item from cart
   * @param {string|number} itemId - Cart item ID
   * @returns {Object} - Result of operation
   */
  const removeCartItem = useCallback(async (itemId) => {
    try {
      setLoading(true);
      setError(null);
      
      await CartService.removeCartItem(itemId);
      await fetchCart(); // Refresh cart after removing item
      
      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to remove cart item');
      return { 
        success: false, 
        message: err.message || 'Failed to remove cart item'
      };
    } finally {
      setLoading(false);
    }
  }, [fetchCart]);

  /**
   * Clear cart
   * @returns {Object} - Result of operation
   */
  const clearCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      await CartService.clearCart();
      await fetchCart(); // Refresh cart after clearing
      
      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to clear cart');
      return { 
        success: false, 
        message: err.message || 'Failed to clear cart'
      };
    } finally {
      setLoading(false);
    }
  }, [fetchCart]);

  // Fetch cart on mount
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return {
    cart,
    loading,
    error,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
    refetch: fetchCart,
  };
};

export default useCart;