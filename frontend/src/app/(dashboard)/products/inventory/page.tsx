'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiPackage } from 'react-icons/fi';
import { Button } from '@/components/ui';
import ProductInventory from '@/components/products/ProductInventory';

export default function InventoryPage() {
  const [success, setSuccess] = useState<string | null>(null);

  const handleSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FiPackage size={24} className="text-indigo-600" />
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Inventory</h1>
            <p className="text-sm text-gray-500">Monitor and manage your stock levels</p>
          </div>
        </div>
        <Link href="/dashboard/products">
          <Button variant="outline">
            <FiArrowLeft className="mr-2" />
            Back to Products
          </Button>
        </Link>
      </div>

      {/* Success Alert */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-800 rounded-md p-4">
          ✅ {success}
        </div>
      )}

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <ProductInventory onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
