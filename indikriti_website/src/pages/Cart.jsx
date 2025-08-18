import { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useResponsive } from '../hooks/useResponsive.js';
import Layout from '../components/Layout.jsx';
import WalletRedemption from '../components/checkout/WalletRedemption.jsx';

const Cart = ({ onNavigate }) => {
  const { 
    cartItems, 
    updateCartQuantity, 
    removeFromCart, 
    getCartTotal, 
    moveToWishlist,
    clearCart 
  } = useCart();
  const { isMobileOrTablet } = useResponsive();
  
  const [walletAmount, setWalletAmount] = useState(0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const cartTotal = getCartTotal();
  const finalAmount = cartTotal - walletAmount;
  const shipping = cartTotal > 499 ? 0 : 40;
  const totalWithShipping = finalAmount + shipping;

  const handleQuantityChange = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      updateCartQuantity(productId, quantity);
    }
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    // Simulate checkout process
    setTimeout(() => {
      onNavigate?.('checkout', { 
        items: cartItems, 
        total: totalWithShipping,
        walletUsed: walletAmount 
      });
      setIsCheckingOut(false);
    }, 1000);
  };

  if (cartItems.length === 0) {
    return (
      <Layout currentPage="cart" title="Shopping Cart">
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🛒</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
              <button
                onClick={() => onNavigate?.('home')}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
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
    <Layout currentPage="cart" title="Shopping Cart">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Shopping Cart</h1>
              <p className="text-gray-600">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart</p>
            </div>
            {cartItems.length > 0 && (
              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Clear Cart
              </button>
            )}
          </div>

          <div className={`grid gap-6 ${isMobileOrTablet ? 'grid-cols-1' : 'grid-cols-3'}`}>
            {/* Cart Items */}
            <div className={`${isMobileOrTablet ? 'order-1' : 'col-span-2'} space-y-4`}>
              {cartItems.map((item) => (
                <div key={item.id || item.product_id} className="bg-white rounded-xl p-4 shadow-sm border border-blue-100">
                  <div className="flex space-x-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                        {item.description}
                      </p>
                      
                      {/* Price */}
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="font-bold text-blue-600">
                          ₹{item.discounted_price || item.price}
                        </span>
                        {item.price && item.discounted_price && item.price > item.discounted_price && (
                          <span className="text-sm text-gray-500 line-through">
                            ���{item.price}
                          </span>
                        )}
                      </div>

                      {/* Quantity and Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleQuantityChange(item.id || item.product_id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                          >
                            −
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id || item.product_id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center transition-colors text-blue-600"
                          >
                            +
                          </button>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => moveToWishlist(item.id || item.product_id)}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            Move to Wishlist
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id || item.product_id)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="text-right">
                      <div className="font-bold text-gray-800">
                        ₹{((item.discounted_price || item.price) * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className={`${isMobileOrTablet ? 'order-2' : ''} space-y-4`}>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
                    <span className="font-medium">₹{cartTotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `₹${shipping}`
                      )}
                    </span>
                  </div>
                  
                  {walletAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Wallet Discount</span>
                      <span>-₹{walletAmount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <hr className="border-gray-200" />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-blue-600">₹{totalWithShipping.toFixed(2)}</span>
                  </div>
                </div>

                {shipping > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-blue-700">
                      Add items worth ₹{(499 - cartTotal).toFixed(2)} more to get free shipping!
                    </p>
                  </div>
                )}

                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCheckingOut ? 'Processing...' : `Proceed to Checkout (₹${totalWithShipping.toFixed(2)})`}
                </button>
              </div>

              {/* Wallet Redemption - Available for all users */}
              <WalletRedemption
                orderTotal={cartTotal}
                onWalletAmountChange={setWalletAmount}
              />

              {/* Continue Shopping */}
              <button
                onClick={() => onNavigate?.('home')}
                className="w-full bg-white text-blue-600 border border-blue-200 py-3 rounded-xl font-medium hover:bg-blue-50 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>

          {/* Recommended Products */}
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-800 mb-6">You might also like</h2>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">💡</div>
                <p>Product recommendations will appear here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
