'use client';

import React, { useEffect, useState } from 'react';
import { FiEdit2, FiSave, FiXCircle } from 'react-icons/fi';
import { Button, Input, Alert } from '@/components/ui';
import api from '@/utils/api';
import { Product } from "@/components/products/Product";



interface ProductInventoryProps {
  onSuccess?: (message: string) => void;
}

export default function ProductInventory({ onSuccess }: ProductInventoryProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newStock, setNewStock] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
  let isMounted = true;

  const loadInventory = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.products.getAll();
      if (res.success && isMounted) {
        setProducts(res.data.products);
        if (typeof onSuccess === 'function') {
          onSuccess('Inventory loaded successfully');
        }
      } else if (!res.success) {
        setError(res.message || 'Failed to load products');
      }
    } catch {
      if (isMounted) {
        setError('Network error while fetching products');
      }
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  loadInventory();

  return () => {
    isMounted = false;
  };
}, []);



  const startEdit = (prod: Product) => {
    setEditingId(prod.id);
    setNewStock(prod.stockQuantity);
    setError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setError(null);
  };

  const saveEdit = async (id: string) => {
    setSaving(true);
    setError(null);
    try {
      const res = await api.products.update(id, { stockQuantity: newStock });
      if (res.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, stockQuantity: newStock } : p))
        );
        setEditingId(null);
        onSuccess?.(res.message || 'Stock updated successfully');
      } else {
        setError(res.message || 'Failed to update stock');
      }
    } catch {
      setError('Network error while updating stock');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-700">Loading inventory…</div>;
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
      {error && (
        <Alert variant="error" className="mb-4">
          {error}
        </Alert>
      )}

      <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Inventory</h2>

      <table className="min-w-full table-auto text-sm text-gray-800 border border-gray-300 rounded-lg overflow-hidden">
        <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
          <tr>
            <th className="px-4 py-3 text-left">ID</th>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">Stock</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod, index) => (
            <tr
              key={prod.id}
              className={`border-t border-gray-200 transition-all duration-150 hover:bg-indigo-50 hover:shadow-sm ${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
              }`}
            >
              <td className="px-4 py-3">{prod.id}</td>
              <td className="px-4 py-3">{prod.name}</td>
              <td className="px-4 py-3">
                {editingId === prod.id ? (
                  <Input
                    type="number"
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    className="w-24"
                  />
                ) : (
                  <span className="font-medium">{prod.stockQuantity}</span>
                )}
              </td>
              <td className="px-4 py-3 text-right space-x-2">
                {editingId === prod.id ? (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={saving}
                      onClick={() => saveEdit(prod.id)}
                    >
                      <FiSave className="mr-1" /> Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={cancelEdit}>
                      <FiXCircle className="mr-1" /> Cancel
                    </Button>
                  </>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => startEdit(prod)}>
                    <FiEdit2 className="mr-1" /> Edit
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
