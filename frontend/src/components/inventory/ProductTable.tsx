import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/Table';
import { 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Edit,
  AlertTriangle,
  Package
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

interface ProductTableProps {
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

const ProductTable: React.FC<ProductTableProps> = ({ 
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
      active: { variant: 'success' as const, color: 'bg-green-100 text-green-800' },
      inactive: { variant: 'danger' as const, color: 'bg-red-100 text-red-800' },
      draft: { variant: 'warning' as const, color: 'bg-gray-100 text-gray-800' }
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Product Inventory</span>
          <span className="text-sm font-normal text-muted-foreground">
            {pagination.totalProducts} total products
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                      <span>Loading products...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="text-muted-foreground">
                      <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No products found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {product.product_id} • {product.sku}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getBrandBadge(product.brand)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{product.categoryDisplay.category}</div>
                        <div className="text-muted-foreground">
                          {product.categoryDisplay.subcategory}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{product.stock_quantity}</div>
                        {getStockIndicator(product)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{formatCurrency(product.selling_price)}</div>
                        {product.mrp !== product.selling_price && (
                          <div className="text-muted-foreground line-through">
                            {formatCurrency(product.mrp)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {formatCurrency(parseFloat(product.inventoryValue))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(product.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Page {pagination.currentPage} of {pagination.totalPages}
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
        )}
      </CardContent>
    </Card>
  );
};

export default ProductTable;
