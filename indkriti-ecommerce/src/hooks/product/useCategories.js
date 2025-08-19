import { useState, useEffect, useCallback } from 'react';
import { CategoryService } from '../../services';

/**
 * Hook for fetching and managing product categories
 * @returns {Object} - Categories data and methods
 */
const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch all categories
   */
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await CategoryService.getCategories();
      setCategories(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch categories');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch a single category by ID
   * @param {string|number} categoryId - Category ID
   * @returns {Object|null} - Category data
   */
  const fetchCategoryById = useCallback(async (categoryId) => {
    try {
      const response = await CategoryService.getCategoryById(categoryId);
      return response.data || null;
    } catch (err) {
      console.error('Failed to fetch category:', err);
      return null;
    }
  }, []);

  /**
   * Fetch featured categories
   * @param {number} limit - Number of categories to fetch
   * @returns {Array} - Featured categories
   */
  const fetchFeaturedCategories = useCallback(async (limit = 6) => {
    try {
      const response = await CategoryService.getFeaturedCategories(limit);
      return response.data || [];
    } catch (err) {
      console.error('Failed to fetch featured categories:', err);
      return [];
    }
  }, []);

  /**
   * Fetch products by category
   * @param {string|number} categoryId - Category ID
   * @param {Object} params - Query parameters
   * @returns {Array} - Products in the category
   */
  const fetchProductsByCategory = useCallback(async (categoryId, params = {}) => {
    try {
      const response = await CategoryService.getProductsByCategory(categoryId, params);
      return response.data || [];
    } catch (err) {
      console.error('Failed to fetch products by category:', err);
      return [];
    }
  }, []);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    fetchCategoryById,
    fetchFeaturedCategories,
    fetchProductsByCategory,
    refetch: fetchCategories,
  };
};

export default useCategories;