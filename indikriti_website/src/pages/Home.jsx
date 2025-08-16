import { useState, useEffect } from 'react';
import { fetchProducts, fetchCategories, ENHANCED_API_CONFIG } from '../services/enhancedApi.js';
import Layout from '../components/Layout.jsx';
import ProductCard from '../components/ProductCard.jsx';
import SalesSection from '../components/sales/SalesSection.jsx';

const Home = ({ onNavigate }) => {
  // Authentication and analytics removed for public website
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Loading home page data...');
      
      const [productsData, categoriesData] = await Promise.all([
        fetchProducts({ brand: 'indikriti', limit: 20 }),
        fetchCategories('indikriti')
      ]);
      
      console.log('✅ Products loaded:', productsData?.length || 0);
      console.log('✅ Categories loaded:', categoriesData?.length || 0);
      
      setProducts(productsData || []);
      setCategories(categoriesData || []);
    } catch (error) {
      console.error('❌ Error loading home data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (product) => {
    onNavigate?.('product', { id: product.id || product.product_id });
  };

  const handleCategoryClick = (category) => {
    // Analytics removed for public website
    onNavigate?.('category', { id: category.id });
  };

  const handleViewAllSales = () => {
    onNavigate?.('sales');
  };

  if (loading) {
    return (
      <Layout currentPage="home" title="Indikriti">
        <div className="min-h-screen">
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            <div className="animate-pulse space-y-8">
              {/* Hero Banner Skeleton */}
              <div className="bg-white/50 rounded-3xl h-64 shadow-smooth"></div>
              
              {/* Categories Skeleton */}
              <div className="space-y-4">
                <div className="h-6 bg-white/50 rounded-2xl w-32"></div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white/50 rounded-2xl h-24"></div>
                  ))}
                </div>
              </div>
              
              {/* Products Skeleton */}
              <div className="space-y-4">
                <div className="h-6 bg-white/50 rounded-2xl w-40"></div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                    <div key={i} className="bg-white/50 rounded-2xl h-80"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout currentPage="home" title="Indikriti">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center p-8">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Failed to Load</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={loadData}
              className="btn-primary"
            >
              🔄 Retry
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const defaultCategories = [
    { id: 1, name: 'Handloom', icon: '🧵', color: 'from-blue-500 to-blue-600' },
    { id: 2, name: 'Handicraft', icon: '🎨', color: 'from-purple-500 to-purple-600' },
    { id: 3, name: 'Corporate Gifts', icon: '🎁', color: 'from-green-500 to-green-600' },
    { id: 4, name: 'Home Decor', icon: '🏠', color: 'from-orange-500 to-orange-600' }
  ];

  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  return (
    <Layout currentPage="home" title="Indikriti">
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-6 max-w-7xl space-y-8">
          
          {/* Hero Banner */}
          <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-600 rounded-3xl overflow-hidden shadow-glow-lg">
            <div className="relative p-8 md:p-12">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-pattern opacity-10"></div>
              
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="text-white">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gradient-primary">
                    Discover Authentic Indian Crafts
                  </h1>
                  <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
                    Handpicked handloom, handicrafts, and corporate gifts directly from skilled artisans across India.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <button 
                      onClick={() => handleCategoryClick({ id: 1, name: 'Handloom' })}
                      className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-semibold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
                    >
                      🧵 Shop Handloom
                    </button>
                    <button 
                      onClick={() => handleCategoryClick({ id: 2, name: 'Handicraft' })}
                      className="bg-blue-700 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-blue-800 transition-all transform hover:scale-105 shadow-lg border border-blue-600"
                    >
                      🎨 Handicrafts
                    </button>
                  </div>
                </div>
                
                {/* Featured Products Preview */}
                <div className="hidden lg:block">
                  <div className="glass rounded-3xl p-6">
                    <div className="grid grid-cols-2 gap-4">
                      {products.slice(0, 4).map((product, index) => (
                        <div
                          key={product.id || product.product_id}
                          className="bg-white/20 rounded-2xl p-4 cursor-pointer hover:bg-white/30 transition-all transform hover:scale-105"
                          onClick={() => handleProductClick(product)}
                        >
                          <div className="aspect-square bg-white/20 rounded-xl mb-3 overflow-hidden">
                            {product.image && (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <h4 className="text-sm font-semibold text-white line-clamp-1">{product.name}</h4>
                          <p className="text-xs text-blue-100">₹{product.discounted_price || product.price}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Environment Status (development/cloud info) */}
          {(ENHANCED_API_CONFIG.USE_MOCK_DATA || !import.meta.env.PROD || ENHANCED_API_CONFIG.IS_CLOUD_ENV) && (
            <div className="card-glass p-4">
              <div className="flex items-center">
                <span className="text-2xl mr-3">
                  {ENHANCED_API_CONFIG.IS_CLOUD_ENV ? '🌐' : ENHANCED_API_CONFIG.USE_MOCK_DATA ? '📦' : '🔧'}
                </span>
                <div>
                  <p className="font-semibold text-gray-800">
                    {ENHANCED_API_CONFIG.IS_CLOUD_ENV ? 'Cloud Demo' : ENHANCED_API_CONFIG.USE_MOCK_DATA ? 'Demo Mode' : 'Development Mode'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {ENHANCED_API_CONFIG.IS_CLOUD_ENV 
                      ? 'Running in cloud environment with sample data'
                      : ENHANCED_API_CONFIG.USE_MOCK_DATA 
                        ? 'Using sample data for demonstration' 
                        : `Environment: ${ENHANCED_API_CONFIG.ENVIRONMENT} | Products: ${products.length}`
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Categories */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="mr-3">🎯</span>
              Shop by Category
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {displayCategories.map((category) => (
                <div
                  key={category.id}
                  onClick={() => handleCategoryClick(category)}
                  className="card hover-lift cursor-pointer group overflow-hidden"
                >
                  <div className={`bg-gradient-to-br ${category.color || 'from-blue-500 to-blue-600'} p-6 text-white`}>
                    <div className="text-center">
                      <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                        {category.icon || '📦'}
                      </div>
                      <h3 className="font-bold text-lg">{category.name}</h3>
                      <p className="text-sm opacity-90 mt-1">
                        {category.subcategories?.length || 0} items
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Sales and Discounts */}
          <section>
            <SalesSection
              onProductClick={handleProductClick}
              onViewAll={handleViewAllSales}
            />
          </section>

          {/* Featured Products */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
                <span className="mr-3">✨</span>
                Featured Products
              </h2>
              <button 
                onClick={() => onNavigate?.('search')}
                className="text-blue-600 font-semibold hover:text-blue-700 transition-colors flex items-center"
              >
                View All
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.slice(0, 8).map((product) => (
                  <div key={product.id || product.product_id} className="animate-fade-in">
                    <ProductCard
                      product={product}
                      onProductClick={handleProductClick}
                      layout="grid"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-bold text-gray-600 mb-2">No Products Available</h3>
                <p className="text-gray-500">Check back later for amazing products!</p>
              </div>
            )}
          </section>

          {/* Trust Indicators */}
          <section>
            <div className="card-glass p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
                Why Choose Indikriti?
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  {
                    icon: '🏆',
                    title: 'Premium Quality',
                    description: 'Handpicked authentic products',
                    color: 'from-yellow-400 to-orange-500'
                  },
                  {
                    icon: '🚚',
                    title: 'Free Shipping',
                    description: 'On orders above ₹499',
                    color: 'from-green-400 to-green-600'
                  },
                  {
                    icon: '🔄',
                    title: 'Easy Returns',
                    description: '7-day return policy',
                    color: 'from-blue-400 to-blue-600'
                  },
                  {
                    icon: '🛡️',
                    title: 'Secure Payment',
                    description: '100% secure transactions',
                    color: 'from-purple-400 to-purple-600'
                  }
                ].map((feature, index) => (
                  <div key={index} className="text-center group">
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-glow`}>
                      <span className="text-2xl">{feature.icon}</span>
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Customer Reviews */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="mr-3">💬</span>
              Customer Reviews
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  name: 'Priya Sharma',
                  rating: 5,
                  review: 'Absolutely beautiful handloom bedsheet! The quality is exceptional and the traditional patterns are stunning.',
                  avatar: 'P',
                  color: 'from-pink-500 to-rose-500'
                },
                {
                  name: 'Rajesh Kumar',
                  rating: 4,
                  review: 'Great quality pottery set. Perfect for gifting. Fast delivery and excellent packaging.',
                  avatar: 'R',
                  color: 'from-blue-500 to-indigo-500'
                },
                {
                  name: 'Anita Devi',
                  rating: 5,
                  review: 'Amazing corporate gifts collection. Helped us with bulk orders. Highly recommended!',
                  avatar: 'A',
                  color: 'from-green-500 to-emerald-500'
                }
              ].map((review, index) => (
                <div key={index} className="card p-6 hover-lift">
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${review.color} rounded-2xl flex items-center justify-center mr-4 shadow-glow`}>
                      <span className="text-white font-bold">{review.avatar}</span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{review.name}</p>
                      <div className="text-yellow-400 text-sm">
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{review.review}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Newsletter Signup */}
          <section>
            <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-3xl p-8 text-white text-center shadow-glow-lg">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">🎉 Stay Updated!</h2>
              <p className="text-purple-100 mb-6 text-lg">Get exclusive deals and new product updates</p>
              <div className="flex max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 rounded-l-2xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button className="bg-white text-purple-600 px-8 py-4 rounded-r-2xl font-semibold hover:bg-gray-100 transition-all">
                  Subscribe
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
