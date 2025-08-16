import { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useResponsive } from '../hooks/useResponsive.js';
import { searchProducts } from '../services/enhancedApi.js';

const Header = ({ title = 'Indikriti', onSearch, onNavigate, showBack = false, onBack }) => {
  const { getCartItemsCount } = useCart();
  const { isMobileOrTablet } = useResponsive();
  
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const cartCount = getCartItemsCount();

  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (query.length > 2) {
      try {
        const results = await searchProducts(query);
        setSearchResults(results);
        setShowSearchResults(true);
      } catch (error) {
        console.error('Search failed:', error);
      }
    } else {
      setShowSearchResults(false);
    }
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      onSearch?.(searchQuery);
      setShowSearch(false);
      setShowSearchResults(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="bg-white shadow-lg border-b sticky top-0 z-50">
      {/* Top notification bar */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 text-white text-center py-2">
        <div className="text-sm font-medium px-4">
          <span>🚚 Free shipping on orders above ₹499 • 📞 +91-9876543210 • ✨ Authentic Indian Crafts</span>
        </div>
      </div>

      {/* Main header */}
      <div className="px-4 py-3">
        {showSearch ? (
          /* Search Mode */
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setShowSearch(false);
                setShowSearchResults(false);
                setSearchQuery('');
              }}
              className="text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search products, categories..."
                className="w-full px-4 py-3 pr-12 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50/50"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
                autoFocus
              />
              <button
                onClick={handleSearchSubmit}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 p-1 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          /* Normal Mode */
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {showBack ? (
                <button
                  onClick={onBack}
                  className="text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">I</span>
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold text-gray-800">{title}</h1>
                {!showBack && (
                  <p className="text-xs text-blue-600 font-medium">Authentic Indian Crafts</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Search button */}
              <button
                onClick={() => setShowSearch(true)}
                className="p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all transform hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Cart button */}
              <button
                onClick={() => onNavigate?.('cart')}
                className="p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all transform hover:scale-105 relative"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5-5M7 13l-2.5 5M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg animate-pulse">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </button>

              {/* Info button - no login required */}
              <div className="relative">
                <button
                  onClick={() => window.open('tel:+919876543210', '_self')}
                  className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center text-white font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  title="Call us for support"
                >
                  📞
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search Results Dropdown */}
        {showSearchResults && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-xl mt-1 mx-4 max-h-96 overflow-y-auto z-40">
            <div className="p-3">
              <div className="text-sm text-gray-500 mb-3 font-medium">
                Found {searchResults.length} products
              </div>
              {searchResults.slice(0, 6).map((product) => (
                <div
                  key={product.id || product.product_id}
                  className="flex items-center space-x-3 p-3 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
                  onClick={() => {
                    onNavigate?.('product', product);
                    setShowSearchResults(false);
                    setShowSearch(false);
                    setSearchQuery('');
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm text-gray-800">{product.name}</div>
                    <div className="text-xs text-blue-600 font-semibold">
                      ₹{product.discounted_price || product.price}
                    </div>
                  </div>
                </div>
              ))}
              {searchResults.length > 6 && (
                <div
                  className="text-center p-3 text-blue-600 hover:bg-blue-50 cursor-pointer text-sm font-medium rounded-lg"
                  onClick={handleSearchSubmit}
                >
                  View all {searchResults.length} results →
                </div>
              )}
            </div>
          </div>
        )}

        {/* Category quick access (only on home) */}
        {!showSearch && !showBack && title === 'Indikriti' && (
          <div className="pt-4">
            <div className="flex space-x-3 overflow-x-auto scrollbar-hide pb-2">
              <button
                onClick={() => onNavigate?.('category', { id: 1, name: 'Handloom' })}
                className="flex-shrink-0 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 px-4 py-2 rounded-full text-sm font-medium hover:from-blue-200 hover:to-blue-300 transition-all transform hover:scale-105"
              >
                Handloom
              </button>
              <button
                onClick={() => onNavigate?.('category', { id: 2, name: 'Handicraft' })}
                className="flex-shrink-0 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 px-4 py-2 rounded-full text-sm font-medium hover:from-purple-200 hover:to-purple-300 transition-all transform hover:scale-105"
              >
                🎨 Handicraft
              </button>
              <button
                onClick={() => onNavigate?.('category', { id: 3, name: 'Corporate Gifts' })}
                className="flex-shrink-0 bg-gradient-to-r from-green-100 to-green-200 text-green-700 px-4 py-2 rounded-full text-sm font-medium hover:from-green-200 hover:to-green-300 transition-all transform hover:scale-105"
              >
                🎁 Corporate
              </button>
              <button
                onClick={() => onNavigate?.('sales')}
                className="flex-shrink-0 bg-gradient-to-r from-red-100 to-red-200 text-red-700 px-4 py-2 rounded-full text-sm font-medium hover:from-red-200 hover:to-red-300 transition-all transform hover:scale-105"
              >
                🔥 Sale
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close search results */}
      {showSearchResults && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowSearchResults(false)}
        />
      )}
    </header>
  );
};

export default Header;
