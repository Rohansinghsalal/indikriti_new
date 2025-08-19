import React, { useState, useEffect } from 'react';
import { useHierarchy } from '../../hooks/product';

/**
 * TestHierarchy component for testing the 4-level hierarchy implementation
 * This component displays the hierarchy data and allows for interaction
 * @returns {JSX.Element} The TestHierarchy component
 */
const TestHierarchy = () => {
  // State for selected brand, category, subcategory, and product type
  const [selectedBrand, setSelectedBrand] = useState('indikriti');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedProductType, setSelectedProductType] = useState(null);
  
  // Use the useHierarchy hook to fetch data
  const {
    brands,
    categories,
    subcategories,
    productTypes,
    loading,
    error,
    fetchBrands,
    fetchCategoriesByBrand: fetchCategories,
    fetchSubcategoriesByCategory: fetchSubcategories,
    fetchProductTypesBySubcategory: fetchProductTypes
  } = useHierarchy();
  
  // Fetch brands on component mount
  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);
  
  // Fetch categories when brand changes
  useEffect(() => {
    if (selectedBrand) {
      fetchCategories(selectedBrand);
      setSelectedCategory(null);
      setSelectedSubcategory(null);
      setSelectedProductType(null);
    }
  }, [selectedBrand, fetchCategories]);
  
  // Fetch subcategories when category changes
  useEffect(() => {
    if (selectedCategory && selectedBrand) {
      fetchSubcategories(selectedBrand, selectedCategory);
      setSelectedSubcategory(null);
      setSelectedProductType(null);
    }
  }, [selectedCategory, selectedBrand, fetchSubcategories]);
  
  // Fetch product types when subcategory changes
  useEffect(() => {
    if (selectedSubcategory && selectedBrand) {
      fetchProductTypes(selectedBrand, selectedSubcategory);
      setSelectedProductType(null);
    }
  }, [selectedSubcategory, selectedBrand, fetchProductTypes]);
  
  // Handle brand selection
  const handleBrandSelect = (brand) => {
    setSelectedBrand(brand);
  };
  
  // Handle category selection
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };
  
  // Handle subcategory selection
  const handleSubcategorySelect = (subcategoryId) => {
    setSelectedSubcategory(subcategoryId);
  };
  
  // Handle product type selection
  const handleProductTypeSelect = (productTypeId) => {
    setSelectedProductType(productTypeId);
  };
  
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Hierarchy Test Component</h2>
      
      {/* Brands Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300">Brands</h3>
        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading brands...</p>
        ) : error ? (
          <p className="text-red-500">Error loading brands: {error}</p>
        ) : brands && brands.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {brands.map((brand) => (
              <button
                key={brand._id}
                onClick={() => handleBrandSelect(brand._id)}
                className={`px-3 py-1 rounded ${selectedBrand === brand._id ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'}`}
              >
                {brand.name}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No brands found</p>
        )}
      </div>
      
      {/* Categories Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300">Categories</h3>
        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading categories...</p>
        ) : error ? (
          <p className="text-red-500">Error loading categories: {error}</p>
        ) : categories && categories.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category._id}
                onClick={() => handleCategorySelect(category._id)}
                className={`px-3 py-1 rounded ${selectedCategory === category._id ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'}`}
              >
                {category.name}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No categories found</p>
        )}
      </div>
      
      {/* Subcategories Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300">Subcategories</h3>
        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading subcategories...</p>
        ) : error ? (
          <p className="text-red-500">Error loading subcategories: {error}</p>
        ) : subcategories && subcategories.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {subcategories.map((subcategory) => (
              <button
                key={subcategory._id}
                onClick={() => handleSubcategorySelect(subcategory._id)}
                className={`px-3 py-1 rounded ${selectedSubcategory === subcategory._id ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'}`}
              >
                {subcategory.name}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No subcategories found</p>
        )}
      </div>
      
      {/* Product Types Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300">Product Types</h3>
        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading product types...</p>
        ) : error ? (
          <p className="text-red-500">Error loading product types: {error}</p>
        ) : productTypes && productTypes.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {productTypes.map((productType) => (
              <button
                key={productType._id}
                onClick={() => handleProductTypeSelect(productType._id)}
                className={`px-3 py-1 rounded ${selectedProductType === productType._id ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'}`}
              >
                {productType.name}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No product types found</p>
        )}
      </div>
      
      {/* Selected Items Summary */}
      <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <h3 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300">Selection Summary</h3>
        <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300">
          <li>Selected Brand: {selectedBrand || 'None'}</li>
          <li>Selected Category: {selectedCategory || 'None'}</li>
          <li>Selected Subcategory: {selectedSubcategory || 'None'}</li>
          <li>Selected Product Type: {selectedProductType || 'None'}</li>
        </ul>
      </div>
    </div>
  );
};

export default TestHierarchy;