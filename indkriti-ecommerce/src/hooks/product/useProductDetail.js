import { useState, useEffect, useCallback } from 'react';
import { ProductService } from '../../services';

/**
 * Hook for fetching and managing a single product's details
 * @param {string|number} productId - The ID of the product to fetch
 * @returns {Object} - Product data and methods
 */
const useProductDetail = (productId = null) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);

  /**
   * Fetch product details by ID
   * @param {string|number} id - Product ID
   */
  const fetchProductDetail = useCallback(async (id) => {
    const targetId = id || productId;
    
    if (!targetId) {
      setError('Product ID is required');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await ProductService.getProductById(targetId);
      setProduct(response.data || null);
      
      // Fetch related products
      if (response.data) {
        fetchRelatedProducts(response.data.category_id);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch product details');
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  /**
   * Fetch product reviews
   * @param {string|number} id - Product ID
   */
  const fetchProductReviews = useCallback(async (id) => {
    const targetId = id || productId;
    
    if (!targetId) {
      return;
    }
    
    try {
      const response = await ProductService.getProductReviews(targetId);
      setReviews(response.data || []);
    } catch (err) {
      console.error('Failed to fetch product reviews:', err);
      setReviews([]);
    }
  }, [productId]);

  /**
   * Fetch related products by category
   * @param {string|number} categoryId - Category ID
   * @param {number} limit - Number of related products to fetch
   */
  const fetchRelatedProducts = useCallback(async (categoryId, limit = 4) => {
    if (!categoryId) {
      return;
    }
    
    try {
      const response = await ProductService.getProductsByCategory(categoryId, { limit });
      // Filter out the current product from related products
      const filtered = response.data?.filter(item => item.id !== productId) || [];
      setRelatedProducts(filtered.slice(0, limit));
    } catch (err) {
      console.error('Failed to fetch related products:', err);
      setRelatedProducts([]);
    }
  }, [productId]);

  /**
   * Submit a product review
   * @param {Object} reviewData - Review data
   */
  const submitReview = useCallback(async (reviewData) => {
    if (!productId) {
      return { success: false, message: 'Product ID is required' };
    }
    
    try {
      await ProductService.submitProductReview(productId, reviewData);
      // Refresh reviews after submission
      await fetchProductReviews();
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        message: err.message || 'Failed to submit review'
      };
    }
  }, [productId, fetchProductReviews]);

  // Fetch product details when productId changes
  useEffect(() => {
    if (productId) {
      fetchProductDetail(productId);
      fetchProductReviews(productId);
    }
  }, [productId, fetchProductDetail, fetchProductReviews]);

  return {
    product,
    loading,
    error,
    reviews,
    relatedProducts,
    fetchProductDetail,
    fetchProductReviews,
    fetchRelatedProducts,
    submitReview,
    refetch: () => fetchProductDetail(productId),
  };
};

export default useProductDetail;