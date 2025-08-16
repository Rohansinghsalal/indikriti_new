import React, { useState, useEffect } from 'react';
import { Card, Button, Input } from '../components/ui';
import Modal from '../components/ui/Modal';
import { FiPlus, FiEdit, FiTrash2, FiChevronRight, FiChevronDown } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Categories = () => {
  const [selectedBrand, setSelectedBrand] = useState('indikriti');
  const [hierarchy, setHierarchy] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [expandedSubcategories, setExpandedSubcategories] = useState(new Set());

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // 'category', 'subcategory', 'productType'
  const [modalAction, setModalAction] = useState(''); // 'create', 'edit'
  const [selectedItem, setSelectedItem] = useState(null);
  const [parentId, setParentId] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sort_order: 0
  });

  // Fetch hierarchy data
  const fetchHierarchy = async () => {
    setLoading(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';
      const response = await fetch(`${API_BASE_URL}/products/brands/${selectedBrand}/hierarchy`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setHierarchy(data.data || []);
      } else {
        toast.error('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching hierarchy:', error);
      toast.error('Error loading categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHierarchy();
  }, [selectedBrand]);

  // Auto-expand categories that have subcategories and subcategories that have product types
  useEffect(() => {
    if (hierarchy.length > 0) {
      const categoriesWithSubcategories = hierarchy
        .filter(cat => cat.subcategories && cat.subcategories.length > 0)
        .map(cat => cat.id);

      const subcategoriesWithProductTypes = hierarchy
        .flatMap(cat => cat.subcategories || [])
        .filter(sub => sub.productTypes && sub.productTypes.length > 0)
        .map(sub => sub.id);

      if (categoriesWithSubcategories.length > 0) {
        setExpandedCategories(new Set(categoriesWithSubcategories));
      }

      if (subcategoriesWithProductTypes.length > 0) {
        setExpandedSubcategories(new Set(subcategoriesWithProductTypes));
      }
    }
  }, [hierarchy]);

  // Toggle expansion
  const toggleCategoryExpansion = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleSubcategoryExpansion = (subcategoryId) => {
    const newExpanded = new Set(expandedSubcategories);
    if (newExpanded.has(subcategoryId)) {
      newExpanded.delete(subcategoryId);
    } else {
      newExpanded.add(subcategoryId);
    }
    setExpandedSubcategories(newExpanded);
  };

  // Modal handlers
  const openModal = (type, action, item = null, parent = null) => {
    setModalType(type);
    setModalAction(action);
    setSelectedItem(item);
    setParentId(parent);

    if (item) {
      setFormData({
        name: item.name || '',
        description: item.description || '',
        sort_order: item.sort_order || 0
      });
    } else {
      setFormData({
        name: '',
        description: '',
        sort_order: 0
      });
    }

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType('');
    setModalAction('');
    setSelectedItem(null);
    setParentId(null);
    setFormData({ name: '', description: '', sort_order: 0 });
  };

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';
      let url = '';
      let method = modalAction === 'create' ? 'POST' : 'PUT';

      if (modalType === 'category') {
        url = modalAction === 'create'
          ? `${API_BASE_URL}/products/brands/${selectedBrand}/categories`
          : `${API_BASE_URL}/products/brands/${selectedBrand}/categories/${selectedItem.id}`;
      } else if (modalType === 'subcategory') {
        url = modalAction === 'create'
          ? `${API_BASE_URL}/products/brands/${selectedBrand}/categories/${parentId}/subcategories`
          : `${API_BASE_URL}/products/brands/${selectedBrand}/subcategories/${selectedItem.id}`;
      } else if (modalType === 'productType') {
        url = modalAction === 'create'
          ? `${API_BASE_URL}/products/brands/${selectedBrand}/subcategories/${parentId}/product-types`
          : `${API_BASE_URL}/products/brands/${selectedBrand}/product-types/${selectedItem.id}`;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success(`${modalType} ${modalAction}d successfully`);
        closeModal();
        fetchHierarchy();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || `Failed to ${modalAction} ${modalType}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(`Error ${modalAction}ing ${modalType}`);
    }
  };

  const handleDelete = async (type, item) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) {
      return;
    }

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';
      let url = '';
      if (type === 'category') {
        url = `${API_BASE_URL}/products/brands/${selectedBrand}/categories/${item.id}`;
      } else if (type === 'subcategory') {
        url = `${API_BASE_URL}/products/brands/${selectedBrand}/subcategories/${item.id}`;
      } else if (type === 'productType') {
        url = `${API_BASE_URL}/products/brands/${selectedBrand}/product-types/${item.id}`;
      }

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        toast.success(`${type} deleted successfully`);
        fetchHierarchy();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || `Failed to delete ${type}`);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error(`Error deleting ${type}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage hierarchical categories for both brands
          </p>
        </div>

        {/* Brand Selector */}
        <div className="flex items-center space-x-4">
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="indikriti">Indikriti</option>
            <option value="winsomeLane">Winsome Lane</option>
          </select>

          <Button
            leftIcon={<FiPlus />}
            onClick={() => openModal('category', 'create')}
          >
            Add Category
          </Button>
        </div>
      </div>

      {/* Categories Hierarchy */}
      <Card>
        {loading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading categories...</p>
          </div>
        ) : hierarchy.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">No categories found for {selectedBrand}</p>
            <Button
              className="mt-4"
              onClick={() => openModal('category', 'create')}
            >
              Create First Category
            </Button>
          </div>
        ) : (
          <div className="p-6">
            {hierarchy.map((category) => (
              <div key={category.id} className="mb-4">
                {/* Category Level */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleCategoryExpansion(category.id)}
                      className={`p-1 hover:bg-gray-200 rounded ${
                        (category.indikriti_subcategories || category.winsomelane_subcategories || category.subcategories) && (category.indikriti_subcategories || category.winsomelane_subcategories || category.subcategories).length > 0
                          ? 'text-blue-600'
                          : 'text-gray-400'
                      }`}
                      disabled={!(category.indikriti_subcategories || category.winsomelane_subcategories || category.subcategories) || (category.indikriti_subcategories || category.winsomelane_subcategories || category.subcategories).length === 0}
                    >
                      {expandedCategories.has(category.id) ? (
                        <FiChevronDown className="h-4 w-4" />
                      ) : (
                        <FiChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {category.name}
                        {(category.indikriti_subcategories || category.winsomelane_subcategories || category.subcategories) && (category.indikriti_subcategories || category.winsomelane_subcategories || category.subcategories).length > 0 && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {(category.indikriti_subcategories || category.winsomelane_subcategories || category.subcategories).length} subcategory{(category.indikriti_subcategories || category.winsomelane_subcategories || category.subcategories).length !== 1 ? 'ies' : ''}
                          </span>
                        )}
                      </h3>
                      {category.description && (
                        <p className="text-sm text-gray-500">{category.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openModal('subcategory', 'create', null, category.id)}
                    >
                      <FiPlus className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openModal('category', 'edit', category)}
                    >
                      <FiEdit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete('category', category)}
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Subcategories */}
                {expandedCategories.has(category.id) && (category.indikriti_subcategories || category.winsomelane_subcategories || category.subcategories) && (category.indikriti_subcategories || category.winsomelane_subcategories || category.subcategories).length > 0 && (
                  <div className="ml-6 mt-2 space-y-2">
                    {(category.indikriti_subcategories || category.winsomelane_subcategories || category.subcategories || []).map((subcategory) => (
                      <div key={subcategory.id}>
                        {/* Subcategory Level */}
                        <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => toggleSubcategoryExpansion(subcategory.id)}
                              className={`p-1 hover:bg-blue-100 rounded ${
                                (subcategory.indikriti_productTypes || subcategory.winsomelane_productTypes || subcategory.productTypes) && (subcategory.indikriti_productTypes || subcategory.winsomelane_productTypes || subcategory.productTypes).length > 0
                                  ? 'text-green-600'
                                  : 'text-gray-400'
                              }`}
                              disabled={!(subcategory.indikriti_productTypes || subcategory.winsomelane_productTypes || subcategory.productTypes) || (subcategory.indikriti_productTypes || subcategory.winsomelane_productTypes || subcategory.productTypes).length === 0}
                            >
                              {expandedSubcategories.has(subcategory.id) ? (
                                <FiChevronDown className="h-4 w-4" />
                              ) : (
                                <FiChevronRight className="h-4 w-4" />
                              )}
                            </button>
                            <div>
                              <h4 className="font-medium text-gray-800">
                                {subcategory.name}
                                {(subcategory.indikriti_productTypes || subcategory.winsomelane_productTypes || subcategory.productTypes) && (subcategory.indikriti_productTypes || subcategory.winsomelane_productTypes || subcategory.productTypes).length > 0 && (
                                  <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                    {(subcategory.indikriti_productTypes || subcategory.winsomelane_productTypes || subcategory.productTypes).length} product type{(subcategory.indikriti_productTypes || subcategory.winsomelane_productTypes || subcategory.productTypes).length !== 1 ? 's' : ''}
                                  </span>
                                )}
                              </h4>
                              {subcategory.description && (
                                <p className="text-sm text-gray-600">{subcategory.description}</p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openModal('productType', 'create', null, subcategory.id)}
                            >
                              <FiPlus className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openModal('subcategory', 'edit', subcategory)}
                            >
                              <FiEdit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => handleDelete('subcategory', subcategory)}
                            >
                              <FiTrash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        {/* Product Types */}
                        {expandedSubcategories.has(subcategory.id) && (subcategory.indikriti_productTypes || subcategory.winsomelane_productTypes || subcategory.productTypes) && (
                          <div className="ml-6 mt-1 space-y-1">
                            {(subcategory.indikriti_productTypes || subcategory.winsomelane_productTypes || subcategory.productTypes || []).map((productType) => (
                              <div key={productType.id} className="flex items-center justify-between p-2 bg-green-50 rounded">
                                <div>
                                  <h5 className="font-medium text-gray-700">{productType.name}</h5>
                                  {productType.description && (
                                    <p className="text-sm text-gray-500">{productType.description}</p>
                                  )}
                                </div>

                                <div className="flex items-center space-x-1">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => openModal('productType', 'edit', productType)}
                                  >
                                    <FiEdit className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="danger"
                                    onClick={() => handleDelete('productType', productType)}
                                  >
                                    <FiTrash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Modal for Create/Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={`${modalAction === 'create' ? 'Create' : 'Edit'} ${modalType}`}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder={`Enter ${modalType} name`}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Enter ${modalType} description (optional)`}
            />
          </div>

          <Input
            label="Sort Order"
            name="sort_order"
            type="number"
            value={formData.sort_order}
            onChange={handleInputChange}
            placeholder="0"
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit">
              {modalAction === 'create' ? 'Create' : 'Update'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Categories;
