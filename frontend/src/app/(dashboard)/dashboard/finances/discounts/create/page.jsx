'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function CreateDiscountPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: '',
    startDate: '',
    endDate: '',
    usageLimit: '',
    minimumOrderAmount: '',
    description: '',
    isActive: true,
    applyToProducts: 'all',
    specificProducts: [],
    applyToCustomers: 'all',
    specificCustomerGroups: [],
    excludeSaleItems: false,
    allowCombination: false
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.code.trim()) {
      newErrors.code = 'Discount code is required';
    } else if (!/^[A-Z0-9_-]+$/.test(formData.code)) {
      newErrors.code = 'Code must contain only uppercase letters, numbers, underscores, and hyphens';
    }

    if (!formData.value) {
      newErrors.value = 'Discount value is required';
    } else if (formData.type === 'percentage' && (parseFloat(formData.value) <= 0 || parseFloat(formData.value) > 100)) {
      newErrors.value = 'Percentage must be between 0 and 100';
    } else if (formData.type === 'fixed' && parseFloat(formData.value) <= 0) {
      newErrors.value = 'Fixed amount must be greater than 0';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    } else if (formData.startDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    if (formData.usageLimit && parseInt(formData.usageLimit) < 0) {
      newErrors.usageLimit = 'Usage limit cannot be negative';
    }

    if (formData.minimumOrderAmount && parseFloat(formData.minimumOrderAmount) < 0) {
      newErrors.minimumOrderAmount = 'Minimum order amount cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call to create discount
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to discounts page on success
      router.push('/dashboard/finances/discounts');
    } catch (error) {
      console.error('Error creating discount:', error);
      setErrors(prev => ({
        ...prev,
        form: 'Failed to create discount. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Create New Discount</h1>
        <Link href="/dashboard/finances/discounts">
          <Button variant="outline">
            Cancel
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Basic Information */}
          <Card className="p-6 col-span-1 md:col-span-2">
            <h2 className="text-xl font-bold mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  className={`block w-full px-3 py-2 border ${errors.code ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="e.g., SUMMER2023"
                />
                {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code}</p>}
                <p className="mt-1 text-xs text-gray-500">Use uppercase letters, numbers, underscores, and hyphens only.</p>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Describe the purpose of this discount"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="percentage">Percentage Discount</option>
                    <option value="fixed">Fixed Amount Discount</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Value <span className="text-red-500">*</span>
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      {formData.type === 'percentage' ? (
                        <span className="text-gray-500 sm:text-sm">%</span>
                      ) : (
                        <span className="text-gray-500 sm:text-sm">$</span>
                      )}
                    </div>
                    <input
                      type="number"
                      id="value"
                      name="value"
                      value={formData.value}
                      onChange={handleChange}
                      className={`block w-full pl-7 pr-12 py-2 border ${errors.value ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      placeholder={formData.type === 'percentage' ? '10' : '10.00'}
                      step={formData.type === 'percentage' ? '1' : '0.01'}
                    />
                  </div>
                  {errors.value && <p className="mt-1 text-sm text-red-600">{errors.value}</p>}
                </div>
              </div>
            </div>
          </Card>

          {/* Settings */}
          <Card className="p-6 col-span-1">
            <h2 className="text-xl font-bold mb-4">Settings</h2>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  id="isActive"
                  name="isActive"
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                  Active
                </label>
              </div>

              <div className="pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <div className={`px-3 py-2 rounded-md text-sm ${formData.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {formData.isActive ? 'Active' : 'Inactive'}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {formData.isActive 
                    ? 'This discount will be available for use immediately after creation.' 
                    : 'This discount will be saved but not available for use until activated.'}
                </p>
              </div>
            </div>
          </Card>

          {/* Validity */}
          <Card className="p-6 col-span-1 md:col-span-2">
            <h2 className="text-xl font-bold mb-4">Validity Period</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className={`block w-full px-3 py-2 border ${errors.startDate ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className={`block w-full px-3 py-2 border ${errors.endDate ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
              </div>
            </div>
          </Card>

          {/* Usage Limits */}
          <Card className="p-6 col-span-1">
            <h2 className="text-xl font-bold mb-4">Usage Limits</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="usageLimit" className="block text-sm font-medium text-gray-700 mb-1">
                  Usage Limit
                </label>
                <input
                  type="number"
                  id="usageLimit"
                  name="usageLimit"
                  value={formData.usageLimit}
                  onChange={handleChange}
                  className={`block w-full px-3 py-2 border ${errors.usageLimit ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="Leave empty for unlimited"
                  min="0"
                />
                {errors.usageLimit && <p className="mt-1 text-sm text-red-600">{errors.usageLimit}</p>}
                <p className="mt-1 text-xs text-gray-500">Leave empty for unlimited usage.</p>
              </div>

              <div>
                <label htmlFor="minimumOrderAmount" className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Order Amount
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    id="minimumOrderAmount"
                    name="minimumOrderAmount"
                    value={formData.minimumOrderAmount}
                    onChange={handleChange}
                    className={`block w-full pl-7 pr-12 py-2 border ${errors.minimumOrderAmount ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
                {errors.minimumOrderAmount && <p className="mt-1 text-sm text-red-600">{errors.minimumOrderAmount}</p>}
                <p className="mt-1 text-xs text-gray-500">Leave empty for no minimum.</p>
              </div>
            </div>
          </Card>

          {/* Advanced Options */}
          <Card className="p-6 col-span-1 md:col-span-3">
            <h2 className="text-xl font-bold mb-4">Advanced Options</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apply To Products
                </label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      id="applyToProducts-all"
                      name="applyToProducts"
                      type="radio"
                      value="all"
                      checked={formData.applyToProducts === 'all'}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="applyToProducts-all" className="ml-2 block text-sm text-gray-900">
                      All products
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="applyToProducts-specific"
                      name="applyToProducts"
                      type="radio"
                      value="specific"
                      checked={formData.applyToProducts === 'specific'}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="applyToProducts-specific" className="ml-2 block text-sm text-gray-900">
                      Specific products
                    </label>
                  </div>
                </div>
                {formData.applyToProducts === 'specific' && (
                  <div className="mt-3">
                    <Button variant="outline" size="sm" type="button">
                      Select Products
                    </Button>
                    <p className="mt-1 text-xs text-gray-500">No products selected</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apply To Customers
                </label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      id="applyToCustomers-all"
                      name="applyToCustomers"
                      type="radio"
                      value="all"
                      checked={formData.applyToCustomers === 'all'}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="applyToCustomers-all" className="ml-2 block text-sm text-gray-900">
                      All customers
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="applyToCustomers-specific"
                      name="applyToCustomers"
                      type="radio"
                      value="specific"
                      checked={formData.applyToCustomers === 'specific'}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="applyToCustomers-specific" className="ml-2 block text-sm text-gray-900">
                      Specific customer groups
                    </label>
                  </div>
                </div>
                {formData.applyToCustomers === 'specific' && (
                  <div className="mt-3">
                    <Button variant="outline" size="sm" type="button">
                      Select Customer Groups
                    </Button>
                    <p className="mt-1 text-xs text-gray-500">No customer groups selected</p>
                  </div>
                )}
              </div>

              <div className="col-span-1 md:col-span-2 space-y-4">
                <div className="flex items-center">
                  <input
                    id="excludeSaleItems"
                    name="excludeSaleItems"
                    type="checkbox"
                    checked={formData.excludeSaleItems}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="excludeSaleItems" className="ml-2 block text-sm text-gray-900">
                    Exclude sale items
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="allowCombination"
                    name="allowCombination"
                    type="checkbox"
                    checked={formData.allowCombination}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="allowCombination" className="ml-2 block text-sm text-gray-900">
                    Allow combination with other discounts
                  </label>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {errors.form && (
          <div className="mt-6">
            <p className="text-sm text-red-600">{errors.form}</p>
          </div>
        )}

        <div className="mt-6 flex justify-end space-x-3">
          <Link href="/dashboard/finances/discounts">
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </>
            ) : 'Create Discount'}
          </Button>
        </div>
      </form>
    </div>
  );
}