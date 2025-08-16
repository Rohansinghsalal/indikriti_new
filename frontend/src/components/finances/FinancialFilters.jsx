'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';
import { Calendar } from '@/components/ui/Calendar';
import { Badge } from '@/components/ui/Badge';
import { Slider } from '@/components/ui/Slider';
import { Switch } from '@/components/ui/Switch';
import { Search, Calendar as CalendarIcon, X, Filter, ChevronDown, Save } from 'lucide-react';

const FinancialFilters = ({ onFilterChange, savedFilters = [], onSaveFilter }) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [searchTerm, setSearchTerm] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [amountRange, setAmountRange] = useState([0, 10000]);
  const [showRefunded, setShowRefunded] = useState(true);
  const [showDisputed, setShowDisputed] = useState(true);
  const [activeFilters, setActiveFilters] = useState([]);
  const [isSaveFilterOpen, setIsSaveFilterOpen] = useState(false);
  const [filterName, setFilterName] = useState('');
  
  // Transaction type options
  const transactionTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'sale', label: 'Sales' },
    { value: 'refund', label: 'Refunds' },
    { value: 'payout', label: 'Payouts' },
    { value: 'transfer', label: 'Transfers' },
    { value: 'fee', label: 'Fees' },
    { value: 'adjustment', label: 'Adjustments' }
  ];
  
  // Payment status options
  const paymentStatuses = [
    { value: 'all', label: 'All Statuses' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
    { value: 'failed', label: 'Failed' },
    { value: 'refunded', label: 'Refunded' },
    { value: 'partially_refunded', label: 'Partially Refunded' },
    { value: 'disputed', label: 'Disputed' }
  ];
  
  // Payment method options
  const paymentMethods = [
    { value: 'all', label: 'All Methods' },
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'debit_card', label: 'Debit Card' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'cash', label: 'Cash' },
    { value: 'store_credit', label: 'Store Credit' },
    { value: 'crypto', label: 'Cryptocurrency' }
  ];
  
  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  const handleSearch = () => {
    // Build active filters array for display
    const newActiveFilters = [];
    
    if (searchTerm) {
      newActiveFilters.push({ key: 'search', label: `Search: ${searchTerm}` });
    }
    
    if (dateRange.from && dateRange.to) {
      newActiveFilters.push({ 
        key: 'dateRange', 
        label: `Date: ${formatDate(dateRange.from)} - ${formatDate(dateRange.to)}` 
      });
    } else if (dateRange.from) {
      newActiveFilters.push({ 
        key: 'dateRange', 
        label: `Date: From ${formatDate(dateRange.from)}` 
      });
    } else if (dateRange.to) {
      newActiveFilters.push({ 
        key: 'dateRange', 
        label: `Date: Until ${formatDate(dateRange.to)}` 
      });
    }
    
    if (transactionType && transactionType !== 'all') {
      const typeLabel = transactionTypes.find(t => t.value === transactionType)?.label;
      newActiveFilters.push({ key: 'transactionType', label: `Type: ${typeLabel}` });
    }
    
    if (paymentStatus && paymentStatus !== 'all') {
      const statusLabel = paymentStatuses.find(s => s.value === paymentStatus)?.label;
      newActiveFilters.push({ key: 'paymentStatus', label: `Status: ${statusLabel}` });
    }
    
    if (paymentMethod && paymentMethod !== 'all') {
      const methodLabel = paymentMethods.find(m => m.value === paymentMethod)?.label;
      newActiveFilters.push({ key: 'paymentMethod', label: `Method: ${methodLabel}` });
    }
    
    if (amountRange[0] > 0 || amountRange[1] < 10000) {
      newActiveFilters.push({ 
        key: 'amountRange', 
        label: `Amount: ${formatCurrency(amountRange[0])} - ${formatCurrency(amountRange[1])}` 
      });
    }
    
    if (!showRefunded) {
      newActiveFilters.push({ key: 'hideRefunded', label: 'Hide Refunded' });
    }
    
    if (!showDisputed) {
      newActiveFilters.push({ key: 'hideDisputed', label: 'Hide Disputed' });
    }
    
    setActiveFilters(newActiveFilters);
    
    // Create filter object to pass to parent
    const filters = {
      searchTerm,
      dateRange,
      transactionType: transactionType || 'all',
      paymentStatus: paymentStatus || 'all',
      paymentMethod: paymentMethod || 'all',
      amountRange,
      showRefunded,
      showDisputed
    };
    
    // Call the parent's filter change handler
    if (onFilterChange) {
      onFilterChange(filters);
    }
    
    // Close advanced filters if open
    setIsAdvancedOpen(false);
  };
  
  const handleClearFilters = () => {
    setSearchTerm('');
    setDateRange({ from: null, to: null });
    setTransactionType('');
    setPaymentStatus('');
    setPaymentMethod('');
    setAmountRange([0, 10000]);
    setShowRefunded(true);
    setShowDisputed(true);
    setActiveFilters([]);
    
    // Call the parent's filter change handler with default values
    if (onFilterChange) {
      onFilterChange({
        searchTerm: '',
        dateRange: { from: null, to: null },
        transactionType: 'all',
        paymentStatus: 'all',
        paymentMethod: 'all',
        amountRange: [0, 10000],
        showRefunded: true,
        showDisputed: true
      });
    }
  };
  
  const handleRemoveFilter = (key) => {
    // Remove the filter from active filters
    const newActiveFilters = activeFilters.filter(filter => filter.key !== key);
    setActiveFilters(newActiveFilters);
    
    // Reset the corresponding filter value
    switch (key) {
      case 'search':
        setSearchTerm('');
        break;
      case 'dateRange':
        setDateRange({ from: null, to: null });
        break;
      case 'transactionType':
        setTransactionType('');
        break;
      case 'paymentStatus':
        setPaymentStatus('');
        break;
      case 'paymentMethod':
        setPaymentMethod('');
        break;
      case 'amountRange':
        setAmountRange([0, 10000]);
        break;
      case 'hideRefunded':
        setShowRefunded(true);
        break;
      case 'hideDisputed':
        setShowDisputed(true);
        break;
      default:
        break;
    }
    
    // Update filters
    handleSearch();
  };
  
  const handleSaveCurrentFilter = () => {
    if (!filterName.trim()) return;
    
    const filterToSave = {
      id: `filter-${Date.now()}`,
      name: filterName,
      filters: {
        searchTerm,
        dateRange,
        transactionType: transactionType || 'all',
        paymentStatus: paymentStatus || 'all',
        paymentMethod: paymentMethod || 'all',
        amountRange,
        showRefunded,
        showDisputed
      }
    };
    
    if (onSaveFilter) {
      onSaveFilter(filterToSave);
    }
    
    setFilterName('');
    setIsSaveFilterOpen(false);
  };
  
  const handleApplySavedFilter = (savedFilter) => {
    const { filters } = savedFilter;
    
    setSearchTerm(filters.searchTerm || '');
    setDateRange(filters.dateRange || { from: null, to: null });
    setTransactionType(filters.transactionType || '');
    setPaymentStatus(filters.paymentStatus || '');
    setPaymentMethod(filters.paymentMethod || '');
    setAmountRange(filters.amountRange || [0, 10000]);
    setShowRefunded(filters.showRefunded !== undefined ? filters.showRefunded : true);
    setShowDisputed(filters.showDisputed !== undefined ? filters.showDisputed : true);
    
    // Apply the filters
    handleSearch();
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search by transaction ID, customer, or description..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                {dateRange.from || dateRange.to ? (
                  <span>
                    {dateRange.from ? formatDate(dateRange.from) : 'Start'} - 
                    {dateRange.to ? formatDate(dateRange.to) : 'End'}
                  </span>
                ) : (
                  <span>Date Range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={{
                  from: dateRange.from,
                  to: dateRange.to
                }}
                onSelect={setDateRange}
                initialFocus
              />
              <div className="flex items-center justify-between p-3 border-t">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setDateRange({ from: null, to: null })}
                >
                  Clear
                </Button>
                <Button 
                  size="sm"
                  onClick={() => handleSearch()}
                >
                  Apply
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          
          <Popover open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Advanced Filters
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[350px] md:w-[450px]" align="end">
              <div className="space-y-4">
                <h3 className="font-medium">Advanced Filters</h3>
                
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="transaction-type">Transaction Type</Label>
                    <Select 
                      value={transactionType} 
                      onValueChange={setTransactionType}
                    >
                      <SelectTrigger id="transaction-type">
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        {transactionTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="payment-status">Payment Status</Label>
                    <Select 
                      value={paymentStatus} 
                      onValueChange={setPaymentStatus}
                    >
                      <SelectTrigger id="payment-status">
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentStatuses.map(status => (
                          <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="payment-method">Payment Method</Label>
                    <Select 
                      value={paymentMethod} 
                      onValueChange={setPaymentMethod}
                    >
                      <SelectTrigger id="payment-method">
                        <SelectValue placeholder="All Methods" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.map(method => (
                          <SelectItem key={method.value} value={method.value}>{method.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <div className="flex justify-between">
                      <Label>Amount Range</Label>
                      <span className="text-sm text-gray-500">
                        {formatCurrency(amountRange[0])} - {formatCurrency(amountRange[1])}
                      </span>
                    </div>
                    <Slider
                      defaultValue={[0, 10000]}
                      value={amountRange}
                      min={0}
                      max={10000}
                      step={100}
                      onValueChange={setAmountRange}
                      className="mt-2"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="show-refunded"
                        checked={showRefunded}
                        onCheckedChange={setShowRefunded}
                      />
                      <Label htmlFor="show-refunded">Show Refunded Transactions</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="show-disputed"
                        checked={showDisputed}
                        onCheckedChange={setShowDisputed}
                      />
                      <Label htmlFor="show-disputed">Show Disputed Transactions</Label>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between pt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleClearFilters}
                  >
                    Clear All
                  </Button>
                  <Button 
                    size="sm"
                    onClick={handleSearch}
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Button onClick={handleSearch}>Search</Button>
        </div>
      </div>
      
      {/* Active filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-500">Active Filters:</span>
          {activeFilters.map((filter, index) => (
            <Badge key={index} variant="outline" className="flex items-center gap-1">
              {filter.label}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleRemoveFilter(filter.key)}
              />
            </Badge>
          ))}
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs"
            onClick={handleClearFilters}
          >
            Clear All
          </Button>
          
          {onSaveFilter && (
            <Popover open={isSaveFilterOpen} onOpenChange={setIsSaveFilterOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="ml-auto text-xs flex items-center gap-1"
                >
                  <Save className="h-3 w-3" />
                  Save Filter
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[250px]" align="end">
                <div className="space-y-4">
                  <h3 className="font-medium">Save Current Filter</h3>
                  <div>
                    <Label htmlFor="filter-name">Filter Name</Label>
                    <Input
                      id="filter-name"
                      value={filterName}
                      onChange={(e) => setFilterName(e.target.value)}
                      placeholder="e.g., Recent Refunds"
                    />
                  </div>
                  <Button 
                    onClick={handleSaveCurrentFilter}
                    disabled={!filterName.trim()}
                    className="w-full"
                  >
                    Save
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      )}
      
      {/* Saved filters */}
      {savedFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-500">Saved Filters:</span>
          <Select onValueChange={(value) => {
            const selectedFilter = savedFilters.find(filter => filter.id === value);
            if (selectedFilter) {
              handleApplySavedFilter(selectedFilter);
            }
          }}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select a saved filter" />
            </SelectTrigger>
            <SelectContent>
              {savedFilters.map(filter => (
                <SelectItem key={filter.id} value={filter.id}>{filter.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default FinancialFilters;