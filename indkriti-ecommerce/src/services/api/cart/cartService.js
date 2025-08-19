import { API_BASE_URL, API_ENDPOINTS, DEFAULT_HEADERS, REQUEST_TIMEOUT } from '../../../config/api';
import config from '../../../config/environment';

/**
 * Cart API Service
 * Handles all cart-related API requests
 */
class CartService {
  /**
   * Get cart contents
   * @returns {Promise<Object>} - Cart data
   */
  static async getCart() {
    try {
      const url = `${API_BASE_URL}${API_ENDPOINTS.CART.GET}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          ...DEFAULT_HEADERS,
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch cart: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  }
  
  /**
   * Add item to cart
   * @param {Object} item - Item to add to cart
   * @returns {Promise<Object>} - Updated cart data
   */
  static async addToCart(item) {
    try {
      const url = `${API_BASE_URL}${API_ENDPOINTS.CART.ADD}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...DEFAULT_HEADERS,
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(item),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to add item to cart: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw error;
    }
  }
  
  /**
   * Update cart item
   * @param {string} itemId - Item ID
   * @param {Object} updates - Updates to apply
   * @returns {Promise<Object>} - Updated cart data
   */
  static async updateCartItem(itemId, updates) {
    try {
      const url = `${API_BASE_URL}${API_ENDPOINTS.CART.UPDATE}`;
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          ...DEFAULT_HEADERS,
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ itemId, ...updates }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update cart item: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  }
  
  /**
   * Remove item from cart
   * @param {string} itemId - Item ID
   * @returns {Promise<Object>} - Updated cart data
   */
  static async removeFromCart(itemId) {
    try {
      const url = `${API_BASE_URL}${API_ENDPOINTS.CART.REMOVE}`;
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          ...DEFAULT_HEADERS,
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ itemId }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to remove item from cart: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error removing item from cart:', error);
      throw error;
    }
  }
  
  /**
   * Clear cart
   * @returns {Promise<Object>} - Empty cart data
   */
  static async clearCart() {
    try {
      const url = `${API_BASE_URL}${API_ENDPOINTS.CART.CLEAR}`;
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          ...DEFAULT_HEADERS,
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to clear cart: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }
}

export default CartService;