import { useState, useCallback } from 'react';

/**
 * Hook for managing product filtering and sorting
 * @param {Object} initialFilters - Initial filter values
 * @returns {Object} - Filter state and methods
 */
const useProductFilters = (initialFilters = {}) => {
  const [filters, setFilters] = useState({
    category: initialFilters.category || '',
    priceRange: initialFilters.priceRange || { min: 0, max: 1000 },
    sortBy: initialFilters.sortBy || 'newest',
    rating: initialFilters.rating || 0,
    brands: initialFilters.brands || [],
    colors: initialFilters.colors || [],
    sizes: initialFilters.sizes || [],
    tags: initialFilters.tags || [],
    inStock: initialFilters.hasOwnProperty('inStock') ? initialFilters.inStock : true,
    onSale: initialFilters.onSale || false,
    freeShipping: initialFilters.freeShipping || false,
    page: initialFilters.page || 1,
    limit: initialFilters.limit || 12,
  });

  /**
   * Update a single filter
   * @param {string} key - Filter key
   * @param {any} value - Filter value
   */
  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      // Reset to page 1 when filters change (except when changing page)
      page: key === 'page' ? value : 1,
    }));
  }, []);

  /**
   * Update multiple filters at once
   * @param {Object} newFilters - New filter values
   */
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      // Reset to page 1 when filters change (except when changing page)
      page: newFilters.hasOwnProperty('page') ? newFilters.page : 1,
    }));
  }, []);

  /**
   * Reset filters to initial values
   */
  const resetFilters = useCallback(() => {
    setFilters({
      category: '',
      priceRange: { min: 0, max: 1000 },
      sortBy: 'newest',
      rating: 0,
      brands: [],
      colors: [],
      sizes: [],
      tags: [],
      inStock: true,
      onSale: false,
      freeShipping: false,
      page: 1,
      limit: 12,
    });
  }, []);

  /**
   * Toggle a filter value in an array
   * @param {string} key - Filter key
   * @param {any} value - Value to toggle
   */
  const toggleArrayFilter = useCallback((key, value) => {
    setFilters(prev => {
      const currentArray = prev[key] || [];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      
      return {
        ...prev,
        [key]: newArray,
        page: 1, // Reset to page 1 when filters change
      };
    });
  }, []);

  /**
   * Toggle a boolean filter
   * @param {string} key - Filter key
   */
  const toggleBooleanFilter = useCallback((key) => {
    setFilters(prev => ({
      ...prev,
      [key]: !prev[key],
      page: 1, // Reset to page 1 when filters change
    }));
  }, []);

  /**
   * Set price range filter
   * @param {number} min - Minimum price
   * @param {number} max - Maximum price
   */
  const setPriceRange = useCallback((min, max) => {
    setFilters(prev => ({
      ...prev,
      priceRange: { min, max },
      page: 1, // Reset to page 1 when filters change
    }));
  }, []);

  /**
   * Convert filters to query parameters for API requests
   * @returns {Object} - Query parameters
   */
  const getQueryParams = useCallback(() => {
    const params = {};
    
    if (filters.category) params.category = filters.category;
    if (filters.priceRange.min > 0) params.minPrice = filters.priceRange.min;
    if (filters.priceRange.max < 1000) params.maxPrice = filters.priceRange.max;
    if (filters.sortBy) params.sortBy = filters.sortBy;
    if (filters.rating > 0) params.rating = filters.rating;
    if (filters.brands.length > 0) params.brands = filters.brands.join(',');
    if (filters.colors.length > 0) params.colors = filters.colors.join(',');
    if (filters.sizes.length > 0) params.sizes = filters.sizes.join(',');
    if (filters.tags.length > 0) params.tags = filters.tags.join(',');
    if (filters.hasOwnProperty('inStock')) params.inStock = filters.inStock;
    if (filters.onSale) params.onSale = filters.onSale;
    if (filters.freeShipping) params.freeShipping = filters.freeShipping;
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;
    
    return params;
  }, [filters]);

  return {
    filters,
    updateFilter,
    updateFilters,
    resetFilters,
    toggleArrayFilter,
    toggleBooleanFilter,
    setPriceRange,
    getQueryParams,
  };
};

export default useProductFilters;