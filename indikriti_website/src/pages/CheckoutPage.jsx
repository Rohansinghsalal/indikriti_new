import { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useResponsive } from '../hooks/useResponsive.js';
import { useAnalytics } from '../hooks/useAnalytics.js';
import { createOrder, redeemWalletAmount } from '../services/enhancedApi.js';
import Layout from '../components/Layout.jsx';
import WalletRedemption from '../components/checkout/WalletRedemption.jsx';

const CheckoutPage = ({ onNavigate, routeParams }) => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user, updateWalletBalance } = useAuth();
  const { isMobileOrTablet } = useResponsive();
  const { trackPurchase } = useAnalytics();
  
  const [walletAmount, setWalletAmount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState(null);
  
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    phone: user?.mobileNumber || '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const cartTotal = getCartTotal();
  const shipping = cartTotal > 499 ? 0 : 40;
  const finalAmount = cartTotal - walletAmount + shipping;

  const handleAddressChange = (field, value) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
  };

  const validateAddress = () => {
    const required = ['fullName', 'phone', 'address', 'city', 'state', 'pincode'];
    return required.every(field => shippingAddress[field].trim());
  };

  const handlePlaceOrder = async () => {
    if (!validateAddress()) {
      alert('Please fill all address fields');
      return;
    }

    try {
      setIsProcessing(true);

      // Create order
      const orderData = {
        items: cartItems,
        shippingAddress,
        total: finalAmount,
        walletUsed: walletAmount,
        paymentMethod: 'cod' // Cash on delivery for demo
      };

      const orderResult = await createOrder(orderData);
      
      if (orderResult.success) {
        const newOrderId = orderResult.order.id;
        setOrderId(newOrderId);

        // Redeem wallet amount if used
        if (walletAmount > 0) {
          const redeemResult = await redeemWalletAmount(user.id, walletAmount, newOrderId);
          if (redeemResult.success) {
            updateWalletBalance(redeemResult.newBalance);
          }
        }

        // Track purchase
        trackPurchase({
          id: newOrderId,
          total: finalAmount,
          items: cartItems,
          paymentMethod: 'cod',
          walletUsed: walletAmount
        });

        // Clear cart and show success
        clearCart();
        setOrderComplete(true);
      } else {
        throw new Error('Order creation failed');
      }
    } catch (error) {
      console.error('Order placement failed:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderComplete) {
    return (
      <Layout showBack onBack={() => onNavigate?.('home')} title="Order Confirmed">
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <div className="bg-white rounded-xl p-8 shadow-sm border border-blue-100 max-w-md mx-auto">
                <div className="text-6xl mb-4">🎉</div>
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Order Confirmed!</h1>
                <p className="text-gray-600 mb-6">
                  Your order #{orderId} has been placed successfully.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => onNavigate?.('profile')}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
                  >
                    View Orders
                  </button>
                  <button
                    onClick={() => onNavigate?.('home')}
                    className="w-full bg-white text-blue-600 border border-blue-200 py-3 rounded-xl font-medium hover:bg-blue-50 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Layout showBack onBack={() => onNavigate?.('cart')} title="Checkout">
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <div className="text-6xl mb-4">🛒</div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
              <button
                onClick={() => onNavigate?.('home')}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showBack onBack={() => onNavigate?.('cart')} title="Checkout">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4 py-6">
          <div className={`grid gap-6 ${isMobileOrTablet ? 'grid-cols-1' : 'grid-cols-3'}`}>
            {/* Shipping Address */}
            <div className={`${isMobileOrTablet ? 'order-1' : 'col-span-2'} space-y-6`}>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Shipping Address</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.fullName}
                      onChange={(e) => handleAddressChange('fullName', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={shippingAddress.phone}
                      onChange={(e) => handleAddressChange('phone', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <textarea
                      value={shippingAddress.address}
                      onChange={(e) => handleAddressChange('address', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) => handleAddressChange('city', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.state}
                      onChange={(e) => handleAddressChange('state', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.pincode}
                      onChange={(e) => handleAddressChange('pincode', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Order Items</h2>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id || item.product_id} className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800">{item.name}</h3>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <div className="font-bold text-gray-800">
                        ₹{((item.discounted_price || item.price) * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className={`${isMobileOrTablet ? 'order-2' : ''} space-y-6`}>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                  </div>
                  {walletAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Wallet Discount</span>
                      <span>-₹{walletAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <hr />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-blue-600">₹{finalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing || !validateAddress()}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : `Place Order (₹${finalAmount.toFixed(2)})`}
                </button>

                <div className="text-xs text-gray-500 text-center mt-4">
                  Cash on Delivery available
                </div>
              </div>

              {/* Wallet Redemption */}
              <WalletRedemption
                orderTotal={cartTotal}
                onWalletAmountChange={setWalletAmount}
                disabled={isProcessing}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
