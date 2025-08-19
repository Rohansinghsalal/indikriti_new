import { useState, useEffect, useCallback } from 'react';
import { ProductService } from '../../services';

/**
 * Hook for fetching and managing products
 * @param {Object} initialParams - Initial query parameters
 * @returns {Object} - Products data and methods
 */
const useProducts = (initialParams = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  /**
   * Fetch products based on current parameters
   */
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ProductService.getProducts(params);
      
      setProducts(response.data || []);
      
      if (response.pagination) {
        setPagination({
          currentPage: response.pagination.currentPage || 1,
          totalPages: response.pagination.totalPages || 1,
          totalItems: response.pagination.totalItems || 0,
          itemsPerPage: response.pagination.itemsPerPage || 10,
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [params]);

  /**
   * Update query parameters and refetch products
   * @param {Object} newParams - New query parameters
   */
  const updateParams = useCallback((newParams) => {
    setParams(prevParams => ({
      ...prevParams,
      ...newParams,
    }));
  }, []);

  /**
   * Change page and refetch products
   * @param {number} page - Page number
   */
  const changePage = useCallback((page) => {
    updateParams({ page });
  }, [updateParams]);

  /**
   * Fetch featured products
   * @param {number} limit - Number of products to fetch
   */
  const fetchFeaturedProducts = useCallback(async (limit = 8) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ProductService.getFeaturedProducts(limit);
      return response.data || [];
    } catch (err) {
      setError(err.message || 'Failed to fetch featured products');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch new arrivals
   * @param {number} limit - Number of products to fetch
   */
  const fetchNewArrivals = useCallback(async (limit = 8) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ProductService.getNewArrivals(limit);
      return response.data || [];
    } catch (err) {
      setError(err.message || 'Failed to fetch new arrivals');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch best sellers
   * @param {number} limit - Number of products to fetch
   */
  const fetchBestSellers = useCallback(async (limit = 8) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ProductService.getBestSellers(limit);
      return response.data || [];
    } catch (err) {
      setError(err.message || 'Failed to fetch best sellers');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Search products
   * @param {string} query - Search query
   * @param {Object} searchParams - Additional search parameters
   */
  const searchProducts = useCallback(async (query, searchParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ProductService.searchProducts(query, searchParams);
      return response.data || [];
    } catch (err) {
      setError(err.message || 'Failed to search products');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch products on mount and when params change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    pagination,
    params,
    updateParams,
    changePage,
    fetchFeaturedProducts,
    fetchNewArrivals,
    fetchBestSellers,
    searchProducts,
    refetch: fetchProducts,
  };
};

export default useProducts;