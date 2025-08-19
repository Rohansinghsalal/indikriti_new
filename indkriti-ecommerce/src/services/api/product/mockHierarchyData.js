/**
 * Mock data for hierarchy testing
 * This file provides mock data for the 4-level hierarchy structure:
 * Brand → Category → Subcategory → Product Type
 */

// Mock brands data
export const mockBrands = {
  data: [
    { _id: 'indikriti', name: 'Indikriti', slug: 'indikriti' },
    { _id: 'winsomeLane', name: 'Winsome Lane', slug: 'winsome-lane' }
  ]
};

// Mock categories data for Indikriti brand
export const mockIndikritiCategories = {
  data: [
    { _id: 'clothing', name: 'Clothing', slug: 'clothing', brand: 'indikriti' },
    { _id: 'accessories', name: 'Accessories', slug: 'accessories', brand: 'indikriti' },
    { _id: 'footwear', name: 'Footwear', slug: 'footwear', brand: 'indikriti' },
    { _id: 'home', name: 'Home & Living', slug: 'home-living', brand: 'indikriti' }
  ]
};

// Mock categories data for Winsome Lane brand
export const mockWinsomeLaneCategories = {
  data: [
    { _id: 'clothing', name: 'Clothing', slug: 'clothing', brand: 'winsomeLane' },
    { _id: 'accessories', name: 'Accessories', slug: 'accessories', brand: 'winsomeLane' },
    { _id: 'beauty', name: 'Beauty', slug: 'beauty', brand: 'winsomeLane' }
  ]
};

// Mock subcategories data for Indikriti Clothing category
export const mockIndikritiClothingSubcategories = {
  data: [
    { _id: 'women', name: 'Women', slug: 'women', category: 'clothing', brand: 'indikriti' },
    { _id: 'men', name: 'Men', slug: 'men', category: 'clothing', brand: 'indikriti' },
    { _id: 'kids', name: 'Kids', slug: 'kids', category: 'clothing', brand: 'indikriti' }
  ]
};

// Mock subcategories data for Indikriti Accessories category
export const mockIndikritiAccessoriesSubcategories = {
  data: [
    { _id: 'jewelry', name: 'Jewelry', slug: 'jewelry', category: 'accessories', brand: 'indikriti' },
    { _id: 'bags', name: 'Bags', slug: 'bags', category: 'accessories', brand: 'indikriti' },
    { _id: 'scarves', name: 'Scarves', slug: 'scarves', category: 'accessories', brand: 'indikriti' }
  ]
};

// Mock product types data for Indikriti Women subcategory
export const mockIndikritiWomenProductTypes = {
  data: [
    { _id: 'sarees', name: 'Sarees', slug: 'sarees', subcategory: 'women', brand: 'indikriti' },
    { _id: 'kurtas', name: 'Kurtas', slug: 'kurtas', subcategory: 'women', brand: 'indikriti' },
    { _id: 'dresses', name: 'Dresses', slug: 'dresses', subcategory: 'women', brand: 'indikriti' },
    { _id: 'tops', name: 'Tops', slug: 'tops', subcategory: 'women', brand: 'indikriti' }
  ]
};

// Mock product types data for Indikriti Men subcategory
export const mockIndikritiMenProductTypes = {
  data: [
    { _id: 'kurtas', name: 'Kurtas', slug: 'kurtas', subcategory: 'men', brand: 'indikriti' },
    { _id: 'shirts', name: 'Shirts', slug: 'shirts', subcategory: 'men', brand: 'indikriti' },
    { _id: 'jackets', name: 'Jackets', slug: 'jackets', subcategory: 'men', brand: 'indikriti' }
  ]
};

// Mock product types data for Indikriti Jewelry subcategory
export const mockIndikritiJewelryProductTypes = {
  data: [
    { _id: 'necklaces', name: 'Necklaces', slug: 'necklaces', subcategory: 'jewelry', brand: 'indikriti' },
    { _id: 'earrings', name: 'Earrings', slug: 'earrings', subcategory: 'jewelry', brand: 'indikriti' },
    { _id: 'bracelets', name: 'Bracelets', slug: 'bracelets', subcategory: 'jewelry', brand: 'indikriti' }
  ]
};

// Helper function to get categories by brand
export const getCategoriesByBrandMock = (brand) => {
  if (brand === 'indikriti') {
    return mockIndikritiCategories;
  } else if (brand === 'winsomeLane') {
    return mockWinsomeLaneCategories;
  }
  return { data: [] };
};

// Helper function to get subcategories by brand and category
export const getSubcategoriesByBrandAndCategoryMock = (brand, categoryId) => {
  if (brand === 'indikriti' && categoryId === 'clothing') {
    return mockIndikritiClothingSubcategories;
  } else if (brand === 'indikriti' && categoryId === 'accessories') {
    return mockIndikritiAccessoriesSubcategories;
  }
  return { data: [] };
};

// Helper function to get product types by brand and subcategory
export const getProductTypesByBrandAndSubcategoryMock = (brand, subcategoryId) => {
  if (brand === 'indikriti' && subcategoryId === 'women') {
    return mockIndikritiWomenProductTypes;
  } else if (brand === 'indikriti' && subcategoryId === 'men') {
    return mockIndikritiMenProductTypes;
  } else if (brand === 'indikriti' && subcategoryId === 'jewelry') {
    return mockIndikritiJewelryProductTypes;
  }
  return { data: [] };
};