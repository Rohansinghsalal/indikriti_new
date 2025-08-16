import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  Package, 
  DollarSign, 
  AlertTriangle, 
  TrendingUp,
  ShoppingBag,
  Archive
} from 'lucide-react';

interface InventoryStatsProps {
  stats: {
    totalProducts: number;
    totalValue: string;
    byBrand: {
      indikriti: { count: number; value: string };
      winsomeLane: { count: number; value: string };
    };
    byStatus: {
      active: number;
      inactive: number;
      draft: number;
    };
    stockStatus: {
      inStock: number;
      lowStock: number;
      outOfStock: number;
    };
  };
}

const InventoryStats: React.FC<InventoryStatsProps> = ({ stats }) => {
  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(parseFloat(value));
  };

  const getStockStatusColor = (status: 'inStock' | 'lowStock' | 'outOfStock') => {
    switch (status) {
      case 'inStock':
        return 'bg-green-100 text-green-800';
      case 'lowStock':
        return 'bg-yellow-100 text-yellow-800';
      case 'outOfStock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getBrandColor = (brand: 'indikriti' | 'winsomeLane') => {
    switch (brand) {
      case 'indikriti':
        return 'bg-blue-100 text-blue-800';
      case 'winsomeLane':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Products */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalProducts.toLocaleString()}</div>
          <div className="flex items-center space-x-2 mt-2">
            <Badge variant="secondary" className={getBrandColor('indikriti')}>
              Indikriti: {stats.byBrand.indikriti.count}
            </Badge>
            <Badge variant="secondary" className={getBrandColor('winsomeLane')}>
              Winsome Lane: {stats.byBrand.winsomeLane.count}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Total Inventory Value */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</div>
          <div className="space-y-1 mt-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Indikriti:</span>
              <span className="font-medium">{formatCurrency(stats.byBrand.indikriti.value)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Winsome Lane:</span>
              <span className="font-medium">{formatCurrency(stats.byBrand.winsomeLane.value)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stock Status */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Stock Status</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className={getStockStatusColor('inStock')}>
                In Stock
              </Badge>
              <span className="text-sm font-medium">{stats.stockStatus.inStock}</span>
            </div>
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className={getStockStatusColor('lowStock')}>
                Low Stock
              </Badge>
              <span className="text-sm font-medium">{stats.stockStatus.lowStock}</span>
            </div>
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className={getStockStatusColor('outOfStock')}>
                Out of Stock
              </Badge>
              <span className="text-sm font-medium">{stats.stockStatus.outOfStock}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Status */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Product Status</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Active</span>
              </div>
              <span className="text-sm font-medium">{stats.byStatus.active}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm">Inactive</span>
              </div>
              <span className="text-sm font-medium">{stats.byStatus.inactive}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <span className="text-sm">Draft</span>
              </div>
              <span className="text-sm font-medium">{stats.byStatus.draft}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryStats;
