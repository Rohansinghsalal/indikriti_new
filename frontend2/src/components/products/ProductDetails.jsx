import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { FiEdit, FiTrash2, FiPackage, FiTag, FiDollarSign } from 'react-icons/fi';

export default function ProductDetails({ product, onEdit, onDelete, onClose }) {
  if (!product) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">No product selected</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-sm text-gray-500">SKU: {product.sku}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onEdit(product)}>
            <FiEdit className="mr-2" />
            Edit
          </Button>
          <Button variant="danger" onClick={() => onDelete(product.id)}>
            <FiTrash2 className="mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Product Images */}
      {product.images && product.images.length > 0 && (
        <Card title="Product Images">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {product.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${product.name} ${index + 1}`}
                className="w-full h-32 object-cover rounded-md border"
              />
            ))}
          </div>
        </Card>
      )}

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Basic Information">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500">Product Name</label>
              <p className="text-gray-900">{product.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">SKU</label>
              <p className="text-gray-900">{product.sku}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Brand</label>
              <p className="text-gray-900">{product.brand}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Category</label>
              <p className="text-gray-900">{product.category}</p>
            </div>
            {product.subcategory && (
              <div>
                <label className="text-sm font-medium text-gray-500">Subcategory</label>
                <p className="text-gray-900">{product.subcategory}</p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                product.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {product.status}
              </span>
            </div>
          </div>
        </Card>

        <Card title="Pricing & Inventory">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FiDollarSign className="text-gray-400" />
              <div>
                <label className="text-sm font-medium text-gray-500">MRP</label>
                <p className="text-gray-900">₹{product.mrp?.toFixed(2) || '0.00'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FiTag className="text-gray-400" />
              <div>
                <label className="text-sm font-medium text-gray-500">Selling Price</label>
                <p className="text-gray-900 font-semibold">₹{product.sellingPrice?.toFixed(2) || product.price?.toFixed(2) || '0.00'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FiPackage className="text-gray-400" />
              <div>
                <label className="text-sm font-medium text-gray-500">Stock Quantity</label>
                <p className={`font-semibold ${
                  product.stockQuantity > 10 ? 'text-green-600' : 
                  product.stockQuantity > 0 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {product.stockQuantity}
                </p>
              </div>
            </div>
            {product.batchNo && (
              <div>
                <label className="text-sm font-medium text-gray-500">Batch Number</label>
                <p className="text-gray-900">{product.batchNo}</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Description */}
      {product.description && (
        <Card title="Description">
          <p className="text-gray-700">{product.description}</p>
        </Card>
      )}

      {/* Long Description */}
      {product.longDescription && (
        <Card title="Detailed Description">
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{product.longDescription}</p>
          </div>
        </Card>
      )}

      {/* USPs */}
      {product.usps && product.usps.length > 0 && (
        <Card title="Unique Selling Points">
          <ul className="space-y-2">
            {product.usps.map((usp, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-indigo-600 mt-1">•</span>
                <span className="text-gray-700">{usp}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Additional Information */}
      {(product.hsn || product.gst || product.productStyle) && (
        <Card title="Additional Information">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {product.hsn && (
              <div>
                <label className="text-sm font-medium text-gray-500">HSN Code</label>
                <p className="text-gray-900">{product.hsn}</p>
              </div>
            )}
            {product.gst && (
              <div>
                <label className="text-sm font-medium text-gray-500">GST (%)</label>
                <p className="text-gray-900">{product.gst}%</p>
              </div>
            )}
            {product.productStyle && (
              <div>
                <label className="text-sm font-medium text-gray-500">Product Style</label>
                <p className="text-gray-900">{product.productStyle}</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Close Button */}
      {onClose && (
        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      )}
    </div>
  );
}
