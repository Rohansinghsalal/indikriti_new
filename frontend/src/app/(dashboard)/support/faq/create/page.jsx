'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CreateFAQPage() {
  const router = useRouter();
  
  // State for form data
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: '',
    status: 'draft',
    isPublic: true,
    sortOrder: 0
  });
  
  // State for custom category input
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  
  // State for form validation
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Mock data for categories
  const categories = [
    { id: 'Account', name: 'Account' },
    { id: 'Orders', name: 'Orders' },
    { id: 'Payment', name: 'Payment' },
    { id: 'Returns', name: 'Returns' },
    { id: 'Shipping', name: 'Shipping' },
    { id: 'Support', name: 'Support' },
    { id: 'custom', name: 'Add New Category...' }
  ];
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    
    // Handle category selection
    if (name === 'category' && value === 'custom') {
      setShowCustomCategory(true);
    } else if (name === 'category') {
      setShowCustomCategory(false);
    }
  };
  
  // Handle custom category input
  const handleCustomCategoryChange = (e) => {
    setCustomCategory(e.target.value);
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.question.trim()) {
      newErrors.question = 'Question is required';
    }
    
    if (!formData.answer.trim()) {
      newErrors.answer = 'Answer is required';
    }
    
    if (!formData.category && !customCategory) {
      newErrors.category = 'Category is required';
    }
    
    return newErrors;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    // Set submitting state
    setIsSubmitting(true);
    
    // Prepare data for submission
    const submissionData = {
      ...formData,
      category: formData.category === 'custom' ? customCategory : formData.category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      helpful: 0,
      notHelpful: 0
    };
    
    // Simulate API call
    setTimeout(() => {
      console.log('Submitted FAQ:', submissionData);
      setIsSubmitting(false);
      
      // Redirect to FAQ list page
      router.push('/dashboard/support/faq');
    }, 1000);
  };
  
  // Handle cancel
  const handleCancel = () => {
    router.push('/dashboard/support/faq');
  };
  
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold">Create FAQ</h1>
          <p className="text-gray-500 mt-1">Add a new frequently asked question</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : 'Save FAQ'}
          </Button>
        </div>
      </div>
      
      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Question */}
            <div>
              <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
                Question <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="question"
                name="question"
                className={`mt-1 block w-full rounded-md shadow-sm ${errors.question ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                value={formData.question}
                onChange={handleChange}
                placeholder="e.g., How do I reset my password?"
              />
              {errors.question && (
                <p className="mt-1 text-sm text-red-600">{errors.question}</p>
              )}
            </div>
            
            {/* Answer */}
            <div>
              <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-1">
                Answer <span className="text-red-500">*</span>
              </label>
              <textarea
                id="answer"
                name="answer"
                rows="6"
                className={`mt-1 block w-full rounded-md shadow-sm ${errors.answer ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                value={formData.answer}
                onChange={handleChange}
                placeholder="Provide a clear and concise answer..."
              ></textarea>
              {errors.answer && (
                <p className="mt-1 text-sm text-red-600">{errors.answer}</p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                Write a comprehensive answer that addresses the question. You can use basic formatting like <strong>bold</strong> and <em>italic</em>.
              </p>
            </div>
            
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                className={`mt-1 block w-full rounded-md shadow-sm ${errors.category ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {showCustomCategory && (
                <div className="mt-3">
                  <label htmlFor="customCategory" className="block text-sm font-medium text-gray-700 mb-1">
                    New Category Name
                  </label>
                  <input
                    type="text"
                    id="customCategory"
                    className="mt-1 block w-full rounded-md shadow-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    value={customCategory}
                    onChange={handleCustomCategoryChange}
                    placeholder="Enter new category name"
                  />
                </div>
              )}
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div>
            
            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                className="mt-1 block w-full rounded-md shadow-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
              <p className="mt-2 text-sm text-gray-500">
                Draft FAQs are only visible to administrators. Published FAQs are visible to customers.
              </p>
            </div>
            
            {/* Additional Settings */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Settings</h3>
              
              <div className="space-y-4">
                {/* Public/Internal */}
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="isPublic"
                      name="isPublic"
                      type="checkbox"
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      checked={formData.isPublic}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="isPublic" className="font-medium text-gray-700">Public FAQ</label>
                    <p className="text-gray-500">Display this FAQ on the public knowledge base. Uncheck to make it internal only.</p>
                  </div>
                </div>
                
                {/* Sort Order */}
                <div>
                  <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    id="sortOrder"
                    name="sortOrder"
                    className="mt-1 block w-full rounded-md shadow-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    value={formData.sortOrder}
                    onChange={handleChange}
                    min="0"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    FAQs with lower sort order will appear first. Default is 0.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Form Actions */}
        <div className="mt-6 flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : 'Save FAQ'}
          </Button>
        </div>
      </form>
    </div>
  );
}