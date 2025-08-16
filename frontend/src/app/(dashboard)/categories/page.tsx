'use client';

import React, { useState, useEffect } from 'react';
import { FiPackage, FiPlus, FiEdit2, FiTrash2, FiChevronRight, FiChevronDown } from 'react-icons/fi';
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

export default function CategoriesPage() {
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
    } else {
      setCategories([]);
    }
  }, [selectedBrand]);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

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
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <FiPackage className="mr-3 text-2xl text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-900">Product Categories</h1>
        </div>
        <p className="text-gray-600">
          Organize your products with brand-specific hierarchical categories
        </p>
      </div>

      {/* Brand Selection Card */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 mb-6 text-white">
        <h2 className="text-xl font-semibold mb-4">Step 1: Select Your Brand</h2>
        <div className="max-w-md">
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
          >
            <option value="">Choose a brand to manage categories...</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>
        <p className="text-indigo-100 text-sm mt-2">
          Categories are brand-specific. You must select a brand before viewing or managing categories.
        </p>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{error}</p>
            </div>
          </div>
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{success}</p>
            </div>
          </div>
        </div>
      )}

      {/* Categories Section */}
      {selectedBrand ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Categories for {brands.find(b => b.id === selectedBrand)?.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Manage categories specific to this brand
                </p>
              </div>
              <Button 
                onClick={handleCreateCategory} 
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <FiPlus className="mr-2" />
                Add Category
              </Button>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <p className="mt-2 text-gray-600">Loading categories...</p>
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-12">
                <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No categories</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating your first category for this brand.
                </p>
                <div className="mt-6">
                  <Button 
                    onClick={handleCreateCategory}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    <FiPlus className="mr-2" />
                    Add Category
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid gap-4">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h4 className="font-medium text-gray-900">{category.name}</h4>
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                          category.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {category.status}
                        </span>
                      </div>
                      {category.description && (
                        <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">Sort Order: {category.sort_order}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditCategory(category)}
                        className="text-gray-600 hover:text-gray-900"
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
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <FiPackage className="mx-auto h-16 w-16 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Select a Brand First</h3>
          <p className="mt-2 text-gray-600">
            Choose a brand from the dropdown above to view and manage its categories.
          </p>
        </div>
      )}

      {/* Category Modal */}
      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Create New Category'}
        size="md"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name *
            </label>
            <Input
              value={categoryForm.name}
              onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
              placeholder="Enter category name"
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={categoryForm.description}
              onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
              placeholder="Enter category description (optional)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort Order
            </label>
            <Input
              type="number"
              value={categoryForm.sort_order}
              onChange={(e) => setCategoryForm({ ...categoryForm, sort_order: parseInt(e.target.value) || 0 })}
              placeholder="0"
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Lower numbers appear first in the list
            </p>
          </div>
          
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => setIsCategoryModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveCategory}
              disabled={loading || !categoryForm.name.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {loading ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
