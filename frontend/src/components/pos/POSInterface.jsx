'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Separator } from '@/components/ui/Separator';
import { AlertCircle, ShoppingCart, User, CreditCard, Printer, Wifi, WifiOff, Clock, Save } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/Alert';

// Import POS components
import ProductSelector from './ProductSelector';
import CartSummary from './CartSummary';
import CustomerForm from './CustomerForm';
import PaymentProcessor from './PaymentProcessor';
import ReceiptGenerator from './ReceiptGenerator';

const POSInterface = () => {
  // State for the POS system
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [activeTab, setActiveTab] = useState('products');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  
  // Check online status
  useEffect(() => {
    const handleOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);
  
  // Handle adding product to cart
  const handleAddToCart = (product, quantity = 1) => {
    const existingItemIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      // Update quantity if product already in cart
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += quantity;
      setCart(updatedCart);
    } else {
      // Add new product to cart
      setCart([...cart, { ...product, quantity }]);
    }
  };
  
  // Handle removing product from cart
  const handleRemoveFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };
  
  // Handle updating product quantity in cart
  const handleUpdateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    
    const updatedCart = cart.map(item => {
      if (item.id === productId) {
        return { ...item, quantity };
      }
      return item;
    });
    
    setCart(updatedCart);
  };
  
  // Handle customer selection/creation
  const handleCustomerSelect = (selectedCustomer) => {
    setCustomer(selectedCustomer);
    // Move to next tab if customer is selected
    if (selectedCustomer) {
      setActiveTab('payment');
    }
  };
  
  // Calculate cart totals
  const calculateTotals = () => {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const taxRate = 0.08; // 8% tax rate
    const tax = subtotal * taxRate;
    const total = subtotal + tax;
    
    return {
      subtotal,
      tax,
      total,
      itemCount: cart.reduce((count, item) => count + item.quantity, 0)
    };
  };
  
  // Handle payment processing
  const handleProcessPayment = async (paymentMethod) => {
    setIsProcessingPayment(true);
    
    // Create transaction object
    const transaction = {
      id: `tx-${Date.now()}`,
      timestamp: new Date(),
      cart: [...cart],
      customer: customer,
      totals: calculateTotals(),
      paymentMethod,
      status: 'pending'
    };
    
    setCurrentTransaction(transaction);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // If offline, store transaction for later sync
      if (!isOnline) {
        transaction.status = 'pending_sync';
        setPendingTransactions([...pendingTransactions, transaction]);
        // Save to local storage or IndexedDB in a real implementation
      } else {
        // Online payment processing
        transaction.status = 'completed';
      }
      
      // Generate receipt
      const receiptData = {
        ...transaction,
        receiptNumber: `R-${Math.floor(100000 + Math.random() * 900000)}`,
        cashier: 'Admin User'
      };
      
      setReceipt(receiptData);
      setPaymentComplete(true);
      setActiveTab('receipt');
    } catch (error) {
      console.error('Payment processing error:', error);
      transaction.status = 'failed';
    } finally {
      setIsProcessingPayment(false);
    }
  };
  
  // Handle starting a new transaction
  const handleNewTransaction = () => {
    setCart([]);
    setCustomer(null);
    setPaymentComplete(false);
    setReceipt(null);
    setCurrentTransaction(null);
    setActiveTab('products');
  };
  
  // Handle syncing offline transactions
  const handleSyncTransactions = async () => {
    if (!isOnline || pendingTransactions.length === 0) return;
    
    // Simulate syncing process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update transactions status
    const syncedTransactions = pendingTransactions.map(tx => ({
      ...tx,
      status: 'completed',
      syncedAt: new Date()
    }));
    
    // In a real app, you would send these to your backend
    console.log('Synced transactions:', syncedTransactions);
    
    // Clear pending transactions
    setPendingTransactions([]);
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Offline warning */}
      {!isOnline && (
        <Alert variant="warning" className="mb-4">
          <WifiOff className="h-4 w-4" />
          <AlertDescription>
            You are currently offline. Transactions will be saved locally and synced when you reconnect.
          </AlertDescription>
        </Alert>
      )}
      
      {/* Pending transactions notification */}
      {isOnline && pendingTransactions.length > 0 && (
        <Alert variant="info" className="mb-4">
          <Clock className="h-4 w-4" />
          <AlertDescription className="flex justify-between items-center">
            <span>You have {pendingTransactions.length} pending transaction(s) to sync.</span>
            <Button size="sm" onClick={handleSyncTransactions}>
              <Wifi className="h-4 w-4 mr-2" />
              Sync Now
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
        {/* Left panel - Product selection */}
        <div className="md:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="products" disabled={paymentComplete}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Products
              </TabsTrigger>
              <TabsTrigger value="customer" disabled={cart.length === 0 || paymentComplete}>
                <User className="h-4 w-4 mr-2" />
                Customer
              </TabsTrigger>
              <TabsTrigger value="payment" disabled={!customer || paymentComplete}>
                <CreditCard className="h-4 w-4 mr-2" />
                Payment
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="products" className="h-full">
              <ProductSelector 
                onAddToCart={handleAddToCart} 
                cart={cart}
              />
            </TabsContent>
            
            <TabsContent value="customer" className="h-full">
              <CustomerForm 
                onCustomerSelect={handleCustomerSelect} 
                initialCustomer={customer}
              />
            </TabsContent>
            
            <TabsContent value="payment" className="h-full">
              <PaymentProcessor 
                totals={calculateTotals()} 
                onProcessPayment={handleProcessPayment}
                isProcessing={isProcessingPayment}
                isOffline={!isOnline}
              />
            </TabsContent>
            
            <TabsContent value="receipt" className="h-full">
              {receipt && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Receipt</h2>
                    <div className="space-x-2">
                      <Button variant="outline" onClick={() => ReceiptGenerator.print(receipt)}>
                        <Printer className="h-4 w-4 mr-2" />
                        Print
                      </Button>
                      <Button variant="outline" onClick={() => ReceiptGenerator.email(receipt, customer?.email)}>
                        <Save className="h-4 w-4 mr-2" />
                        Email
                      </Button>
                    </div>
                  </div>
                  
                  <Card>
                    <CardContent className="p-6">
                      <ReceiptGenerator receipt={receipt} />
                    </CardContent>
                  </Card>
                  
                  <div className="flex justify-end">
                    <Button onClick={handleNewTransaction}>
                      New Transaction
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Right panel - Cart summary */}
        <div>
          <Card className="h-full">
            <CardContent className="p-4 h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Current Cart</h3>
                <Badge variant="outline">
                  {calculateTotals().itemCount} items
                </Badge>
              </div>
              
              <CartSummary 
                cart={cart} 
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveFromCart}
                totals={calculateTotals()}
                className="flex-1"
              />
              
              {cart.length > 0 && activeTab === 'products' && (
                <Button 
                  className="mt-4" 
                  onClick={() => setActiveTab('customer')}
                  disabled={cart.length === 0}
                >
                  Continue to Customer
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default POSInterface;