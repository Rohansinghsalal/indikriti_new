import { useState, useEffect } from 'react';
import { fetchCategories } from '../services/api.js';

const CategoryNavigation = ({ onNavigate, className = "" }) => {
  const [categories, setCategories] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const categoriesData = await fetchCategories('indikriti');
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to load categories:', error);
      // Fallback to categories matching actual database structure
      setCategories([
        {
          id: 1,
          name: 'jwellry',
          icon: '💎',
          subcategories: [
            {
              id: 2,
              name: 'Fallen',
              types: [{ id: 4, name: '123123112' }]
            },
            {
              id: 3,
              name: '234234',
              types: [{ id: 1, name: 'asdasda' }]
            },
            {
              id: 9,
              name: 'hbhb',
              types: [{ id: 1, name: 'asdasda' }]
            }
          ]
        },
        {
          id: 3,
          name: 'handloom',
          icon: '🧵',
          subcategories: [
            {
              id: 8,
              name: 'abc',
              types: [{ id: 5, name: '12' }]
            }
          ]
        },
        {
          id: 4,
          name: 'Handicraft',
          icon: '🎨',
          subcategories: [
            {
              id: 10,
              name: 'Fallen',
              types: [
                { id: 6, name: 'Wireless Headphones' },
                { id: 7, name: 'Java Full Stack Developer' }
              ]
            }
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    onNavigate?.('category', { id: category.id, name: category.name });
  };

  const handleSubcategoryClick = (category, subcategory) => {
    onNavigate?.('category', { 
      id: category.id, 
      name: category.name,
      subcategoryId: subcategory.id,
      subcategoryName: subcategory.name
    });
  };

  if (loading) {
    return (
      <div className={`flex space-x-3 overflow-x-auto scrollbar-hide pb-2 ${className}`}>
        {[1, 2, 3].map(i => (
          <div key={i} className="flex-shrink-0 bg-gray-200 animate-pulse px-4 py-2 rounded-full w-24 h-8"></div>
        ))}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div className="flex space-x-3 overflow-x-auto scrollbar-hide pb-2">
        {categories.map((category) => (
          <div
            key={category.id}
            className="relative flex-shrink-0"
            onMouseEnter={() => setHoveredCategory(category.id)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <button
              onClick={() => handleCategoryClick(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all transform hover:scale-105 ${
                category.id === 1 
                  ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 hover:from-blue-200 hover:to-blue-300'
                  : category.id === 2
                  ? 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 hover:from-purple-200 hover:to-purple-300'
                  : 'bg-gradient-to-r from-green-100 to-green-200 text-green-700 hover:from-green-200 hover:to-green-300'
              }`}
            >
              {category.icon && <span className="mr-1">{category.icon}</span>}
              {category.name}
            </button>

            {/* Subcategory Dropdown */}
            {hoveredCategory === category.id && category.subcategories && category.subcategories.length > 0 && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 min-w-64 z-50 overflow-hidden">
                <div className="p-3">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    {category.name} Categories
                  </div>
                  <div className="space-y-1">
                    {category.subcategories.map((subcategory) => (
                      <div key={subcategory.id}>
                        <button
                          onClick={() => handleSubcategoryClick(category, subcategory)}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors font-medium"
                        >
                          {subcategory.name}
                        </button>
                        
                        {/* Product Types */}
                        {subcategory.types && subcategory.types.length > 0 && (
                          <div className="ml-4 mt-1 space-y-1">
                            {subcategory.types.slice(0, 3).map((type) => (
                              <button
                                key={type.id}
                                onClick={() => onNavigate?.('product-type', {
                                  productTypeId: type.id,
                                  productTypeName: type.name,
                                  categoryName: category.name,
                                  subcategoryName: subcategory.name
                                })}
                                className="block w-full text-left px-2 py-1 text-xs text-gray-500 hover:text-blue-600 transition-colors"
                              >
                                • {type.name}
                              </button>
                            ))}
                            {subcategory.types.length > 3 && (
                              <button
                                onClick={() => handleSubcategoryClick(category, subcategory)}
                                className="block w-full text-left px-2 py-1 text-xs text-blue-600 hover:text-blue-700 transition-colors font-medium"
                              >
                                + {subcategory.types.length - 3} more...
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleCategoryClick(category)}
                      className="w-full text-center px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
                    >
                      View All {category.name} →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {/* Sale Button */}
        <button
          onClick={() => onNavigate?.('search', { query: 'sale', on_sale: true })}
          className="flex-shrink-0 bg-gradient-to-r from-red-100 to-red-200 text-red-700 px-4 py-2 rounded-full text-sm font-medium hover:from-red-200 hover:to-red-300 transition-all transform hover:scale-105"
        >
          🔥 Sale
        </button>
      </div>

      {/* Overlay to close dropdown when clicking outside */}
      {hoveredCategory && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setHoveredCategory(null)}
        />
      )}
    </div>
  );
};

export default CategoryNavigation;
