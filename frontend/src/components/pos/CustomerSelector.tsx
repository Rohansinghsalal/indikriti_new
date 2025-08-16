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
import { Label } from '@/components/ui/Label';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { Card, CardContent } from '@/components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Search, User, Plus, Phone, Mail } from 'lucide-react';
import { api } from '@/utils/api';
import { toast } from 'sonner';

interface Customer {
  id?: number;
  name: string;
  email?: string;
  phone?: string;
  billing_address?: string;
  total_orders?: number;
  total_spent?: number;
}

interface CustomerSelectorProps {
  onSelect: (customer: Customer) => void;
  onClose: () => void;
}

export default function CustomerSelector({ onSelect, onClose }: CustomerSelectorProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('existing');
  
  // New customer form
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    billing_address: ''
  });

  useEffect(() => {
    if (activeTab === 'existing') {
      fetchCustomers();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'existing') {
      const delayedSearch = setTimeout(() => {
        fetchCustomers();
      }, 300);

      return () => clearTimeout(delayedSearch);
    }
  }, [search, activeTab]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const params: any = {
        limit: 50,
        page: 1
      };

      if (search) {
        params.search = search;
      }

      const response = await api.customers.getAll(params);
      
      if (response.success) {
        setCustomers(response.data.customers || []);
      } else {
        toast.error('Failed to fetch customers');
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerSelect = (customer: Customer) => {
    onSelect(customer);
    onClose();
  };

  const handleWalkInCustomer = () => {
    onSelect({
      name: 'Walk-in Customer'
    });
    onClose();
  };

  const handleCreateCustomer = async () => {
    if (!newCustomer.name.trim()) {
      toast.error('Customer name is required');
      return;
    }

    try {
      setLoading(true);
      const response = await api.customers.create(newCustomer);
      
      if (response.success) {
        toast.success('Customer created successfully');
        onSelect(response.data);
        onClose();
      } else {
        toast.error('Failed to create customer');
      }
    } catch (error) {
      console.error('Error creating customer:', error);
      toast.error('Failed to create customer');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickCustomer = () => {
    if (!newCustomer.name.trim()) {
      toast.error('Customer name is required');
      return;
    }

    // Create a temporary customer without saving to database
    onSelect({
      name: newCustomer.name,
      email: newCustomer.email || undefined,
      phone: newCustomer.phone || undefined
    });
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Select Customer</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="existing">Existing</TabsTrigger>
            <TabsTrigger value="new">New Customer</TabsTrigger>
            <TabsTrigger value="quick">Quick Add</TabsTrigger>
          </TabsList>

          <TabsContent value="existing" className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search customers by name, email, or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Walk-in Customer Option */}
            <Card className="cursor-pointer hover:shadow-md" onClick={handleWalkInCustomer}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-full">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Walk-in Customer</h4>
                    <p className="text-sm text-gray-500">No customer information required</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customers List */}
            <ScrollArea className="h-64">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : customers.length === 0 ? (
                <div className="text-center py-8">
                  <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">No customers found</p>
                  <p className="text-sm text-gray-400">Try adjusting your search</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {customers.map((customer) => (
                    <Card 
                      key={customer.id} 
                      className="cursor-pointer hover:shadow-md"
                      onClick={() => handleCustomerSelect(customer)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <h4 className="font-medium">{customer.name}</h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              {customer.email && (
                                <div className="flex items-center">
                                  <Mail className="h-3 w-3 mr-1" />
                                  {customer.email}
                                </div>
                              )}
                              {customer.phone && (
                                <div className="flex items-center">
                                  <Phone className="h-3 w-3 mr-1" />
                                  {customer.phone}
                                </div>
                              )}
                            </div>
                            {(customer.total_orders || customer.total_spent) && (
                              <div className="text-xs text-gray-400">
                                {customer.total_orders && `${customer.total_orders} orders`}
                                {customer.total_orders && customer.total_spent && ' • '}
                                {customer.total_spent && `₹${customer.total_spent.toFixed(2)} spent`}
                              </div>
                            )}
                          </div>
                          <Button size="sm">Select</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="new" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  placeholder="Customer name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  placeholder="customer@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  placeholder="+91 9876543210"
                />
              </div>
              <div>
                <Label htmlFor="address">Billing Address</Label>
                <Input
                  id="address"
                  value={newCustomer.billing_address}
                  onChange={(e) => setNewCustomer({ ...newCustomer, billing_address: e.target.value })}
                  placeholder="Customer address"
                />
              </div>
              <Button 
                onClick={handleCreateCustomer} 
                disabled={loading || !newCustomer.name.trim()}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Customer
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="quick" className="space-y-4">
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Quickly add customer information for this transaction only (not saved to database).
              </p>
              <div>
                <Label htmlFor="quick-name">Name *</Label>
                <Input
                  id="quick-name"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  placeholder="Customer name"
                />
              </div>
              <div>
                <Label htmlFor="quick-email">Email</Label>
                <Input
                  id="quick-email"
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  placeholder="customer@example.com"
                />
              </div>
              <div>
                <Label htmlFor="quick-phone">Phone</Label>
                <Input
                  id="quick-phone"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  placeholder="+91 9876543210"
                />
              </div>
              <Button 
                onClick={handleQuickCustomer} 
                disabled={!newCustomer.name.trim()}
                className="w-full"
              >
                Use for This Transaction
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
