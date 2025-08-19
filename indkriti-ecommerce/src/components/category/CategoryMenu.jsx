import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useHierarchy } from '../../hooks/product';
// Tailwind CSS is used instead of separate CSS file

/**
 * CategoryMenu Component
 * A dropdown menu component for displaying the 4-level product hierarchy
 * @param {Object} props - Component props
 * @param {string} props.brand - The brand ID to fetch hierarchy for
 * @param {Function} props.onBrandChange - Callback when a brand is changed
 */
const CategoryMenu = ({ brand = 'indikriti', onBrandChange }) => {
  const {
    categories,
    subcategories,
    productTypes,
    loadingCategories,
    errorCategories,
    fetchCategoriesByBrand,
    fetchSubcategoriesByCategory,
    fetchProductTypesBySubcategory
  } = useHierarchy();

  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const menuRef = useRef(null);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategoriesByBrand(brand);
  }, [brand, fetchCategoriesByBrand]);

  // Fetch subcategories when hovering over a category
  useEffect(() => {
    if (activeCategory) {
      fetchSubcategoriesByCategory(activeCategory, brand);
    }
  }, [activeCategory, brand, fetchSubcategoriesByCategory]);

  // Fetch product types when hovering over a subcategory
  useEffect(() => {
    if (activeSubcategory) {
      fetchProductTypesBySubcategory(activeSubcategory, brand);
    }
  }, [activeSubcategory, brand, fetchProductTypesBySubcategory]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle category hover
  const handleCategoryHover = (categoryId) => {
    setActiveCategory(categoryId);
    setActiveSubcategory(null);
  };

  // Handle subcategory hover
  const handleSubcategoryHover = (subcategoryId) => {
    setActiveSubcategory(subcategoryId);
  };

  // Generate URL for category
  const getCategoryUrl = (category) => {
    return `/category/${category._id}`;
  };

  // Generate URL for subcategory
  const getSubcategoryUrl = (subcategory) => {
    return `/category/${activeCategory}/subcategory/${subcategory._id}`;
  };

  // Generate URL for product type
  const getProductTypeUrl = (productType) => {
    return `/category/${activeCategory}/subcategory/${activeSubcategory}/product-type/${productType._id}`;
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <span>Categories</span>
        <svg
          className={`ml-2 h-5 w-5 transform ${isOpen ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-10 mt-2 w-screen max-w-md bg-white shadow-lg rounded-md ring-1 ring-black ring-opacity-5 overflow-hidden">
          <div className="grid grid-cols-12 divide-x">
            {/* Categories Column */}
            <div className="col-span-4 py-1 bg-gray-50">
              {loadingCategories ? (
                <div className="flex justify-center p-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                </div>
              ) : errorCategories ? (
                <div className="p-4 text-red-500">Error loading categories</div>
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  {categories && categories.map((category) => (
                    <Link
                      key={category._id}
                      to={getCategoryUrl(category)}
                      className={`block px-4 py-2 text-sm ${activeCategory === category._id ? 'bg-indigo-100 text-indigo-900' : 'text-gray-700 hover:bg-gray-100'}`}
                      onMouseEnter={() => handleCategoryHover(category._id)}
                      onClick={() => setIsOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Subcategories Column */}
            <div className="col-span-4 py-1">
              {activeCategory && subcategories && subcategories.length > 0 ? (
                <div className="max-h-96 overflow-y-auto">
                  {subcategories.map((subcategory) => (
                    <Link
                      key={subcategory._id}
                      to={getSubcategoryUrl(subcategory)}
                      className={`block px-4 py-2 text-sm ${activeSubcategory === subcategory._id ? 'bg-indigo-50 text-indigo-900' : 'text-gray-700 hover:bg-gray-50'}`}
                      onMouseEnter={() => handleSubcategoryHover(subcategory._id)}
                      onClick={() => setIsOpen(false)}
                    >
                      {subcategory.name}
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-sm text-gray-500">
                  {activeCategory ? 'No subcategories found' : 'Select a category'}
                </div>
              )}
            </div>

            {/* Product Types Column */}
            <div className="col-span-4 py-1 bg-gray-50">
              {activeSubcategory && productTypes && productTypes.length > 0 ? (
                <div className="max-h-96 overflow-y-auto">
                  {productTypes.map((productType) => (
                    <Link
                      key={productType._id}
                      to={getProductTypeUrl(productType)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsOpen(false)}
                    >
                      {productType.name}
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-sm text-gray-500">
                  {activeSubcategory ? 'No product types found' : 'Select a subcategory'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryMenu;