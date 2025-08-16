import { useState, useEffect } from 'react';
import { searchProducts } from '../services/enhancedApi.js';
import { useResponsive } from '../hooks/useResponsive.js';
import { useAnalytics } from '../hooks/useAnalytics.js';
import Layout from '../components/Layout.jsx';
import ProductCard from '../components/ProductCard.jsx';

const SearchPage = ({ onNavigate, routeParams }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { isMobileOrTablet } = useResponsive();
  const { trackSearch } = useAnalytics();

  const initialQuery = routeParams?.q || '';

  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery);
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = async (query = searchQuery) => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      setHasSearched(true);
      const results = await searchProducts(query);
      setSearchResults(results || []);
      trackSearch(query, results);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (product) => {
    onNavigate?.('product', { id: product.id || product.product_id });
  };

  const popularSearches = [
    'Handloom sarees',
    'Pottery sets',
    'Corporate gifts',
    'Home decor',
    'Traditional crafts',
    'Textile products'
  ];

  return (
    <Layout showBack onBack={() => onNavigate?.('home')} title="Search">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4 py-6">
          {/* Search Bar */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100 mb-6">
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </div>
              </div>
              <button
                onClick={() => handleSearch()}
                disabled={loading || !searchQuery.trim()}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>

          {/* Search Results */}
          {hasSearched ? (
            <>
              {/* Results Header */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  {loading ? 'Searching...' : `Search Results for "${searchQuery}"`}
                </h2>
                {!loading && (
                  <p className="text-gray-600">
                    {searchResults.length} product{searchResults.length !== 1 ? 's' : ''} found
                  </p>
                )}
              </div>

              {/* Loading State */}
              {loading && (
                <div className={`grid gap-4 ${isMobileOrTablet ? 'grid-cols-2' : 'grid-cols-4'}`}>
                  {[1,2,3,4,5,6].map(i => (
                    <div key={i} className="bg-gray-200 rounded-xl h-64 animate-pulse"></div>
                  ))}
                </div>
              )}

              {/* Results Grid */}
              {!loading && searchResults.length > 0 && (
                <div className={`grid gap-4 ${isMobileOrTablet ? 'grid-cols-2' : 'grid-cols-4'}`}>
                  {searchResults.map((product) => (
                    <ProductCard
                      key={product.id || product.product_id}
                      product={product}
                      onProductClick={handleProductClick}
                      layout="grid"
                    />
                  ))}
                </div>
              )}

              {/* No Results */}
              {!loading && searchResults.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">No products found</h3>
                  <p className="text-gray-600 mb-8">
                    We couldn't find any products matching "{searchQuery}". Try searching with different keywords.
                  </p>
                  
                  {/* Search Suggestions */}
                  <div className="max-w-md mx-auto">
                    <h4 className="font-semibold text-gray-800 mb-3">Try these popular searches:</h4>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {popularSearches.map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => {
                            setSearchQuery(suggestion);
                            handleSearch(suggestion);
                          }}
                          className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm hover:bg-blue-200 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Initial State - No Search Yet */
            <div className="space-y-8">
              {/* Popular Searches */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Popular Searches</h2>
                <div className="flex flex-wrap gap-3">
                  {popularSearches.map((search) => (
                    <button
                      key={search}
                      onClick={() => {
                        setSearchQuery(search);
                        handleSearch(search);
                      }}
                      className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Tips */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Search Tips</h2>
                <div className="space-y-3 text-gray-600">
                  <div className="flex items-start space-x-3">
                    <span className="text-blue-600">💡</span>
                    <p>Use specific keywords like "handloom saree" or "pottery vase"</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-blue-600">🔍</span>
                    <p>Try different spellings or synonyms</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-blue-600">📂</span>
                    <p>Browse categories for inspiration</p>
                  </div>
                </div>
              </div>

              {/* Recent Searches (if any) */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Start Exploring</h2>
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🛍️</div>
                  <p className="text-gray-600 mb-6">
                    Discover authentic Indian handloom and handicraft products
                  </p>
                  <button
                    onClick={() => onNavigate?.('home')}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
                  >
                    Browse All Products
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SearchPage;
