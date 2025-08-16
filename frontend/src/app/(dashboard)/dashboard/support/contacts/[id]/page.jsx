'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

export default function ContactDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const contactId = params.id;
  
  // State for contact data
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for tabs
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'tickets', 'notes', 'activity'
  
  // State for notes
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  
  // Fetch contact data
  useEffect(() => {
    const fetchContact = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock contact data
        const mockContact = {
          id: contactId,
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+1 (555) 123-4567',
          type: 'customer',
          company: 'Acme Inc.',
          position: 'CEO',
          address: {
            street: '123 Business Ave',
            city: 'San Francisco',
            state: 'CA',
            zipCode: '94107',
            country: 'United States'
          },
          socialProfiles: {
            linkedin: 'linkedin.com/in/johndoe',
            twitter: 'twitter.com/johndoe',
            facebook: null
          },
          createdAt: '2023-01-15T10:30:00',
          updatedAt: '2023-06-18T14:45:00',
          lastContact: '2023-06-15T10:30:00',
          preferredContactMethod: 'email',
          status: 'active',
          tags: ['VIP', 'Enterprise', 'Tech'],
          assignedTo: {
            id: 'AGT-001',
            name: 'Sarah Johnson'
          },
          customerInfo: {
            customerSince: '2023-01-15',
            totalSpent: '$12,450.00',
            lastPurchase: '2023-06-10',
            accountStatus: 'Active',
            paymentStatus: 'Good Standing'
          }
        };
        
        // Mock notes
        const mockNotes = [
          {
            id: 'NOTE-001',
            content: 'Had a call with John about the new product launch. He expressed interest in our enterprise plan.',
            createdBy: {
              id: 'AGT-001',
              name: 'Sarah Johnson'
            },
            createdAt: '2023-06-15T10:30:00',
            isPrivate: true
          },
          {
            id: 'NOTE-002',
            content: 'Sent follow-up email with pricing details and documentation.',
            createdBy: {
              id: 'AGT-001',
              name: 'Sarah Johnson'
            },
            createdAt: '2023-06-16T14:15:00',
            isPrivate: false
          },
          {
            id: 'NOTE-003',
            content: 'John mentioned they are in the process of evaluating several solutions. Decision expected by end of month.',
            createdBy: {
              id: 'AGT-002',
              name: 'David Wilson'
            },
            createdAt: '2023-06-17T11:45:00',
            isPrivate: false
          }
        ];
        
        setContact(mockContact);
        setNotes(mockNotes);
      } catch (err) {
        setError('Failed to load contact details. Please try again.');
        console.error('Error fetching contact:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchContact();
  }, [contactId]);
  
  // Handle adding a new note
  const handleAddNote = async (e) => {
    e.preventDefault();
    
    if (!newNote.trim()) {
      return;
    }
    
    setIsAddingNote(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create new note
      const newNoteObj = {
        id: `NOTE-${notes.length + 1}`,
        content: newNote,
        createdBy: {
          id: 'AGT-001',
          name: 'Sarah Johnson' // This would be the logged-in agent
        },
        createdAt: new Date().toISOString(),
        isPrivate: false
      };
      
      // Update notes
      setNotes(prev => [newNoteObj, ...prev]);
      setNewNote('');
    } catch (err) {
      console.error('Error adding note:', err);
      alert('Failed to add note. Please try again.');
    } finally {
      setIsAddingNote(false);
    }
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
  
  // Render loading state
  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-gray-200 h-12 w-12 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-24 mb-2.5"></div>
          <div className="h-2 bg-gray-200 rounded w-12"></div>
        </div>
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div className="p-6">
        <Card className="p-6 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Contact</h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <div className="flex justify-center space-x-3">
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
            <Link href="/dashboard/support/contacts" passHref>
              <Button variant="outline">
                Back to Contacts
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }
  
  // Render contact not found
  if (!contact) {
    return (
      <div className="p-6">
        <Card className="p-6 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Contact Not Found</h2>
          <p className="text-gray-500 mb-4">The contact you are looking for does not exist or has been deleted.</p>
          <Link href="/dashboard/support/contacts" passHref>
            <Button>
              Back to Contacts
            </Button>
          </Link>
        </Card>
      </div>
    );
  }
  
  // Mock data for tickets
  const tickets = [
    {
      id: 'TKT-001',
      subject: 'Payment failed but money deducted',
      status: 'open',
      priority: 'high',
      createdAt: '2023-06-18T09:30:00',
      lastUpdated: '2023-06-18T10:15:00'
    },
    {
      id: 'TKT-002',
      subject: 'Question about product features',
      status: 'resolved',
      priority: 'medium',
      createdAt: '2023-05-25T14:20:00',
      lastUpdated: '2023-05-26T11:30:00'
    },
    {
      id: 'TKT-003',
      subject: 'Request for refund',
      status: 'closed',
      priority: 'low',
      createdAt: '2023-04-10T08:45:00',
      lastUpdated: '2023-04-12T16:20:00'
    }
  ];
  
  // Mock data for activity
  const activities = [
    {
      id: 'ACT-001',
      type: 'email_sent',
      description: 'Sent follow-up email about enterprise plan',
      performedBy: {
        id: 'AGT-001',
        name: 'Sarah Johnson'
      },
      timestamp: '2023-06-16T14:15:00'
    },
    {
      id: 'ACT-002',
      type: 'call',
      description: 'Phone call discussing new product features',
      performedBy: {
        id: 'AGT-001',
        name: 'Sarah Johnson'
      },
      timestamp: '2023-06-15T10:30:00',
      duration: '15 minutes'
    },
    {
      id: 'ACT-003',
      type: 'ticket_created',
      description: 'Created ticket: Payment failed but money deducted',
      performedBy: {
        id: 'CUST-001',
        name: 'John Doe'
      },
      timestamp: '2023-06-18T09:30:00'
    },
    {
      id: 'ACT-004',
      type: 'note_added',
      description: 'Added note about product evaluation',
      performedBy: {
        id: 'AGT-002',
        name: 'David Wilson'
      },
      timestamp: '2023-06-17T11:45:00'
    },
    {
      id: 'ACT-005',
      type: 'contact_updated',
      description: 'Updated contact information',
      performedBy: {
        id: 'AGT-001',
        name: 'Sarah Johnson'
      },
      timestamp: '2023-06-14T16:20:00'
    }
  ];
  
  return (
    <div className="p-6 space-y-6">
      {/* Header with contact info and actions */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start space-y-4 md:space-y-0">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-medium text-2xl">{contact.name.charAt(0)}</span>
            </div>
          </div>
          
          <div>
            <div className="flex items-center">
              <Link href="/dashboard/support/contacts" passHref>
                <Button variant="ghost" size="sm" className="p-0 h-auto mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">{contact.name}</h1>
              <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                contact.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
              </span>
            </div>
            
            <div className="mt-1 text-gray-500">
              <p>{contact.position} at {contact.company}</p>
              <div className="flex flex-wrap items-center mt-1">
                {contact.tags.map((tag, index) => (
                  <span key={index} className="mr-2 mb-1 px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-800">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mt-2 flex items-center space-x-4">
              <a href={`mailto:${contact.email}`} className="text-sm text-gray-500 hover:text-gray-700 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {contact.email}
              </a>
              <a href={`tel:${contact.phone}`} className="text-sm text-gray-500 hover:text-gray-700 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {contact.phone}
              </a>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button variant="outline">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            Call
          </Button>
          
          <Button variant="outline">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            Email
          </Button>
          
          <Button variant="outline">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Edit
          </Button>
          
          <Button variant="outline">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Create Ticket
          </Button>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`${activeTab === 'overview' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`${activeTab === 'tickets' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('tickets')}
          >
            Tickets
            <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100">
              {tickets.length}
            </span>
          </button>
          <button
            className={`${activeTab === 'notes' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('notes')}
          >
            Notes
            <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100">
              {notes.length}
            </span>
          </button>
          <button
            className={`${activeTab === 'activity' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('activity')}
          >
            Activity
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="mt-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Contact Information */}
            <Card className="col-span-2 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                  <p className="mt-1 text-sm text-gray-900">{contact.name}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="mt-1 text-sm text-gray-900">{contact.email}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                  <p className="mt-1 text-sm text-gray-900">{contact.phone}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Company</h3>
                  <p className="mt-1 text-sm text-gray-900">{contact.company}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Position</h3>
                  <p className="mt-1 text-sm text-gray-900">{contact.position}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Type</h3>
                  <p className="mt-1 text-sm text-gray-900 capitalize">{contact.type}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Preferred Contact Method</h3>
                  <p className="mt-1 text-sm text-gray-900 capitalize">{contact.preferredContactMethod}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Assigned To</h3>
                  <p className="mt-1 text-sm text-gray-900">{contact.assignedTo.name}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Created</h3>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(contact.createdAt)}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(contact.updatedAt)}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Last Contact</h3>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(contact.lastContact)}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Address</h3>
                <p className="text-sm text-gray-900">{contact.address.street}</p>
                <p className="text-sm text-gray-900">{contact.address.city}, {contact.address.state} {contact.address.zipCode}</p>
                <p className="text-sm text-gray-900">{contact.address.country}</p>
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Social Profiles</h3>
                <div className="flex space-x-4">
                  {contact.socialProfiles.linkedin && (
                    <a href={`https://${contact.socialProfiles.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
                      <span className="sr-only">LinkedIn</span>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                      </svg>
                    </a>
                  )}
                  
                  {contact.socialProfiles.twitter && (
                    <a href={`https://${contact.socialProfiles.twitter}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
                      <span className="sr-only">Twitter</span>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                  )}
                  
                  {contact.socialProfiles.facebook && (
                    <a href={`https://${contact.socialProfiles.facebook}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
                      <span className="sr-only">Facebook</span>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </Card>
            
            {/* Customer Information */}
            <Card className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Customer Since</h3>
                  <p className="mt-1 text-sm text-gray-900">{contact.customerInfo.customerSince}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Total Spent</h3>
                  <p className="mt-1 text-sm text-gray-900">{contact.customerInfo.totalSpent}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Last Purchase</h3>
                  <p className="mt-1 text-sm text-gray-900">{contact.customerInfo.lastPurchase}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Account Status</h3>
                  <p className="mt-1 text-sm text-gray-900">{contact.customerInfo.accountStatus}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Payment Status</h3>
                  <p className="mt-1 text-sm text-gray-900">{contact.customerInfo.paymentStatus}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Recent Orders</h3>
                <p className="text-sm text-gray-500">No recent orders found.</p>
              </div>
            </Card>
          </div>
        )}
        
        {/* Tickets Tab */}
        {activeTab === 'tickets' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Support Tickets</h2>
              <Button>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Create Ticket
              </Button>
            </div>
            
            {tickets.length > 0 ? (
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">ID</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Subject</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Priority</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Created</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Last Updated</th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {tickets.map((ticket) => (
                      <tr key={ticket.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{ticket.id}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{ticket.subject}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            ticket.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                            ticket.status === 'resolved' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            ticket.priority === 'high' ? 'bg-red-100 text-red-800' :
                            ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatDate(ticket.createdAt)}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatDate(ticket.lastUpdated)}</td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <Link href={`/dashboard/support/tickets/${ticket.id}`} className="text-blue-600 hover:text-blue-900">
                            View<span className="sr-only">, {ticket.id}</span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <Card className="p-6 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No Tickets Found</h3>
                <p className="text-gray-500 mb-4">This contact doesn't have any support tickets yet.</p>
                <Button>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Create Ticket
                </Button>
              </Card>
            )}
          </div>
        )}
        
        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Contact Notes</h2>
            </div>
            
            {/* Add Note Form */}
            <Card className="p-6 mb-6">
              <form onSubmit={handleAddNote}>
                <div className="mb-4">
                  <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
                    Add a Note
                  </label>
                  <textarea
                    id="note"
                    rows={3}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Add a note about this contact..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={isAddingNote || !newNote.trim()}>
                    {isAddingNote ? 'Adding...' : 'Add Note'}
                  </Button>
                </div>
              </form>
            </Card>
            
            {/* Notes List */}
            {notes.length > 0 ? (
              <div className="space-y-4">
                {notes.map((note) => (
                  <Card key={note.id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-600 font-medium">{note.createdBy.name.charAt(0)}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{note.createdBy.name}</p>
                          <p className="text-xs text-gray-500">{formatDate(note.createdAt)}</p>
                        </div>
                      </div>
                      {note.isPrivate && (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          Private
                        </span>
                      )}
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-700 whitespace-pre-line">{note.content}</p>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-6 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No Notes Found</h3>
                <p className="text-gray-500">Add a note to keep track of important information about this contact.</p>
              </Card>
            )}
          </div>
        )}
        
        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Activity History</h2>
            </div>
            
            {activities.length > 0 ? (
              <div className="flow-root">
                <ul className="-mb-8">
                  {activities.map((activity, activityIdx) => (
                    <li key={activity.id}>
                      <div className="relative pb-8">
                        {activityIdx !== activities.length - 1 ? (
                          <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                              activity.type === 'email_sent' ? 'bg-blue-500' :
                              activity.type === 'call' ? 'bg-green-500' :
                              activity.type === 'ticket_created' ? 'bg-yellow-500' :
                              activity.type === 'note_added' ? 'bg-purple-500' :
                              'bg-gray-500'
                            }`}>
                              {activity.type === 'email_sent' && (
                                <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                              )}
                              {activity.type === 'call' && (
                                <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                </svg>
                              )}
                              {activity.type === 'ticket_created' && (
                                <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                              )}
                              {activity.type === 'note_added' && (
                                <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                </svg>
                              )}
                              {activity.type === 'contact_updated' && (
                                <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                              )}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-gray-500">{activity.description}</p>
                              {activity.duration && (
                                <p className="text-xs text-gray-500 mt-0.5">Duration: {activity.duration}</p>
                              )}
                            </div>
                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                              <p>{formatDate(activity.timestamp)}</p>
                              <p className="text-xs">{activity.performedBy.name}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <Card className="p-6 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No Activity Found</h3>
                <p className="text-gray-500">There is no recorded activity for this contact yet.</p>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}