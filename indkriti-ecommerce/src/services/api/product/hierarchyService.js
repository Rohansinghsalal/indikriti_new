import { API_BASE_URL, API_ENDPOINTS, DEFAULT_HEADERS, REQUEST_TIMEOUT } from '../../../config/api';
import { 
  mockBrands, 
  getCategoriesByBrandMock, 
  getSubcategoriesByBrandAndCategoryMock, 
  getProductTypesByBrandAndSubcategoryMock 
} from './mockHierarchyData';

// Flag to use mock data instead of API calls
const USE_MOCK_DATA = true;

/**
 * Hierarchy API Service
 * Handles all hierarchy-related API requests for the 4-level structure:
 * Brand → Category → Subcategory → Product Type
 */
class HierarchyService {
  /**
   * Fetch all available brands
   * @returns {Promise<Array>} - Brands data
   */
  static async getBrands() {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockBrands), 500);
      });
    }
    
    try {
      const url = `${API_BASE_URL}${API_ENDPOINTS.HIERARCHY.BRANDS}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: DEFAULT_HEADERS,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch brands: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching brands:', error);
      throw error;
    }
  }
  
  /**
   * Fetch categories by brand
   * @param {string} brand - Brand name ('indikriti' or 'winsomeLane')
   * @returns {Promise<Array>} - Categories data
   */
  static async getCategoriesByBrand(brand) {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(getCategoriesByBrandMock(brand)), 500);
      });
    }
    
    try {
      const url = `${API_BASE_URL}${API_ENDPOINTS.HIERARCHY.BRAND_CATEGORIES(brand)}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: DEFAULT_HEADERS,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch categories for brand ${brand}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching categories for brand ${brand}:`, error);
      throw error;
    }
  }
  
  /**
   * Fetch subcategories by brand and category ID
   * @param {string} brand - Brand name ('indikriti' or 'winsomeLane')
   * @param {string|number} categoryId - Category ID
   * @returns {Promise<Array>} - Subcategories data
   */
  static async getSubcategoriesByBrandAndCategory(brand, categoryId) {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(getSubcategoriesByBrandAndCategoryMock(brand, categoryId)), 500);
      });
    }
    
    try {
      const url = `${API_BASE_URL}${API_ENDPOINTS.HIERARCHY.BRAND_SUBCATEGORIES(brand, categoryId)}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: DEFAULT_HEADERS,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch subcategories for brand ${brand} and category ${categoryId}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching subcategories for brand ${brand} and category ${categoryId}:`, error);
      throw error;
    }
  }
  
  /**
   * Fetch product types by brand and subcategory ID
   * @param {string} brand - Brand name ('indikriti' or 'winsomeLane')
   * @param {string|number} subcategoryId - Subcategory ID
   * @returns {Promise<Array>} - Product types data
   */
  static async getProductTypesByBrandAndSubcategory(brand, subcategoryId) {
    if (USE_MOCK_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(getProductTypesByBrandAndSubcategoryMock(brand, subcategoryId)), 500);
      });
    }
    
    try {
      const url = `${API_BASE_URL}${API_ENDPOINTS.HIERARCHY.BRAND_PRODUCT_TYPES(brand, subcategoryId)}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: DEFAULT_HEADERS,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch product types for brand ${brand} and subcategory ${subcategoryId}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching product types for brand ${brand} and subcategory ${subcategoryId}:`, error);
      throw error;
    }
  }
  
  /**
   * Fetch complete hierarchy for a brand
   * @param {string} brand - Brand name ('indikriti' or 'winsomeLane')
   * @returns {Promise<Object>} - Complete hierarchy data
   */
  static async getCompleteHierarchyByBrand(brand) {
    if (USE_MOCK_DATA) {
      // For mock data, we'll build the hierarchy manually
      const categories = getCategoriesByBrandMock(brand).data;
      const hierarchy = {
        brand,
        categories: []
      };
      
      // For each category, get its subcategories
      for (const category of categories) {
        const subcategories = getSubcategoriesByBrandAndCategoryMock(brand, category._id).data;
        const categoryWithSubs = {
          ...category,
          subcategories: []
        };
        
        // For each subcategory, get its product types
        for (const subcategory of subcategories) {
          const productTypes = getProductTypesByBrandAndSubcategoryMock(brand, subcategory._id).data;
          const subcategoryWithTypes = {
            ...subcategory,
            productTypes
          };
          
          categoryWithSubs.subcategories.push(subcategoryWithTypes);
        }
        
        hierarchy.categories.push(categoryWithSubs);
      }
      
      return new Promise((resolve) => {
        setTimeout(() => resolve({ data: hierarchy }), 800);
      });
    }
    
    try {
      const url = `${API_BASE_URL}${API_ENDPOINTS.HIERARCHY.COMPLETE_HIERARCHY(brand)}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: DEFAULT_HEADERS,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch complete hierarchy for brand ${brand}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching complete hierarchy for brand ${brand}:`, error);
      throw error;
    }
  }
}

export { HierarchyService };
export default HierarchyService;