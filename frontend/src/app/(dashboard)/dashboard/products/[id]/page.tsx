'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Trash2, ShoppingCart } from 'lucide-react';
import { Button, Alert } from '@/components/ui';
import Modal from '@/components/ui/Modal';
import Link from 'next/link';
import ProductHierarchyManager from '@/components/products/ProductHierarchyManager';

interface ProductDetailsProps {
  params: Promise<{
    id: string;
  }>;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  price: number;
  salePrice?: number;
  stockQuantity: number;
  category: string;
  images: string[];
  brand: string;
  status: 'active' | 'inactive' | 'draft';
  createdAt: string;
  updatedAt: string;
}

export default function ProductDetailsPage({ params }: ProductDetailsProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [id, setId] = useState<string>('');

  // Resolve params Promise in Next.js 15
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        // Here you would fetch the product details from your API
        // const response = await api.products.getById(id);

        // For now, simulate a product
        setTimeout(() => {
          setProduct({
            id,
            name: 'Sample Product',
            sku: 'PROD-' + id,
            description: 'This is a sample product description that shows details about the product.',
            price: 99.99,
            salePrice: 79.99,
            stockQuantity: 25,
            category: 'Electronics',
            images: ['/assets/images/placeholder.jpg'],
            brand: 'Sample Brand',
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
          setLoading(false);
        }, 1000);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch product details');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    try {
      // Here you would call your API to delete the product
      // await api.products.delete(id);

      // For now, simulate a successful deletion
      setTimeout(() => {
        // Redirect to products list after successful deletion
        window.location.href = '/products';
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete product');
      setIsDeleteModalOpen(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading product details...</div>;
  }

  if (error) {
    return <div className="p-6"><Alert variant="error">{error}</Alert></div>;
  }

  if (!product) {
    return <div className="p-6"><Alert variant="error">Product not found</Alert></div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link href="/products" className="inline-flex items-center text-indigo-600 hover:text-indigo-900">
          <ArrowLeft className="mr-2" />
          Back to Products
        </Link>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">{product.name}</h1>
        <div className="flex space-x-3">
          <Link href={`/products/${id}/edit`}>
            <Button className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Button
            className="bg-red-100 text-red-700 hover:bg-red-200"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            <Trash2 className="mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 p-6">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-auto rounded-lg"
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                No image available
              </div>
            )}

            <div className="mt-4 grid grid-cols-5 gap-2">
              {product.images && product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  className="w-full h-auto rounded cursor-pointer border-2 border-transparent hover:border-indigo-500"
                />
              ))}
            </div>
          </div>

          <div className="md:w-2/3 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">SKU</h3>
                <p className="mt-1 text-lg">{product.sku}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <p className="mt-1">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${product.status === 'active' ? 'bg-green-100 text-green-800' :
                    product.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                    {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                  </span>
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Price</h3>
                <div className="mt-1 flex items-end">
                  <p className="text-lg font-medium text-gray-900">${product.price.toFixed(2)}</p>
                  {product.salePrice && (
                    <p className="ml-2 text-sm line-through text-gray-500">${product.salePrice.toFixed(2)}</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Stock</h3>
                <p className={`mt-1 text-lg ${product.stockQuantity > 10 ? 'text-green-600' : product.stockQuantity > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
                </p>
              </div>

              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="mt-1 text-gray-900">{product.description}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Category</h3>
                <p className="mt-1">{product.category}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Brand</h3>
                <p className="mt-1">{product.brand}</p>
              </div>
            </div>

            <div className="mt-8">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                <ShoppingCart className="mr-2" />
                Add to Stock
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Product"
        size="sm"
      >
        <div className="p-6">
          <p className="mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
          <div className="flex justify-end space-x-3">
            <Button
              className="bg-gray-100 text-gray-700 hover:bg-gray-200"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
} 

