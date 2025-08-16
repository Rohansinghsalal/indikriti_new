"use client";

import React from "react";
import ProductHierarchyManager from "@/components/products/ProductHierarchyManager";

export default function ProductCategoriesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Category Hierarchy Management</h1>
        <p className="text-gray-600">Manage the complete 4-level product hierarchy for both brands</p>
      </div>

      <ProductHierarchyManager />
    </div>
  );
}
