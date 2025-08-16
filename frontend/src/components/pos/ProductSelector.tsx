'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { Card, CardContent } from '@/components/ui/Card';
import { Search, Package, Plus } from 'lucide-react';
import { api } from '@/utils/api';
import { toast } from 'sonner';

interface Product {
  id: number;
  product_id: string;
  sku: string;
  name: string;
  description?: string;
  selling_price: number;
  mrp: number;
  final_price?: number;
  stock_quantity: number;
  category?: {
    id: number;
    name: string;
  };
  brand: string;
  status: string;
}

interface ProductSelectorProps {
  onSelect: (product: Product) => void;
  onClose: () => void;
  searchQuery?: string;
}

export default function ProductSelector({ onSelect, onClose, searchQuery = '' }: ProductSelectorProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchQuery);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [search, selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params: any = {
        limit: 50,
        page: 1
      };

      if (search) {
        params.search = search;
      }

      if (selectedCategory) {
        params.category_id = selectedCategory;
      }

      const response = await api.pos.getProducts(params);
      
      if (response.success) {
        setProducts(response.data.products || []);
      } else {
        toast.error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.categories.getAll();
      if (response.success) {
        setCategories(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleProductSelect = (product: Product) => {
    if (product.stock_quantity <= 0) {
      toast.error('Product is out of stock');
      return;
    }
    onSelect(product);
  };

  const getDisplayPrice = (product: Product) => {
    return product.final_price || product.selling_price || product.mrp;
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Select Product</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products by name, SKU, or product ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value ? parseInt(e.target.value) : null)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Products Grid */}
          <ScrollArea className="h-96">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">No products found</p>
                <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      product.stock_quantity <= 0 ? 'opacity-50' : ''
                    }`}
                    onClick={() => handleProductSelect(product)}
                  >
                    <Card>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-sm line-clamp-2">{product.name}</h4>
                          <Badge
                            variant={product.stock_quantity > 0 ? 'success' : 'danger'}
                            className="text-xs"
                          >
                            {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                          </Badge>
                        </div>
                        
                        <div className="text-xs text-gray-500 space-y-1">
                          <p>SKU: {product.sku}</p>
                          <p>ID: {product.product_id}</p>
                          {product.category && <p>Category: {product.category.name}</p>}
                          <p>Stock: {product.stock_quantity} units</p>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="space-y-1">
                            <p className="font-bold text-green-600">
                              ₹{getDisplayPrice(product).toFixed(2)}
                            </p>
                            {product.mrp !== getDisplayPrice(product) && (
                              <p className="text-xs text-gray-500 line-through">
                                MRP: ₹{product.mrp.toFixed(2)}
                              </p>
                            )}
                          </div>
                          <Button
                            size="sm"
                            disabled={product.stock_quantity <= 0}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProductSelect(product);
                            }}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add
                          </Button>
                        </div>

                        {product.description && (
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {product.description}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Footer */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
