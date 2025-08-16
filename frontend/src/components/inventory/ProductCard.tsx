import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Edit,
  AlertTriangle,
  Package,
  DollarSign,
  Tag
} from 'lucide-react';

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

interface ProductCardProps {
  products: InventoryProduct[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    limit: number;
  };
  onPageChange: (page: number) => void;
  loading: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  products, 
  pagination, 
  onPageChange, 
  loading 
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: 'default' as const, color: 'bg-green-100 text-green-800' },
      inactive: { variant: 'secondary' as const, color: 'bg-red-100 text-red-800' },
      draft: { variant: 'outline' as const, color: 'bg-gray-100 text-gray-800' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    
    return (
      <Badge variant={config.variant} className={config.color}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getBrandBadge = (brand: string) => {
    const brandConfig = {
      indikriti: 'bg-blue-100 text-blue-800',
      winsomeLane: 'bg-purple-100 text-purple-800'
    };

    const color = brandConfig[brand as keyof typeof brandConfig] || 'bg-gray-100 text-gray-800';
    
    return (
      <Badge variant="secondary" className={color}>
        {brand === 'indikriti' ? 'Indikriti' : 'Winsome Lane'}
      </Badge>
    );
  };

  const getStockIndicator = (product: InventoryProduct) => {
    if (product.isOutOfStock) {
      return (
        <div className="flex items-center space-x-1 text-red-600">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-sm font-medium">Out of Stock</span>
        </div>
      );
    }
    
    if (product.isLowStock) {
      return (
        <div className="flex items-center space-x-1 text-yellow-600">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-sm font-medium">Low Stock</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center space-x-1 text-green-600">
        <Package className="h-4 w-4" />
        <span className="text-sm font-medium">In Stock</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium mb-2">No products found</h3>
          <p className="text-muted-foreground">Try adjusting your filters to see more products.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
                  <div className="flex items-center space-x-2 mt-2">
                    {getBrandBadge(product.brand)}
                    {getStatusBadge(product.status)}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Product IDs */}
              <div className="text-sm text-muted-foreground">
                <div>ID: {product.product_id}</div>
                <div>SKU: {product.sku}</div>
              </div>

              {/* Category Information */}
              <div className="space-y-1">
                <div className="flex items-center space-x-1 text-sm">
                  <Tag className="h-3 w-3" />
                  <span className="font-medium">{product.categoryDisplay.category}</span>
                </div>
                <div className="text-sm text-muted-foreground ml-4">
                  {product.categoryDisplay.subcategory} • {product.categoryDisplay.productType}
                </div>
              </div>

              {/* Stock Information */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Stock Quantity</div>
                  <div className="text-lg font-bold">{product.stock_quantity}</div>
                </div>
                <div>
                  {getStockIndicator(product)}
                </div>
              </div>

              {/* Pricing Information */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Selling Price</span>
                  <span className="font-medium">{formatCurrency(product.selling_price)}</span>
                </div>
                {product.mrp !== product.selling_price && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">MRP</span>
                    <span className="text-sm line-through text-muted-foreground">
                      {formatCurrency(product.mrp)}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between border-t pt-2">
                  <span className="text-sm font-medium">Inventory Value</span>
                  <span className="font-bold text-green-600">
                    {formatCurrency(parseFloat(product.inventoryValue))}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>

              {/* Dates */}
              <div className="text-xs text-muted-foreground border-t pt-2">
                <div>Created: {product.createdAtFormatted}</div>
                <div>Updated: {product.updatedAtFormatted}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Page {pagination.currentPage} of {pagination.totalPages} • {pagination.totalProducts} total products
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage >= pagination.totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductCard;
