import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useResponsive } from '../hooks/useResponsive.js';
import { useAnalytics } from '../hooks/useAnalytics.js';
import { fetchProducts } from '../services/enhancedApi.js';
import Layout from '../components/Layout.jsx';

const ProductDetail = ({ onNavigate, routeParams }) => {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const { isMobileOrTablet } = useResponsive();
  const { trackViewProduct, trackAddToCart } = useAnalytics();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const productId = routeParams?.id;
  const inWishlist = product ? isInWishlist(product.id || product.product_id) : false;

  useEffect(() => {
    if (productId) {
      loadProduct();
    }
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      // In a real app, you'd fetch single product
      const products = await fetchProducts();
      const foundProduct = products.find(p => 
        (p.id || p.product_id) === productId || 
        (p.id || p.product_id) === parseInt(productId)
      );
      
      if (foundProduct) {
        setProduct(foundProduct);
        trackViewProduct(foundProduct);
      }
    } catch (error) {
      console.error('Failed to load product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      trackAddToCart(product, quantity);
    }
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    
    const productId = product.id || product.product_id;
    if (inWishlist) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(product);
    }
  };

  if (loading) {
    return (
      <Layout showBack onBack={() => onNavigate?.('home')} title="Product">
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
          <div className="container mx-auto px-4 py-6">
            <div className="animate-pulse space-y-6">
              <div className="bg-gray-200 rounded-xl h-64"></div>
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout showBack onBack={() => onNavigate?.('home')} title="Product">
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
          <div className="container mx-auto px-4 py-8 text-center">
            <div className="text-4xl mb-4">📦</div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Product not found</h2>
            <button
              onClick={() => onNavigate?.('home')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const discountPercentage = product.price && product.discounted_price 
    ? Math.round(((product.price - product.discounted_price) / product.price) * 100)
    : 0;

  return (
    <Layout showBack onBack={() => onNavigate?.('home')} title={product.name}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4 py-6">
          <div className={`grid gap-8 ${isMobileOrTablet ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {/* Product Images */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-100">
                <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden relative">
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {discountPercentage > 0 && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      -{discountPercentage}% OFF
                    </div>
                  )}
                  <button
                    onClick={handleWishlistToggle}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-colors ${
                      inWishlist ? 'bg-red-100 text-red-500' : 'bg-white/70 text-gray-600 hover:text-red-500'
                    }`}
                  >
                    {inWishlist ? '❤️' : '🤍'}
                  </button>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
                <h1 className="text-2xl font-bold text-gray-800 mb-3">{product.name}</h1>
                
                {/* Rating */}
                {product.rating && (
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex text-yellow-400">
                      {'★'.repeat(Math.floor(product.rating))}
                      {'☆'.repeat(5 - Math.floor(product.rating))}
                    </div>
                    <span className="text-sm text-gray-600">
                      ({product.reviewCount || 0} reviews)
                    </span>
                  </div>
                )}

                {/* Price */}
                <div className="flex items-center space-x-3 mb-6">
                  <span className="text-3xl font-bold text-blue-600">
                    ₹{product.discounted_price || product.price}
                  </span>
                  {discountPercentage > 0 && (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        ₹{product.price}
                      </span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                        Save ₹{product.price - product.discounted_price}
                      </span>
                    </>
                  )}
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description || product.long_description || 'No description available.'}
                  </p>
                </div>

                {/* Quantity Selector */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    >
                      −
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-lg bg-blue-100 hover:bg-blue-200 flex items-center justify-center transition-colors text-blue-600"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-medium hover:bg-blue-700 transition-colors text-lg"
                >
                  Add to Cart - ₹{((product.discounted_price || product.price) * quantity).toFixed(2)}
                </button>

                {/* Product Features */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl mb-1">🚚</div>
                    <div className="text-sm font-medium text-gray-800">Free Shipping</div>
                    <div className="text-xs text-gray-600">On orders above ₹499</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl mb-1">🔄</div>
                    <div className="text-sm font-medium text-gray-800">Easy Returns</div>
                    <div className="text-xs text-gray-600">7-day return policy</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden">
            <div className="border-b border-gray-200">
              <div className="flex">
                <button className="px-6 py-4 font-medium text-blue-600 border-b-2 border-blue-600">
                  Details
                </button>
                <button className="px-6 py-4 font-medium text-gray-500 hover:text-gray-700">
                  Reviews
                </button>
                <button className="px-6 py-4 font-medium text-gray-500 hover:text-gray-700">
                  Shipping
                </button>
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-semibold text-gray-800 mb-3">Product Specifications</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Brand:</span>
                  <span className="ml-2 text-gray-800">{product.brand || 'Indikriti'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Category:</span>
                  <span className="ml-2 text-gray-800">{product.category || 'Handcraft'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Material:</span>
                  <span className="ml-2 text-gray-800">Authentic Handloom</span>
                </div>
                <div>
                  <span className="text-gray-600">Origin:</span>
                  <span className="ml-2 text-gray-800">Made in India</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
