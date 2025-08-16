'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function ContactsPage() {
  // State for contacts data
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for filtering and pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'customer', 'vendor', 'partner'
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Fetch contacts data
  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock contacts data
        const mockContacts = [
          {
            id: 'CONT-001',
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+1 (555) 123-4567',
            type: 'customer',
            company: 'Acme Inc.',
            position: 'CEO',
            lastContact: '2023-06-15T10:30:00',
            ticketsCount: 3,
            status: 'active'
          },
          {
            id: 'CONT-002',
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            phone: '+1 (555) 987-6543',
            type: 'customer',
            company: 'XYZ Corp',
            position: 'Marketing Director',
            lastContact: '2023-06-10T14:45:00',
            ticketsCount: 1,
            status: 'active'
          },
          {
            id: 'CONT-003',
            name: 'Robert Johnson',
            email: 'robert.johnson@example.com',
            phone: '+1 (555) 456-7890',
            type: 'vendor',
            company: 'Supply Solutions',
            position: 'Account Manager',
            lastContact: '2023-05-28T09:15:00',
            ticketsCount: 0,
            status: 'active'
          },
          {
            id: 'CONT-004',
            name: 'Emily Davis',
            email: 'emily.davis@example.com',
            phone: '+1 (555) 234-5678',
            type: 'customer',
            company: 'Global Enterprises',
            position: 'CTO',
            lastContact: '2023-06-18T16:20:00',
            ticketsCount: 2,
            status: 'active'
          },
          {
            id: 'CONT-005',
            name: 'Michael Wilson',
            email: 'michael.wilson@example.com',
            phone: '+1 (555) 876-5432',
            type: 'partner',
            company: 'Tech Partners LLC',
            position: 'Business Development',
            lastContact: '2023-06-05T11:10:00',
            ticketsCount: 0,
            status: 'inactive'
          },
          {
            id: 'CONT-006',
            name: 'Sarah Thompson',
            email: 'sarah.thompson@example.com',
            phone: '+1 (555) 345-6789',
            type: 'customer',
            company: 'Retail Innovations',
            position: 'Operations Manager',
            lastContact: '2023-06-12T13:25:00',
            ticketsCount: 4,
            status: 'active'
          },
          {
            id: 'CONT-007',
            name: 'David Brown',
            email: 'david.brown@example.com',
            phone: '+1 (555) 654-3210',
            type: 'vendor',
            company: 'Logistics Pro',
            position: 'Sales Representative',
            lastContact: '2023-05-30T15:40:00',
            ticketsCount: 1,
            status: 'active'
          },
          {
            id: 'CONT-008',
            name: 'Jennifer Martinez',
            email: 'jennifer.martinez@example.com',
            phone: '+1 (555) 789-0123',
            type: 'customer',
            company: 'Fashion Forward',
            position: 'Purchasing Manager',
            lastContact: '2023-06-08T10:05:00',
            ticketsCount: 2,
            status: 'active'
          },
          {
            id: 'CONT-009',
            name: 'Thomas Anderson',
            email: 'thomas.anderson@example.com',
            phone: '+1 (555) 321-0987',
            type: 'partner',
            company: 'Software Solutions',
            position: 'Integration Specialist',
            lastContact: '2023-06-01T09:30:00',
            ticketsCount: 0,
            status: 'active'
          },
          {
            id: 'CONT-010',
            name: 'Lisa Garcia',
            email: 'lisa.garcia@example.com',
            phone: '+1 (555) 210-9876',
            type: 'customer',
            company: 'Health Innovations',
            position: 'Customer Success',
            lastContact: '2023-06-16T14:15:00',
            ticketsCount: 1,
            status: 'inactive'
          },
          {
            id: 'CONT-011',
            name: 'Kevin Taylor',
            email: 'kevin.taylor@example.com',
            phone: '+1 (555) 432-1098',
            type: 'customer',
            company: 'Education First',
            position: 'Director',
            lastContact: '2023-06-14T11:45:00',
            ticketsCount: 3,
            status: 'active'
          },
          {
            id: 'CONT-012',
            name: 'Amanda White',
            email: 'amanda.white@example.com',
            phone: '+1 (555) 567-8901',
            type: 'vendor',
            company: 'Office Supplies Inc',
            position: 'Account Executive',
            lastContact: '2023-06-07T16:50:00',
            ticketsCount: 0,
            status: 'active'
          }
        ];
        
        setContacts(mockContacts);
      } catch (err) {
        setError('Failed to load contacts. Please try again.');
        console.error('Error fetching contacts:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchContacts();
  }, []);
  
  // Filter contacts based on search query and filter type
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === 'all' || contact.type === filterType;
    
    return matchesSearch && matchesType;
  });
  
  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredContacts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  
  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold">Contact Management</h1>
          <p className="text-gray-500 mt-1">Manage your customer, vendor, and partner contacts</p>
        </div>
        <Link href="/dashboard/support/contacts/create" passHref>
          <Button>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Contact
          </Button>
        </Link>
      </div>
      
      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <label htmlFor="search" className="sr-only">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                id="search"
                type="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search by name, email, company or ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex-shrink-0">
            <label htmlFor="filter-type" className="sr-only">Filter by Type</label>
            <select
              id="filter-type"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="customer">Customers</option>
              <option value="vendor">Vendors</option>
              <option value="partner">Partners</option>
            </select>
          </div>
          
          <div className="flex-shrink-0">
            <Button variant="outline">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
              Export
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Contacts List */}
      <Card>
        {loading ? (
          <div className="p-6 flex justify-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="rounded-full bg-gray-200 h-12 w-12 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-24 mb-2.5"></div>
              <div className="h-2 bg-gray-200 rounded w-12"></div>
            </div>
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Contacts</h2>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Contacts Found</h2>
            <p className="text-gray-500 mb-4">
              {searchQuery || filterType !== 'all' ? 
                'Try adjusting your search or filter criteria.' : 
                'Get started by adding your first contact.'}
            </p>
            {!(searchQuery || filterType !== 'all') && (
              <Link href="/dashboard/support/contacts/create" passHref>
                <Button>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Contact
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tickets
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-medium text-lg">{contact.name.charAt(0)}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                          <div className="text-sm text-gray-500">{contact.email}</div>
                          <div className="text-sm text-gray-500">{contact.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{contact.company}</div>
                      <div className="text-sm text-gray-500">{contact.position}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        contact.type === 'customer' ? 'bg-green-100 text-green-800' :
                        contact.type === 'vendor' ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {contact.type.charAt(0).toUpperCase() + contact.type.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(contact.lastContact)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {contact.ticketsCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        contact.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link href={`/dashboard/support/contacts/${contact.id}`} passHref>
                          <Button variant="ghost" size="sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Button>
                        <Button variant="ghost" size="sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        {!loading && !error && filteredContacts.length > 0 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to <span className="font-medium">
                    {Math.min(indexOfLastItem, filteredContacts.length)}
                  </span> of <span className="font-medium">{filteredContacts.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <Button
                    variant="outline"
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </Button>
                  
                  {/* Page numbers */}
                  {[...Array(totalPages).keys()].map(number => (
                    <Button
                      key={number + 1}
                      variant={currentPage === number + 1 ? 'default' : 'outline'}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === number + 1
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                      onClick={() => handlePageChange(number + 1)}
                    >
                      {number + 1}
                    </Button>
                  ))}
                  
                  <Button
                    variant="outline"
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </Button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}