'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Label } from '@/components/ui/Label';
import { Switch } from '@/components/ui/Switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioGroup';
import { Checkbox } from '@/components/ui/Checkbox';

const DiscountForm = ({ discount, onSubmit, onCancel }) => {
  const initialFormData = {
    code: '',
    type: 'percentage',
    value: '',
    minPurchase: '',
    maxDiscount: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
    status: 'active',
    usageLimit: '',
    applicableTo: 'all_products',
    excludedProducts: [],
    description: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  
  // Mock product categories for the form
  const productCategories = [
    { id: 'electronics', name: 'Electronics' },
    { id: 'clothing', name: 'Clothing' },
    { id: 'home', name: 'Home & Kitchen' },
    { id: 'books', name: 'Books' },
    { id: 'toys', name: 'Toys & Games' }
  ];

  useEffect(() => {
    if (discount) {
      // Format dates for input fields
      const formattedDiscount = {
        ...discount,
        startDate: discount.startDate ? new Date(discount.startDate).toISOString().split('T')[0] : '',
        endDate: discount.endDate ? new Date(discount.endDate).toISOString().split('T')[0] : ''
      };
      setFormData(formattedDiscount);
    }
  }, [discount]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleNumberInputChange = (e) => {
    const { name, value } = e.target;
    // Allow empty string or valid numbers
    if (value === '' || !isNaN(value)) {
      setFormData({
        ...formData,
        [name]: value
      });
      
      // Clear error when field is edited
      if (errors[name]) {
        setErrors({
          ...errors,
          [name]: ''
        });
      }
    }
  };
  
  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSwitchChange = (name, checked) => {
    setFormData({
      ...formData,
      [name]: checked ? 'active' : 'inactive'
    });
  };

  const handleExcludedProductsChange = (categoryId, checked) => {
    let updatedExcludedProducts = [...formData.excludedProducts];
    
    if (checked) {
      if (!updatedExcludedProducts.includes(categoryId)) {
        updatedExcludedProducts.push(categoryId);
      }
    } else {
      updatedExcludedProducts = updatedExcludedProducts.filter(id => id !== categoryId);
    }
    
    setFormData({
      ...formData,
      excludedProducts: updatedExcludedProducts
    });
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.code.trim()) {
      newErrors.code = 'Discount code is required';
    } else if (!/^[A-Z0-9_-]+$/.test(formData.code)) {
      newErrors.code = 'Code must contain only uppercase letters, numbers, underscores, and hyphens';
    }
    
    if (!formData.value || formData.value <= 0) {
      newErrors.value = 'Value must be greater than 0';
    } else if (formData.type === 'percentage' && formData.value > 100) {
      newErrors.value = 'Percentage cannot exceed 100%';
    }
    
    if (formData.minPurchase && formData.minPurchase < 0) {
      newErrors.minPurchase = 'Minimum purchase cannot be negative';
    }
    
    if (formData.maxDiscount && formData.maxDiscount < 0) {
      newErrors.maxDiscount = 'Maximum discount cannot be negative';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    } else if (formData.startDate && formData.endDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    
    if (formData.usageLimit && formData.usageLimit < 0) {
      newErrors.usageLimit = 'Usage limit cannot be negative';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Format the data for submission
      const submissionData = {
        ...formData,
        value: parseFloat(formData.value),
        minPurchase: formData.minPurchase ? parseFloat(formData.minPurchase) : 0,
        maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : 0,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : 0,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate + 'T23:59:59').toISOString()
      };
      
      onSubmit(submissionData);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="code">
            Discount Code <span className="text-red-500">*</span>
          </Label>
          <Input
            id="code"
            name="code"
            placeholder="e.g., SUMMER2023"
            value={formData.code}
            onChange={handleInputChange}
            className={errors.code ? 'border-red-500' : ''}
          />
          {errors.code && (
            <p className="text-red-500 text-sm mt-1">{errors.code}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Use uppercase letters, numbers, underscores, and hyphens only
          </p>
        </div>
        
        <div>
          <Label htmlFor="status">Status</Label>
          <div className="flex items-center space-x-2 mt-2">
            <Switch
              id="status"
              checked={formData.status === 'active'}
              onCheckedChange={(checked) => handleSwitchChange('status', checked)}
            />
            <span>{formData.status === 'active' ? 'Active' : 'Inactive'}</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">
            Discount Type <span className="text-red-500">*</span>
          </Label>
          <RadioGroup 
            value={formData.type} 
            onValueChange={(value) => handleSelectChange('type', value)}
            className="flex space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="percentage" id="percentage" />
              <Label htmlFor="percentage">Percentage (%)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="fixed" id="fixed" />
              <Label htmlFor="fixed">Fixed Amount</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div>
          <Label htmlFor="value">
            {formData.type === 'percentage' ? 'Percentage' : 'Amount'} <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            {formData.type === 'fixed' && (
              <span className="absolute left-3 top-2.5">$</span>
            )}
            <Input
              id="value"
              name="value"
              type="number"
              step={formData.type === 'percentage' ? '1' : '0.01'}
              min="0"
              max={formData.type === 'percentage' ? '100' : undefined}
              placeholder={formData.type === 'percentage' ? '10' : '10.00'}
              value={formData.value}
              onChange={handleNumberInputChange}
              className={`${errors.value ? 'border-red-500' : ''} ${formData.type === 'fixed' ? 'pl-7' : ''}`}
            />
            {formData.type === 'percentage' && (
              <span className="absolute right-3 top-2.5">%</span>
            )}
          </div>
          {errors.value && (
            <p className="text-red-500 text-sm mt-1">{errors.value}</p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="minPurchase">Minimum Purchase Amount</Label>
          <div className="relative">
            <span className="absolute left-3 top-2.5">$</span>
            <Input
              id="minPurchase"
              name="minPurchase"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.minPurchase}
              onChange={handleNumberInputChange}
              className={`${errors.minPurchase ? 'border-red-500' : ''} pl-7`}
            />
          </div>
          {errors.minPurchase && (
            <p className="text-red-500 text-sm mt-1">{errors.minPurchase}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="maxDiscount">Maximum Discount Amount</Label>
          <div className="relative">
            <span className="absolute left-3 top-2.5">$</span>
            <Input
              id="maxDiscount"
              name="maxDiscount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00 (no limit)"
              value={formData.maxDiscount}
              onChange={handleNumberInputChange}
              className={`${errors.maxDiscount ? 'border-red-500' : ''} pl-7`}
            />
          </div>
          {errors.maxDiscount && (
            <p className="text-red-500 text-sm mt-1">{errors.maxDiscount}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Leave empty for no maximum limit
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">
            Start Date <span className="text-red-500">*</span>
          </Label>
          <Input
            id="startDate"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleInputChange}
            className={errors.startDate ? 'border-red-500' : ''}
          />
          {errors.startDate && (
            <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="endDate">
            End Date <span className="text-red-500">*</span>
          </Label>
          <Input
            id="endDate"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleInputChange}
            className={errors.endDate ? 'border-red-500' : ''}
          />
          {errors.endDate && (
            <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
          )}
        </div>
      </div>
      
      <div>
        <Label htmlFor="usageLimit">Usage Limit Per Customer</Label>
        <Input
          id="usageLimit"
          name="usageLimit"
          type="number"
          min="0"
          step="1"
          placeholder="0 (unlimited)"
          value={formData.usageLimit}
          onChange={handleNumberInputChange}
          className={errors.usageLimit ? 'border-red-500' : ''}
        />
        {errors.usageLimit && (
          <p className="text-red-500 text-sm mt-1">{errors.usageLimit}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Enter 0 or leave empty for unlimited usage
        </p>
      </div>
      
      <div>
        <Label htmlFor="applicableTo">
          Applicable To <span className="text-red-500">*</span>
        </Label>
        <Select 
          value={formData.applicableTo} 
          onValueChange={(value) => handleSelectChange('applicableTo', value)}
        >
          <SelectTrigger id="applicableTo">
            <SelectValue placeholder="Select where discount applies" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all_products">All Products</SelectItem>
            <SelectItem value="selected_products">Selected Products</SelectItem>
            <SelectItem value="selected_categories">Selected Categories</SelectItem>
            <SelectItem value="shipping">Shipping Only</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {(formData.applicableTo === 'all_products' || formData.applicableTo === 'selected_categories') && (
        <div>
          <Label>Excluded Product Categories</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {productCategories.map(category => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`category-${category.id}`}
                  checked={formData.excludedProducts.includes(category.id)}
                  onCheckedChange={(checked) => handleExcludedProductsChange(category.id, checked)}
                />
                <Label htmlFor={`category-${category.id}`}>{category.name}</Label>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          rows={3}
          placeholder="Enter a description for this discount"
          value={formData.description}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {discount ? 'Update Discount' : 'Create Discount'}
        </Button>
      </div>
    </form>
  );
};

export default DiscountForm;