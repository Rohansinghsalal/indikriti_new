import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import '../../styles/components.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setIsAdded(true);
    
    // Reset the added state after 2 seconds
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  if (!product) return null;

  return (
    <div className="product-card">
      <div className="product-image">
        <Link to={`/products/${product.id}`}>
          <img src={product.image} alt={product.name} />
        </Link>
        {product.discount > 0 && (
          <span className="discount-badge">-{product.discount}%</span>
        )}
      </div>
      
      <div className="product-info">
        <h3 className="product-title">
          <Link to={`/products/${product.id}`}>{product.name}</Link>
        </h3>
        
        <div className="product-price">
          <span className="current-price">₹{product.price}</span>
          {product.originalPrice > product.price && (
            <span className="original-price">₹{product.originalPrice}</span>
          )}
        </div>
        
        <button 
          className={`btn ${isAdded ? 'btn-success' : 'btn-primary'}`}
          onClick={handleAddToCart}
          disabled={isAdded}
        >
          {isAdded ? 'Added! ✓' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;