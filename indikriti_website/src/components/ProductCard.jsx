import { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useAnalytics } from '../hooks/useAnalytics.js';
import { useResponsive } from '../hooks/useResponsive.js';

const ProductCard = ({ product, onProductClick, layout = 'grid' }) => {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const { user } = useAuth();
  const { trackViewProduct } = useAnalytics();
  const { isMobileOrTablet } = useResponsive();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showAddedToCart, setShowAddedToCart] = useState(false);
  
  const productId = product.id || product.product_id;
  const inWishlist = isInWishlist(productId);
  
  const handleProductClick = () => {
    trackViewProduct(product);
    onProductClick?.(product);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    setIsLoading(true);
    
    try {
      addToCart(product, 1);
      setShowAddedToCart(true);
      setTimeout(() => setShowAddedToCart(false), 2000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    
    if (inWishlist) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(product);
    }
  };

  const discountPercentage = product.price && product.discounted_price 
    ? Math.round(((product.price - product.discounted_price) / product.price) * 100)
    : 0;

  const price = product.discounted_price || product.price || 0;
  const originalPrice = product.price || 0;

  if (layout === 'list') {
    return (
      <div
        onClick={handleProductClick}
        className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
      >
        <div className="flex space-x-4">
          {/* Product Image */}
          <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden relative">
            {product.image ? (
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
              No Image
            </div>
            
            {discountPercentage > 0 && (
              <div className="absolute top-1 left-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded">
                -{discountPercentage}%
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm text-gray-800 line-clamp-2 mb-1">
              {product.name}
            </h3>
            
            <p className="text-xs text-gray-600 line-clamp-1 mb-2">
              {product.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm text-gray-900">₹{price}</span>
                {discountPercentage > 0 && (
                  <span className="text-xs text-gray-500 line-through">₹{originalPrice}</span>
                )}
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={handleWishlistToggle}
                  className={`p-1.5 rounded-full transition-colors ${
                    inWishlist 
                      ? 'text-red-500 bg-red-50' 
                      : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                  }`}
                >
                  {inWishlist ? '❤️' : '🤍'}
                </button>
                
                <button
                  onClick={handleAddToCart}
                  disabled={isLoading}
                  className="bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  {isLoading ? '...' : showAddedToCart ? '✓' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid layout (default)
  return (
    <div
      onClick={handleProductClick}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100 overflow-hidden"
    >
      {/* Product Image */}
      <div className="relative">
        <div className={`${isMobileOrTablet ? 'h-40' : 'h-48'} bg-gray-200 flex items-center justify-center overflow-hidden relative`}>
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
            No Image
          </div>
          
          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              -{discountPercentage}%
            </div>
          )}
          
          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-sm transition-colors ${
              inWishlist 
                ? 'text-red-500 bg-white/90' 
                : 'text-gray-600 bg-white/70 hover:text-red-500 hover:bg-white/90'
            }`}
          >
            {inWishlist ? '❤️' : '🤍'}
          </button>
          
          {/* Quick Add Button */}
          <button
            onClick={handleAddToCart}
            disabled={isLoading}
            className={`absolute bottom-2 right-2 bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-600 transition-all transform hover:scale-105 disabled:opacity-50 ${
              showAddedToCart ? 'bg-green-500' : ''
            }`}
          >
            {isLoading ? '...' : showAddedToCart ? '✓ Added' : '+ Add'}
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3">
        <h3 className="font-medium text-sm text-gray-800 line-clamp-2 mb-2">
          {product.name}
        </h3>
        
        <p className="text-xs text-gray-600 line-clamp-2 mb-3">
          {product.description}
        </p>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center space-x-1 mb-2">
            <div className="flex text-yellow-400 text-xs">
              {'★'.repeat(Math.floor(product.rating))}
              {'☆'.repeat(5 - Math.floor(product.rating))}
            </div>
            <span className="text-xs text-gray-500">
              ({product.reviewCount || 0})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-gray-900">₹{price}</span>
            {discountPercentage > 0 && (
              <span className="text-sm text-gray-500 line-through">₹{originalPrice}</span>
            )}
          </div>
          
          {/* Brand/Category */}
          {(product.brand || product.category) && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {product.brand || product.category}
            </span>
          )}
        </div>

        {/* Add to Cart Button (Full Width) */}
        <button
          onClick={handleAddToCart}
          disabled={isLoading}
          className={`w-full mt-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            showAddedToCart
              ? 'bg-green-500 text-white'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isLoading ? 'Adding...' : showAddedToCart ? '✓ Added to Cart' : '🛒 Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
