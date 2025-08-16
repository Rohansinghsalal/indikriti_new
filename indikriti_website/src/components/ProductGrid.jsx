import { useState, useEffect } from 'react';
import { fetchProducts, fetchProductsByCategory, searchProducts } from '../services/api.js';
import ProductCard from './ProductCard.jsx';

const ProductGrid = ({ selectedCategory, searchQuery, onProductClick }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let data;
        if (searchQuery && searchQuery.trim()) {
          data = await searchProducts(searchQuery);
        } else if (selectedCategory && selectedCategory !== 'all') {
          data = await fetchProductsByCategory(selectedCategory);
        } else {
          data = await fetchProducts();
        }

        setProducts(data);
      } catch (err) {
        setError('Failed to load products');
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [selectedCategory, searchQuery]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse"
          >
            <div className="h-36 bg-gray-200" />
            <div className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-3 bg-gray-200 rounded mb-2 w-3/4" />
              <div className="h-4 bg-gray-200 rounded mb-3 w-1/2" />
              <div className="h-10 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Try again
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg mb-2">No products found</p>
        {searchQuery && (
          <p className="text-gray-400 text-sm">
            Try different search terms or browse categories
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {products.map((product, index) => (
        <div
          key={product.product_id}
          style={{
            animationDelay: `${index * 0.1}s`,
          }}
          className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
        >
          <ProductCard product={product} onProductClick={onProductClick} />
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
