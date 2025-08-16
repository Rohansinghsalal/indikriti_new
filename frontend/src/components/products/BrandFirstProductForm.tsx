'use client';

import React, { useState, useEffect } from 'react';
import { FiPackage, FiTag, FiDollarSign, FiHash } from 'react-icons/fi';
import { Button, Input } from '@/components/ui';
import api from '@/utils/api';

interface Brand {
  id: string;
  name: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
}

interface BrandFirstProductFormProps {
  initialData?: any;
  onSubmit: (formData: FormData) => void;
  isSubmitting?: boolean;
}

export default function BrandFirstProductForm({ 
  initialData, 
  onSubmit, 
  isSubmitting = false 
}: BrandFirstProductFormProps) {
  const [formData, setFormData] = useState({
    product_id: '',
    sku: '',
    name: '',
    description: '',
    mrp: '',
    selling_price: '',
    stock_quantity: '',
    batch_no: '',
    brand: '',
    status: 'draft',
    // Brand-specific fields
    indikriti_category_id: '',
    winsomelane_category_id: '',
    indikriti_subcategory_id: '',
    winsomelane_subcategory_id: '',
    indikriti_product_type_id: '',
    winsomelane_product_type_id: ''
  });

  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load brands on component mount
  useEffect(() => {
    loadBrands();
  }, []);

  // Load categories when brand changes
  useEffect(() => {
    if (formData.brand) {
      loadCategories(formData.brand);
    } else {
      setCategories([]);
    }
  }, [formData.brand]);

  // Initialize form with existing data
  useEffect(() => {
    if (initialData) {
      setFormData({
        product_id: initialData.product_id || '',
        sku: initialData.sku || '',
        name: initialData.name || '',
        description: initialData.description || '',
        mrp: initialData.mrp?.toString() || '',
        selling_price: initialData.selling_price?.toString() || '',
        stock_quantity: initialData.stock_quantity?.toString() || '',
        batch_no: initialData.batch_no || '',
        brand: initialData.brand || '',
        status: initialData.status || 'draft',
        indikriti_category_id: initialData.indikriti_category_id?.toString() || '',
        winsomelane_category_id: initialData.winsomelane_category_id?.toString() || '',
        indikriti_subcategory_id: initialData.indikriti_subcategory_id?.toString() || '',
        winsomelane_subcategory_id: initialData.winsomelane_subcategory_id?.toString() || '',
        indikriti_product_type_id: initialData.indikriti_product_type_id?.toString() || '',
        winsomelane_product_type_id: initialData.winsomelane_product_type_id?.toString() || ''
      });
    }
  }, [initialData]);

  const loadBrands = async () => {
    try {
      const response = await api.brands.getAll();
      if (response.success) {
        setBrands(response.data);
      }
    } catch (error) {
      console.error('Failed to load brands:', error);
      setError('Failed to load brands');
    }
  };

  const loadCategories = async (brand: string) => {
    try {
      setLoading(true);
      const response = await api.brandCategories.getByBrand(brand);
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBrandChange = (brand: string) => {
    // Reset brand-specific fields when brand changes
    setFormData(prev => ({
      ...prev,
      brand,
      indikriti_category_id: '',
      winsomelane_category_id: '',
      indikriti_subcategory_id: '',
      winsomelane_subcategory_id: '',
      indikriti_product_type_id: '',
      winsomelane_product_type_id: ''
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.brand) {
      setError('Please select a brand first');
      return;
    }
    
    if (!formData.name || !formData.sku || !formData.mrp) {
      setError('Please fill in all required fields');
      return;
    }

    // Validate brand-specific category
    const hasCategory = formData.brand === 'indikriti' 
      ? formData.indikriti_category_id 
      : formData.winsomelane_category_id;
    
    if (!hasCategory) {
      setError('Please select a category for the chosen brand');
      return;
    }

    // Create FormData object
    const submitData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) {
        submitData.append(key, value);
      }
    });

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Brand Selection - First and Required */}
      <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          Step 1: Select Brand *
        </h3>
        <select
          value={formData.brand}
          onChange={(e) => handleBrandChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Choose a brand...</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>
        <p className="text-sm text-blue-700 mt-2">
          You must select a brand before proceeding with product details.
        </p>
      </div>

      {/* Brand-Specific Category Selection */}
      {formData.brand && (
        <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
          <h3 className="text-lg font-semibold text-green-900 mb-3">
            Step 2: Select Category for {brands.find(b => b.id === formData.brand)?.name} *
          </h3>
          {loading ? (
            <div className="text-center py-2">Loading categories...</div>
          ) : (
            <select
              value={formData.brand === 'indikriti' ? formData.indikriti_category_id : formData.winsomelane_category_id}
              onChange={(e) => handleInputChange(
                formData.brand === 'indikriti' ? 'indikriti_category_id' : 'winsomelane_category_id',
                e.target.value
              )}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Choose a category...</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name} {category.description && `- ${category.description}`}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* Basic Product Information */}
      {formData.brand && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product ID *
            </label>
            <Input
              value={formData.product_id}
              onChange={(e) => handleInputChange('product_id', e.target.value)}
              placeholder="Enter unique product ID"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SKU *
            </label>
            <Input
              value={formData.sku}
              onChange={(e) => handleInputChange('sku', e.target.value)}
              placeholder="Enter SKU"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter product name"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter product description"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              MRP *
            </label>
            <Input
              type="number"
              step="0.01"
              value={formData.mrp}
              onChange={(e) => handleInputChange('mrp', e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Selling Price
            </label>
            <Input
              type="number"
              step="0.01"
              value={formData.selling_price}
              onChange={(e) => handleInputChange('selling_price', e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock Quantity
            </label>
            <Input
              type="number"
              value={formData.stock_quantity}
              onChange={(e) => handleInputChange('stock_quantity', e.target.value)}
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Batch Number
            </label>
            <Input
              value={formData.batch_no}
              onChange={(e) => handleInputChange('batch_no', e.target.value)}
              placeholder="Enter batch number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      )}

      {/* Submit Button */}
      {formData.brand && (
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {isSubmitting ? 'Saving...' : initialData ? 'Update Product' : 'Create Product'}
          </Button>
        </div>
      )}
    </form>
  );
}
