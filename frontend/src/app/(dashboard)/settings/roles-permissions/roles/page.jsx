'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';

export default function RoleManagementPage() {
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // State for delete confirmation dialog
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  
  // Mock data for roles
  const roles = [
    {
      id: 'role-001',
      name: 'Administrator',
      description: 'Full system access with all permissions',
      usersCount: 5,
      permissionsCount: 42,
      isSystem: true,
      lastUpdated: '2023-05-15 14:30:22',
      createdBy: 'System',
      createdAt: '2023-01-01 00:00:00'
    },
    {
      id: 'role-002',
      name: 'Manager',
      description: 'Access to manage users, content, and view reports',
      usersCount: 12,
      permissionsCount: 28,
      isSystem: true,
      lastUpdated: '2023-05-20 09:45:18',
      createdBy: 'System',
      createdAt: '2023-01-01 00:00:00'
    },
    {
      id: 'role-003',
      name: 'Editor',
      description: 'Can create and edit content, but cannot manage users or system settings',
      usersCount: 24,
      permissionsCount: 18,
      isSystem: true,
      lastUpdated: '2023-05-22 11:20:05',
      createdBy: 'System',
      createdAt: '2023-01-01 00:00:00'
    },
    {
      id: 'role-004',
      name: 'Viewer',
      description: 'Read-only access to content and reports',
      usersCount: 36,
      permissionsCount: 10,
      isSystem: true,
      lastUpdated: '2023-05-25 16:15:30',
      createdBy: 'System',
      createdAt: '2023-01-01 00:00:00'
    },
    {
      id: 'role-005',
      name: 'Sales Representative',
      description: 'Access to sales data, customer information, and order management',
      usersCount: 18,
      permissionsCount: 15,
      isSystem: false,
      lastUpdated: '2023-06-02 10:30:45',
      createdBy: 'John Doe',
      createdAt: '2023-04-15 09:20:30'
    },
    {
      id: 'role-006',
      name: 'Support Agent',
      description: 'Access to support tickets, customer information, and knowledge base',
      usersCount: 22,
      permissionsCount: 14,
      isSystem: false,
      lastUpdated: '2023-06-05 13:25:10',
      createdBy: 'Jane Smith',
      createdAt: '2023-04-20 14:15:22'
    },
    {
      id: 'role-007',
      name: 'Marketing Specialist',
      description: 'Access to marketing campaigns, analytics, and content creation',
      usersCount: 8,
      permissionsCount: 16,
      isSystem: false,
      lastUpdated: '2023-06-10 09:15:22',
      createdBy: 'John Doe',
      createdAt: '2023-06-10 09:15:22'
    },
    {
      id: 'role-008',
      name: 'Product Manager',
      description: 'Access to product data, analytics, and feature management',
      usersCount: 6,
      permissionsCount: 20,
      isSystem: false,
      lastUpdated: '2023-06-08 11:40:15',
      createdBy: 'Michael Johnson',
      createdAt: '2023-05-12 10:30:45'
    },
    {
      id: 'role-009',
      name: 'Finance Analyst',
      description: 'Access to financial reports, transactions, and billing information',
      usersCount: 4,
      permissionsCount: 12,
      isSystem: false,
      lastUpdated: '2023-06-07 15:20:30',
      createdBy: 'Sarah Brown',
      createdAt: '2023-05-15 13:45:10'
    },
    {
      id: 'role-010',
      name: 'API User',
      description: 'Limited access for API integrations and automated processes',
      usersCount: 2,
      permissionsCount: 8,
      isSystem: false,
      lastUpdated: '2023-06-06 10:05:12',
      createdBy: 'David Miller',
      createdAt: '2023-05-20 09:10:25'
    }
  ];
  
  // Filter roles based on search and filters
  const filteredRoles = roles.filter(role => {
    // Search query filter
    const matchesSearch = searchQuery === '' || 
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Type filter
    const matchesType = typeFilter === 'all' || 
      (typeFilter === 'system' && role.isSystem) ||
      (typeFilter === 'custom' && !role.isSystem);
    
    return matchesSearch && matchesType;
  });
  
  // Sort roles
  const sortedRoles = [...filteredRoles].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'users':
        comparison = a.usersCount - b.usersCount;
        break;
      case 'permissions':
        comparison = a.permissionsCount - b.permissionsCount;
        break;
      case 'updated':
        comparison = new Date(a.lastUpdated) - new Date(b.lastUpdated);
        break;
      case 'created':
        comparison = new Date(a.createdAt) - new Date(b.createdAt);
        break;
      default:
        comparison = a.name.localeCompare(b.name);
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });
  
  // Handle role deletion
  const handleDeleteRole = () => {
    // In a real application, this would be an API call
    console.log(`Deleting role: ${roleToDelete.id}`);
    
    // Close the dialog
    setShowDeleteDialog(false);
    setRoleToDelete(null);
    
    // Show success message or handle errors
    // This is just a mock implementation
  };
  
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold">Role Management</h1>
          <p className="text-gray-500 mt-1">Create, edit, and manage user roles</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link href="/settings/roles-permissions/roles/create">
            <Button>
              <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Role
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              placeholder="Search roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="type-filter">Role Type</Label>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger id="type-filter">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="system">System Roles</SelectItem>
                <SelectItem value="custom">Custom Roles</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="sort-by">Sort By</Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger id="sort-by">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="users">Users Count</SelectItem>
                <SelectItem value="permissions">Permissions Count</SelectItem>
                <SelectItem value="updated">Last Updated</SelectItem>
                <SelectItem value="created">Created Date</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="sort-order">Sort Order</Label>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger id="sort-order">
                <SelectValue placeholder="Sort order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>
      
      {/* Roles Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Users
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permissions
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created By
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedRoles.length > 0 ? (
                sortedRoles.map((role) => (
                  <tr key={role.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{role.name}</div>
                          <div className="text-sm text-gray-500 max-w-xs truncate">{role.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {role.isSystem ? (
                        <Badge className="bg-blue-100 text-blue-800">System</Badge>
                      ) : (
                        <Badge className="bg-green-100 text-green-800">Custom</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {role.usersCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {role.permissionsCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {role.lastUpdated}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {role.createdBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link href={`/settings/roles-permissions/roles/${role.id}`}>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </Link>
                        {!role.isSystem && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                            onClick={() => {
                              setRoleToDelete(role);
                              setShowDeleteDialog(true);
                            }}
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                    No roles found matching the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      
      {/* Role Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-medium mb-4">System Roles</h2>
          <p className="text-sm text-gray-500 mb-4">
            System roles are predefined roles that come with the application. They cannot be deleted, but their permissions can be modified.
          </p>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <svg className="h-5 w-5 text-blue-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span><strong>Administrator:</strong> Full system access with all permissions</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-blue-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span><strong>Manager:</strong> Access to manage users, content, and view reports</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-blue-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span><strong>Editor:</strong> Can create and edit content, but cannot manage users or system settings</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-blue-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span><strong>Viewer:</strong> Read-only access to content and reports</span>
            </li>
          </ul>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-lg font-medium mb-4">Custom Roles</h2>
          <p className="text-sm text-gray-500 mb-4">
            Custom roles are user-defined roles that can be created, modified, and deleted as needed. They allow for fine-grained access control tailored to your organization's needs.
          </p>
          <div className="space-y-4">
            <div className="flex items-start">
              <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span><strong>Create custom roles</strong> with specific permissions for different departments or job functions</span>
            </div>
            <div className="flex items-start">
              <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span><strong>Modify permissions</strong> at any time to adapt to changing requirements</span>
            </div>
            <div className="flex items-start">
              <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span><strong>Temporary roles</strong> can be created for limited-time access needs</span>
            </div>
            <div className="flex items-start">
              <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span><strong>Clone existing roles</strong> to quickly create similar roles with minor modifications</span>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Role</DialogTitle>
          </DialogHeader>
          
          {roleToDelete && (
            <div className="py-4">
              <p className="text-sm text-gray-500">
                Are you sure you want to delete the role <strong>"{roleToDelete.name}"</strong>? This action cannot be undone.
              </p>
              
              {roleToDelete.usersCount > 0 && (
                <div className="mt-4 p-4 bg-yellow-50 text-yellow-800 rounded-md">
                  <div className="flex">
                    <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <p className="font-medium">Warning</p>
                      <p className="text-sm mt-1">
                        This role is currently assigned to {roleToDelete.usersCount} user{roleToDelete.usersCount !== 1 ? 's' : ''}. 
                        Deleting this role will remove it from these users. You will need to assign them a new role.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteRole}>
              Delete Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}