'use client';

import React from 'react';
// ProductDetails.tsx
import { Product } from "@/components/products/Product";


interface ProductDetailsProps {
  product: Product;
  onEdit?: () => void;
  onClose?: () => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">{product.name}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p><strong>SKU:</strong> {product.sku}</p>
          <p><strong>Price:</strong> ${product.price.toFixed(2)}</p>
          <p><strong>Stock:</strong> {product.stockQuantity}</p>
        </div>
        <div>
          <p><strong>Category:</strong> {product.category}</p>
          <p><strong>Brand:</strong> {product.brand}</p>
          <p><strong>Status:</strong> {product.status}</p>
        </div>
      </div>
      {product.image && (
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="w-48 h-48 object-cover rounded"
          />
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
