'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import { Avatar } from '@/components/ui/Avatar';
import { Skeleton } from '@/components/ui/Skeleton';
import { Switch } from '@/components/ui/Switch';
import { Label } from '@/components/ui/Label';

export default function RoleDetailsPage({ params }) {
  const router = useRouter();
  const roleId = params.id;
  
  // State for role data
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for active tab
  const [activeTab, setActiveTab] = useState('overview');
  
  // State for confirmation dialogs
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  
  // Mock data for permission categories
  const permissionCategories = [
    {
      id: 'perm-cat-001',
      name: 'User Management',
      description: 'Permissions related to user accounts and profiles',
      permissions: [
        { id: 'perm-001', name: 'View Users', description: 'Can view user list and profiles' },
        { id: 'perm-002', name: 'Create Users', description: 'Can create new user accounts' },
        { id: 'perm-003', name: 'Edit Users', description: 'Can edit user profiles and information' },
        { id: 'perm-004', name: 'Delete Users', description: 'Can delete user accounts' },
        { id: 'perm-005', name: 'Manage User Roles', description: 'Can assign roles to users' },
        { id: 'perm-006', name: 'View User Activity', description: 'Can view user activity logs' },
        { id: 'perm-007', name: 'Export User Data', description: 'Can export user data' },
        { id: 'perm-008', name: 'Impersonate Users', description: 'Can impersonate other users (for support purposes)' }
      ]
    },
    {
      id: 'perm-cat-002',
      name: 'Content Management',
      description: 'Permissions related to creating and managing content',
      permissions: [
        { id: 'perm-009', name: 'View Content', description: 'Can view all content' },
        { id: 'perm-010', name: 'Create Content', description: 'Can create new content' },
        { id: 'perm-011', name: 'Edit Content', description: 'Can edit existing content' },
        { id: 'perm-012', name: 'Delete Content', description: 'Can delete content' },
        { id: 'perm-013', name: 'Publish Content', description: 'Can publish content to live site' },
        { id: 'perm-014', name: 'Manage Categories', description: 'Can manage content categories' },
        { id: 'perm-015', name: 'Manage Tags', description: 'Can manage content tags' },
        { id: 'perm-016', name: 'Manage Media', description: 'Can upload and manage media files' },
        { id: 'perm-017', name: 'Manage Comments', description: 'Can moderate and manage comments' },
        { id: 'perm-018', name: 'Export Content', description: 'Can export content data' }
      ]
    },
    {
      id: 'perm-cat-003',
      name: 'Financial Operations',
      description: 'Permissions related to financial data and transactions',
      permissions: [
        { id: 'perm-019', name: 'View Transactions', description: 'Can view financial transactions' },
        { id: 'perm-020', name: 'Process Payments', description: 'Can process payments' },
        { id: 'perm-021', name: 'Issue Refunds', description: 'Can issue refunds' },
        { id: 'perm-022', name: 'Manage Discounts', description: 'Can create and manage discounts' },
        { id: 'perm-023', name: 'View Financial Reports', description: 'Can view financial reports' },
        { id: 'perm-024', name: 'Export Financial Data', description: 'Can export financial data' },
        { id: 'perm-025', name: 'Manage Payment Settings', description: 'Can configure payment settings' }
      ]
    },
    {
      id: 'perm-cat-004',
      name: 'System Settings',
      description: 'Permissions related to system configuration and settings',
      permissions: [
        { id: 'perm-026', name: 'View System Settings', description: 'Can view system settings' },
        { id: 'perm-027', name: 'Edit System Settings', description: 'Can edit system settings' },
        { id: 'perm-028', name: 'Manage Backups', description: 'Can create and restore backups' },
        { id: 'perm-029', name: 'View Audit Logs', description: 'Can view system audit logs' },
        { id: 'perm-030', name: 'Manage Roles & Permissions', description: 'Can manage roles and permissions' },
        { id: 'perm-031', name: 'System Maintenance', description: 'Can perform system maintenance tasks' }
      ]
    },
    {
      id: 'perm-cat-005',
      name: 'Analytics & Reporting',
      description: 'Permissions related to viewing and exporting reports',
      permissions: [
        { id: 'perm-032', name: 'View Analytics Dashboard', description: 'Can view analytics dashboard' },
        { id: 'perm-033', name: 'View Sales Reports', description: 'Can view sales reports' },
        { id: 'perm-034', name: 'View User Analytics', description: 'Can view user analytics' },
        { id: 'perm-035', name: 'View Product Analytics', description: 'Can view product analytics' },
        { id: 'perm-036', name: 'Create Custom Reports', description: 'Can create custom reports' }
      ]
    },
    {
      id: 'perm-cat-006',
      name: 'API & Integration',
      description: 'Permissions related to API access and third-party integrations',
      permissions: [
        { id: 'perm-037', name: 'Generate API Keys', description: 'Can generate API keys' },
        { id: 'perm-038', name: 'Manage API Access', description: 'Can manage API access and permissions' },
        { id: 'perm-039', name: 'Configure Integrations', description: 'Can configure third-party integrations' },
        { id: 'perm-040', name: 'View API Logs', description: 'Can view API usage logs' }
      ]
    }
  ];
  
  // Mock data for users with this role
  const mockUsers = [
    {
      id: 'user-001',
      name: 'John Doe',
      email: 'john.doe@example.com',
      avatar: '/avatars/john-doe.jpg',
      department: 'Marketing',
      lastActive: '2023-06-15T10:30:00Z'
    },
    {
      id: 'user-002',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      avatar: '/avatars/jane-smith.jpg',
      department: 'Sales',
      lastActive: '2023-06-14T16:45:00Z'
    },
    {
      id: 'user-003',
      name: 'Robert Johnson',
      email: 'robert.johnson@example.com',
      avatar: '/avatars/robert-johnson.jpg',
      department: 'Customer Support',
      lastActive: '2023-06-15T09:15:00Z'
    },
    {
      id: 'user-004',
      name: 'Emily Davis',
      email: 'emily.davis@example.com',
      avatar: '/avatars/emily-davis.jpg',
      department: 'Product',
      lastActive: '2023-06-13T14:20:00Z'
    },
    {
      id: 'user-005',
      name: 'Michael Wilson',
      email: 'michael.wilson@example.com',
      avatar: '/avatars/michael-wilson.jpg',
      department: 'Engineering',
      lastActive: '2023-06-15T11:10:00Z'
    }
  ];
  
  // Mock data for recent activities
  const mockActivities = [
    {
      id: 'activity-001',
      type: 'role_updated',
      user: {
        id: 'user-001',
        name: 'John Doe',
        avatar: '/avatars/john-doe.jpg'
      },
      timestamp: '2023-06-15T10:30:00Z',
      details: 'Updated role permissions'
    },
    {
      id: 'activity-002',
      type: 'user_assigned',
      user: {
        id: 'user-002',
        name: 'Jane Smith',
        avatar: '/avatars/jane-smith.jpg'
      },
      timestamp: '2023-06-14T16:45:00Z',
      details: 'Assigned role to Emily Davis'
    },
    {
      id: 'activity-003',
      type: 'user_removed',
      user: {
        id: 'user-003',
        name: 'Robert Johnson',
        avatar: '/avatars/robert-johnson.jpg'
      },
      timestamp: '2023-06-13T09:15:00Z',
      details: 'Removed role from Alex Thompson'
    },
    {
      id: 'activity-004',
      type: 'role_status_changed',
      user: {
        id: 'user-001',
        name: 'John Doe',
        avatar: '/avatars/john-doe.jpg'
      },
      timestamp: '2023-06-10T14:20:00Z',
      details: 'Changed role status to Active'
    },
    {
      id: 'activity-005',
      type: 'role_created',
      user: {
        id: 'user-001',
        name: 'John Doe',
        avatar: '/avatars/john-doe.jpg'
      },
      timestamp: '2023-06-01T11:10:00Z',
      details: 'Created role'
    }
  ];
  
  // Mock role data based on roleId
  useEffect(() => {
    const fetchRoleData = async () => {
      setLoading(true);
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock role data
        let mockRole;
        
        switch (roleId) {
          case 'role-001':
            mockRole = {
              id: 'role-001',
              name: 'Administrator',
              description: 'Full access to all system features and settings',
              isActive: true,
              createdAt: '2023-01-15T10:30:00Z',
              updatedAt: '2023-06-15T10:30:00Z',
              createdBy: {
                id: 'user-001',
                name: 'John Doe'
              },
              updatedBy: {
                id: 'user-001',
                name: 'John Doe'
              },
              userCount: 5,
              isSystem: true,
              permissions: {}
            };
            // All permissions
            permissionCategories.forEach(category => {
              category.permissions.forEach(permission => {
                mockRole.permissions[permission.id] = true;
              });
            });
            break;
          case 'role-002':
            mockRole = {
              id: 'role-002',
              name: 'Manager',
              description: 'Access to most system features with some restrictions on system settings',
              isActive: true,
              createdAt: '2023-01-20T14:45:00Z',
              updatedAt: '2023-05-10T09:15:00Z',
              createdBy: {
                id: 'user-001',
                name: 'John Doe'
              },
              updatedBy: {
                id: 'user-002',
                name: 'Jane Smith'
              },
              userCount: 12,
              isSystem: true,
              permissions: {}
            };
            // Most permissions except some system ones
            permissionCategories.forEach(category => {
              category.permissions.forEach(permission => {
                mockRole.permissions[permission.id] = !['perm-028', 'perm-030', 'perm-031'].includes(permission.id);
              });
            });
            break;
          case 'role-003':
            mockRole = {
              id: 'role-003',
              name: 'Editor',
              description: 'Access to content management with limited access to other features',
              isActive: true,
              createdAt: '2023-02-05T11:20:00Z',
              updatedAt: '2023-04-18T16:30:00Z',
              createdBy: {
                id: 'user-001',
                name: 'John Doe'
              },
              updatedBy: {
                id: 'user-003',
                name: 'Robert Johnson'
              },
              userCount: 8,
              isSystem: true,
              permissions: {}
            };
            // Content permissions and view permissions
            permissionCategories.forEach(category => {
              category.permissions.forEach(permission => {
                if (category.id === 'perm-cat-002') {
                  // All content permissions except delete
                  mockRole.permissions[permission.id] = permission.id !== 'perm-012';
                } else {
                  // Only view permissions for other categories
                  mockRole.permissions[permission.id] = permission.name.startsWith('View');
                }
              });
            });
            break;
          case 'role-004':
            mockRole = {
              id: 'role-004',
              name: 'Viewer',
              description: 'Read-only access to most system features',
              isActive: true,
              createdAt: '2023-02-10T09:00:00Z',
              updatedAt: '2023-03-22T13:45:00Z',
              createdBy: {
                id: 'user-001',
                name: 'John Doe'
              },
              updatedBy: {
                id: 'user-001',
                name: 'John Doe'
              },
              userCount: 20,
              isSystem: true,
              permissions: {}
            };
            // Only view permissions
            permissionCategories.forEach(category => {
              category.permissions.forEach(permission => {
                mockRole.permissions[permission.id] = permission.name.startsWith('View');
              });
            });
            break;
          case 'role-005':
            mockRole = {
              id: 'role-005',
              name: 'Sales Representative',
              description: 'Access to sales and customer data with limited access to other features',
              isActive: true,
              createdAt: '2023-03-01T10:15:00Z',
              updatedAt: '2023-05-05T11:30:00Z',
              createdBy: {
                id: 'user-002',
                name: 'Jane Smith'
              },
              updatedBy: {
                id: 'user-002',
                name: 'Jane Smith'
              },
              userCount: 15,
              isSystem: false,
              permissions: {}
            };
            // Sales and customer related permissions
            permissionCategories.forEach(category => {
              category.permissions.forEach(permission => {
                if (category.id === 'perm-cat-003') {
                  // All financial permissions except settings
                  mockRole.permissions[permission.id] = permission.id !== 'perm-025';
                } else if (category.id === 'perm-cat-005') {
                  // All analytics permissions
                  mockRole.permissions[permission.id] = true;
                } else {
                  // Only view permissions for other categories
                  mockRole.permissions[permission.id] = permission.name.startsWith('View');
                }
              });
            });
            break;
          case 'role-006':
            mockRole = {
              id: 'role-006',
              name: 'Support Agent',
              description: 'Access to customer support features with limited access to other features',
              isActive: false,
              createdAt: '2023-03-15T14:30:00Z',
              updatedAt: '2023-06-01T09:45:00Z',
              createdBy: {
                id: 'user-003',
                name: 'Robert Johnson'
              },
              updatedBy: {
                id: 'user-001',
                name: 'John Doe'
              },
              userCount: 10,
              isSystem: false,
              permissions: {}
            };
            // Support and customer related permissions
            permissionCategories.forEach(category => {
              category.permissions.forEach(permission => {
                if (category.id === 'perm-cat-001') {
                  // User view and activity permissions
                  mockRole.permissions[permission.id] = ['perm-001', 'perm-006'].includes(permission.id);
                } else if (category.id === 'perm-cat-002') {
                  // Content view and comment permissions
                  mockRole.permissions[permission.id] = ['perm-009', 'perm-017'].includes(permission.id);
                } else {
                  // Only view permissions for other categories
                  mockRole.permissions[permission.id] = permission.name.startsWith('View');
                }
              });
            });
            break;
          default:
            throw new Error('Role not found');
        }
        
        setRole(mockRole);
      } catch (err) {
        setError(err.message || 'Failed to fetch role data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRoleData();
  }, [roleId]);
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Count selected permissions
  const countSelectedPermissions = () => {
    if (!role || !role.permissions) return 0;
    return Object.values(role.permissions).filter(value => value).length;
  };
  
  // Get total permissions count
  const getTotalPermissionsCount = () => {
    return permissionCategories.reduce((total, category) => total + category.permissions.length, 0);
  };
  
  // Handle role deletion
  const handleDeleteRole = () => {
    // In a real application, this would be an API call
    console.log('Deleting role:', roleId);
    
    // Close the dialog
    setShowDeleteDialog(false);
    
    // Redirect to roles list page
    router.push('/settings/roles-permissions/roles');
  };
  
  // Handle role status change
  const handleStatusChange = () => {
    // In a real application, this would be an API call
    console.log('Changing role status to:', !role.isActive);
    
    // Update role status locally
    setRole({
      ...role,
      isActive: !role.isActive,
      updatedAt: new Date().toISOString()
    });
    
    // Close the dialog
    setShowStatusDialog(false);
  };
  
  // Render loading state
  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <div className="flex items-center space-x-3">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        
        <div className="space-y-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading role</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <Link href="/settings/roles-permissions/roles">
                  <Button variant="outline" size="sm">
                    Back to Roles
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">{role.name}</h1>
            <Badge className="ml-3" variant={role.isActive ? 'success' : 'secondary'}>
              {role.isActive ? 'Active' : 'Inactive'}
            </Badge>
            {role.isSystem && (
              <Badge className="ml-2" variant="outline">
                System Role
              </Badge>
            )}
          </div>
          <p className="text-gray-500 mt-1">{role.description}</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link href={`/settings/roles-permissions/roles/${roleId}/edit`}>
            <Button variant="outline">
              Edit Role
            </Button>
          </Link>
          <Button 
            variant="destructive" 
            onClick={() => setShowDeleteDialog(true)}
            disabled={role.isSystem} // Prevent deletion of system roles
          >
            Delete Role
          </Button>
        </div>
      </div>
      
      {/* Role Details */}
      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full md:w-auto grid-cols-4 md:inline-flex">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <div className="p-6 space-y-6">
              <div>
                <h2 className="text-lg font-medium mb-4">Role Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Role Name</h3>
                    <p className="mt-1">{role.name}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Status</h3>
                    <div className="mt-1 flex items-center">
                      <Badge variant={role.isActive ? 'success' : 'secondary'}>
                        {role.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      {!role.isSystem && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="ml-2"
                          onClick={() => setShowStatusDialog(true)}
                        >
                          {role.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-medium text-gray-500">Description</h3>
                    <p className="mt-1">{role.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Created By</h3>
                    <p className="mt-1">{role.createdBy.name}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Created At</h3>
                    <p className="mt-1">{formatDate(role.createdAt)}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Last Updated By</h3>
                    <p className="mt-1">{role.updatedBy.name}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Last Updated At</h3>
                    <p className="mt-1">{formatDate(role.updatedAt)}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Users with this Role</h3>
                    <p className="mt-1">{role.userCount}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Permissions</h3>
                    <p className="mt-1">{countSelectedPermissions()} of {getTotalPermissionsCount()}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-medium mb-4">Recent Users</h2>
                
                <div className="space-y-4">
                  {mockUsers.slice(0, 3).map((user) => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10">
                          <img src={user.avatar} alt={user.name} />
                        </Avatar>
                        <div className="ml-3">
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.department}</p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Last active: {formatDate(user.lastActive)}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-sm"
                    onClick={() => setActiveTab('users')}
                  >
                    View All Users
                  </Button>
                </div>
              </div>
            </Card>
            
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-medium mb-4">Recent Activity</h2>
                
                <div className="space-y-4">
                  {mockActivities.slice(0, 3).map((activity) => (
                    <div key={activity.id} className="flex items-start">
                      <Avatar className="h-8 w-8">
                        <img src={activity.user.avatar} alt={activity.user.name} />
                      </Avatar>
                      <div className="ml-3">
                        <p className="text-sm">
                          <span className="font-medium">{activity.user.name}</span> {activity.details}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-sm"
                    onClick={() => setActiveTab('activity')}
                  >
                    View All Activity
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
        
        {/* Permissions Tab */}
        <TabsContent value="permissions" className="space-y-6">
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium">Role Permissions</h2>
                <div className="text-sm text-gray-500">
                  {countSelectedPermissions()} of {getTotalPermissionsCount()} permissions
                </div>
              </div>
              
              <div className="space-y-6">
                {permissionCategories.map((category) => {
                  const categoryPermissions = category.permissions.filter(
                    permission => role.permissions[permission.id]
                  );
                  
                  if (categoryPermissions.length === 0) return null;
                  
                  return (
                    <div key={category.id} className="border rounded-md overflow-hidden">
                      <div className="p-4 bg-gray-50 border-b">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{category.name}</h3>
                            <p className="mt-1 text-sm text-gray-500">{category.description}</p>
                          </div>
                          <Badge>
                            {categoryPermissions.length} of {category.permissions.length}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="divide-y">
                        {categoryPermissions.map((permission) => (
                          <div key={permission.id} className="p-4">
                            <div className="flex items-center">
                              <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <div className="ml-3">
                                <p className="font-medium">{permission.name}</p>
                                <p className="mt-1 text-sm text-gray-500">{permission.description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </TabsContent>
        
        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium">Users with this Role</h2>
                <div className="text-sm text-gray-500">
                  {role.userCount} users
                </div>
              </div>
              
              <div className="space-y-4">
                {mockUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-md">
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10">
                        <img src={user.avatar} alt={user.name} />
                      </Avatar>
                      <div className="ml-3">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Badge variant="outline">{user.department}</Badge>
                      <div className="ml-4 text-xs text-gray-500">
                        Last active: {formatDate(user.lastActive)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>
        
        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-medium mb-6">Role Activity History</h2>
              
              <div className="space-y-6">
                {mockActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start">
                    <Avatar className="h-10 w-10">
                      <img src={activity.user.avatar} alt={activity.user.name} />
                    </Avatar>
                    <div className="ml-3">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user.name}</span> {activity.details}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Role</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-gray-500">
              Are you sure you want to delete the role <strong>"{role.name}"</strong>? This action cannot be undone.
            </p>
            
            {role.userCount > 0 && (
              <div className="mt-4 p-4 bg-amber-50 text-amber-800 rounded-md">
                <p className="text-sm">
                  <strong>Warning:</strong> This role is currently assigned to {role.userCount} users. Deleting this role will remove it from all users.
                </p>
              </div>
            )}
          </div>
          
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
      
      {/* Status Change Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{role.isActive ? 'Deactivate' : 'Activate'} Role</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-gray-500">
              Are you sure you want to {role.isActive ? 'deactivate' : 'activate'} the role <strong>"{role.name}"</strong>?
            </p>
            
            {role.isActive && role.userCount > 0 && (
              <div className="mt-4 p-4 bg-amber-50 text-amber-800 rounded-md">
                <p className="text-sm">
                  <strong>Warning:</strong> This role is currently assigned to {role.userCount} users. Deactivating this role will prevent these users from using the permissions associated with this role.
                </p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStatusDialog(false)}>
              Cancel
            </Button>
            <Button variant={role.isActive ? 'destructive' : 'default'} onClick={handleStatusChange}>
              {role.isActive ? 'Deactivate' : 'Activate'} Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}