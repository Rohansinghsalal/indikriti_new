import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  AlertTriangle, 
  Package, 
  TrendingDown,
  Plus,
  Download,
  Upload,
  RefreshCw
} from 'lucide-react';

interface QuickActionsProps {
  stats: {
    stockStatus: {
      inStock: number;
      lowStock: number;
      outOfStock: number;
    };
  };
  onRefresh: () => void;
  onExport: () => void;
  onLowStockFilter: () => void;
  onOutOfStockFilter: () => void;
}

const InventoryQuickActions: React.FC<QuickActionsProps> = ({
  stats,
  onRefresh,
  onExport,
  onLowStockFilter,
  onOutOfStockFilter
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Quick Stock Alerts */}
      <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onLowStockFilter}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Low Stock Items</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.stockStatus.lowStock}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onOutOfStockFilter}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingDown className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">{stats.stockStatus.outOfStock}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Package className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">In Stock</p>
              <p className="text-2xl font-bold text-green-600">{stats.stockStatus.inStock}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            <Button onClick={onRefresh} variant="outline" size="sm" className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
            <Button onClick={onExport} variant="outline" size="sm" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryQuickActions;
