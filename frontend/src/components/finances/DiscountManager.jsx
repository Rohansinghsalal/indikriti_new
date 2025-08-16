'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Search } from 'lucide-react';
import DiscountForm from './DiscountForm';
import DiscountCard from './DiscountCard';

// Mock data for discounts
const mockDiscounts = [
  {
    id: 'disc-001',
    code: 'SUMMER2023',
    type: 'percentage',
    value: 15,
    minPurchase: 50,
    maxDiscount: 100,
    startDate: '2023-06-01T00:00:00Z',
    endDate: '2023-08-31T23:59:59Z',
    status: 'active',
    usageLimit: 1000,
    usageCount: 342,
    applicableTo: 'all_products',
    excludedProducts: [],
    description: 'Summer sale discount',
    createdAt: '2023-05-15T10:30:00Z',
    updatedAt: '2023-05-15T10:30:00Z'
  },
  {
    id: 'disc-002',
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    minPurchase: 0,
    maxDiscount: 50,
    startDate: '2023-01-01T00:00:00Z',
    endDate: '2023-12-31T23:59:59Z',
    status: 'active',
    usageLimit: 1,
    usageCount: 0,
    applicableTo: 'all_products',
    excludedProducts: [],
    description: 'New customer welcome discount',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 'disc-003',
    code: 'FREESHIP',
    type: 'fixed',
    value: 15,
    minPurchase: 75,
    maxDiscount: 15,
    startDate: '2023-04-01T00:00:00Z',
    endDate: '2023-12-31T23:59:59Z',
    status: 'active',
    usageLimit: 0,
    usageCount: 156,
    applicableTo: 'shipping',
    excludedProducts: [],
    description: 'Free shipping on orders over $75',
    createdAt: '2023-03-15T14:20:00Z',
    updatedAt: '2023-03-15T14:20:00Z'
  },
  {
    id: 'disc-004',
    code: 'FLASH50',
    type: 'percentage',
    value: 50,
    minPurchase: 100,
    maxDiscount: 200,
    startDate: '2023-05-01T00:00:00Z',
    endDate: '2023-05-02T23:59:59Z',
    status: 'expired',
    usageLimit: 500,
    usageCount: 487,
    applicableTo: 'selected_products',
    excludedProducts: [],
    description: 'Flash sale - 50% off selected items',
    createdAt: '2023-04-20T09:15:00Z',
    updatedAt: '2023-04-20T09:15:00Z'
  },
  {
    id: 'disc-005',
    code: 'LOYALTY25',
    type: 'percentage',
    value: 25,
    minPurchase: 200,
    maxDiscount: 0,
    startDate: '2023-01-01T00:00:00Z',
    endDate: '2023-12-31T23:59:59Z',
    status: 'active',
    usageLimit: 0,
    usageCount: 78,
    applicableTo: 'all_products',
    excludedProducts: ['electronics'],
    description: 'Loyalty program discount',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  }
];

const DiscountManager = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    // Simulate API call to fetch discounts
    const fetchDiscounts = async () => {
      try {
        // In a real app, this would be an API call
        setTimeout(() => {
          setDiscounts(mockDiscounts);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching discounts:', error);
        setLoading(false);
      }
    };

    fetchDiscounts();
  }, []);

  const handleCreateDiscount = (newDiscount) => {
    // In a real app, this would be an API call
    const discountWithId = {
      ...newDiscount,
      id: `disc-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: 0
    };

    setDiscounts([discountWithId, ...discounts]);
    setIsCreateDialogOpen(false);
  };

  const handleEditDiscount = (updatedDiscount) => {
    // In a real app, this would be an API call
    const updatedDiscounts = discounts.map(discount => 
      discount.id === updatedDiscount.id ? 
        { ...updatedDiscount, updatedAt: new Date().toISOString() } : 
        discount
    );

    setDiscounts(updatedDiscounts);
    setIsEditDialogOpen(false);
    setSelectedDiscount(null);
  };

  const handleDeleteDiscount = () => {
    // In a real app, this would be an API call
    if (selectedDiscount) {
      const updatedDiscounts = discounts.filter(
        discount => discount.id !== selectedDiscount.id
      );

      setDiscounts(updatedDiscounts);
      setIsDeleteDialogOpen(false);
      setSelectedDiscount(null);
    }
  };

  const handleToggleStatus = (discountId) => {
    // In a real app, this would be an API call
    const updatedDiscounts = discounts.map(discount => {
      if (discount.id === discountId) {
        const newStatus = discount.status === 'active' ? 'inactive' : 'active';
        return { 
          ...discount, 
          status: newStatus,
          updatedAt: new Date().toISOString() 
        };
      }
      return discount;
    });

    setDiscounts(updatedDiscounts);
  };

  const filteredDiscounts = discounts.filter(discount => {
    // Filter by search term
    const matchesSearch = 
      discount.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discount.description.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by tab
    let matchesTab = true;
    if (activeTab === 'active') {
      matchesTab = discount.status === 'active';
    } else if (activeTab === 'inactive') {
      matchesTab = discount.status === 'inactive';
    } else if (activeTab === 'expired') {
      matchesTab = discount.status === 'expired';
    }

    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Discount Management</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          Create Discount
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search discounts by code or description..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
          <TabsTrigger value="expired">Expired</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          {renderDiscountList(filteredDiscounts, loading)}
        </TabsContent>
        <TabsContent value="active" className="mt-4">
          {renderDiscountList(filteredDiscounts, loading)}
        </TabsContent>
        <TabsContent value="inactive" className="mt-4">
          {renderDiscountList(filteredDiscounts, loading)}
        </TabsContent>
        <TabsContent value="expired" className="mt-4">
          {renderDiscountList(filteredDiscounts, loading)}
        </TabsContent>
      </Tabs>

      {/* Create Discount Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Discount</DialogTitle>
          </DialogHeader>
          <DiscountForm onSubmit={handleCreateDiscount} onCancel={() => setIsCreateDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Discount Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Discount</DialogTitle>
          </DialogHeader>
          {selectedDiscount && (
            <DiscountForm 
              discount={selectedDiscount} 
              onSubmit={handleEditDiscount} 
              onCancel={() => setIsEditDialogOpen(false)} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete the discount code <strong>{selectedDiscount?.code}</strong>?</p>
            <p className="text-red-500 mt-2">This action cannot be undone.</p>
          </div>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteDiscount}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  function renderDiscountList(discounts, loading) {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-8">
          <p>Loading discounts...</p>
        </div>
      );
    }

    if (discounts.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-gray-500 mb-4">No discounts found</p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            Create Your First Discount
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {discounts.map(discount => (
          <DiscountCard 
            key={discount.id} 
            discount={discount} 
            onEdit={() => {
              setSelectedDiscount(discount);
              setIsEditDialogOpen(true);
            }}
            onDelete={() => {
              setSelectedDiscount(discount);
              setIsDeleteDialogOpen(true);
            }}
            onToggleStatus={() => handleToggleStatus(discount.id)}
          />
        ))}
      </div>
    );
  }
};

export default DiscountManager;