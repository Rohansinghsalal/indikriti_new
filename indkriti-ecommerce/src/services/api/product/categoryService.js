import { API_BASE_URL, API_ENDPOINTS, DEFAULT_HEADERS, REQUEST_TIMEOUT } from '../../../config/api';
import config from '../../../config/environment';

/**
 * Category API Service
 * Handles all category-related API requests
 */
class CategoryService {
  /**
   * Fetch all categories
   * @param {string} brand - Brand name ('indikriti' or 'winsomeLane')
   * @returns {Promise<Array>} - Categories data
   */
  static async getCategories(brand = 'indikriti') {
    try {
      // Use the brand-specific endpoint if brand is provided
      const url = brand
        ? `${API_BASE_URL}${API_ENDPOINTS.HIERARCHY.BRAND_CATEGORIES(brand)}`
        : `${API_BASE_URL}${API_ENDPOINTS.PRODUCTS.CATEGORIES}`;
      
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
   * Fetch a single category by ID
   * @param {string} categoryId - Category ID
   * @param {string} brand - Brand name ('indikriti' or 'winsomeLane')
   * @returns {Promise<Object>} - Category data
   */
  static async getCategoryById(categoryId, brand = 'indikriti') {
    try {
      // Use the brand-specific endpoint if brand is provided
      const url = brand
        ? `${API_BASE_URL}${API_ENDPOINTS.HIERARCHY.BRAND_CATEGORIES(brand)}/${categoryId}`
        : `${API_BASE_URL}${API_ENDPOINTS.PRODUCTS.CATEGORIES}/${categoryId}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: DEFAULT_HEADERS,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch category: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching category ${categoryId}:`, error);
      throw error;
    }
  }
  
  /**
   * Fetch products by category
   * @param {string} categoryId - Category ID
   * @param {Object} params - Query parameters
   * @param {string} brand - Brand name ('indikriti' or 'winsomeLane')
   * @returns {Promise<Array>} - Products data
   */
  static async getProductsByCategory(categoryId, params = {}, brand = 'indikriti') {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = `${API_BASE_URL}${API_ENDPOINTS.PRODUCTS.BY_CATEGORY(categoryId)}${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: DEFAULT_HEADERS,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch products by category: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching products for category ${categoryId}:`, error);
      throw error;
    }
  }

  /**
   * Fetch featured categories
   * @param {string} brand - Brand name ('indikriti' or 'winsomeLane')
   * @returns {Promise<Array>} - Featured categories data
   */
  static async getFeaturedCategories(brand = 'indikriti') {
    try {
      const url = `${API_BASE_URL}${API_ENDPOINTS.PRODUCTS.FEATURED_CATEGORIES}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: DEFAULT_HEADERS,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch featured categories: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching featured categories:', error);
      throw error;
    }
  }

  /**
   * Fetch subcategories by brand and category ID
   * @param {string} categoryId - Category ID
   * @param {string} brand - Brand name ('indikriti' or 'winsomeLane')
   * @returns {Promise<Array>} - Subcategories data
   */
  static async getSubcategoriesByCategory(categoryId, brand = 'indikriti') {
    try {
      const url = `${API_BASE_URL}${API_ENDPOINTS.HIERARCHY.BRAND_SUBCATEGORIES(brand, categoryId)}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: DEFAULT_HEADERS,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch subcategories: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching subcategories for category ${categoryId}:`, error);
      throw error;
    }
  }

  /**
   * Fetch product types by brand and subcategory ID
   * @param {string} subcategoryId - Subcategory ID
   * @param {string} brand - Brand name ('indikriti' or 'winsomeLane')
   * @returns {Promise<Array>} - Product types data
   */
  static async getProductTypesBySubcategory(subcategoryId, brand = 'indikriti') {
    try {
      const url = `${API_BASE_URL}${API_ENDPOINTS.HIERARCHY.BRAND_PRODUCT_TYPES(brand, subcategoryId)}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: DEFAULT_HEADERS,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch product types: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching product types for subcategory ${subcategoryId}:`, error);
      throw error;
    }
  }

  /**
   * Fetch complete hierarchy by brand
   * @param {string} brand - Brand name ('indikriti' or 'winsomeLane')
   * @returns {Promise<Object>} - Complete hierarchy data
   */
  static async getCompleteHierarchy(brand = 'indikriti') {
    try {
      const url = `${API_BASE_URL}${API_ENDPOINTS.HIERARCHY.COMPLETE_HIERARCHY(brand)}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: DEFAULT_HEADERS,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch complete hierarchy: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching complete hierarchy for brand ${brand}:`, error);
      throw error;
    }
  }
}

export default CategoryService;