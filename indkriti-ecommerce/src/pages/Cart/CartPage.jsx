import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import '../../styles/components.css';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  if (cartItems.length === 0) {
    return (
      <div className="cart-page empty-cart-page">
        <div className="container">
          <h1>Your Cart</h1>
          <div className="empty-cart-message">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <p>Your cart is empty</p>
            <p className="empty-cart-subtext">Looks like you haven't added anything to your cart yet.</p>
            <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  const cartTotal = getCartTotal();
  const shippingFee = cartTotal >= 2000 ? 0 : 100;
  const orderTotal = cartTotal + shippingFee;

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Your Cart</h1>
        
        <div className="cart-content">
          <div className="cart-items">
            <div className="cart-header">
              <span className="product-col">Product</span>
              <span className="price-col">Price</span>
              <span className="quantity-col">Quantity</span>
              <span className="total-col">Total</span>
              <span className="remove-col"></span>
            </div>
            
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="product-col">
                  <div className="product-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="product-details">
                    <h3>{item.name}</h3>
                    {item.variant && <p className="product-variant">{item.variant}</p>}
                  </div>
                </div>
                
                <div className="price-col">
                  <span className="item-price">₹{item.price}</span>
                </div>
                
                <div className="quantity-col">
                  <div className="quantity-control">
                    <button 
                      className="quantity-btn" 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button 
                      className="quantity-btn" 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="total-col">
                  <span className="item-total">₹{item.price * item.quantity}</span>
                </div>
                
                <div className="remove-col">
                  <button 
                    className="remove-item" 
                    onClick={() => removeFromCart(item.id)}
                    aria-label="Remove item"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
            
            <div className="cart-actions">
              <button className="clear-cart" onClick={clearCart}>
                Clear Cart
              </button>
              <Link to="/products" className="continue-shopping">
                Continue Shopping
              </Link>
            </div>
          </div>
          
          <div className="cart-summary">
            <h2>Order Summary</h2>
            
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{cartTotal}</span>
            </div>
            
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shippingFee === 0 ? 'Free' : `₹${shippingFee}`}</span>
            </div>
            
            {shippingFee > 0 && (
              <div className="free-shipping-message">
                Add ₹{2000 - cartTotal} more to get free shipping
              </div>
            )}
            
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{orderTotal}</span>
            </div>
            
            <div className="checkout-button-container">
              <Link to="/checkout" className="checkout-button">
                Proceed to Checkout
              </Link>
            </div>
            
            <div className="payment-methods">
              <p>We accept:</p>
              <div className="payment-icons">
                <span className="payment-icon">💳</span>
                <span className="payment-icon">🏦</span>
                <span className="payment-icon">📱</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;