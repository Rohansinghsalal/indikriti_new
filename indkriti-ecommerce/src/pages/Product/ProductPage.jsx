import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import '../../styles/components.css';

const ProductPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5001/api/products/${id}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch product: ${response.statusText}`);
        }
        
        const data = await response.json();
        setProduct(data);
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message);
        // Fallback data for development
        setProduct({
          id: parseInt(id),
          name: 'Hand Block Print Mul Dohar - Penguin Blue',
          description: 'Our signature hand block printed mul cotton dohar is lightweight and perfect for all seasons. The dohar is made with three layers of mul cotton fabric making it breathable and comfortable. The fabric gets softer with every wash.',
          price: 1800,
          originalPrice: 3000,
          discount: 40,
          image: '/assets/images/products/dohar-blue.jpg',
          images: [
            '/assets/images/products/dohar-blue.jpg',
            '/assets/images/products/dohar-blue-2.jpg',
            '/assets/images/products/dohar-blue-3.jpg'
          ],
          category: 'bedding',
          variants: [
            { id: 1, name: 'Single', price: 1800 },
            { id: 2, name: 'Double', price: 2200 }
          ],
          features: [
            'Handcrafted with love',
            '100% cotton',
            'Breathable fabric',
            'Gets softer with every wash',
            'Reversible design'
          ],
          specifications: {
            'Material': '100% Cotton',
            'Dimensions': '90 x 108 inches (Double)',
            'Weight': '800 grams',
            'Care': 'Machine wash cold, Tumble dry low',
            'Made in': 'India'
          },
          inStock: true,
          rating: 4.5,
          reviewCount: 28
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [id]);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
  };

  const handleAddToCart = () => {
    const productToAdd = {
      ...product,
      price: selectedVariant ? selectedVariant.price : product.price,
      variant: selectedVariant ? selectedVariant.name : null,
      quantity: quantity
    };
    
    addToCart(productToAdd);
    setIsAdded(true);
    
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="product-page loading">
        <div className="container">
          <div className="loading-spinner"></div>
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-page error">
        <div className="container">
          <h2>Error Loading Product</h2>
          <p>{error || 'Product not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-page">
      <div className="container">
        <div className="product-details">
          <div className="product-gallery">
            <div className="main-image">
              <img src={product.image} alt={product.name} />
            </div>
            {product.images && product.images.length > 0 && (
              <div className="thumbnail-images">
                {product.images.map((img, index) => (
                  <div key={index} className="thumbnail">
                    <img src={img} alt={`${product.name} - view ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="product-info">
            <h1 className="product-title">{product.name}</h1>
            
            <div className="product-price-container">
              <span className="product-price">₹{selectedVariant ? selectedVariant.price : product.price}</span>
              {product.originalPrice > (selectedVariant ? selectedVariant.price : product.price) && (
                <>
                  <span className="product-original-price">₹{product.originalPrice}</span>
                  <span className="product-discount">({product.discount}% OFF)</span>
                </>
              )}
            </div>
            
            {product.rating && (
              <div className="product-rating">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < Math.floor(product.rating) ? 'star filled' : 'star'}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="rating-value">{product.rating}</span>
                <span className="review-count">({product.reviewCount} reviews)</span>
              </div>
            )}
            
            <div className="product-description">
              <p>{product.description}</p>
            </div>
            
            {product.variants && product.variants.length > 0 && (
              <div className="product-variants">
                <h3>Variants</h3>
                <div className="variant-options">
                  {product.variants.map(variant => (
                    <button
                      key={variant.id}
                      className={`variant-option ${selectedVariant && selectedVariant.id === variant.id ? 'selected' : ''}`}
                      onClick={() => handleVariantChange(variant)}
                    >
                      {variant.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="product-actions">
              <div className="quantity-selector">
                <button 
                  className="quantity-btn" 
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="quantity">{quantity}</span>
                <button 
                  className="quantity-btn" 
                  onClick={() => handleQuantityChange(quantity + 1)}
                >
                  +
                </button>
              </div>
              
              <button 
                className={`add-to-cart-btn ${isAdded ? 'added' : ''}`}
                onClick={handleAddToCart}
                disabled={!product.inStock || isAdded}
              >
                {!product.inStock ? 'Out of Stock' : isAdded ? 'Added to Cart ✓' : 'Add to Cart'}
              </button>
            </div>
            
            {product.features && product.features.length > 0 && (
              <div className="product-features">
                <h3>Features</h3>
                <ul>
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        
        {product.specifications && (
          <div className="product-specifications">
            <h2>Specifications</h2>
            <table>
              <tbody>
                {Object.entries(product.specifications).map(([key, value]) => (
                  <tr key={key}>
                    <th>{key}</th>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;