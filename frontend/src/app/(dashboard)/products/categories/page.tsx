"use client";

import React, { useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import { Button } from "@/components/ui";
import ProductHierarchyManager from "@/components/products/ProductHierarchyManager";


import { Category } from "@/app/(dashboard)/dashboard/products/categories/categoryTypes";


export default function ProductCategoriesPage() {
  const [success, setSuccess] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]); // ✅ shared state
  

  const handleSuccess = (message: string) => {
    setSuccess(message);
    setTimeout(() => {
      setSuccess(null);
    }, 3000);
  };

  const handleCategoryChange = (updated: Category[]) => {
    setCategories(updated); // ✅ get updated list from ProductHierarchyManager
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Product Categories
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage product types, categories, and subcategories
          </p>
        </div>
        <Link href="/dashboard/products">
          <Button variant="outline">
            <FiArrowLeft className="mr-2" />
            Back to Products
          </Button>
        </Link>
      </div>

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-800 rounded-md p-4">
          {success}
        </div>
      )}

      {/* Product Hierarchy Manager */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <ProductHierarchyManager
          mode="manage"
          onCategoryChange={handleCategoryChange} // ✅ sync with local state
          onSuccess={handleSuccess} // ✅ show success messages if needed
        />
      </div>


    </div>
  );
}
