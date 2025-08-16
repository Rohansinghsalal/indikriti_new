'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Separator } from '@/components/ui/Separator';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { 
  ShoppingCart, 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  User, 
  CreditCard,
  Receipt,
  Calculator
} from 'lucide-react';
import { toast } from 'sonner';
import ProductSelector from '@/components/pos/ProductSelector';
import CustomerSelector from '@/components/pos/CustomerSelector';
import PaymentModal from '@/components/pos/PaymentModal';
import { api } from '@/utils/api';

interface CartItem {
  id: number;
  product_id: number;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  discount: number;
  total: number;
}

interface Customer {
  id?: number;
  name: string;
  email?: string;
  phone?: string;
}

export default function POSPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [showCustomerSelector, setShowCustomerSelector] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const totalDiscount = cart.reduce((sum, item) => sum + (item.discount * item.quantity), 0);
  const tax = subtotal * 0.18; // 18% GST
  const grandTotal = subtotal + tax - totalDiscount;

  // Add product to cart
  const addToCart = (product: any) => {
    const existingItem = cart.find(item => item.product_id === product.id);
    
    if (existingItem) {
      updateQuantity(existingItem.id, existingItem.quantity + 1);
    } else {
      const newItem: CartItem = {
        id: Date.now(),
        product_id: product.id,
        name: product.name,
        sku: product.sku,
        price: product.selling_price || product.final_price || product.mrp,
        quantity: 1,
        discount: 0,
        total: product.selling_price || product.final_price || product.mrp
      };
      setCart([...cart, newItem]);
    }
    setShowProductSelector(false);
  };

  // Update item quantity
  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart(cart.map(item => 
      item.id === itemId 
        ? { 
            ...item, 
            quantity: newQuantity, 
            total: (item.price - item.discount) * newQuantity 
          }
        : item
    ));
  };

  // Remove item from cart
  const removeFromCart = (itemId: number) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  // Update item discount
  const updateDiscount = (itemId: number, discount: number) => {
    setCart(cart.map(item => 
      item.id === itemId 
        ? { 
            ...item, 
            discount, 
            total: (item.price - discount) * item.quantity 
          }
        : item
    ));
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
    setCustomer(null);
  };

  // Process payment
  const processPayment = async (paymentData: any) => {
    setIsProcessing(true);
    try {
      const transactionData = {
        customer_id: customer?.id || null,
        customer_name: customer?.name || 'Walk-in Customer',
        customer_phone: customer?.phone || null,
        customer_email: customer?.email || null,
        items: cart.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.price,
          discount_amount: item.discount
        })),
        payments: paymentData.payments,
        discount_amount: totalDiscount,
        tax_amount: tax,
        notes: paymentData.notes || ''
      };

      const response = await api.pos.createTransaction(transactionData);
      
      if (response.success) {
        toast.success('Transaction completed successfully!');
        clearCart();
        setShowPaymentModal(false);
        
        // Optionally print receipt or show receipt modal
        if (paymentData.printReceipt) {
          // Handle receipt printing
        }
      } else {
        toast.error('Transaction failed. Please try again.');
      }
    } catch (error) {
      console.error('Transaction error:', error);
      toast.error('Transaction failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Panel - Products and Cart */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Point of Sale</h1>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button 
                onClick={() => setShowProductSelector(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 p-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Cart ({cart.length} items)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                {cart.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Your cart is empty</p>
                    <p className="text-sm">Add products to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                          <p className="text-sm font-medium">₹{item.price.toFixed(2)} each</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-right ml-4">
                          <p className="font-medium">₹{item.total.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Panel - Customer and Checkout */}
      <div className="w-96 bg-white border-l flex flex-col">
        {/* Customer Section */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Customer</h3>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowCustomerSelector(true)}
            >
              <User className="h-4 w-4 mr-1" />
              {customer ? 'Change' : 'Select'}
            </Button>
          </div>
          {customer ? (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium">{customer.name}</p>
              {customer.phone && <p className="text-sm text-gray-600">{customer.phone}</p>}
              {customer.email && <p className="text-sm text-gray-600">{customer.email}</p>}
            </div>
          ) : (
            <div className="p-3 bg-gray-50 rounded-lg text-center text-gray-500">
              <User className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Walk-in Customer</p>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="flex-1 p-4">
          <h3 className="font-medium mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            {totalDiscount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount:</span>
                <span>-₹{totalDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Tax (18%):</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-medium text-lg">
              <span>Total:</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t space-y-2">
          <Button
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={cart.length === 0 || isProcessing}
            onClick={() => setShowPaymentModal(true)}
          >
            <CreditCard className="h-4 w-4 mr-2" />
            {isProcessing ? 'Processing...' : 'Checkout'}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            disabled={cart.length === 0}
            onClick={clearCart}
          >
            Clear Cart
          </Button>
        </div>
      </div>

      {/* Modals */}
      {showProductSelector && (
        <ProductSelector
          onSelect={addToCart}
          onClose={() => setShowProductSelector(false)}
          searchQuery={searchQuery}
        />
      )}

      {showCustomerSelector && (
        <CustomerSelector
          onSelect={setCustomer}
          onClose={() => setShowCustomerSelector(false)}
        />
      )}

      {showPaymentModal && (
        <PaymentModal
          total={grandTotal}
          onPayment={processPayment}
          onClose={() => setShowPaymentModal(false)}
          isProcessing={isProcessing}
        />
      )}
    </div>
  );
}
