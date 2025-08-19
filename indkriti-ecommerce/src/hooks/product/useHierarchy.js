import { useState, useEffect, useCallback } from 'react';
import { HierarchyService } from '../../services/api/product';

/**
 * Hook for fetching and managing product hierarchy data
 * @param {string} defaultBrand - Default brand to use ('indikriti' or 'winsomeLane')
 * @returns {Object} - Hierarchy data and methods
 */
const useHierarchy = (defaultBrand = 'indikriti') => {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [completeHierarchy, setCompleteHierarchy] = useState(null);
  const [currentBrand, setCurrentBrand] = useState(defaultBrand);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all available brands
   */
  const fetchBrands = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await HierarchyService.getBrands();
      setBrands(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch brands');
      setBrands([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch categories for a specific brand
   * @param {string} brand - Brand name ('indikriti' or 'winsomeLane')
   */
  const fetchCategoriesByBrand = useCallback(async (brand = currentBrand) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await HierarchyService.getCategoriesByBrand(brand);
      setCategories(response.data || []);
      setCurrentBrand(brand);
    } catch (err) {
      setError(err.message || `Failed to fetch categories for brand ${brand}`);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [currentBrand]);

  /**
   * Fetch subcategories for a specific brand and category
   * @param {string} brand - Brand name ('indikriti' or 'winsomeLane')
   * @param {string|number} categoryId - Category ID
   */
  const fetchSubcategoriesByBrandAndCategory = useCallback(async (brand = currentBrand, categoryId) => {
    if (!categoryId) {
      setSubcategories([]);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await HierarchyService.getSubcategoriesByBrandAndCategory(brand, categoryId);
      setSubcategories(response.data || []);
    } catch (err) {
      setError(err.message || `Failed to fetch subcategories for brand ${brand} and category ${categoryId}`);
      setSubcategories([]);
    } finally {
      setLoading(false);
    }
  }, [currentBrand]);

  /**
   * Fetch product types for a specific brand and subcategory
   * @param {string} brand - Brand name ('indikriti' or 'winsomeLane')
   * @param {string|number} subcategoryId - Subcategory ID
   */
  const fetchProductTypesByBrandAndSubcategory = useCallback(async (brand = currentBrand, subcategoryId) => {
    if (!subcategoryId) {
      setProductTypes([]);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await HierarchyService.getProductTypesByBrandAndSubcategory(brand, subcategoryId);
      setProductTypes(response.data || []);
    } catch (err) {
      setError(err.message || `Failed to fetch product types for brand ${brand} and subcategory ${subcategoryId}`);
      setProductTypes([]);
    } finally {
      setLoading(false);
    }
  }, [currentBrand]);

  /**
   * Fetch complete hierarchy for a specific brand
   * @param {string} brand - Brand name ('indikriti' or 'winsomeLane')
   */
  const fetchCompleteHierarchyByBrand = useCallback(async (brand = currentBrand) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await HierarchyService.getCompleteHierarchyByBrand(brand);
      setCompleteHierarchy(response.data || null);
      setCurrentBrand(brand);
    } catch (err) {
      setError(err.message || `Failed to fetch complete hierarchy for brand ${brand}`);
      setCompleteHierarchy(null);
    } finally {
      setLoading(false);
    }
  }, [currentBrand]);

  /**
   * Change the current brand and fetch its categories
   * @param {string} brand - Brand name ('indikriti' or 'winsomeLane')
   */
  const changeBrand = useCallback((brand) => {
    if (brand !== currentBrand) {
      setCurrentBrand(brand);
      fetchCategoriesByBrand(brand);
      setSubcategories([]);
      setProductTypes([]);
    }
  }, [currentBrand, fetchCategoriesByBrand]);

  // Fetch brands on mount
  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  // Fetch categories for the default brand on mount
  useEffect(() => {
    fetchCategoriesByBrand(defaultBrand);
  }, [defaultBrand, fetchCategoriesByBrand]);

  return {
    brands,
    categories,
    subcategories,
    productTypes,
    completeHierarchy,
    currentBrand,
    loading,
    error,
    fetchBrands,
    fetchCategoriesByBrand,
    fetchSubcategoriesByBrandAndCategory,
    fetchProductTypesByBrandAndSubcategory,
    fetchCompleteHierarchyByBrand,
    changeBrand,
  };
};

export default useHierarchy;