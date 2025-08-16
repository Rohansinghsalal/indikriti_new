import React, { useState, useEffect } from 'react';
import { Card, Button, Input } from '../ui';
import { FiPlus, FiMinus, FiEdit3, FiRefreshCw, FiAlertTriangle, FiPackage, FiTrendingDown } from 'react-icons/fi';
import { useSocket } from '../../context/SocketContext';
import toast from 'react-hot-toast';

export default function InventoryManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stockOperation, setStockOperation] = useState('add'); // 'add', 'remove', 'update'
  const [stockQuantity, setStockQuantity] = useState('');
  const [stockReason, setStockReason] = useState('');
  const [showStockModal, setShowStockModal] = useState(false);
  const [inventorySummary, setInventorySummary] = useState({});
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [showLowStock, setShowLowStock] = useState(false);

  const { connected, inventoryUpdates } = useSocket();

  useEffect(() => {
    fetchProducts();
    fetchInventorySummary();
    fetchLowStockProducts();
  }, []);

  // Listen for real-time inventory updates
  useEffect(() => {
    if (inventoryUpdates.length > 0) {
      // Refresh products when inventory updates are received
      fetchProducts();
      fetchInventorySummary();
      fetchLowStockProducts();
    }
  }, [inventoryUpdates]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';
      const response = await fetch(`${API_BASE_URL}/inventory/products`);
      
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

  const fetchInventorySummary = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';
      const response = await fetch(`${API_BASE_URL}/inventory/summary`);
      
      if (response.ok) {
        const data = await response.json();
        setInventorySummary(data.data || {});
      }
    } catch (error) {
      console.error('Error fetching inventory summary:', error);
    }
  };

  const fetchLowStockProducts = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';
      const response = await fetch(`${API_BASE_URL}/inventory/low-stock?threshold=10`);
      
      if (response.ok) {
        const data = await response.json();
        setLowStockProducts(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching low stock products:', error);
    }
  };

  const handleStockOperation = async () => {
    if (!selectedProduct || !stockQuantity) {
      toast.error('Please enter a valid quantity');
      return;
    }

    setLoading(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';
      let endpoint = '';
      let method = 'POST';

      switch (stockOperation) {
        case 'add':
          endpoint = `${API_BASE_URL}/inventory/products/${selectedProduct.id}/add-stock`;
          break;
        case 'remove':
          endpoint = `${API_BASE_URL}/inventory/products/${selectedProduct.id}/remove-stock`;
          break;
        case 'update':
          endpoint = `${API_BASE_URL}/inventory/products/${selectedProduct.id}/stock`;
          method = 'PUT';
          break;
        default:
          toast.error('Invalid operation');
          return;
      }

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          quantity: parseInt(stockQuantity),
          reason: stockReason || `Manual ${stockOperation} via inventory manager`
        })
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(result.message);
        setShowStockModal(false);
        setStockQuantity('');
        setStockReason('');
        setSelectedProduct(null);
        fetchProducts();
        fetchInventorySummary();
        fetchLowStockProducts();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to update stock');
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      toast.error('Error updating stock');
    } finally {
      setLoading(false);
    }
  };

  const openStockModal = (product, operation) => {
    setSelectedProduct(product);
    setStockOperation(operation);
    setStockQuantity(operation === 'update' ? product.stock_quantity.toString() : '');
    setShowStockModal(true);
  };

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.product_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-600">
              {connected ? 'Real-time connected' : 'Offline mode'}
            </span>
          </div>
          <Button onClick={fetchProducts} disabled={loading}>
            <FiRefreshCw className="mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Inventory Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center">
            <FiPackage className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{inventorySummary.total_products || 0}</p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center">
            <FiPackage className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">In Stock</p>
              <p className="text-2xl font-bold text-gray-900">{inventorySummary.in_stock_products || 0}</p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center">
            <FiAlertTriangle className="h-8 w-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Low Stock</p>
              <p className="text-2xl font-bold text-gray-900">{inventorySummary.low_stock_products || 0}</p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center">
            <FiTrendingDown className="h-8 w-8 text-red-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Out of Stock</p>
              <p className="text-2xl font-bold text-gray-900">{inventorySummary.out_of_stock_products || 0}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <Card>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiAlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
              <span className="font-medium text-orange-700">
                {lowStockProducts.length} products are running low on stock
              </span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowLowStock(!showLowStock)}
            >
              {showLowStock ? 'Hide' : 'Show'} Low Stock Items
            </Button>
          </div>
          
          {showLowStock && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lowStockProducts.map(product => (
                <div key={product.id} className="border rounded-lg p-3 bg-orange-50">
                  <h4 className="font-medium text-gray-900">{product.name}</h4>
                  <p className="text-sm text-gray-500">{product.sku}</p>
                  <p className="text-sm text-orange-600">Stock: {product.stock_quantity}</p>
                  <div className="mt-2 flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => openStockModal(product, 'add')}
                    >
                      Add Stock
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Search */}
      <Card>
        <Input
          placeholder="Search products by name, SKU, or product ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Card>

      {/* Products Table */}
      <Card title="Products Inventory">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading products...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className={product.stock_quantity <= 0 ? 'bg-red-50' : product.stock_quantity <= 10 ? 'bg-orange-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.brand}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${
                        product.stock_quantity <= 0 ? 'text-red-600' : 
                        product.stock_quantity <= 10 ? 'text-orange-600' : 'text-green-600'
                      }`}>
                        {product.stock_quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{(product.selling_price || product.mrp || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openStockModal(product, 'add')}
                      >
                        <FiPlus className="mr-1" />
                        Add
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openStockModal(product, 'remove')}
                        disabled={product.stock_quantity <= 0}
                      >
                        <FiMinus className="mr-1" />
                        Remove
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openStockModal(product, 'update')}
                      >
                        <FiEdit3 className="mr-1" />
                        Update
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredProducts.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-500">
                No products found
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Stock Operation Modal */}
      {showStockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {stockOperation === 'add' ? 'Add Stock' : stockOperation === 'remove' ? 'Remove Stock' : 'Update Stock'}
            </h3>
            
            {selectedProduct && (
              <div className="mb-4 p-3 bg-gray-50 rounded">
                <p className="font-medium">{selectedProduct.name}</p>
                <p className="text-sm text-gray-500">Current Stock: {selectedProduct.stock_quantity}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {stockOperation === 'update' ? 'New Stock Quantity' : 'Quantity'}
                </label>
                <input
                  type="number"
                  min="0"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter quantity"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason (optional)
                </label>
                <input
                  type="text"
                  value={stockReason}
                  onChange={(e) => setStockReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter reason for stock change"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowStockModal(false);
                  setStockQuantity('');
                  setStockReason('');
                  setSelectedProduct(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleStockOperation}
                disabled={!stockQuantity || loading}
              >
                {loading ? 'Processing...' : 'Confirm'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
