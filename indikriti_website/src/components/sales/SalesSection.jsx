import { useState, useEffect } from 'react';
import { fetchSalesAndDiscounts } from '../../services/enhancedApi.js';
import { useResponsive } from '../../hooks/useResponsive.js';
import { useAnalytics } from '../../hooks/useAnalytics.js';
import ProductCard from '../ProductCard.jsx';

const SalesSection = ({ onProductClick, onViewAll }) => {
  const [salesData, setSalesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isMobileOrTablet } = useResponsive();
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    loadSalesData();
  }, []);

  const loadSalesData = async () => {
    try {
      setLoading(true);
      const data = await fetchSalesAndDiscounts();
      setSalesData(data);
      trackEvent('view_sales_section', { deals_count: data.deals?.length || 0 });
    } catch (error) {
      console.error('Failed to load sales data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAllDeals = () => {
    trackEvent('click_view_all_deals');
    onViewAll?.('deals');
  };

  const handleViewFlashSale = () => {
    trackEvent('click_view_flash_sale');
    onViewAll?.('flash-sale');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Flash Sale Skeleton */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl p-4">
          <div className="h-6 bg-white/20 rounded w-32 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white/10 rounded-lg h-48 animate-pulse"></div>
            ))}
          </div>
        </div>

        {/* Deals Skeleton */}
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded w-40 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-100 rounded-lg h-32 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-2">❌</div>
        <p className="text-gray-600">Failed to load deals and offers</p>
        <button
          onClick={loadSalesData}
          className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Flash Sale Section */}
      {salesData?.flashSales?.length > 0 && (
        <section className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold flex items-center space-x-2">
                <span>⚡</span>
                <span>Flash Sale</span>
              </h2>
              <p className="text-red-100 text-sm">Limited time offer!</p>
            </div>
            <button
              onClick={handleViewFlashSale}
              className="bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
            >
              View All
            </button>
          </div>

          <div className={`grid gap-3 ${isMobileOrTablet ? 'grid-cols-2' : 'grid-cols-4'}`}>
            {salesData.flashSales.slice(0, isMobileOrTablet ? 4 : 8).map((product) => (
              <div
                key={product.id || product.product_id}
                onClick={() => onProductClick?.(product)}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-3 cursor-pointer hover:bg-white/20 transition-colors"
              >
                <div className="aspect-square bg-white/20 rounded-lg mb-2 overflow-hidden">
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <h3 className="font-medium text-sm line-clamp-2 mb-1">{product.name}</h3>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sm">₹{product.discounted_price || product.price}</span>
                  {product.price && product.discounted_price && product.price > product.discounted_price && (
                    <span className="text-xs line-through text-red-200">₹{product.price}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Deal Banners */}
      {salesData?.deals?.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">🎯 Special Deals</h2>
            <button
              onClick={handleViewAllDeals}
              className="text-orange-600 font-medium hover:text-orange-700 transition-colors"
            >
              View All →
            </button>
          </div>

          <div className={`grid gap-4 ${isMobileOrTablet ? 'grid-cols-1' : 'grid-cols-3'}`}>
            {salesData.deals.slice(0, 3).map((deal) => (
              <div
                key={deal.id}
                onClick={() => onViewAll?.('deal', deal)}
                className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white cursor-pointer hover:shadow-lg transition-all transform hover:scale-105"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {deal.discount}% OFF
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-blue-100">Products</div>
                    <div className="font-bold">{deal.products?.length || 0}</div>
                  </div>
                </div>

                <h3 className="text-lg font-bold mb-2">{deal.title}</h3>
                <p className="text-blue-100 text-sm mb-4">{deal.description}</p>

                {deal.expiresAt && (
                  <div className="flex items-center space-x-2 text-xs text-blue-100">
                    <span>⏰</span>
                    <span>Expires: {new Date(deal.expiresAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Discounted Products Grid */}
      {salesData?.discountedProducts?.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">💸 Best Deals</h2>
            <button
              onClick={() => onViewAll?.('discounted')}
              className="text-orange-600 font-medium hover:text-orange-700 transition-colors"
            >
              View All →
            </button>
          </div>

          <div className={`grid gap-4 ${isMobileOrTablet ? 'grid-cols-2' : 'grid-cols-4'}`}>
            {salesData.discountedProducts.slice(0, isMobileOrTablet ? 6 : 8).map((product) => (
              <ProductCard
                key={product.id || product.product_id}
                product={product}
                onProductClick={onProductClick}
                layout="grid"
              />
            ))}
          </div>
        </section>
      )}

      {/* No Sales Message */}
      {(!salesData?.flashSales?.length && !salesData?.deals?.length && !salesData?.discountedProducts?.length) && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Active Sales</h3>
          <p className="text-gray-600">Check back soon for amazing deals and discounts!</p>
        </div>
      )}
    </div>
  );
};

export default SalesSection;
