import { API_BASE_URL, API_ENDPOINTS, DEFAULT_HEADERS, REQUEST_TIMEOUT } from '../../../config/api';
import config from '../../../config/environment';

/**
 * Product API Service
 * Handles all product-related API requests
 */
class ProductService {
  /**
   * Fetch all products with optional pagination and filters
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} - Products data
   */
  static async getProducts(params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = `${API_BASE_URL}${API_ENDPOINTS.PRODUCTS.LIST}?${queryParams}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: DEFAULT_HEADERS,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }
  
  /**
   * Fetch a single product by ID
   * @param {string} productId - Product ID
   * @returns {Promise<Object>} - Product data
   */
  static async getProductById(productId) {
    try {
      const url = `${API_BASE_URL}${API_ENDPOINTS.PRODUCTS.DETAILS(productId)}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: DEFAULT_HEADERS,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch product: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching product ${productId}:`, error);
      throw error;
    }
  }
  
  /**
   * Fetch all product categories
   * @returns {Promise<Array>} - Categories data
   */
  static async getCategories() {
    try {
      const url = `${API_BASE_URL}${API_ENDPOINTS.PRODUCTS.CATEGORIES}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: DEFAULT_HEADERS,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }
  
  /**
   * Fetch products by category ID
   * @param {string} categoryId - Category ID
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} - Products data
   */
  static async getProductsByCategory(categoryId, params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = `${API_BASE_URL}${API_ENDPOINTS.PRODUCTS.CATEGORY_PRODUCTS(categoryId)}?${queryParams}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: DEFAULT_HEADERS,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch products for category ${categoryId}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching products for category ${categoryId}:`, error);
      throw error;
    }
  }
  
  /**
   * Fetch featured products
   * @param {number} limit - Number of products to fetch
   * @returns {Promise<Array>} - Featured products data
   */
  static async getFeaturedProducts(limit = 8) {
    try {
      const url = `${API_BASE_URL}${API_ENDPOINTS.PRODUCTS.FEATURED}?limit=${limit}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: DEFAULT_HEADERS,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch featured products: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  }
  
  /**
   * Fetch new arrival products
   * @param {number} limit - Number of products to fetch
   * @returns {Promise<Array>} - New arrival products data
   */
  static async getNewArrivals(limit = 8) {
    try {
      const url = `${API_BASE_URL}${API_ENDPOINTS.PRODUCTS.NEW_ARRIVALS}?limit=${limit}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: DEFAULT_HEADERS,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch new arrivals: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching new arrivals:', error);
      throw error;
    }
  }
  
  /**
   * Fetch best seller products
   * @param {number} limit - Number of products to fetch
   * @returns {Promise<Array>} - Best seller products data
   */
  static async getBestSellers(limit = 8) {
    try {
      const url = `${API_BASE_URL}${API_ENDPOINTS.PRODUCTS.BEST_SELLERS}?limit=${limit}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: DEFAULT_HEADERS,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch best sellers: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching best sellers:', error);
      throw error;
    }
  }
  
  /**
   * Search products
   * @param {string} query - Search query
   * @param {Object} params - Additional query parameters
   * @returns {Promise<Object>} - Search results
   */
  static async searchProducts(query, params = {}) {
    try {
      const searchParams = new URLSearchParams({
        q: query,
        ...params,
      }).toString();
      
      const url = `${API_BASE_URL}${API_ENDPOINTS.PRODUCTS.SEARCH}?${searchParams}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: DEFAULT_HEADERS,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to search products: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }
  
  /**
   * Fetch product reviews
   * @param {string} productId - Product ID
   * @returns {Promise<Array>} - Reviews data
   */
  static async getProductReviews(productId) {
    try {
      const url = `${API_BASE_URL}${API_ENDPOINTS.PRODUCTS.REVIEWS(productId)}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: DEFAULT_HEADERS,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch product reviews: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching reviews for product ${productId}:`, error);
      throw error;
    }
  }
}

export default ProductService;