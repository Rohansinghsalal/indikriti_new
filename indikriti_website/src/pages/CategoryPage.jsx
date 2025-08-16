import { useState, useEffect } from 'react';
import { fetchProducts, fetchCategories } from '../services/enhancedApi.js';
import { useResponsive } from '../hooks/useResponsive.js';
import Layout from '../components/Layout.jsx';
import ProductCard from '../components/ProductCard.jsx';

const CategoryPage = ({ onNavigate, routeParams }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { isMobileOrTablet } = useResponsive();

  const categoryId = routeParams?.id;

  useEffect(() => {
    loadData();
  }, [categoryId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        fetchProducts({ category_id: categoryId, brand: 'indikriti' }),
        fetchCategories('indikriti')
      ]);
      
      setProducts(productsData || []);
      setCategories(categoriesData || []);
      
      // Find selected category
      const category = categoriesData?.find(c => c.id === parseInt(categoryId));
      setSelectedCategory(category);
    } catch (error) {
      console.error('Failed to load category data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (product) => {
    onNavigate?.('product', { id: product.id || product.product_id });
  };

  if (loading) {
    return (
      <Layout showBack onBack={() => onNavigate?.('home')} title="Category">
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
          <div className="container mx-auto px-4 py-6">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className={`grid gap-4 ${isMobileOrTablet ? 'grid-cols-2' : 'grid-cols-4'}`}>
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="bg-gray-200 rounded-xl h-64"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
      showBack 
      onBack={() => onNavigate?.('home')} 
      title={selectedCategory?.name || 'Category'}
    >
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4 py-6">
          {/* Category Header */}
          {selectedCategory && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100 mb-6">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">{selectedCategory.icon || '📦'}</div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{selectedCategory.name}</h1>
                  <p className="text-gray-600">
                    {products.length} product{products.length !== 1 ? 's' : ''} available
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Subcategories */}
          {selectedCategory?.subcategories?.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100 mb-6">
              <h2 className="font-semibold text-gray-800 mb-4">Subcategories</h2>
              <div className="flex flex-wrap gap-3">
                {selectedCategory.subcategories.map((sub) => (
                  <button
                    key={sub.id}
                    className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Products Grid */}
          {products.length > 0 ? (
            <div className={`grid gap-4 ${isMobileOrTablet ? 'grid-cols-2' : 'grid-cols-4'}`}>
              {products.map((product) => (
                <ProductCard
                  key={product.id || product.product_id}
                  product={product}
                  onProductClick={handleProductClick}
                  layout="grid"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📦</div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">No products found</h2>
              <p className="text-gray-600 mb-8">We couldn't find any products in this category.</p>
              <button
                onClick={() => onNavigate?.('home')}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                Browse All Products
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CategoryPage;
