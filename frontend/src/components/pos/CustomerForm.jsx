'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Card, CardContent } from '@/components/ui/Card';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { Separator } from '@/components/ui/Separator';
import { Badge } from '@/components/ui/Badge';
import { Search, User, UserPlus, Phone, Mail, MapPin, Clock, Star } from 'lucide-react';

const CustomerForm = ({ onCustomerSelect, initialCustomer = null }) => {
  const [activeTab, setActiveTab] = useState('search');
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(initialCustomer);
  
  // New customer form state
  const [newCustomer, setNewCustomer] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    notes: ''
  });
  
  // Load mock customers
  useEffect(() => {
    const loadCustomers = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock customer data
        const mockCustomers = [
          {
            id: 'cust-1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '(555) 123-4567',
            address: '123 Main St',
            city: 'Anytown',
            state: 'CA',
            zipCode: '12345',
            totalSpent: 1245.67,
            orderCount: 8,
            lastPurchase: '2023-10-15',
            notes: 'Prefers email communication',
            isVIP: true
          },
          {
            id: 'cust-2',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@example.com',
            phone: '(555) 987-6543',
            address: '456 Oak Ave',
            city: 'Somewhere',
            state: 'NY',
            zipCode: '67890',
            totalSpent: 879.45,
            orderCount: 5,
            lastPurchase: '2023-11-02',
            notes: '',
            isVIP: false
          },
          {
            id: 'cust-3',
            firstName: 'Robert',
            lastName: 'Johnson',
            email: 'robert.j@example.com',
            phone: '(555) 456-7890',
            address: '789 Pine Rd',
            city: 'Elsewhere',
            state: 'TX',
            zipCode: '54321',
            totalSpent: 2567.89,
            orderCount: 12,
            lastPurchase: '2023-11-20',
            notes: 'Wholesale customer',
            isVIP: true
          },
          {
            id: 'cust-4',
            firstName: 'Sarah',
            lastName: 'Williams',
            email: 'sarah.w@example.com',
            phone: '(555) 234-5678',
            address: '321 Elm St',
            city: 'Nowhere',
            state: 'FL',
            zipCode: '98765',
            totalSpent: 456.78,
            orderCount: 3,
            lastPurchase: '2023-09-28',
            notes: '',
            isVIP: false
          },
          {
            id: 'cust-5',
            firstName: 'Michael',
            lastName: 'Brown',
            email: 'michael.b@example.com',
            phone: '(555) 876-5432',
            address: '654 Maple Dr',
            city: 'Anyplace',
            state: 'WA',
            zipCode: '13579',
            totalSpent: 1789.23,
            orderCount: 9,
            lastPurchase: '2023-11-15',
            notes: 'Allergic to latex',
            isVIP: false
          }
        ];
        
        setCustomers(mockCustomers);
        
        // Set initial customer if provided
        if (initialCustomer) {
          setSelectedCustomer(initialCustomer);
        }
      } catch (error) {
        console.error('Error loading customers:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCustomers();
  }, [initialCustomer]);
  
  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer => {
    const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    return fullName.includes(searchLower) || 
           customer.email.toLowerCase().includes(searchLower) || 
           customer.phone.includes(searchTerm);
  });
  
  // Handle customer selection
  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    if (onCustomerSelect) {
      onCustomerSelect(customer);
    }
  };
  
  // Handle new customer form input change
  const handleNewCustomerChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle new customer form submission
  const handleCreateCustomer = (e) => {
    e.preventDefault();
    
    // Create new customer object
    const customer = {
      id: `cust-${Date.now()}`,
      ...newCustomer,
      totalSpent: 0,
      orderCount: 0,
      lastPurchase: null,
      isVIP: false
    };
    
    // Add to customers list
    setCustomers([...customers, customer]);
    
    // Select the new customer
    handleSelectCustomer(customer);
    
    // Reset form
    setNewCustomer({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      notes: ''
    });
    
    // Switch to search tab
    setActiveTab('search');
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Render customer card
  const renderCustomerCard = (customer) => {
    const isSelected = selectedCustomer && selectedCustomer.id === customer.id;
    
    return (
      <Card 
        key={customer.id} 
        className={`mb-3 cursor-pointer transition-all ${isSelected ? 'ring-2 ring-primary' : 'hover:bg-gray-50'}`}
        onClick={() => handleSelectCustomer(customer)}
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex items-start space-x-3">
              <div className="bg-primary/10 rounded-full p-2 mt-1">
                <User className="h-5 w-5 text-primary" />
              </div>
              
              <div>
                <div className="flex items-center">
                  <h3 className="font-medium">
                    {customer.firstName} {customer.lastName}
                  </h3>
                  {customer.isVIP && (
                    <Badge className="ml-2 bg-amber-500">
                      <Star className="h-3 w-3 mr-1" />
                      VIP
                    </Badge>
                  )}
                </div>
                
                <div className="text-sm text-gray-500 mt-1 space-y-1">
                  <div className="flex items-center">
                    <Mail className="h-3 w-3 mr-2" />
                    {customer.email}
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-3 w-3 mr-2" />
                    {customer.phone}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-2" />
                    {customer.city}, {customer.state}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-right text-sm">
              <div className="font-medium">{formatCurrency(customer.totalSpent)}</div>
              <div className="text-gray-500">{customer.orderCount} orders</div>
              <div className="flex items-center justify-end mt-1 text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                {formatDate(customer.lastPurchase)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  return (
    <div className="h-full flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="search">
            <Search className="h-4 w-4 mr-2" />
            Find Customer
          </TabsTrigger>
          <TabsTrigger value="new">
            <UserPlus className="h-4 w-4 mr-2" />
            New Customer
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="search" className="flex-1 flex flex-col m-0">
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search by name, email or phone..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <ScrollArea className="flex-1">
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="bg-gray-200 rounded-full p-2 h-9 w-9" />
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                          <div className="space-y-1">
                            <div className="h-3 bg-gray-200 rounded w-2/3" />
                            <div className="h-3 bg-gray-200 rounded w-1/2" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredCustomers.length > 0 ? (
              <div>
                {filteredCustomers.map(customer => renderCustomerCard(customer))}
              </div>
            ) : (
              <div className="text-center py-8">
                <User className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">
                  {searchTerm ? 'No customers found' : 'Select a customer'}
                </h3>
                <p className="text-gray-500 mt-1">
                  {searchTerm 
                    ? 'Try a different search term or create a new customer' 
                    : 'Search for an existing customer or create a new one'}
                </p>
                <Button 
                  className="mt-4" 
                  onClick={() => setActiveTab('new')}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create New Customer
                </Button>
              </div>
            )}
          </ScrollArea>
          
          {selectedCustomer && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">
                    Selected: {selectedCustomer.firstName} {selectedCustomer.lastName}
                  </h3>
                  <p className="text-sm text-gray-500">{selectedCustomer.email}</p>
                </div>
                <Button onClick={() => onCustomerSelect(selectedCustomer)}>
                  Continue
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="new" className="flex-1 m-0">
          <form onSubmit={handleCreateCustomer} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={newCustomer.firstName}
                  onChange={handleNewCustomerChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={newCustomer.lastName}
                  onChange={handleNewCustomerChange}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={newCustomer.email}
                  onChange={handleNewCustomerChange}
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={newCustomer.phone}
                  onChange={handleNewCustomerChange}
                  required
                />
              </div>
            </div>
            
            <Separator />
            
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={newCustomer.address}
                onChange={handleNewCustomerChange}
              />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="col-span-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={newCustomer.city}
                  onChange={handleNewCustomerChange}
                />
              </div>
              
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  name="state"
                  value={newCustomer.state}
                  onChange={handleNewCustomerChange}
                />
              </div>
              
              <div>
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={newCustomer.zipCode}
                  onChange={handleNewCustomerChange}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                name="notes"
                value={newCustomer.notes}
                onChange={handleNewCustomerChange}
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setActiveTab('search')}
              >
                Cancel
              </Button>
              <Button type="submit">
                Create Customer
              </Button>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerForm;