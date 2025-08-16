'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function FAQManagementPage() {
  // State for search and filter
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Mock data for FAQs
  const mockFAQs = [
    {
      id: 'FAQ-001',
      question: 'How do I reset my password?',
      answer: 'You can reset your password by clicking on the "Forgot Password" link on the login page. You will receive an email with instructions to reset your password.',
      category: 'Account',
      status: 'published',
      createdAt: '2023-05-15T10:30:00',
      updatedAt: '2023-06-10T14:45:00',
      views: 1250,
      helpful: 120,
      notHelpful: 15
    },
    {
      id: 'FAQ-002',
      question: 'How do I track my order?',
      answer: 'You can track your order by logging into your account and navigating to the "Orders" section. Click on the order you want to track and you will see the current status and tracking information.',
      category: 'Orders',
      status: 'published',
      createdAt: '2023-05-18T09:15:00',
      updatedAt: '2023-06-12T11:30:00',
      views: 2300,
      helpful: 210,
      notHelpful: 25
    },
    {
      id: 'FAQ-003',
      question: 'What payment methods do you accept?',
      answer: 'We accept various payment methods including credit/debit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. For more information, please visit our Payment Methods page.',
      category: 'Payment',
      status: 'published',
      createdAt: '2023-05-20T14:20:00',
      updatedAt: '2023-06-15T16:45:00',
      views: 1800,
      helpful: 180,
      notHelpful: 20
    },
    {
      id: 'FAQ-004',
      question: 'How do I return a product?',
      answer: 'To return a product, go to your order history, select the order containing the item you wish to return, and click on "Return Items". Follow the instructions to complete the return process.',
      category: 'Returns',
      status: 'published',
      createdAt: '2023-05-22T11:45:00',
      updatedAt: '2023-06-18T13:20:00',
      views: 1500,
      helpful: 140,
      notHelpful: 18
    },
    {
      id: 'FAQ-005',
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship to most countries worldwide. Shipping costs and delivery times vary depending on the destination. You can see the shipping options available to your country during checkout.',
      category: 'Shipping',
      status: 'published',
      createdAt: '2023-05-25T08:30:00',
      updatedAt: '2023-06-20T10:15:00',
      views: 1950,
      helpful: 190,
      notHelpful: 22
    },
    {
      id: 'FAQ-006',
      question: 'How can I contact customer support?',
      answer: 'You can contact our customer support team through various channels: email (support@example.com), phone (+1-800-123-4567), live chat on our website, or through our social media channels.',
      category: 'Support',
      status: 'published',
      createdAt: '2023-05-28T13:10:00',
      updatedAt: '2023-06-22T15:40:00',
      views: 2100,
      helpful: 200,
      notHelpful: 15
    },
    {
      id: 'FAQ-007',
      question: 'What is your refund policy?',
      answer: 'Our refund policy allows returns within 30 days of purchase. Items must be in original condition with all tags and packaging. Once we receive and inspect the returned item, we will process your refund within 5-7 business days.',
      category: 'Returns',
      status: 'published',
      createdAt: '2023-06-01T09:45:00',
      updatedAt: '2023-06-25T12:30:00',
      views: 1700,
      helpful: 160,
      notHelpful: 19
    },
    {
      id: 'FAQ-008',
      question: 'How do I change my shipping address?',
      answer: 'You can update your shipping address in your account settings. If you need to change the address for an order that has already been placed but not yet shipped, please contact our customer support team immediately.',
      category: 'Shipping',
      status: 'draft',
      createdAt: '2023-06-05T15:20:00',
      updatedAt: '2023-06-28T17:45:00',
      views: 0,
      helpful: 0,
      notHelpful: 0
    },
    {
      id: 'FAQ-009',
      question: 'Do you offer gift wrapping?',
      answer: 'Yes, we offer gift wrapping services for an additional fee. You can select this option during checkout and even include a personalized message for the recipient.',
      category: 'Orders',
      status: 'published',
      createdAt: '2023-06-08T10:15:00',
      updatedAt: '2023-06-30T13:40:00',
      views: 1200,
      helpful: 110,
      notHelpful: 12
    },
    {
      id: 'FAQ-010',
      question: 'How can I unsubscribe from your newsletter?',
      answer: 'You can unsubscribe from our newsletter by clicking the "Unsubscribe" link at the bottom of any newsletter email you receive from us. Alternatively, you can update your communication preferences in your account settings.',
      category: 'Account',
      status: 'published',
      createdAt: '2023-06-10T14:30:00',
      updatedAt: '2023-07-02T16:55:00',
      views: 950,
      helpful: 90,
      notHelpful: 10
    },
    {
      id: 'FAQ-011',
      question: 'Are there any discounts for bulk orders?',
      answer: 'Yes, we offer discounts for bulk orders. The discount percentage depends on the quantity and types of products ordered. Please contact our sales team for more information and a custom quote.',
      category: 'Orders',
      status: 'draft',
      createdAt: '2023-06-12T11:40:00',
      updatedAt: '2023-07-05T14:25:00',
      views: 0,
      helpful: 0,
      notHelpful: 0
    },
    {
      id: 'FAQ-012',
      question: 'How do I redeem a gift card?',
      answer: 'To redeem a gift card, enter the gift card code in the designated field during checkout. The gift card amount will be applied to your order total. Any remaining balance on the gift card can be used for future purchases.',
      category: 'Payment',
      status: 'published',
      createdAt: '2023-06-15T08:55:00',
      updatedAt: '2023-07-08T11:20:00',
      views: 1100,
      helpful: 105,
      notHelpful: 8
    }
  ];
  
  // Mock data for categories
  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'Account', name: 'Account' },
    { id: 'Orders', name: 'Orders' },
    { id: 'Payment', name: 'Payment' },
    { id: 'Returns', name: 'Returns' },
    { id: 'Shipping', name: 'Shipping' },
    { id: 'Support', name: 'Support' }
  ];
  
  // Filter FAQs based on search query and filters
  const filteredFAQs = mockFAQs.filter(faq => {
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || faq.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || faq.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });
  
  // Pagination logic
  const totalPages = Math.ceil(filteredFAQs.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredFAQs.slice(indexOfFirstItem, indexOfLastItem);
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold">FAQ Management</h1>
          <p className="text-gray-500 mt-1">Manage frequently asked questions and their categories</p>
        </div>
        <Link href="/dashboard/support/faq/create" passHref>
          <Button>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create FAQ
          </Button>
        </Link>
      </div>
      
      {/* Filters and Search */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                id="search"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 border-gray-300 rounded-md"
                placeholder="Search questions or answers"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </Card>
      
      {/* FAQ List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {currentItems.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {currentItems.map((faq) => (
              <li key={faq.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-blue-600 truncate">{faq.question}</p>
                      <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        faq.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {faq.status.charAt(0).toUpperCase() + faq.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Link href={`/dashboard/support/faq/${faq.id}`} passHref>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </Link>
                      <Link href={`/dashboard/support/faq/${faq.id}/edit`} passHref>
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      </Link>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-800">
                        Delete
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                        {faq.category}
                      </p>
                      <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                        <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        Updated {formatDate(faq.updatedAt)}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                      {faq.views} views
                      <span className="ml-4 flex items-center">
                        <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                        </svg>
                        {faq.helpful}
                      </span>
                      <span className="ml-4 flex items-center">
                        <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                        </svg>
                        {faq.notHelpful}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-4 py-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No FAQs found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new FAQ.</p>
            <div className="mt-6">
              <Link href="/dashboard/support/faq/create" passHref>
                <Button>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Create FAQ
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {filteredFAQs.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              variant="outline"
            >
              Previous
            </Button>
            <Button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              variant="outline"
            >
              Next
            </Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to <span className="font-medium">
                  {Math.min(indexOfLastItem, filteredFAQs.length)}
                </span> of <span className="font-medium">{filteredFAQs.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === page
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}