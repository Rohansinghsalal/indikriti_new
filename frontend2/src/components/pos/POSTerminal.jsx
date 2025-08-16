import React, { useState, useEffect } from 'react';
import { Card, Button, Input } from '../ui';
import { FiSearch, FiPlus, FiMinus, FiTrash2, FiCreditCard, FiDollarSign, FiUser, FiPercent, FiWifi, FiWifiOff, FiRefreshCw } from 'react-icons/fi';
import { useSocket } from '../../context/SocketContext';
import toast from 'react-hot-toast';
import OfflineStorageService from '../../services/offlineStorage';
import SyncService from '../../services/syncService';

export default function POSTerminal({ onProcessSale }) {
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [discountType, setDiscountType] = useState('fixed'); // 'fixed' or 'percentage'
  const [discountValue, setDiscountValue] = useState(0);

  // Offline mode states
  const [isOffline, setIsOffline] = useState(OfflineStorageService.isOfflineMode());
  const [syncStatus, setSyncStatus] = useState(SyncService.getSyncStatus());
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [taxRate, setTaxRate] = useState(18); // Default 18% GST
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [existingCustomers, setExistingCustomers] = useState([]);
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);

  const { connected } = useSocket();

  // Load products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Initialize offline mode and sync service
  useEffect(() => {
    // Initialize sync service
    SyncService.init();

    // Listen for offline mode changes
    const handleOfflineModeChange = (event) => {
      setIsOffline(event.detail.isOffline);
      setSyncStatus(SyncService.getSyncStatus());
    };

    // Listen for sync status changes
    const handleSyncStatusChange = (status) => {
      setSyncStatus(prev => ({ ...prev, ...status }));

      if (status.completed) {
        toast.success('Offline data synced successfully!');
      } else if (status.error) {
        toast.error(`Sync failed: ${status.error}`);
      }
    };

    window.addEventListener('offlineModeChanged', handleOfflineModeChange);
    SyncService.onSyncStatusChange(handleSyncStatusChange);

    // Cleanup
    return () => {
      window.removeEventListener('offlineModeChanged', handleOfflineModeChange);
      SyncService.removeSyncStatusCallback(handleSyncStatusChange);
    };
  }, []);

  // Fetch available products from API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';
      const response = await fetch(`${API_BASE_URL}/pos/available-products`);

      if (response.ok) {
        const data = await response.json();
        setProducts(data.data || []);
      } else {
        toast.error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Error loading products');
    } finally {
      setLoading(false);
    }
  };

  // Search products
  const searchProducts = async (term) => {
    if (!term.trim()) {
      fetchProducts();
      return;
    }

    setLoading(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';
      const response = await fetch(`${API_BASE_URL}/pos/search-products?q=${encodeURIComponent(term)}`);

      if (response.ok) {
        const data = await response.json();
        setProducts(data.data || []);
      } else {
        toast.error('Failed to search products');
      }
    } catch (error) {
      console.error('Error searching products:', error);
      toast.error('Error searching products');
    } finally {
      setLoading(false);
    }
  };

  // Search customers
  const searchCustomers = async (term) => {
    if (!term.trim()) {
      setExistingCustomers([]);
      return;
    }

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';
      const response = await fetch(`${API_BASE_URL}/pos/customers/search?q=${encodeURIComponent(term)}`);

      if (response.ok) {
        const data = await response.json();
        setExistingCustomers(data.data || []);
      }
    } catch (error) {
      console.error('Error searching customers:', error);
    }
  };

  // Handle search input change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchProducts(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Handle customer search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchCustomers(customerSearchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [customerSearchTerm]);

  const filteredProducts = products;

  const addToCart = (product) => {
    // Check if product has stock
    if (product.stock_quantity <= 0) {
      toast.error('Product is out of stock');
      return;
    }

    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      const newQuantity = existingItem.quantity + 1;
      if (newQuantity > product.stock_quantity) {
        toast.error(`Only ${product.stock_quantity} items available in stock`);
        return;
      }
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: newQuantity }
          : item
      ));
    } else {
      setCart([...cart, {
        ...product,
        quantity: 1,
        unit_price: parseFloat(product.selling_price) || parseFloat(product.mrp) || 0
      }]);
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const product = products.find(p => p.id === productId);
    if (product && newQuantity > product.stock_quantity) {
      toast.error(`Only ${product.stock_quantity} items available in stock`);
      return;
    }

    setCart(cart.map(item =>
      item.id === productId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const getSubtotal = () => {
    return cart.reduce((total, item) => {
      const price = parseFloat(item.unit_price) || parseFloat(item.selling_price) || parseFloat(item.mrp) || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const getDiscountAmount = () => {
    const subtotal = getSubtotal();
    if (discountType === 'percentage') {
      return (subtotal * discountValue) / 100;
    }
    return Math.min(discountValue, subtotal); // Fixed amount, but not more than subtotal
  };

  const getSubtotalAfterDiscount = () => {
    return getSubtotal() - getDiscountAmount();
  };

  const getTaxAmount = () => {
    return (getSubtotalAfterDiscount() * taxRate) / 100;
  };

  const getTotal = () => {
    return getSubtotalAfterDiscount() + getTaxAmount();
  };

  const handleProcessSale = async () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    // Validate customer info for large orders or if address is required
    const totalAmount = getTotal();
    if (totalAmount > 1000 && !customerInfo.name) {
      toast.error('Customer name is required for orders above ₹1000');
      return;
    }

    setLoading(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

      // Prepare transaction data
      const transactionData = {
        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          unit_price: parseFloat(item.unit_price) || parseFloat(item.selling_price) || parseFloat(item.mrp) || 0,
          discount_amount: 0
        })),
        customer: customerInfo.name ? customerInfo : null,
        subtotal: getSubtotal(),
        discount_amount: getDiscountAmount(),
        discount_type: discountType,
        tax_rate: taxRate,
        tax_amount: getTaxAmount(),
        total_amount: getTotal(),
        payment_method: paymentMethod,
        notes: `Discount: ${discountType === 'percentage' ? `${discountValue}%` : `₹${discountValue}`}, Tax: ${taxRate}%`
      };

      // Check if we're offline - but try online first
      const shouldTryOffline = isOffline || !navigator.onLine;

      if (shouldTryOffline) {
        console.log('System is offline, storing transaction locally');

        // Store transaction offline
        const offlineTransaction = OfflineStorageService.storeOfflineTransaction(transactionData);

        // Update local inventory
        cart.forEach(item => {
          const currentQuantity = OfflineStorageService.getLocalInventoryQuantity(item.id) || item.stock_quantity;
          const newQuantity = Math.max(0, currentQuantity - item.quantity);
          OfflineStorageService.updateLocalInventory(item.id, newQuantity);
        });

        toast.success(`Transaction stored offline! ID: ${offlineTransaction.offline_id.slice(-8)}`);

        // Reset form
        setCart([]);
        setCustomerInfo({ name: '', phone: '', email: '', address: '' });
        setDiscountValue(0);
        setCustomerSearchTerm('');
        setShowCustomerSearch(false);

        // Update sync status
        setSyncStatus(SyncService.getSyncStatus());

        if (onProcessSale) {
          onProcessSale({ transaction: offlineTransaction, offline: true });
        }

        return;
      }

      // Online mode - check stock availability first
      const stockCheckResponse = await fetch(`${API_BASE_URL}/pos/check-stock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items: cart.map(item => ({
            product_id: item.id,
            quantity: item.quantity
          }))
        })
      });

      if (!stockCheckResponse.ok) {
        toast.error('Failed to check stock availability');
        return;
      }

      const stockData = await stockCheckResponse.json();
      const unavailableItems = stockData.data.filter(item => !item.available);

      if (unavailableItems.length > 0) {
        toast.error(`Some items are not available: ${unavailableItems.map(item => item.reason).join(', ')}`);
        return;
      }

      // Online mode - process transaction with retry logic
      let retryCount = 0;
      const maxRetries = 2;
      let lastError = null;

      while (retryCount <= maxRetries) {
        try {
          console.log(`Attempting transaction (attempt ${retryCount + 1}/${maxRetries + 1})`);

          const response = await fetch(`${API_BASE_URL}/pos/process-transaction`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            },
            body: JSON.stringify(transactionData),
            timeout: 10000 // 10 second timeout
          });

          if (response.ok) {
            const result = await response.json();

            // Verify invoice was created
            if (result.data.invoice) {
              toast.success(`Transaction completed! Invoice #${result.data.invoice.invoice_number}`);
            } else {
              toast.success(`Transaction completed! Transaction #${result.data.transaction.transaction_number}`);
              console.warn('Invoice was not created with transaction');
            }

            // Reset form
            setCart([]);
            setCustomerInfo({ name: '', phone: '', email: '', address: '' });
            setDiscountValue(0);
            setCustomerSearchTerm('');
            setShowCustomerSearch(false);

            // Refresh products to get updated stock
            fetchProducts();

            if (onProcessSale) {
              onProcessSale(result.data);
            }

            return; // Success, exit retry loop
          } else {
            const errorData = await response.json();
            lastError = new Error(errorData.message || `HTTP ${response.status}: Failed to process transaction`);

            if (response.status >= 400 && response.status < 500) {
              // Client error, don't retry
              throw lastError;
            }
          }
        } catch (error) {
          lastError = error;
          console.error(`Transaction attempt ${retryCount + 1} failed:`, error);

          // If it's a network error and we have retries left, continue
          if (retryCount < maxRetries && (error.name === 'TypeError' || error.message.includes('fetch'))) {
            retryCount++;
            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount)); // Exponential backoff
            continue;
          }

          // If it's not a network error or we're out of retries, break
          break;
        }

        retryCount++;
      }

      // If we get here, all retries failed
      throw lastError || new Error('Transaction failed after retries');
    } catch (error) {
      console.error('Error processing sale:', error);

      // Determine if we should fall back to offline storage
      const isNetworkError = error.name === 'TypeError' ||
                            error.message.includes('fetch') ||
                            error.message.includes('network') ||
                            error.message.includes('timeout');

      if (isNetworkError || !navigator.onLine) {
        console.log('Network error detected, falling back to offline storage');
        toast.warning('Connection issues detected. Storing transaction offline...');

        // Automatically store offline if connection was lost during processing
        try {
          const offlineTransaction = OfflineStorageService.storeOfflineTransaction(transactionData);
          toast.success(`Transaction stored offline! ID: ${offlineTransaction.offline_id.slice(-8)}`);

          // Update local inventory
          cart.forEach(item => {
            const currentQuantity = OfflineStorageService.getLocalInventoryQuantity(item.id) || item.stock_quantity;
            const newQuantity = Math.max(0, currentQuantity - item.quantity);
            OfflineStorageService.updateLocalInventory(item.id, newQuantity);
          });

          // Reset form
          setCart([]);
          setCustomerInfo({ name: '', phone: '', email: '', address: '' });
          setDiscountValue(0);
          setCustomerSearchTerm('');
          setShowCustomerSearch(false);

          // Update sync status
          setSyncStatus(SyncService.getSyncStatus());

          if (onProcessSale) {
            onProcessSale({ transaction: offlineTransaction, offline: true });
          }
        } catch (offlineError) {
          console.error('Error storing offline transaction:', offlineError);
          toast.error('Failed to store transaction offline. Please try again.');
        }
      } else {
        // Non-network error (validation, server error, etc.)
        toast.error(error.message || 'Error processing transaction. Please check your input and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const selectCustomer = (customer) => {
    setCustomerInfo({
      name: customer.name,
      phone: customer.phone,
      email: customer.email || '',
      address: customer.address || ''
    });
    setCustomerSearchTerm(customer.name);
    setShowCustomerSearch(false);
    setExistingCustomers([]);
  };

  const clearCustomer = () => {
    setCustomerInfo({ name: '', phone: '', email: '', address: '' });
    setCustomerSearchTerm('');
    setShowCustomerSearch(false);
    setExistingCustomers([]);
  };

  // Handle manual sync
  const handleManualSync = async () => {
    if (!navigator.onLine) {
      toast.error('Cannot sync while offline');
      return;
    }

    if (syncStatus.isSyncing) {
      toast.info('Sync already in progress');
      return;
    }

    try {
      const result = await SyncService.forceSync();
      if (result.success) {
        toast.success('Sync completed successfully');
        fetchProducts(); // Refresh products after sync
      } else {
        toast.error(result.message || 'Sync failed');
      }
    } catch (error) {
      toast.error('Sync failed: ' + error.message);
    }
  };

  // Toggle sync modal
  const toggleSyncModal = () => {
    setShowSyncModal(!showSyncModal);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-screen">
      {/* Product Selection */}
      <div className="lg:col-span-2 space-y-4">
        <Card title="Products">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Connection and sync status */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                {/* Connection status */}
                <div className="flex items-center space-x-2">
                  {isOffline ? (
                    <FiWifiOff className="w-4 h-4 text-red-500" />
                  ) : (
                    <FiWifi className="w-4 h-4 text-green-500" />
                  )}
                  <span className="text-sm text-gray-600">
                    {isOffline ? 'Offline Mode' : 'Online'}
                  </span>
                </div>

                {/* Sync status */}
                {syncStatus.hasPendingItems && (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-yellow-600">
                      {syncStatus.pendingCount.total} pending
                    </span>
                  </div>
                )}

                {/* Sync progress */}
                {syncStatus.isSyncing && (
                  <div className="flex items-center space-x-2">
                    <FiRefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
                    <span className="text-sm text-blue-600">
                      Syncing... {syncStatus.progress || 0}%
                    </span>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-2">
                {syncStatus.hasPendingItems && !isOffline && (
                  <Button
                    onClick={handleManualSync}
                    disabled={syncStatus.isSyncing}
                    size="sm"
                    variant="outline"
                    className="text-xs"
                  >
                    <FiRefreshCw className={`w-3 h-3 mr-1 ${syncStatus.isSyncing ? 'animate-spin' : ''}`} />
                    Sync
                  </Button>
                )}

                <Button
                  size="sm"
                  variant="outline"
                  onClick={fetchProducts}
                  disabled={loading}
                >
                  Refresh
                </Button>
              </div>
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2">Loading products...</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`border rounded-lg p-3 hover:shadow-md cursor-pointer transition-shadow ${
                      product.stock_quantity <= 0 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={() => addToCart(product)}
                  >
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </div>
                    <div className="text-xs text-gray-500">{product.sku}</div>
                    <div className="text-sm font-bold text-green-600 mt-1">
                      ₹{(parseFloat(product.selling_price) || parseFloat(product.mrp) || 0).toFixed(2)}
                    </div>
                    <div className={`text-xs ${product.stock_quantity <= 0 ? 'text-red-500' : 'text-gray-500'}`}>
                      {product.stock_quantity <= 0 ? 'Out of Stock' : `Stock: ${product.stock_quantity}`}
                    </div>
                    {product.stock_quantity <= 10 && product.stock_quantity > 0 && (
                      <div className="text-xs text-orange-500">Low Stock!</div>
                    )}
                  </div>
                ))}
                {filteredProducts.length === 0 && !loading && (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    No products found
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Cart and Checkout */}
      <div className="space-y-4">
        {/* Cart */}
        <Card title="Cart">
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Cart is empty</p>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex-1">
                    <div className="text-sm font-medium">{item.name}</div>
                    <div className="text-xs text-gray-500">₹{(parseFloat(item.unit_price) || parseFloat(item.selling_price) || parseFloat(item.mrp) || 0).toFixed(2)} each</div>
                    <div className="text-xs text-green-600">Total: ₹{((parseFloat(item.unit_price) || parseFloat(item.selling_price) || parseFloat(item.mrp) || 0) * item.quantity).toFixed(2)}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <FiMinus />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <FiPlus />
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <FiTrash2 />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Customer Info */}
        <Card title="Customer Information">
          <div className="space-y-3">
            {/* Customer Search */}
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search existing customer or enter new name..."
                value={customerSearchTerm}
                onChange={(e) => {
                  setCustomerSearchTerm(e.target.value);
                  setShowCustomerSearch(true);
                  if (!e.target.value) {
                    clearCustomer();
                  }
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              />
              {customerSearchTerm && !customerInfo.name && (
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={clearCustomer}
                >
                  Clear
                </Button>
              )}
            </div>

            {/* Customer Search Results */}
            {showCustomerSearch && existingCustomers.length > 0 && (
              <div className="border rounded-md max-h-32 overflow-y-auto">
                {existingCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    className="p-2 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                    onClick={() => selectCustomer(customer)}
                  >
                    <div className="font-medium">{customer.name}</div>
                    <div className="text-sm text-gray-500">{customer.phone}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Customer Details Form */}
            <Input
              placeholder="Customer Name"
              value={customerInfo.name}
              onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
            />
            <Input
              placeholder="Phone Number"
              value={customerInfo.phone}
              onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
            />
            <Input
              placeholder="Email (optional)"
              value={customerInfo.email}
              onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
            />
            <Input
              placeholder="Address (required for large orders)"
              value={customerInfo.address}
              onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
            />
          </div>
        </Card>

        {/* Discount & Tax Controls */}
        <Card title="Discount & Tax">
          <div className="space-y-3">
            {/* Discount Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Type
              </label>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant={discountType === 'fixed' ? 'primary' : 'outline'}
                  onClick={() => setDiscountType('fixed')}
                  className="flex-1"
                >
                  <FiDollarSign className="mr-1" />
                  Fixed Amount
                </Button>
                <Button
                  size="sm"
                  variant={discountType === 'percentage' ? 'primary' : 'outline'}
                  onClick={() => setDiscountType('percentage')}
                  className="flex-1"
                >
                  <FiPercent className="mr-1" />
                  Percentage
                </Button>
              </div>
            </div>

            {/* Discount Value */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount {discountType === 'percentage' ? 'Percentage' : 'Amount'}
              </label>
              <input
                type="number"
                min="0"
                max={discountType === 'percentage' ? '100' : undefined}
                step={discountType === 'percentage' ? '0.1' : '1'}
                value={discountValue}
                onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                placeholder={discountType === 'percentage' ? '0.0' : '0'}
              />
            </div>

            {/* Tax Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tax Rate (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={taxRate}
                onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                placeholder="18.0"
              />
            </div>
          </div>
        </Card>

        {/* Payment */}
        <Card title="Payment">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="upi">UPI</option>
                <option value="netbanking">Net Banking</option>
              </select>
            </div>

            {/* Totals */}
            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{getSubtotal().toFixed(2)}</span>
              </div>
              {getDiscountAmount() > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Discount ({discountType === 'percentage' ? `${discountValue}%` : `₹${discountValue}`}):</span>
                  <span>-₹{getDiscountAmount().toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Subtotal after discount:</span>
                <span>₹{getSubtotalAfterDiscount().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax ({taxRate}%):</span>
                <span>₹{getTaxAmount().toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>₹{getTotal().toFixed(2)}</span>
              </div>
            </div>

            <Button
              fullWidth
              variant="primary"
              onClick={handleProcessSale}
              disabled={cart.length === 0 || loading}
              className="mt-4"
            >
              <FiCreditCard className="mr-2" />
              {loading ? 'Processing...' : 'Process Sale'}
            </Button>
          </div>
        </Card>
      </div>

      {/* Sync Status Modal */}
      {showSyncModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Sync Status</h3>
              <button
                onClick={toggleSyncModal}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              {/* Connection Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Connection:</span>
                <div className="flex items-center space-x-2">
                  {isOffline ? (
                    <FiWifiOff className="w-4 h-4 text-red-500" />
                  ) : (
                    <FiWifi className="w-4 h-4 text-green-500" />
                  )}
                  <span className={`text-sm ${isOffline ? 'text-red-600' : 'text-green-600'}`}>
                    {isOffline ? 'Offline' : 'Online'}
                  </span>
                </div>
              </div>

              {/* Pending Items */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Pending Items:</span>
                <span className="text-sm text-gray-600">
                  {syncStatus.pendingCount.total} total
                  ({syncStatus.pendingCount.transactions} transactions, {syncStatus.pendingCount.inventoryUpdates} inventory)
                </span>
              </div>

              {/* Last Sync */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Last Sync:</span>
                <span className="text-sm text-gray-600">
                  {syncStatus.lastSyncTime
                    ? new Date(syncStatus.lastSyncTime).toLocaleString()
                    : 'Never'
                  }
                </span>
              </div>

              {/* Sync Progress */}
              {syncStatus.isSyncing && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Progress:</span>
                    <span className="text-sm text-blue-600">{syncStatus.progress || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${syncStatus.progress || 0}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2 pt-4">
                {syncStatus.hasPendingItems && !isOffline && (
                  <Button
                    onClick={handleManualSync}
                    disabled={syncStatus.isSyncing}
                    size="sm"
                    className="flex-1"
                  >
                    <FiRefreshCw className={`w-4 h-4 mr-2 ${syncStatus.isSyncing ? 'animate-spin' : ''}`} />
                    {syncStatus.isSyncing ? 'Syncing...' : 'Sync Now'}
                  </Button>
                )}

                <Button
                  onClick={toggleSyncModal}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
