'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FiInfo, FiChevronRight } from 'react-icons/fi';
import { api } from '@/utils/api';
import { Button, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

interface Brand {
  id: string;
  name: string;
}

interface Category {
  id: number;
  name: string;
  description?: string;
  subcategories?: Subcategory[];
}

interface Subcategory {
  id: number;
  name: string;
  description?: string;
  productTypes?: ProductType[];
}

interface ProductType {
  id: number;
  name: string;
  description?: string;
}

interface Enhanced4LevelProductFormData {
  name: string;
  description: string;
  mrp: number;
  sellingPrice: number;
  stockQuantity: number;
  batchNo: string;
  brand: string;
  categoryId: string;
  subcategoryId: string;
  productTypeId: string;
  status: 'draft' | 'active' | 'inactive';
  hsn?: string;
  gst?: number;
}

interface Enhanced4LevelProductFormProps {
  onSubmit: (data: Enhanced4LevelProductFormData) => void;
  onClose: () => void;
  isSubmitting?: boolean;
  initialData?: Partial<Enhanced4LevelProductFormData>;
}

export default function Enhanced4LevelProductForm({
  onSubmit,
  onClose,
  isSubmitting = false,
  initialData
}: Enhanced4LevelProductFormProps) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);
  const [loadingProductTypes, setLoadingProductTypes] = useState(false);
  const [error, setError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<Enhanced4LevelProductFormData>({
    defaultValues: {
      name: '',
      description: '',
      mrp: 0,
      sellingPrice: 0,
      stockQuantity: 0,
      batchNo: '',
      brand: '',
      categoryId: '',
      subcategoryId: '',
      productTypeId: '',
      status: 'draft',
      hsn: '',
      gst: 0,
      ...initialData
    }
  });

  const watchedBrand = watch('brand');
  const watchedCategory = watch('categoryId');
  const watchedSubcategory = watch('subcategoryId');

  // Load brands on component mount
  useEffect(() => {
    const loadBrands = async () => {
      try {
        const response = await api.brandCategories.getBrands();
        if (response.success) {
          setBrands(response.data);
        }
      } catch (error) {
        console.error('Error loading brands:', error);
        setError('Failed to load brands');
      }
    };

    loadBrands();
  }, []);

  // Load categories when brand changes
  useEffect(() => {
    if (watchedBrand) {
      loadCategoriesByBrand(watchedBrand);
      setSelectedBrand(watchedBrand);
      // Reset dependent fields
      setValue('categoryId', '');
      setValue('subcategoryId', '');
      setValue('productTypeId', '');
      setSubcategories([]);
      setProductTypes([]);
    } else {
      setCategories([]);
      setSubcategories([]);
      setProductTypes([]);
      setSelectedBrand('');
    }
  }, [watchedBrand, setValue]);

  // Load subcategories when category changes
  useEffect(() => {
    if (watchedBrand && watchedCategory) {
      loadSubcategoriesByBrandAndCategory(watchedBrand, watchedCategory);
      setSelectedCategory(watchedCategory);
      // Reset dependent fields
      setValue('subcategoryId', '');
      setValue('productTypeId', '');
      setProductTypes([]);
    } else {
      setSubcategories([]);
      setProductTypes([]);
      setSelectedCategory('');
    }
  }, [watchedBrand, watchedCategory, setValue]);

  // Load product types when subcategory changes
  useEffect(() => {
    if (watchedBrand && watchedSubcategory) {
      loadProductTypesByBrandAndSubcategory(watchedBrand, watchedSubcategory);
      setSelectedSubcategory(watchedSubcategory);
      // Reset dependent fields
      setValue('productTypeId', '');
    } else {
      setProductTypes([]);
      setSelectedSubcategory('');
    }
  }, [watchedBrand, watchedSubcategory, setValue]);

  const loadCategoriesByBrand = async (brand: string) => {
    setLoadingCategories(true);
    setError('');

    try {
      const response = await api.brandCategories.getByBrand(brand);
      if (response.success) {
        setCategories(response.data);
      } else {
        setError('Failed to load categories for selected brand');
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      setError('Failed to load categories');
    } finally {
      setLoadingCategories(false);
    }
  };

  const loadSubcategoriesByBrandAndCategory = async (brand: string, categoryId: string) => {
    setLoadingSubcategories(true);
    setError('');

    try {
      const response = await api.enhanced4LevelHierarchy.getSubcategories(brand, categoryId);
      if (response.success) {
        setSubcategories(response.data);
      } else {
        setError('Failed to load subcategories');
      }
    } catch (error) {
      console.error('Error loading subcategories:', error);
      setError('Failed to load subcategories');
    } finally {
      setLoadingSubcategories(false);
    }
  };

  const loadProductTypesByBrandAndSubcategory = async (brand: string, subcategoryId: string) => {
    setLoadingProductTypes(true);
    setError('');

    try {
      const response = await api.enhanced4LevelHierarchy.getProductTypes(brand, subcategoryId);
      if (response.success) {
        setProductTypes(response.data);
      } else {
        setError('Failed to load product types');
      }
    } catch (error) {
      console.error('Error loading product types:', error);
      setError('Failed to load product types');
    } finally {
      setLoadingProductTypes(false);
    }
  };

  const handleFormSubmit = (data: Enhanced4LevelProductFormData) => {
    if (!data.brand) {
      setError('Please select a brand');
      return;
    }

    if (!data.categoryId) {
      setError('Please select a category');
      return;
    }

    if (!data.subcategoryId) {
      setError('Please select a subcategory');
      return;
    }

    if (!data.productTypeId) {
      setError('Please select a product type');
      return;
    }

    setError('');
    onSubmit(data);
  };

  const renderStepIndicator = () => {
    const steps = [
      { name: 'Brand', completed: !!selectedBrand },
      { name: 'Category', completed: !!selectedCategory },
      { name: 'Subcategory', completed: !!selectedSubcategory },
      { name: 'Product Type', completed: !!watch('productTypeId') }
    ];

    return (
      <div className="flex items-center justify-center mb-6">
        {steps.map((step, index) => (
          <React.Fragment key={step.name}>
            <div className={`flex items-center ${step.completed ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
              }`}>
                {index + 1}
              </div>
              <span className="ml-2 text-sm font-medium">{step.name}</span>
            </div>
            {index < steps.length - 1 && (
              <FiChevronRight className="mx-3 text-gray-400" />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Product - Enhanced 4-Level Hierarchy</CardTitle>
          {renderStepIndicator()}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex items-start">
                  <FiInfo className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Step 1: Brand Selection */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex items-start">
                <FiInfo className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-800">Step 1: Select Brand</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Choose the brand for this product. This determines the available categories.
                  </p>
                </div>
              </div>
              
              <div className="mt-4">
                <Label htmlFor="brand">Brand *</Label>
                <Select onValueChange={(value) => setValue('brand', value)} defaultValue={initialData?.brand}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand.message}</p>}
              </div>
            </div>

            {/* Step 2: Category Selection */}
            {selectedBrand && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <div className="flex items-start">
                  <FiInfo className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-green-800">Step 2: Select Category</h4>
                    <p className="text-sm text-green-700 mt-1">
                      Choose a category for your {brands.find(b => b.id === selectedBrand)?.name} product.
                    </p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Label htmlFor="categoryId">Category *</Label>
                  {loadingCategories ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                      <span className="ml-2 text-sm text-gray-600">Loading categories...</span>
                    </div>
                  ) : (
                    <Select onValueChange={(value) => setValue('categoryId', value)} defaultValue={initialData?.categoryId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>}
                </div>
              </div>
            )}

            {/* Step 3: Subcategory Selection */}
            {selectedCategory && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div className="flex items-start">
                  <FiInfo className="text-yellow-600 mt-1 mr-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Step 3: Select Subcategory</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Choose a subcategory within the selected category.
                    </p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Label htmlFor="subcategoryId">Subcategory *</Label>
                  {loadingSubcategories ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-600"></div>
                      <span className="ml-2 text-sm text-gray-600">Loading subcategories...</span>
                    </div>
                  ) : (
                    <Select onValueChange={(value) => setValue('subcategoryId', value)} defaultValue={initialData?.subcategoryId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        {subcategories.map((subcategory) => (
                          <SelectItem key={subcategory.id} value={subcategory.id.toString()}>
                            {subcategory.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {errors.subcategoryId && <p className="text-red-500 text-sm mt-1">{errors.subcategoryId.message}</p>}
                </div>
              </div>
            )}

            {/* Step 4: Product Type Selection */}
            {selectedSubcategory && (
              <div className="bg-purple-50 border border-purple-200 rounded-md p-4">
                <div className="flex items-start">
                  <FiInfo className="text-purple-600 mt-1 mr-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-purple-800">Step 4: Select Product Type</h4>
                    <p className="text-sm text-purple-700 mt-1">
                      Choose the specific product type within the subcategory.
                    </p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Label htmlFor="productTypeId">Product Type *</Label>
                  {loadingProductTypes ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                      <span className="ml-2 text-sm text-gray-600">Loading product types...</span>
                    </div>
                  ) : (
                    <Select onValueChange={(value) => setValue('productTypeId', value)} defaultValue={initialData?.productTypeId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a product type" />
                      </SelectTrigger>
                      <SelectContent>
                        {productTypes.map((productType) => (
                          <SelectItem key={productType.id} value={productType.id.toString()}>
                            {productType.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {errors.productTypeId && <p className="text-red-500 text-sm mt-1">{errors.productTypeId.message}</p>}
                </div>
              </div>
            )}

            {/* Product Details */}
            {watch('productTypeId') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    {...register('name', { required: 'Product name is required' })}
                    placeholder="Enter product name"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <Label htmlFor="mrp">MRP *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register('mrp', { 
                      required: 'MRP is required',
                      min: { value: 0, message: 'MRP must be greater than 0' }
                    })}
                    placeholder="0.00"
                  />
                  {errors.mrp && <p className="text-red-500 text-sm mt-1">{errors.mrp.message}</p>}
                </div>

                <div>
                  <Label htmlFor="sellingPrice">Selling Price</Label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register('sellingPrice')}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <Label htmlFor="stockQuantity">Stock Quantity</Label>
                  <Input
                    type="number"
                    {...register('stockQuantity')}
                    placeholder="0"
                  />
                </div>

                <div>
                  <Label htmlFor="batchNo">Batch Number</Label>
                  <Input
                    {...register('batchNo')}
                    placeholder="Enter batch number"
                  />
                </div>

                <div>
                  <Label htmlFor="hsn">HSN Code</Label>
                  <Input
                    {...register('hsn')}
                    placeholder="Enter HSN code"
                  />
                </div>

                <div>
                  <Label htmlFor="gst">GST (%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register('gst')}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select onValueChange={(value) => setValue('status', value as any)} defaultValue={initialData?.status || 'draft'}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Description */}
            {watch('productTypeId') && (
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  {...register('description')}
                  placeholder="Enter product description"
                  rows={4}
                />
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || !watch('productTypeId')}
                className="min-w-[120px]"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </div>
                ) : (
                  'Create Product'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
