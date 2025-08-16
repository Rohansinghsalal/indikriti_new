'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function POSPage() {
  // State for products, categories, cart, and customer
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [note, setNote] = useState('');
  const [discount, setDiscount] = useState({ type: 'percentage', value: 0 });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [amountReceived, setAmountReceived] = useState('');
  
  // Mock data for demonstration
  useEffect(() => {
    // Simulate fetching products from API
    const mockProducts = [
      { id: 1, name: 'T-Shirt', price: 19.99, image: '/placeholder.jpg', category: 'clothing', stock: 25 },
      { id: 2, name: 'Jeans', price: 49.99, image: '/placeholder.jpg', category: 'clothing', stock: 15 },
      { id: 3, name: 'Sneakers', price: 79.99, image: '/placeholder.jpg', category: 'footwear', stock: 10 },
      { id: 4, name: 'Watch', price: 129.99, image: '/placeholder.jpg', category: 'accessories', stock: 8 },
      { id: 5, name: 'Backpack', price: 39.99, image: '/placeholder.jpg', category: 'accessories', stock: 12 },
      { id: 6, name: 'Sunglasses', price: 24.99, image: '/placeholder.jpg', category: 'accessories', stock: 20 },
      { id: 7, name: 'Hoodie', price: 34.99, image: '/placeholder.jpg', category: 'clothing', stock: 18 },
      { id: 8, name: 'Socks', price: 9.99, image: '/placeholder.jpg', category: 'clothing', stock: 30 },
      { id: 9, name: 'Hat', price: 14.99, image: '/placeholder.jpg', category: 'accessories', stock: 22 },
      { id: 10, name: 'Sandals', price: 29.99, image: '/placeholder.jpg', category: 'footwear', stock: 14 },
      { id: 11, name: 'Belt', price: 19.99, image: '/placeholder.jpg', category: 'accessories', stock: 16 },
      { id: 12, name: 'Scarf', price: 17.99, image: '/placeholder.jpg', category: 'accessories', stock: 11 },
    ];
    
    setProducts(mockProducts);
    
    // Extract unique categories
    const uniqueCategories = [...new Set(mockProducts.map(product => product.category))];
    setCategories(uniqueCategories);
  }, []);
  
  // Filter products based on category and search query
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  // Add product to cart
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      // Increment quantity if already in cart
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      // Add new item to cart
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };
  
  // Update item quantity in cart
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      // Remove item if quantity is 0 or less
      setCart(cart.filter(item => item.id !== id));
    } else {
      // Update quantity
      setCart(cart.map(item => 
        item.id === id 
          ? { ...item, quantity: newQuantity } 
          : item
      ));
    }
  };
  
  // Remove item from cart
  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };
  
  // Calculate subtotal
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Calculate discount amount
  const discountAmount = discount.type === 'percentage' 
    ? (subtotal * discount.value / 100) 
    : discount.value;
  
  // Calculate tax (assuming 10% tax rate)
  const taxRate = 0.1;
  const taxAmount = (subtotal - discountAmount) * taxRate;
  
  // Calculate total
  const total = subtotal - discountAmount + taxAmount;
  
  // Handle payment processing
  const processPayment = () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      // Reset cart and other state after successful payment
      setCart([]);
      setCustomer(null);
      setNote('');
      setDiscount({ type: 'percentage', value: 0 });
      setAmountReceived('');
      setShowPaymentModal(false);
      setIsProcessing(false);
      
      // Show success message or redirect to receipt page
      alert('Payment successful!');
    }, 1500);
  };
  
  // Calculate change amount
  const changeAmount = amountReceived ? (parseFloat(amountReceived) - total) : 0;
  
  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Left side - Products */}
      <div className="w-2/3 p-4 overflow-auto">
        <div className="mb-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Point of Sale</h1>
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              Print Receipt
            </Button>
            
            <Button variant="outline" size="sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Help
            </Button>
          </div>
        </div>
        
        {/* Search and category filters */}
        <div className="mb-4 flex space-x-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-2.5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          
          <select
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map(product => (
            <Card key={product.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => addToCart(product)}>
              <div className="p-2">
                <div className="bg-gray-100 h-32 mb-2 flex items-center justify-center rounded">
                  <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain" />
                </div>
                <h3 className="font-medium">{product.name}</h3>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                  <span className={`text-sm ${product.stock > 5 ? 'text-green-600' : 'text-orange-500'}`}>
                    {product.stock} in stock
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Right side - Cart */}
      <div className="w-1/3 bg-gray-50 p-4 border-l border-gray-200 flex flex-col">
        {/* Customer selection */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-medium">Customer</h2>
            <Button variant="ghost" size="sm" className="text-blue-600">
              + Add
            </Button>
          </div>
          
          <div className="p-3 bg-white rounded-md border border-gray-200">
            {customer ? (
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{customer.name}</p>
                  <p className="text-sm text-gray-500">{customer.email}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setCustomer(null)}>
                  Change
                </Button>
              </div>
            ) : (
              <p className="text-gray-500">No customer selected</p>
            )}
          </div>
        </div>
        
        {/* Cart items */}
        <div className="flex-1 overflow-auto mb-4">
          <h2 className="font-medium mb-2">Cart Items</h2>
          
          {cart.length === 0 ? (
            <div className="p-4 bg-white rounded-md border border-gray-200 text-center">
              <p className="text-gray-500">No items in cart</p>
              <p className="text-sm text-gray-400 mt-1">Click on products to add them to the cart</p>
            </div>
          ) : (
            <div className="space-y-2">
              {cart.map(item => (
                <div key={item.id} className="p-3 bg-white rounded-md border border-gray-200">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{item.name}</h3>
                    <button 
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center">
                      <button 
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l-md"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <input 
                        type="number" 
                        className="w-12 h-8 border-t border-b border-gray-300 text-center"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                        min="1"
                      />
                      <button 
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r-md"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Order summary */}
        <div className="mb-4">
          <h2 className="font-medium mb-2">Order Summary</h2>
          
          <div className="p-3 bg-white rounded-md border border-gray-200">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span>Discount</span>
                <div className="flex items-center space-x-2">
                  <select
                    className="text-sm border border-gray-300 rounded-md px-1 py-0.5"
                    value={discount.type}
                    onChange={(e) => setDiscount({...discount, type: e.target.value})}
                  >
                    <option value="percentage">%</option>
                    <option value="fixed">$</option>
                  </select>
                  <input
                    type="number"
                    className="w-16 text-sm border border-gray-300 rounded-md px-2 py-0.5 text-right"
                    value={discount.value}
                    onChange={(e) => setDiscount({...discount, value: parseFloat(e.target.value) || 0})}
                    min="0"
                  />
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="flex justify-between">
                <span>Tax (10%)</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>
              
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Payment method */}
        <div className="mb-4">
          <h2 className="font-medium mb-2">Payment Method</h2>
          
          <div className="grid grid-cols-3 gap-2">
            <button
              className={`p-2 border rounded-md flex flex-col items-center justify-center ${paymentMethod === 'cash' ? 'bg-blue-50 border-blue-500' : 'border-gray-300'}`}
              onClick={() => setPaymentMethod('cash')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-sm">Cash</span>
            </button>
            
            <button
              className={`p-2 border rounded-md flex flex-col items-center justify-center ${paymentMethod === 'card' ? 'bg-blue-50 border-blue-500' : 'border-gray-300'}`}
              onClick={() => setPaymentMethod('card')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span className="text-sm">Card</span>
            </button>
            
            <button
              className={`p-2 border rounded-md flex flex-col items-center justify-center ${paymentMethod === 'mobile' ? 'bg-blue-50 border-blue-500' : 'border-gray-300'}`}
              onClick={() => setPaymentMethod('mobile')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span className="text-sm">Mobile</span>
            </button>
          </div>
        </div>
        
        {/* Note */}
        <div className="mb-4">
          <h2 className="font-medium mb-2">Note</h2>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add a note to this order..."
            rows="2"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          ></textarea>
        </div>
        
        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" disabled={cart.length === 0}>
            Save as Draft
          </Button>
          <Button 
            disabled={cart.length === 0} 
            onClick={() => setShowPaymentModal(true)}
          >
            Checkout
          </Button>
        </div>
      </div>
      
      {/* Payment modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Complete Payment</h2>
            
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span>Total Amount:</span>
                <span className="font-bold">${total.toFixed(2)}</span>
              </div>
              
              {paymentMethod === 'cash' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount Received
                  </label>
                  <div className="flex items-center">
                    <span className="mr-2">$</span>
                    <input
                      type="number"
                      className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={amountReceived}
                      onChange={(e) => setAmountReceived(e.target.value)}
                      min={total}
                      step="0.01"
                    />
                  </div>
                </div>
              )}
              
              {paymentMethod === 'cash' && amountReceived && (
                <div className="flex justify-between p-2 bg-gray-50 rounded-md">
                  <span>Change:</span>
                  <span className="font-bold">${changeAmount.toFixed(2)}</span>
                </div>
              )}
              
              {paymentMethod === 'card' && (
                <div className="p-4 border border-gray-200 rounded-md bg-gray-50 text-center">
                  <p>Please swipe card or insert chip</p>
                </div>
              )}
              
              {paymentMethod === 'mobile' && (
                <div className="p-4 border border-gray-200 rounded-md bg-gray-50 text-center">
                  <p>Scan QR code with mobile payment app</p>
                  <div className="w-32 h-32 mx-auto my-2 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">QR Code</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setShowPaymentModal(false)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button 
                onClick={processPayment}
                disabled={isProcessing || (paymentMethod === 'cash' && (!amountReceived || parseFloat(amountReceived) < total))}
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : 'Complete Payment'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}