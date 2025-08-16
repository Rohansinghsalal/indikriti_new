'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Badge } from '@/components/ui/Badge';
import { Separator } from '@/components/ui/Separator';
import { Search, Plus, Minus, ShoppingCart, Tag, BarChart, Package } from 'lucide-react';
import { ScrollArea } from '@/components/ui/ScrollArea';

const ProductSelector = ({ onAddToCart, cart = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock data loading
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock product data
        const mockProducts = [
          {
            id: 'prod-1',
            name: 'T-Shirt - Basic',
            price: 19.99,
            category: 'clothing',
            image: '/images/products/tshirt.jpg',
            sku: 'CLO-TS-001',
            barcode: '123456789',
            stock: 45,
            taxable: true
          },
          {
            id: 'prod-2',
            name: 'Coffee Mug',
            price: 12.99,
            category: 'accessories',
            image: '/images/products/mug.jpg',
            sku: 'ACC-MG-001',
            barcode: '223456789',
            stock: 32,
            taxable: true
          },
          {
            id: 'prod-3',
            name: 'Notebook',
            price: 8.99,
            category: 'stationery',
            image: '/images/products/notebook.jpg',
            sku: 'STA-NB-001',
            barcode: '323456789',
            stock: 120,
            taxable: true
          },
          {
            id: 'prod-4',
            name: 'Wireless Headphones',
            price: 89.99,
            category: 'electronics',
            image: '/images/products/headphones.jpg',
            sku: 'ELE-HP-001',
            barcode: '423456789',
            stock: 18,
            taxable: true
          },
          {
            id: 'prod-5',
            name: 'Water Bottle',
            price: 15.99,
            category: 'accessories',
            image: '/images/products/bottle.jpg',
            sku: 'ACC-BT-001',
            barcode: '523456789',
            stock: 65,
            taxable: true
          },
          {
            id: 'prod-6',
            name: 'Smartphone Case',
            price: 24.99,
            category: 'electronics',
            image: '/images/products/phone-case.jpg',
            sku: 'ELE-PC-001',
            barcode: '623456789',
            stock: 42,
            taxable: true
          },
          {
            id: 'prod-7',
            name: 'Jeans',
            price: 49.99,
            category: 'clothing',
            image: '/images/products/jeans.jpg',
            sku: 'CLO-JN-001',
            barcode: '723456789',
            stock: 28,
            taxable: true
          },
          {
            id: 'prod-8',
            name: 'Desk Lamp',
            price: 34.99,
            category: 'home',
            image: '/images/products/lamp.jpg',
            sku: 'HOM-LP-001',
            barcode: '823456789',
            stock: 15,
            taxable: true
          },
          {
            id: 'prod-9',
            name: 'Backpack',
            price: 59.99,
            category: 'accessories',
            image: '/images/products/backpack.jpg',
            sku: 'ACC-BP-001',
            barcode: '923456789',
            stock: 22,
            taxable: true
          },
          {
            id: 'prod-10',
            name: 'Wireless Mouse',
            price: 29.99,
            category: 'electronics',
            image: '/images/products/mouse.jpg',
            sku: 'ELE-MS-001',
            barcode: '023456789',
            stock: 30,
            taxable: true
          },
          {
            id: 'prod-11',
            name: 'Gift Card $50',
            price: 50.00,
            category: 'gift-cards',
            image: '/images/products/gift-card.jpg',
            sku: 'GFT-50-001',
            barcode: '123456780',
            stock: 999,
            taxable: false
          },
          {
            id: 'prod-12',
            name: 'Gift Card $100',
            price: 100.00,
            category: 'gift-cards',
            image: '/images/products/gift-card.jpg',
            sku: 'GFT-100-001',
            barcode: '123456781',
            stock: 999,
            taxable: false
          }
        ];
        
        setProducts(mockProducts);
        
        // Extract unique categories
        const uniqueCategories = ['all', ...new Set(mockProducts.map(p => p.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProducts();
  }, []);
  
  // Filter products based on search term and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.barcode.includes(searchTerm);
    
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Get quantity of product in cart
  const getCartQuantity = (productId) => {
    const cartItem = cart.find(item => item.id === productId);
    return cartItem ? cartItem.quantity : 0;
  };
  
  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };
  
  // Render product card
  const renderProductCard = (product) => {
    const cartQuantity = getCartQuantity(product.id);
    
    return (
      <Card key={product.id} className="overflow-hidden">
        <div className="aspect-square relative bg-gray-100 flex items-center justify-center">
          {product.image ? (
            <div 
              className="w-full h-full bg-center bg-cover" 
              style={{ backgroundImage: `url(${product.image})` }}
            />
          ) : (
            <Package className="h-12 w-12 text-gray-400" />
          )}
          
          {product.stock <= 5 && (
            <Badge className="absolute top-2 right-2 bg-red-500">
              Low Stock: {product.stock}
            </Badge>
          )}
        </div>
        
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-medium line-clamp-1">{product.name}</h3>
              <div className="text-sm text-gray-500">{product.sku}</div>
            </div>
            <div className="font-bold">{formatPrice(product.price)}</div>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            {cartQuantity > 0 ? (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => onAddToCart(product, -1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{cartQuantity}</span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => onAddToCart(product, 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => onAddToCart(product, 1)}
                disabled={product.stock <= 0}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 flex space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search products by name, SKU or barcode..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <BarChart className="h-4 w-4" />
          Popular
        </Button>
      </div>
      
      <Tabs defaultValue="grid" className="flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="grid">Grid</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
          </TabsList>
          
          <div className="text-sm text-gray-500">
            {filteredProducts.length} products
          </div>
        </div>
        
        <div className="flex-1 flex">
          {/* Categories sidebar */}
          <div className="w-48 pr-4 hidden md:block">
            <h3 className="font-medium mb-2">Categories</h3>
            <div className="space-y-1">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'ghost'}
                  className="w-full justify-start text-left capitalize"
                  onClick={() => setSelectedCategory(category)}
                >
                  <Tag className="h-4 w-4 mr-2" />
                  {category === 'all' ? 'All Products' : category.replace('-', ' ')}
                </Button>
              ))}
            </div>
          </div>
          
          <Separator orientation="vertical" className="hidden md:block" />
          
          {/* Products grid/list */}
          <div className="flex-1 pl-0 md:pl-4">
            <ScrollArea className="h-[calc(100vh-240px)]">
              <TabsContent value="grid" className="m-0">
                {isLoading ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                      <Card key={i} className="animate-pulse">
                        <div className="aspect-square bg-gray-200" />
                        <CardContent className="p-4">
                          <div className="h-4 bg-gray-200 rounded mb-2" />
                          <div className="h-4 bg-gray-200 rounded w-1/2" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredProducts.map(product => renderProductCard(product))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 mx-auto text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium">No products found</h3>
                    <p className="text-gray-500">
                      Try adjusting your search or filter to find what you're looking for.
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="list" className="m-0">
                {isLoading ? (
                  <div className="space-y-2">
                    {[...Array(8)].map((_, i) => (
                      <Card key={i} className="animate-pulse">
                        <CardContent className="p-4 flex">
                          <div className="w-16 h-16 bg-gray-200 mr-4" />
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded mb-2" />
                            <div className="h-4 bg-gray-200 rounded w-1/2" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : filteredProducts.length > 0 ? (
                  <div className="space-y-2">
                    {filteredProducts.map(product => {
                      const cartQuantity = getCartQuantity(product.id);
                      
                      return (
                        <Card key={product.id}>
                          <CardContent className="p-4 flex items-center">
                            <div className="w-16 h-16 bg-gray-100 mr-4 flex-shrink-0">
                              {product.image ? (
                                <div 
                                  className="w-full h-full bg-center bg-cover" 
                                  style={{ backgroundImage: `url(${product.image})` }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="h-8 w-8 text-gray-400" />
                                </div>
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium truncate">{product.name}</h3>
                                  <div className="text-sm text-gray-500 flex items-center">
                                    <span>{product.sku}</span>
                                    {product.stock <= 5 && (
                                      <Badge className="ml-2 bg-red-500 text-xs">
                                        Low: {product.stock}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <div className="font-bold">{formatPrice(product.price)}</div>
                              </div>
                            </div>
                            
                            <div className="ml-4">
                              {cartQuantity > 0 ? (
                                <div className="flex items-center space-x-2">
                                  <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="h-8 w-8"
                                    onClick={() => onAddToCart(product, -1)}
                                  >
                                    <Minus className="h-4 w-4" />
                                  </Button>
                                  <span className="w-8 text-center">{cartQuantity}</span>
                                  <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="h-8 w-8"
                                    onClick={() => onAddToCart(product, 1)}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              ) : (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => onAddToCart(product, 1)}
                                  disabled={product.stock <= 0}
                                >
                                  <ShoppingCart className="h-4 w-4 mr-2" />
                                  Add
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 mx-auto text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium">No products found</h3>
                    <p className="text-gray-500">
                      Try adjusting your search or filter to find what you're looking for.
                    </p>
                  </div>
                )}
              </TabsContent>
            </ScrollArea>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default ProductSelector;