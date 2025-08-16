'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function CreateTicketPage() {
  // State for form data
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    priority: 'medium', // 'low', 'medium', 'high'
    category: '', // 'payment', 'order', 'return', 'product', 'account', 'other'
    customer: {
      id: '',
      name: '',
      email: '',
      phone: ''
    },
    order: {
      id: '',
      date: '',
      total: ''
    },
    attachments: [],
    internalNotes: ''
  });
  
  // State for form validation
  const [errors, setErrors] = useState({});
  
  // State for customer search
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [customerSearchResults, setCustomerSearchResults] = useState([]);
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  
  // State for order search
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderSearchResults, setOrderSearchResults] = useState([]);
  const [showOrderSearch, setShowOrderSearch] = useState(false);
  
  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  // Mock data for customers
  const mockCustomers = [
    { id: 'CUST-001', name: 'John Doe', email: 'john.doe@example.com', phone: '+1 (555) 123-4567' },
    { id: 'CUST-002', name: 'Jane Smith', email: 'jane.smith@example.com', phone: '+1 (555) 987-6543' },
    { id: 'CUST-003', name: 'Michael Brown', email: 'michael.brown@example.com', phone: '+1 (555) 456-7890' },
    { id: 'CUST-004', name: 'Emily Davis', email: 'emily.davis@example.com', phone: '+1 (555) 789-0123' },
    { id: 'CUST-005', name: 'Robert Miller', email: 'robert.miller@example.com', phone: '+1 (555) 234-5678' },
  ];
  
  // Mock data for orders
  const mockOrders = [
    { id: 'ORD-10001', date: '2023-06-15', total: '$129.99', customer: 'CUST-001' },
    { id: 'ORD-10002', date: '2023-06-14', total: '$75.50', customer: 'CUST-002' },
    { id: 'ORD-10003', date: '2023-06-12', total: '$249.99', customer: 'CUST-003' },
    { id: 'ORD-10004', date: '2023-06-10', total: '$32.75', customer: 'CUST-004' },
    { id: 'ORD-10005', date: '2023-06-08', total: '$189.95', customer: 'CUST-005' },
  ];
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested objects
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Handle file uploads
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };
  
  // Remove an attachment
  const handleRemoveAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };
  
  // Handle customer search
  const handleCustomerSearch = (query) => {
    setCustomerSearchQuery(query);
    
    if (query.trim() === '') {
      setCustomerSearchResults([]);
      return;
    }
    
    // Filter customers based on query
    const results = mockCustomers.filter(customer => 
      customer.name.toLowerCase().includes(query.toLowerCase()) ||
      customer.email.toLowerCase().includes(query.toLowerCase()) ||
      customer.id.toLowerCase().includes(query.toLowerCase())
    );
    
    setCustomerSearchResults(results);
    setShowCustomerSearch(true);
  };
  
  // Select a customer from search results
  const handleSelectCustomer = (customer) => {
    setFormData(prev => ({
      ...prev,
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone
      }
    }));
    setCustomerSearchQuery('');
    setCustomerSearchResults([]);
    setShowCustomerSearch(false);
    
    // Also filter orders for this customer
    const customerOrders = mockOrders.filter(order => order.customer === customer.id);
    setOrderSearchResults(customerOrders);
  };
  
  // Handle order search
  const handleOrderSearch = (query) => {
    setOrderSearchQuery(query);
    
    if (query.trim() === '') {
      setOrderSearchResults([]);
      return;
    }
    
    // Filter orders based on query and selected customer
    let results = mockOrders.filter(order => 
      order.id.toLowerCase().includes(query.toLowerCase())
    );
    
    // If a customer is selected, only show their orders
    if (formData.customer.id) {
      results = results.filter(order => order.customer === formData.customer.id);
    }
    
    setOrderSearchResults(results);
    setShowOrderSearch(true);
  };
  
  // Select an order from search results
  const handleSelectOrder = (order) => {
    setFormData(prev => ({
      ...prev,
      order: {
        id: order.id,
        date: order.date,
        total: order.total
      }
    }));
    setOrderSearchQuery('');
    setOrderSearchResults([]);
    setShowOrderSearch(false);
  };
  
  // Clear customer selection
  const handleClearCustomer = () => {
    setFormData(prev => ({
      ...prev,
      customer: {
        id: '',
        name: '',
        email: '',
        phone: ''
      },
      // Also clear order if customer is cleared
      order: {
        id: '',
        date: '',
        total: ''
      }
    }));
    setOrderSearchResults([]);
  };
  
  // Clear order selection
  const handleClearOrder = () => {
    setFormData(prev => ({
      ...prev,
      order: {
        id: '',
        date: '',
        total: ''
      }
    }));
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful submission
      setSubmitSuccess(true);
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          subject: '',
          description: '',
          priority: 'medium',
          category: '',
          customer: {
            id: '',
            name: '',
            email: '',
            phone: ''
          },
          order: {
            id: '',
            date: '',
            total: ''
          },
          attachments: [],
          internalNotes: ''
        });
        setSubmitSuccess(false);
      }, 3000);
    } catch (error) {
      setSubmitError('An error occurred while creating the ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Create Support Ticket</h1>
        
        <Link href="/dashboard/support/tickets" passHref>
          <Button variant="outline">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Tickets
          </Button>
        </Link>
      </div>
      
      <Card className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main ticket information - takes up 2/3 of the space */}
            <div className="md:col-span-2 space-y-6">
              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className={`block w-full rounded-md shadow-sm sm:text-sm ${errors.subject ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Brief summary of the issue"
                />
                {errors.subject && <p className="mt-1 text-sm text-red-500">{errors.subject}</p>}
              </div>
              
              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
                <textarea
                  id="description"
                  name="description"
                  rows="6"
                  className={`block w-full rounded-md shadow-sm sm:text-sm ${errors.description ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Detailed description of the issue"
                ></textarea>
                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
              </div>
              
              {/* Attachments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Attachments</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <span>Upload files</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleFileUpload} />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF, PDF up to 10MB each</p>
                  </div>
                </div>
                
                {/* Display uploaded files */}
                {formData.attachments.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700">Uploaded Files:</h4>
                    <ul className="mt-2 divide-y divide-gray-200">
                      {formData.attachments.map((file, index) => (
                        <li key={index} className="py-2 flex justify-between items-center">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                            <span className="text-sm text-gray-900">{file.name}</span>
                          </div>
                          <button
                            type="button"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleRemoveAttachment(index)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              {/* Internal Notes */}
              <div>
                <label htmlFor="internalNotes" className="block text-sm font-medium text-gray-700 mb-1">Internal Notes</label>
                <textarea
                  id="internalNotes"
                  name="internalNotes"
                  rows="3"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.internalNotes}
                  onChange={handleInputChange}
                  placeholder="Notes visible only to support staff"
                ></textarea>
                <p className="mt-1 text-xs text-gray-500">These notes are only visible to support staff, not to the customer.</p>
              </div>
            </div>
            
            {/* Sidebar with additional options - takes up 1/3 of the space */}
            <div className="space-y-6">
              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <div className="mt-1 space-y-2">
                  <div className="flex items-center">
                    <input
                      id="priority-low"
                      name="priority"
                      type="radio"
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                      value="low"
                      checked={formData.priority === 'low'}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="priority-low" className="ml-3 block text-sm font-medium text-gray-700">
                      Low
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="priority-medium"
                      name="priority"
                      type="radio"
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                      value="medium"
                      checked={formData.priority === 'medium'}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="priority-medium" className="ml-3 block text-sm font-medium text-gray-700">
                      Medium
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="priority-high"
                      name="priority"
                      type="radio"
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                      value="high"
                      checked={formData.priority === 'high'}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="priority-high" className="ml-3 block text-sm font-medium text-gray-700">
                      High
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
                <select
                  id="category"
                  name="category"
                  className={`block w-full rounded-md shadow-sm sm:text-sm ${errors.category ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="">Select a category</option>
                  <option value="payment">Payment</option>
                  <option value="order">Order</option>
                  <option value="return">Return/Refund</option>
                  <option value="product">Product Information</option>
                  <option value="account">Account</option>
                  <option value="other">Other</option>
                </select>
                {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
              </div>
              
              {/* Customer Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                <div className="relative">
                  <input
                    type="text"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Search for customer..."
                    value={customerSearchQuery}
                    onChange={(e) => handleCustomerSearch(e.target.value)}
                    onFocus={() => setShowCustomerSearch(true)}
                  />
                  {showCustomerSearch && customerSearchResults.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md max-h-60 overflow-auto">
                      <ul className="py-1">
                        {customerSearchResults.map((customer) => (
                          <li
                            key={customer.id}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleSelectCustomer(customer)}
                          >
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-sm text-gray-500">{customer.email}</div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                {formData.customer.id && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{formData.customer.name}</h4>
                        <p className="text-sm text-gray-500">{formData.customer.email}</p>
                        {formData.customer.phone && <p className="text-sm text-gray-500">{formData.customer.phone}</p>}
                      </div>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-500"
                        onClick={handleClearCustomer}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Order Information - Only show if customer is selected */}
              {formData.customer.id && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Related Order</label>
                  <div className="relative">
                    <input
                      type="text"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Search for order..."
                      value={orderSearchQuery}
                      onChange={(e) => handleOrderSearch(e.target.value)}
                      onFocus={() => setShowOrderSearch(true)}
                    />
                    {showOrderSearch && orderSearchResults.length > 0 && (
                      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md max-h-60 overflow-auto">
                        <ul className="py-1">
                          {orderSearchResults.map((order) => (
                            <li
                              key={order.id}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleSelectOrder(order)}
                            >
                              <div className="font-medium">{order.id}</div>
                              <div className="text-sm text-gray-500">{order.date} - {order.total}</div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  {formData.order.id && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{formData.order.id}</h4>
                          <p className="text-sm text-gray-500">Date: {formData.order.date}</p>
                          <p className="text-sm text-gray-500">Total: {formData.order.total}</p>
                        </div>
                        <button
                          type="button"
                          className="text-gray-400 hover:text-gray-500"
                          onClick={handleClearOrder}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="mt-8 flex justify-end space-x-3">
            <Link href="/dashboard/support/tickets" passHref>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : 'Create Ticket'}
            </Button>
          </div>
          
          {/* Success Message */}
          {submitSuccess && (
            <div className="mt-4 p-4 bg-green-50 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    Ticket created successfully! Redirecting to tickets list...
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Error Message */}
          {submitError && (
            <div className="mt-4 p-4 bg-red-50 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">
                    {submitError}
                  </p>
                </div>
              </div>
            </div>
          )}
        </form>
      </Card>
    </div>
  );
}