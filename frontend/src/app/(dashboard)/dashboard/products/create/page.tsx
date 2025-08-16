'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Enhanced4LevelProductForm from '@/components/products/Enhanced4LevelProductForm';
import { Alert } from '@/components/ui';
import { api } from '@/utils/api';

export default function CreateProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (productData: any) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Convert the product data to FormData format expected by the API
      const formData = new FormData();

      // Map the brand-specific form data to the API format
      formData.append('name', productData.name);
      formData.append('description', productData.description);
      formData.append('mrp', productData.mrp.toString());
      formData.append('selling_price', productData.sellingPrice?.toString() || productData.mrp.toString());
      formData.append('stock_quantity', productData.stockQuantity?.toString() || '0');
      formData.append('batch_no', productData.batchNo || '');
      formData.append('brand', productData.brand);

      // Send brand-specific hierarchy IDs
      formData.append('categoryId', productData.categoryId);
      formData.append('subcategoryId', productData.subcategoryId);
      formData.append('productTypeId', productData.productTypeId);

      // Keep legacy fields for backward compatibility
      formData.append('category_id', productData.categoryId);
      formData.append('subcategory_id', productData.subcategoryId);
      formData.append('product_type_id', '1'); // Default fallback

      formData.append('status', productData.status || 'draft');

      if (productData.hsn) formData.append('hsn', productData.hsn);
      if (productData.gst) formData.append('gst', productData.gst.toString());

      // Call the API to create a product
      const response = await api.products.create(formData);

      if (response.success) {
        // Redirect to product list on success
        router.push('/dashboard/products');
      } else {
        setError(response.message || 'Failed to create product');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating the product');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Add New Product</h1>
        <p className="text-sm text-gray-500 mt-1">
          Fill in the details to add a new product to your inventory
        </p>
      </div>
      
      {error && <Alert variant="error">{error}</Alert>}
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <Enhanced4LevelProductForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          onClose={() => router.push('/dashboard/products')}
        />
      </div>
    </div>
  );
} 