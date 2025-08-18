import { useState, useEffect } from 'react';
import { useResponsive } from '../hooks/useResponsive.js';
import { fetchProductsByProductType } from '../services/enhancedApi.js';
import ProductCard from '../components/ProductCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const ProductType = ({ onNavigate, routeParams }) => {
  const {
    productTypeId,
    productTypeName,
    categoryName,
    subcategoryName
  } = routeParams || {};
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { isMobileOrTablet } = useResponsive();

  useEffect(() => {
    if (productTypeId) {
      loadProducts();
    }
  }, [productTypeId]);

  const loadProducts = async (pageNum = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const productsData = await fetchProductsByProductType(productTypeId, {
        page: pageNum,
        limit: 20
      });

      if (pageNum === 1) {
        setProducts(productsData);
      } else {
        setProducts(prev => [...prev, ...productsData]);
      }

      setHasMore(productsData.length === 20);
      setPage(pageNum);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadProducts(page + 1);
    }
  };

  if (loading && page === 1) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-red-500 text-lg mb-4">{error}</div>
            <button
              onClick={() => loadProducts()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <button
              onClick={() => onNavigate?.('home')}
              className="hover:text-blue-600 transition-colors"
            >
              Home
            </button>
            <span>›</span>
            <span className="text-gray-800">{categoryName}</span>
            {subcategoryName && (
              <>
                <span>›</span>
                <span className="text-gray-800">{subcategoryName}</span>
              </>
            )}
            <span>›</span>
            <span className="text-blue-600 font-medium">{productTypeName}</span>
          </nav>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {productTypeName}
          </h1>
          <p className="text-gray-600">
            {subcategoryName ? `${subcategoryName} › ` : ''}{categoryName} Collection
          </p>
          {products.length > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              {products.length} product{products.length !== 1 ? 's' : ''} found
            </p>
          )}
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <>
            <div className={`grid gap-6 mb-8 ${
              isMobileOrTablet 
                ? 'grid-cols-2' 
                : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
            }`}>
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onProductClick={(product) => onNavigate?.('product', { id: product.id, product })}
                  layout="grid"
                />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Loading...' : 'Load More Products'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Products Found
            </h3>
            <p className="text-gray-500 mb-6">
              We couldn't find any products in this category at the moment.
            </p>
            <button
              onClick={() => onNavigate?.('home')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Other Categories
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductType;
