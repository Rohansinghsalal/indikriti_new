import { useCart } from '../context/CartContext.jsx';
import { useResponsive } from '../hooks/useResponsive.js';
import Layout from '../components/Layout.jsx';
import ProductCard from '../components/ProductCard.jsx';

const Wishlist = ({ onNavigate }) => {
  const { 
    wishlistItems, 
    removeFromWishlist, 
    moveToCart, 
    clearWishlist 
  } = useCart();
  const { isMobileOrTablet } = useResponsive();

  const handleProductClick = (product) => {
    onNavigate?.('product', { id: product.id || product.product_id });
  };

  if (wishlistItems.length === 0) {
    return (
      <Layout currentPage="wishlist" title="Wishlist">
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-16">
              <div className="text-6xl mb-4">💙</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Your wishlist is empty</h2>
              <p className="text-gray-600 mb-8">Save items you love by clicking the heart icon.</p>
              <button
                onClick={() => onNavigate?.('home')}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                Discover Products
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentPage="wishlist" title="Wishlist">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">My Wishlist</h1>
              <p className="text-gray-600">{wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved</p>
            </div>
            {wishlistItems.length > 0 && (
              <button
                onClick={clearWishlist}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Clear Wishlist
              </button>
            )}
          </div>

          {/* Wishlist Actions */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-100 mb-6">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  wishlistItems.forEach(item => {
                    moveToCart(item.id || item.product_id, 1);
                  });
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Move All to Cart
              </button>
              <button
                onClick={() => onNavigate?.('home')}
                className="bg-white text-blue-600 border border-blue-200 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>

          {/* Wishlist Items Grid */}
          <div className={`grid gap-4 ${isMobileOrTablet ? 'grid-cols-2' : 'grid-cols-4'}`}>
            {wishlistItems.map((item) => (
              <div key={item.id || item.product_id} className="relative">
                <ProductCard
                  product={item}
                  onProductClick={handleProductClick}
                  layout="grid"
                />
                
                {/* Wishlist Actions Overlay */}
                <div className="absolute top-2 left-2 space-y-2">
                  <button
                    onClick={() => moveToCart(item.id || item.product_id, 1)}
                    className="bg-blue-600 text-white p-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors text-sm"
                    title="Move to Cart"
                  >
                    🛒
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Recently Viewed */}
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Recently Viewed</h2>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">👀</div>
                <p>Your recently viewed products will appear here</p>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">You might also like</h2>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">💡</div>
                <p>Product recommendations based on your wishlist</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Wishlist;
