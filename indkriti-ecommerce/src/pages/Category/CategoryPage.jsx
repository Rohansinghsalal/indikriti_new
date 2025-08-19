import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useHierarchy } from '../../hooks/product';
import { useProducts } from '../../hooks/product';
import { CategoryHierarchy, CategoryBreadcrumb } from '../../components/category';

const CategoryPage = () => {
  const { categoryId, subcategoryId, productTypeId } = useParams();
  const navigate = useNavigate();
  const {
    categories,
    subcategories,
    productTypes,
    loadingCategories,
    loadingSubcategories,
    loadingProductTypes,
    errorCategories,
    errorSubcategories,
    errorProductTypes,
    fetchCategoriesByBrand,
    fetchSubcategoriesByCategory,
    fetchProductTypesBySubcategory
  } = useHierarchy();

  const { products, loading: loadingProducts, error: errorProducts, getProducts } = useProducts();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedProductType, setSelectedProductType] = useState(null);
  const [brand] = useState('indikriti'); // Default brand

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategoriesByBrand(brand);
  }, [brand, fetchCategoriesByBrand]);

  // Fetch subcategories when category ID is available
  useEffect(() => {
    if (categoryId) {
      fetchSubcategoriesByCategory(categoryId, brand);
    }
  }, [categoryId, brand, fetchSubcategoriesByCategory]);

  // Fetch product types when subcategory ID is available
  useEffect(() => {
    if (subcategoryId) {
      fetchProductTypesBySubcategory(subcategoryId, brand);
    }
  }, [subcategoryId, brand, fetchProductTypesBySubcategory]);

  // Fetch products based on selected filters
  useEffect(() => {
    const filters = {};
    
    if (categoryId) {
      filters.category = categoryId;
    }
    
    if (subcategoryId) {
      filters.subcategory = subcategoryId;
    }
    
    if (productTypeId) {
      filters.productType = productTypeId;
    }
    
    getProducts(filters);
  }, [categoryId, subcategoryId, productTypeId, getProducts]);

  // Update selected items when params change
  useEffect(() => {
    if (categoryId && categories) {
      const category = categories.find(cat => cat._id === categoryId);
      setSelectedCategory(category || null);
    } else {
      setSelectedCategory(null);
    }

    if (subcategoryId && subcategories) {
      const subcategory = subcategories.find(subcat => subcat._id === subcategoryId);
      setSelectedSubcategory(subcategory || null);
    } else {
      setSelectedSubcategory(null);
    }

    if (productTypeId && productTypes) {
      const productType = productTypes.find(pt => pt._id === productTypeId);
      setSelectedProductType(productType || null);
    } else {
      setSelectedProductType(null);
    }
  }, [categoryId, subcategoryId, productTypeId, categories, subcategories, productTypes]);

  // Handle category selection
  const handleCategorySelect = (category) => {
    navigate(`/category/${category._id}`);
  };

  // Handle subcategory selection
  const handleSubcategorySelect = (subcategory) => {
    navigate(`/category/${categoryId}/subcategory/${subcategory._id}`);
  };

  // Handle product type selection
  const handleProductTypeSelect = (productType) => {
    navigate(`/category/${categoryId}/subcategory/${subcategoryId}/product-type/${productType._id}`);
  };

  // Handle breadcrumb navigation
  const handleBrandClick = () => {
    navigate('/');
  };

  const handleBreadcrumbCategoryClick = (category) => {
    navigate(`/category/${category._id}`);
  };

  const handleBreadcrumbSubcategoryClick = (subcategory) => {
    navigate(`/category/${categoryId}/subcategory/${subcategory._id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb Navigation */}
      <div className="mb-6">
        <CategoryBreadcrumb
          brand={brand}
          category={selectedCategory}
          subcategory={selectedSubcategory}
          productType={selectedProductType}
          onBrandClick={handleBrandClick}
          onCategoryClick={handleBreadcrumbCategoryClick}
          onSubcategoryClick={handleBreadcrumbSubcategoryClick}
        />
      </div>

      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-6">
        {selectedProductType ? selectedProductType.name :
         selectedSubcategory ? selectedSubcategory.name :
         selectedCategory ? selectedCategory.name :
         'All Categories'}
      </h1>

      {/* Category Hierarchy */}
      <div className="mb-8">
        <CategoryHierarchy
          brand={brand}
          onSelectCategory={handleCategorySelect}
          onSelectSubcategory={handleSubcategorySelect}
          onSelectProductType={handleProductTypeSelect}
        />
      </div>

      {/* Products Grid */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Products</h2>
        {loadingProducts ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : errorProducts ? (
          <div className="text-red-500 py-8 text-center">Error loading products</div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <div key={product._id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
                  <img
                    src={product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/300'}
                    alt={product.name}
                    className="object-cover object-center w-full h-full"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 truncate">{product.name}</h3>
                  <p className="mt-1 text-sm text-gray-500 truncate">{product.description}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-lg font-semibold text-gray-900">
                      ₹{product.price.toFixed(2)}
                    </p>
                    <button className="px-3 py-1 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-700">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">No products found</div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;