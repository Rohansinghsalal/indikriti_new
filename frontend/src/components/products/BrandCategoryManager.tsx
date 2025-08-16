'use client';

import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiChevronRight, FiChevronDown } from 'react-icons/fi';
import { Button, Input } from '@/components/ui';
import Modal from '@/components/ui/Modal';
import api from '@/utils/api';

interface Brand {
  id: string;
  name: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
  status: string;
  sort_order: number;
}

interface BrandCategoryManagerProps {
  onClose?: () => void;
}

export default function BrandCategoryManager({ onClose }: BrandCategoryManagerProps) {
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Modal states
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    sort_order: 0
  });

  // Load brands on component mount
  useEffect(() => {
    loadBrands();
  }, []);

  // Load categories when brand is selected
  useEffect(() => {
    if (selectedBrand) {
      loadCategories(selectedBrand);
    }
  }, [selectedBrand]);

  const loadBrands = async () => {
    try {
      setLoading(true);
      const response = await api.brands.getAll();
      if (response.success) {
        setBrands(response.data);
      }
    } catch (error) {
      console.error('Failed to load brands:', error);
      setError('Failed to load brands');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async (brand: string) => {
    try {
      setLoading(true);
      setError(null);
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

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setCategoryForm({ name: '', description: '', sort_order: 0 });
    setIsCategoryModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description,
      sort_order: category.sort_order
    });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async () => {
    if (!selectedBrand || !categoryForm.name.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (editingCategory) {
        // Update existing category
        const response = await api.brandCategories.update(selectedBrand, editingCategory.id, categoryForm);
        if (response.success) {
          setSuccess('Category updated successfully');
          loadCategories(selectedBrand);
          setIsCategoryModalOpen(false);
        }
      } else {
        // Create new category
        const response = await api.brandCategories.create(selectedBrand, categoryForm);
        if (response.success) {
          setSuccess('Category created successfully');
          loadCategories(selectedBrand);
          setIsCategoryModalOpen(false);
        }
      }
    } catch (error) {
      console.error('Failed to save category:', error);
      setError('Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (category: Category) => {
    if (!confirm(`Are you sure you want to delete "${category.name}"?`)) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await api.brandCategories.delete(selectedBrand, category.id);
      if (response.success) {
        setSuccess('Category deleted successfully');
        loadCategories(selectedBrand);
      }
    } catch (error) {
      console.error('Failed to delete category:', error);
      setError('Failed to delete category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Brand Selection */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Brand-Specific Category Management</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Brand
          </label>
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Choose a brand...</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      {/* Categories Section */}
      {selectedBrand && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Categories</h3>
            <Button onClick={handleCreateCategory} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <FiPlus className="mr-2" />
              Add Category
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            <div className="space-y-2">
              {categories.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No categories found. Create your first category to get started.
                </div>
              ) : (
                categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">{category.name}</h4>
                      {category.description && (
                        <p className="text-sm text-gray-600">{category.description}</p>
                      )}
                      <p className="text-xs text-gray-500">Sort Order: {category.sort_order}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditCategory(category)}
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteCategory(category)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* Category Modal */}
      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Create Category'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <Input
              value={categoryForm.name}
              onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
              placeholder="Enter category name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={categoryForm.description}
              onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
              placeholder="Enter category description"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort Order
            </label>
            <Input
              type="number"
              value={categoryForm.sort_order}
              onChange={(e) => setCategoryForm({ ...categoryForm, sort_order: parseInt(e.target.value) || 0 })}
              placeholder="0"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsCategoryModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveCategory}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {loading ? 'Saving...' : editingCategory ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
