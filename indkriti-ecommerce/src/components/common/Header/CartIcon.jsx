import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';

const CartIcon = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartItems, removeFromCart, updateQuantity, getCartCount, getCartTotal } = useCart();

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const cartCount = getCartCount();
  const cartTotal = getCartTotal();

  return (
    <div className="cart-icon-container">
      <button 
        className="cart-icon" 
        onClick={toggleCart}
        aria-label="Shopping cart"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
      </button>

      {isCartOpen && (
        <div className="cart-dropdown">
          <div className="cart-header">
            <h3>Your Cart ({cartCount} items)</h3>
            <button 
              className="close-cart" 
              onClick={toggleCart}
              aria-label="Close cart"
            >
              ×
            </button>
          </div>

          {cartItems.length > 0 ? (
            <>
              <ul className="cart-items">
                {cartItems.map(item => (
                  <li key={item.id} className="cart-item">
                    <div className="item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <div className="item-price-qty">
                        <span className="item-price">₹{item.price}</span>
                        <div className="item-quantity-control">
                          <button 
                            className="qty-btn" 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="item-quantity">Qty: {item.quantity}</span>
                          <button 
                            className="qty-btn" 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    <button 
                      className="remove-item" 
                      aria-label="Remove item"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>

              <div className="cart-footer">
                <div className="cart-total">
                  <span>Total:</span>
                  <span>₹{cartTotal}</span>
                </div>
                <div className="cart-actions">
                  <Link to="/cart" className="view-cart-btn" onClick={toggleCart}>
                    View Cart
                  </Link>
                  <Link to="/checkout" className="checkout-btn" onClick={toggleCart}>
                    Checkout
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <div className="empty-cart">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <p>Your cart is empty</p>
              <Link to="/products" className="continue-shopping" onClick={toggleCart}>
                Continue Shopping
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CartIcon;