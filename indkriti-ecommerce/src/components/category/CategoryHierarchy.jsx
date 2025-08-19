import React, { useState, useEffect } from 'react';
import { useHierarchy } from '../../hooks/product';

/**
 * CategoryHierarchy Component
 * Displays the 4-level hierarchy (Brand → Category → Subcategory → Product Type)
 */
const CategoryHierarchy = ({ brand = 'indikriti', onSelectCategory, onSelectSubcategory, onSelectProductType }) => {
  const {
    brands,
    categories,
    subcategories,
    productTypes,
    completeHierarchy,
    loadingBrands,
    loadingCategories,
    loadingSubcategories,
    loadingProductTypes,
    loadingCompleteHierarchy,
    errorBrands,
    errorCategories,
    errorSubcategories,
    errorProductTypes,
    errorCompleteHierarchy,
    fetchBrands,
    fetchCategoriesByBrand,
    fetchSubcategoriesByCategory,
    fetchProductTypesBySubcategory,
    fetchCompleteHierarchy
  } = useHierarchy();

  const [selectedBrand, setSelectedBrand] = useState(brand);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedProductType, setSelectedProductType] = useState(null);

  // Fetch brands on component mount
  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  // Fetch categories when brand changes
  useEffect(() => {
    if (selectedBrand) {
      fetchCategoriesByBrand(selectedBrand);
      setSelectedCategory(null);
      setSelectedSubcategory(null);
      setSelectedProductType(null);
    }
  }, [selectedBrand, fetchCategoriesByBrand]);

  // Fetch subcategories when category changes
  useEffect(() => {
    if (selectedBrand && selectedCategory) {
      fetchSubcategoriesByCategory(selectedCategory, selectedBrand);
      setSelectedSubcategory(null);
      setSelectedProductType(null);
    }
  }, [selectedBrand, selectedCategory, fetchSubcategoriesByCategory]);

  // Fetch product types when subcategory changes
  useEffect(() => {
    if (selectedBrand && selectedSubcategory) {
      fetchProductTypesBySubcategory(selectedSubcategory, selectedBrand);
      setSelectedProductType(null);
    }
  }, [selectedBrand, selectedSubcategory, fetchProductTypesBySubcategory]);

  // Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category._id);
    if (onSelectCategory) onSelectCategory(category);
  };

  // Handle subcategory selection
  const handleSubcategorySelect = (subcategory) => {
    setSelectedSubcategory(subcategory._id);
    if (onSelectSubcategory) onSelectSubcategory(subcategory);
  };

  // Handle product type selection
  const handleProductTypeSelect = (productType) => {
    setSelectedProductType(productType._id);
    if (onSelectProductType) onSelectProductType(productType);
  };

  return (
    <div className="w-full">
      {/* Categories Section */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Categories</h3>
        {loadingCategories ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
          </div>
        ) : errorCategories ? (
          <div className="text-red-500">Error loading categories</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {categories && categories.map((category) => (
              <div 
                key={category._id}
                onClick={() => handleCategorySelect(category)}
                className={`p-2 border rounded cursor-pointer hover:bg-gray-100 ${selectedCategory === category._id ? 'bg-blue-100 border-blue-500' : ''}`}
              >
                {category.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Subcategories Section - Only show if a category is selected */}
      {selectedCategory && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Subcategories</h3>
          {loadingSubcategories ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            </div>
          ) : errorSubcategories ? (
            <div className="text-red-500">Error loading subcategories</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {subcategories && subcategories.map((subcategory) => (
                <div 
                  key={subcategory._id}
                  onClick={() => handleSubcategorySelect(subcategory)}
                  className={`p-2 border rounded cursor-pointer hover:bg-gray-100 ${selectedSubcategory === subcategory._id ? 'bg-blue-100 border-blue-500' : ''}`}
                >
                  {subcategory.name}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Product Types Section - Only show if a subcategory is selected */}
      {selectedSubcategory && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Product Types</h3>
          {loadingProductTypes ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            </div>
          ) : errorProductTypes ? (
            <div className="text-red-500">Error loading product types</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {productTypes && productTypes.map((productType) => (
                <div 
                  key={productType._id}
                  onClick={() => handleProductTypeSelect(productType)}
                  className={`p-2 border rounded cursor-pointer hover:bg-gray-100 ${selectedProductType === productType._id ? 'bg-blue-100 border-blue-500' : ''}`}
                >
                  {productType.name}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryHierarchy;