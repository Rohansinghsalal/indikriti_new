import { useState, useEffect } from 'react';
import { fetchCategories } from '../services/api.js';

const CategoryList = ({ selectedCategory, onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-3">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="flex flex-col items-center p-4 rounded-2xl bg-gray-100 animate-pulse"
          >
            <div className="w-8 h-8 bg-gray-200 rounded mb-2" />
            <div className="w-12 h-3 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-3">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategorySelect(category.id)}
          className={`flex flex-col items-center p-3 rounded-2xl border-2 transition-all duration-200 hover:scale-105 ${
            selectedCategory === category.id
              ? 'bg-blue-600 text-white border-blue-600 shadow-lg'
              : 'bg-gray-50 text-gray-700 border-transparent hover:bg-gray-100'
          }`}
        >
          <span className="text-2xl mb-2">{category.icon}</span>
          <span className="text-xs font-medium text-center">
            {category.name}
          </span>
        </button>
      ))}
    </div>
  );
};

export default CategoryList;
