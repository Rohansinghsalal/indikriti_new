import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../context/NotificationContext';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { showSuccess, showError } = useNotification();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'cod'
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Redirect to cart if cart is empty
    if (cartItems.length === 0) {
      navigate('/cart');
    }
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [cartItems, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'pincode'];
    requiredFields.forEach(field => {
      if (!formData[field].trim()) {
        newErrors[field] = 'This field is required';
      }
    });
    
    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone validation
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    // Pincode validation
    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showError('Please fix the errors in the form');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Order successful
      showSuccess('Order placed successfully!');
      clearCart();
      navigate('/order-confirmation');
    } catch (error) {
      showError('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const cartTotal = getCartTotal();
  const shippingFee = cartTotal >= 2000 ? 0 : 100;
  const orderTotal = cartTotal + shippingFee;

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>Checkout</h1>
        
        <div className="checkout-content">
          <div className="checkout-form-container">
            <form onSubmit={handleSubmit} className="checkout-form">
              <h2>Shipping Information</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={errors.firstName ? 'error' : ''}
                  />
                  {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="lastName">Last Name *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={errors.lastName ? 'error' : ''}
                  />
                  {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">Phone *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={errors.phone ? 'error' : ''}
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="address">Address *</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={errors.address ? 'error' : ''}
                />
                {errors.address && <span className="error-message">{errors.address}</span>}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={errors.city ? 'error' : ''}
                  />
                  {errors.city && <span className="error-message">{errors.city}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="state">State *</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={errors.state ? 'error' : ''}
                  />
                  {errors.state && <span className="error-message">{errors.state}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="pincode">Pincode *</label>
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    className={errors.pincode ? 'error' : ''}
                  />
                  {errors.pincode && <span className="error-message">{errors.pincode}</span>}
                </div>
              </div>
              
              <h2>Payment Method</h2>
              
              <div className="payment-methods">
                <div className="payment-method">
                  <input
                    type="radio"
                    id="cod"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleChange}
                  />
                  <label htmlFor="cod">Cash on Delivery</label>
                </div>
                
                <div className="payment-method">
                  <input
                    type="radio"
                    id="card"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleChange}
                  />
                  <label htmlFor="card">Credit/Debit Card</label>
                </div>
                
                <div className="payment-method">
                  <input
                    type="radio"
                    id="upi"
                    name="paymentMethod"
                    value="upi"
                    checked={formData.paymentMethod === 'upi'}
                    onChange={handleChange}
                  />
                  <label htmlFor="upi">UPI</label>
                </div>
              </div>
              
              <button 
                type="submit" 
                className="checkout-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </div>
          
          <div className="order-summary">
            <h2>Order Summary</h2>
            
            <div className="order-items">
              {cartItems.map(item => (
                <div key={item.id} className="order-item">
                  <div className="item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    {item.variant && <p className="item-variant">{item.variant}</p>}
                    <div className="item-price-qty">
                      <span>₹{item.price} × {item.quantity}</span>
                    </div>
                  </div>
                  <div className="item-total">
                    ₹{item.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="order-totals">
              <div className="subtotal">
                <span>Subtotal</span>
                <span>₹{cartTotal}</span>
              </div>
              
              <div className="shipping">
                <span>Shipping</span>
                <span>{shippingFee === 0 ? 'Free' : `₹${shippingFee}`}</span>
              </div>
              
              <div className="total">
                <span>Total</span>
                <span>₹{orderTotal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;