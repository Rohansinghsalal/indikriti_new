import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { 
  Search, 
  Filter, 
  Download, 
  Package, 
  AlertTriangle, 
  TrendingUp,
  Eye,
  RefreshCw
} from 'lucide-react';
import { api } from '@/utils/api';
import InventoryStats from './InventoryStats';
import ProductTable from './ProductTable';
import ProductCard from './ProductCard';
import InventoryQuickActions from './InventoryQuickActions';

interface InventoryProduct {
  id: number;
  product_id: string;
  sku: string;
  name: string;
  brand: string;
  status: string;
  stock_quantity: number;
  selling_price: number;
  mrp: number;
  inventoryValue: string;
  isLowStock: boolean;
  isOutOfStock: boolean;
  categoryDisplay: {
    category: string;
    subcategory: string;
    productType: string;
  };
  createdAtFormatted: string;
  updatedAtFormatted: string;
}

interface InventoryData {
  products: InventoryProduct[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    limit: number;
  };
  stats: any;
}

const InventoryManagement: React.FC = () => {
  const [inventoryData, setInventoryData] = useState<InventoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  
  // Filter states
  const [filters, setFilters] = useState({
    page: 1,
    limit: 50,
    brand: '',
    status: '',
    search: '',
    sortBy: 'created_at',
    sortOrder: 'DESC',
    lowStock: false,
    outOfStock: false
  });

  // Load inventory data
  const loadInventory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.inventory.getAll(filters);
      
      if (response.success) {
        setInventoryData(response.data);
      } else {
        setError('Failed to load inventory data');
      }
    } catch (err) {
      console.error('Error loading inventory:', err);
      setError('Failed to load inventory data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount and filter changes
  useEffect(() => {
    loadInventory();
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value // Reset to page 1 when other filters change
    }));
  };

  // Handle search
  const handleSearch = (searchTerm: string) => {
    handleFilterChange('search', searchTerm);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    handleFilterChange('page', page);
  };

  // Export inventory data
  const handleExport = async () => {
    try {
      // This would typically generate and download a CSV/Excel file
      console.log('Exporting inventory data...');
      // Implementation would depend on your export requirements
    } catch (err) {
      console.error('Error exporting data:', err);
    }
  };

  // Quick filter handlers
  const handleLowStockFilter = () => {
    handleFilterChange('lowStock', true);
    handleFilterChange('outOfStock', false);
  };

  const handleOutOfStockFilter = () => {
    handleFilterChange('outOfStock', true);
    handleFilterChange('lowStock', false);
  };

  if (loading && !inventoryData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Loading inventory...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={loadInventory} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground">
            Manage and monitor your product inventory across all brands
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={loadInventory} variant="outline" size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleExport} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Statistics */}
      {inventoryData?.stats && (
        <InventoryStats stats={inventoryData.stats} />
      )}

      {/* Quick Actions */}
      {inventoryData?.stats && (
        <InventoryQuickActions
          stats={inventoryData.stats}
          onRefresh={loadInventory}
          onExport={handleExport}
          onLowStockFilter={handleLowStockFilter}
          onOutOfStockFilter={handleOutOfStockFilter}
        />
      )}

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Brand Filter */}
            <Select value={filters.brand} onValueChange={(value) => handleFilterChange('brand', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Brands" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Brands</SelectItem>
                <SelectItem value="indikriti">Indikriti</SelectItem>
                <SelectItem value="winsomeLane">Winsome Lane</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>

            {/* Stock Filter */}
            <Select 
              value={filters.lowStock ? 'low' : filters.outOfStock ? 'out' : ''} 
              onValueChange={(value) => {
                handleFilterChange('lowStock', value === 'low');
                handleFilterChange('outOfStock', value === 'out');
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Stock Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Stock Levels</SelectItem>
                <SelectItem value="low">Low Stock</SelectItem>
                <SelectItem value="out">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">View:</span>
              <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'table' | 'cards')}>
                <TabsList>
                  <TabsTrigger value="table">Table</TabsTrigger>
                  <TabsTrigger value="cards">Cards</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Results Count */}
            {inventoryData && (
              <div className="text-sm text-muted-foreground">
                Showing {inventoryData.products.length} of {inventoryData.pagination.totalProducts} products
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Product Display */}
      {inventoryData && (
        <div className="space-y-4">
          {viewMode === 'table' ? (
            <ProductTable 
              products={inventoryData.products}
              pagination={inventoryData.pagination}
              onPageChange={handlePageChange}
              loading={loading}
            />
          ) : (
            <ProductCard 
              products={inventoryData.products}
              pagination={inventoryData.pagination}
              onPageChange={handlePageChange}
              loading={loading}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;
