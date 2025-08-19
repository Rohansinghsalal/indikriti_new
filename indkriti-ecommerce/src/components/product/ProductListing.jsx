import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import '../../styles/components.css';

const ProductListing = ({ title, category, limit }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Construct the API URL with query parameters
        let url = 'http://localhost:5001/api/products';
        const params = new URLSearchParams();
        
        if (category) params.append('category', category);
        if (limit) params.append('limit', limit.toString());
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.statusText}`);
        }
        
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
        // Fallback data for development
        setProducts([
          {
            id: 1,
            name: 'Hand Block Print Mul Dohar - Penguin Blue',
            price: 1800,
            originalPrice: 3000,
            discount: 40,
            image: '/assets/images/products/dohar-blue.jpg',
            category: 'bedding'
          },
          {
            id: 2,
            name: 'Double Bed Reversible Mul Dohar - Abstract Orange',
            price: 2495,
            originalPrice: 2495,
            discount: 0,
            image: '/assets/images/products/dohar-orange.jpg',
            category: 'bedding'
          },
          {
            id: 3,
            name: 'Handcrafted Cotton Bedsheet with Pillow Covers',
            price: 1299,
            originalPrice: 1999,
            discount: 35,
            image: '/assets/images/products/bedsheet.jpg',
            category: 'bedding'
          },
          {
            id: 4,
            name: 'Decorative Wall Hanging - Madhubani Art',
            price: 899,
            originalPrice: 1299,
            discount: 30,
            image: '/assets/images/products/wall-hanging.jpg',
            category: 'decor'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, limit]);

  if (loading) {
    return <div className="products-loading">Loading products...</div>;
  }

  if (error && products.length === 0) {
    return <div className="products-error">Error loading products: {error}</div>;
  }

  return (
    <section className="products-section">
      {title && <h2 className="section-title">{title}</h2>}
      
      <div className="products-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductListing;