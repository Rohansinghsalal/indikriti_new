import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input, Card } from '../ui';
import Modal from '../ui/Modal';
import { FiUpload, FiX, FiImage } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ProductForm = ({ isOpen, onClose, onSave, product = null }) => {
  const [selectedBrand, setSelectedBrand] = useState(product?.brand || 'indikriti');
  const [hierarchy, setHierarchy] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(product?.category_id || '');
  const [selectedSubcategory, setSelectedSubcategory] = useState(product?.subcategory_id || '');
  const [selectedProductType, setSelectedProductType] = useState(product?.product_type_id || '');
  const [images, setImages] = useState(product?.images || []);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm({
    defaultValues: {
      product_id: product?.product_id || '',
      sku: product?.sku || '',
      name: product?.name || '',
      description: product?.description || '',
      mrp: product?.mrp || '',
      selling_price: product?.selling_price || '',
      stock_quantity: product?.stock_quantity || 0,
      batch_no: product?.batch_no || '',
      status: product?.status || 'draft',
      product_style: product?.product_style || '',
      discount: product?.discount || 0,
      special_discount: product?.special_discount || 0
    }
  });

  // Fetch hierarchy when brand changes
  useEffect(() => {
    if (selectedBrand) {
      fetchHierarchy();
    }
  }, [selectedBrand]);

  // Reset form when product changes
  useEffect(() => {
    if (product) {
      reset({
        product_id: product.product_id || '',
        sku: product.sku || '',
        name: product.name || '',
        description: product.description || '',
        mrp: product.mrp || '',
        selling_price: product.selling_price || '',
        stock_quantity: product.stock_quantity || 0,
        batch_no: product.batch_no || '',
        status: product.status || 'draft',
        product_style: product.product_style || '',
        discount: product.discount || 0,
        special_discount: product.special_discount || 0
      });
      setSelectedBrand(product.brand || 'indikriti');
      setSelectedCategory(product.category_id || '');
      setSelectedSubcategory(product.subcategory_id || '');
      setSelectedProductType(product.product_type_id || '');
      setImages(product.images || []);
    }
  }, [product, reset]);

  const fetchHierarchy = async () => {
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
    }
  };

  // Get subcategories for selected category
  const getSubcategories = () => {
    const category = hierarchy.find(cat => cat.id.toString() === selectedCategory);
    // Handle both brand-specific and generic property names
    return category?.indikriti_subcategories || category?.winsomelane_subcategories || category?.subcategories || [];
  };

  // Get product types for selected subcategory
  const getProductTypes = () => {
    const subcategories = getSubcategories();
    const subcategory = subcategories.find(sub => sub.id.toString() === selectedSubcategory);
    // Handle both brand-specific and generic property names
    return subcategory?.indikriti_productTypes || subcategory?.winsomelane_productTypes || subcategory?.productTypes || [];
  };

  // Handle image upload
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    
    if (images.length + files.length > 3) {
      toast.error('Maximum 3 images allowed');
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages(prev => [...prev, {
          id: Date.now() + Math.random(),
          file,
          preview: e.target.result,
          is_primary: images.length === 0 // First image is primary
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove image
  const removeImage = (imageId) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== imageId);
      // If we removed the primary image, make the first remaining image primary
      if (filtered.length > 0 && !filtered.some(img => img.is_primary)) {
        filtered[0].is_primary = true;
      }
      return filtered;
    });
  };

  // Set primary image
  const setPrimaryImage = (imageId) => {
    setImages(prev => prev.map(img => ({
      ...img,
      is_primary: img.id === imageId
    })));
  };

  // Generate SKU automatically
  const generateSKU = () => {
    const brandPrefix = selectedBrand === 'indikriti' ? 'IND' : 'WSL';
    const timestamp = Date.now().toString().slice(-6);
    const randomNum = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    return `${brandPrefix}-${timestamp}-${randomNum}`;
  };

  // Generate Product ID automatically
  const generateProductId = () => {
    const brandPrefix = selectedBrand === 'indikriti' ? 'IND' : 'WSL';
    const timestamp = Date.now().toString().slice(-8);
    return `${brandPrefix}${timestamp}`;
  };

  const onSubmit = async (data) => {
    if (images.length === 0) {
      toast.error('At least one image is required');
      return;
    }

    if (!selectedCategory || !selectedSubcategory || !selectedProductType) {
      toast.error('Please select category, subcategory, and product type');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      
      // Add product data
      const productData = {
        ...data,
        brand: selectedBrand,
        // Backend expects these field names (without brand prefix)
        categoryId: parseInt(selectedCategory),
        subcategoryId: parseInt(selectedSubcategory),
        productTypeId: parseInt(selectedProductType),
        productType: 'general', // Required by backend
        mrp: parseFloat(data.mrp),
        selling_price: parseFloat(data.selling_price),
        stock_quantity: parseInt(data.stock_quantity),
        discount: parseFloat(data.discount || 0),
        special_discount: parseFloat(data.special_discount || 0)
      };

      // console.log('Product data being sent:', productData); // Debug log

      // Add product data to FormData
      Object.keys(productData).forEach(key => {
        formData.append(key, productData[key]);
      });

      // Add images
      images.forEach((image, index) => {
        if (image.file) {
          formData.append('images', image.file);
          formData.append(`image_${index}_is_primary`, image.is_primary);
        }
      });

      // Debug: Log FormData contents
      // console.log('FormData contents:');
      // for (let [key, value] of formData.entries()) {
      //   console.log(key, value);
      // }

      // Call the save function
      await onSave(formData);
      
      toast.success(product ? 'Product updated successfully' : 'Product created successfully');
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? 'Edit Product' : 'Create New Product'}
      size="full"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
        {/* Brand Selection */}
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Brand & Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brand *
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => {
                  setSelectedBrand(e.target.value);
                  setSelectedCategory('');
                  setSelectedSubcategory('');
                  setSelectedProductType('');
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="indikriti">Indikriti</option>
                <option value="winsomeLane">Winsome Lane</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedSubcategory('');
                  setSelectedProductType('');
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Category</option>
                {hierarchy.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subcategory *
              </label>
              <select
                value={selectedSubcategory}
                onChange={(e) => {
                  setSelectedSubcategory(e.target.value);
                  setSelectedProductType('');
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={!selectedCategory}
              >
                <option value="">Select Subcategory</option>
                {getSubcategories().map(subcategory => (
                  <option key={subcategory.id} value={subcategory.id}>
                    {subcategory.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Type *
              </label>
              <select
                value={selectedProductType}
                onChange={(e) => setSelectedProductType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={!selectedSubcategory}
              >
                <option value="">Select Product Type</option>
                {getProductTypes().map(productType => (
                  <option key={productType.id} value={productType.id}>
                    {productType.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Basic Information */}
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Input
                label="Product ID"
                {...register('product_id', { required: 'Product ID is required' })}
                error={errors.product_id?.message}
                placeholder="Auto-generated"
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="mt-1"
                onClick={() => setValue('product_id', generateProductId())}
              >
                Generate ID
              </Button>
            </div>

            <div>
              <Input
                label="SKU"
                {...register('sku', { required: 'SKU is required' })}
                error={errors.sku?.message}
                placeholder="Stock Keeping Unit"
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="mt-1"
                onClick={() => setValue('sku', generateSKU())}
              >
                Generate SKU
              </Button>
            </div>

            <Input
              label="Product Name"
              {...register('name', { required: 'Product name is required' })}
              error={errors.name?.message}
              placeholder="Enter product name"
            />

            <Input
              label="MRP (₹)"
              type="number"
              step="0.01"
              {...register('mrp', { required: 'MRP is required', min: 0 })}
              error={errors.mrp?.message}
              placeholder="Maximum Retail Price"
            />

            <Input
              label="Selling Price (₹)"
              type="number"
              step="0.01"
              {...register('selling_price', { min: 0 })}
              error={errors.selling_price?.message}
              placeholder="Selling price"
            />

            <Input
              label="Stock Quantity"
              type="number"
              {...register('stock_quantity', { required: 'Stock quantity is required', min: 0 })}
              error={errors.stock_quantity?.message}
              placeholder="Available stock"
            />

            <Input
              label="Batch Number"
              {...register('batch_no')}
              placeholder="Batch number for tracking"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                {...register('status')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Product description"
            />
          </div>
        </Card>

        {/* Additional Fields */}
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Additional Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Product Style"
              {...register('product_style')}
              placeholder="Style or variant"
            />

            <Input
              label="Discount (%)"
              type="number"
              step="0.01"
              {...register('discount', { min: 0, max: 100 })}
              error={errors.discount?.message}
              placeholder="Discount percentage"
            />

            <Input
              label="Special Discount (%)"
              type="number"
              step="0.01"
              {...register('special_discount', { min: 0, max: 100 })}
              error={errors.special_discount?.message}
              placeholder="Special discount"
            />
          </div>
        </Card>

        {/* Image Upload */}
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Product Images (Max 3, 1 Required)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {images.map((image, index) => (
              <div key={image.id} className="relative border-2 border-dashed border-gray-300 rounded-lg p-4">
                <img
                  src={image.preview || image.url}
                  alt={`Product ${index + 1}`}
                  className="w-full h-32 object-cover rounded"
                />
                <div className="absolute top-2 right-2 flex space-x-1">
                  {!image.is_primary && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setPrimaryImage(image.id)}
                      title="Set as primary"
                    >
                      ⭐
                    </Button>
                  )}
                  {image.is_primary && (
                    <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs">
                      Primary
                    </span>
                  )}
                  <Button
                    type="button"
                    size="sm"
                    variant="danger"
                    onClick={() => removeImage(image.id)}
                  >
                    <FiX className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}

            {images.length < 3 && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center h-32">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <FiUpload className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Upload Images</span>
                </label>
              </div>
            )}
          </div>

          {images.length === 0 && (
            <p className="text-red-500 text-sm">At least one image is required</p>
          )}
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={loading}>
            {product ? 'Update Product' : 'Create Product'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductForm;
