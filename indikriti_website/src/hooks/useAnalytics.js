import { useCallback } from 'react';

export const useAnalytics = () => {
  const trackEvent = useCallback((eventName, eventData = {}) => {
    // Log event for debugging
    console.log('📊 Analytics Event:', eventName, eventData);
    
    // Track to localStorage for demo purposes
    try {
      const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
      const event = {
        id: Date.now() + Math.random(),
        name: eventName,
        data: eventData,
        timestamp: new Date().toISOString(),
        sessionId: sessionStorage.getItem('session_id') || 'anonymous',
        userId: localStorage.getItem('user')?.id || null,
      };
      
      events.push(event);
      
      // Keep only last 1000 events
      if (events.length > 1000) {
        events.splice(0, events.length - 1000);
      }
      
      localStorage.setItem('analytics_events', JSON.stringify(events));
      
      // In production, you would send this to your analytics service
      // Example: sendToAnalyticsService(event);
      
    } catch (error) {
      console.error('Analytics tracking failed:', error);
    }
  }, []);

  // Specific tracking functions
  const trackAddToCart = useCallback((product, quantity = 1) => {
    trackEvent('add_to_cart', {
      product_id: product.id,
      product_name: product.name,
      price: product.price,
      quantity,
      category: product.category,
      brand: product.brand || 'indikriti'
    });
  }, [trackEvent]);

  const trackAddToWishlist = useCallback((product) => {
    trackEvent('add_to_wishlist', {
      product_id: product.id,
      product_name: product.name,
      price: product.price,
      category: product.category,
      brand: product.brand || 'indikriti'
    });
  }, [trackEvent]);

  const trackRemoveFromWishlist = useCallback((product) => {
    trackEvent('remove_from_wishlist', {
      product_id: product.id,
      product_name: product.name,
      category: product.category,
      brand: product.brand || 'indikriti'
    });
  }, [trackEvent]);

  const trackViewProduct = useCallback((product) => {
    trackEvent('view_product', {
      product_id: product.id,
      product_name: product.name,
      price: product.price,
      category: product.category,
      brand: product.brand || 'indikriti'
    });
  }, [trackEvent]);

  const trackPurchase = useCallback((orderData) => {
    trackEvent('purchase', {
      order_id: orderData.id,
      total_amount: orderData.total,
      items: orderData.items,
      payment_method: orderData.paymentMethod,
      wallet_used: orderData.walletUsed || 0
    });
  }, [trackEvent]);

  const trackSearch = useCallback((query, results = []) => {
    trackEvent('search', {
      query,
      results_count: results.length,
      results: results.slice(0, 10).map(r => ({ id: r.id, name: r.name }))
    });
  }, [trackEvent]);

  const trackUserRegistration = useCallback((userData) => {
    trackEvent('user_registration', {
      user_id: userData.id,
      registration_method: userData.method || 'phone',
      has_referral: !!userData.referralCode
    });
  }, [trackEvent]);

  const trackUserLogin = useCallback((userData) => {
    trackEvent('user_login', {
      user_id: userData.id,
      login_method: userData.method || 'phone'
    });
  }, [trackEvent]);

  // Get analytics data (for admin dashboard)
  const getAnalyticsData = useCallback(() => {
    try {
      const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
      return events;
    } catch (error) {
      return [];
    }
  }, []);

  const clearAnalyticsData = useCallback(() => {
    localStorage.removeItem('analytics_events');
  }, []);

  return {
    trackEvent,
    trackAddToCart,
    trackAddToWishlist,
    trackRemoveFromWishlist,
    trackViewProduct,
    trackPurchase,
    trackSearch,
    trackUserRegistration,
    trackUserLogin,
    getAnalyticsData,
    clearAnalyticsData,
  };
};

// Initialize session ID
if (typeof window !== 'undefined' && !sessionStorage.getItem('session_id')) {
  sessionStorage.setItem('session_id', 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9));
}
