'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Checkbox } from '@/components/ui/Checkbox';
import { Switch } from '@/components/ui/Switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';

export default function CreateRolePage() {
  const router = useRouter();
  
  // State for role form
  const [roleForm, setRoleForm] = useState({
    name: '',
    description: '',
    isActive: true,
    cloneFromRole: '',
    permissions: {}
  });
  
  // State for validation errors
  const [errors, setErrors] = useState({});
  
  // State for confirmation dialog
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  // State for active tab
  const [activeTab, setActiveTab] = useState('general');
  
  // Mock data for existing roles (for cloning)
  const existingRoles = [
    { id: 'role-001', name: 'Administrator' },
    { id: 'role-002', name: 'Manager' },
    { id: 'role-003', name: 'Editor' },
    { id: 'role-004', name: 'Viewer' },
    { id: 'role-005', name: 'Sales Representative' },
    { id: 'role-006', name: 'Support Agent' }
  ];
  
  // Mock data for permission categories and permissions
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
  
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRoleForm({
      ...roleForm,
      [name]: value
    });
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  // Handle switch change
  const handleSwitchChange = (checked) => {
    setRoleForm({
      ...roleForm,
      isActive: checked
    });
  };
  
  // Handle permission change
  const handlePermissionChange = (permissionId, checked) => {
    setRoleForm({
      ...roleForm,
      permissions: {
        ...roleForm.permissions,
        [permissionId]: checked
      }
    });
  };
  
  // Handle category permission change (select/deselect all permissions in a category)
  const handleCategoryPermissionChange = (categoryId, checked) => {
    const category = permissionCategories.find(cat => cat.id === categoryId);
    if (!category) return;
    
    const updatedPermissions = { ...roleForm.permissions };
    
    category.permissions.forEach(permission => {
      updatedPermissions[permission.id] = checked;
    });
    
    setRoleForm({
      ...roleForm,
      permissions: updatedPermissions
    });
  };
  
  // Check if all permissions in a category are selected
  const isCategoryFullySelected = (categoryId) => {
    const category = permissionCategories.find(cat => cat.id === categoryId);
    if (!category) return false;
    
    return category.permissions.every(permission => roleForm.permissions[permission.id]);
  };
  
  // Check if some permissions in a category are selected
  const isCategoryPartiallySelected = (categoryId) => {
    const category = permissionCategories.find(cat => cat.id === categoryId);
    if (!category) return false;
    
    const selectedCount = category.permissions.filter(permission => roleForm.permissions[permission.id]).length;
    return selectedCount > 0 && selectedCount < category.permissions.length;
  };
  
  // Handle clone role selection
  const handleCloneRole = (roleId) => {
    // In a real application, this would fetch the role's permissions from the API
    // For this mock, we'll just set some random permissions
    
    const selectedRole = existingRoles.find(role => role.id === roleId);
    if (!selectedRole) return;
    
    // Simulate different permission sets for different roles
    let mockPermissions = {};
    
    switch (roleId) {
      case 'role-001': // Administrator
        // All permissions
        permissionCategories.forEach(category => {
          category.permissions.forEach(permission => {
            mockPermissions[permission.id] = true;
          });
        });
        break;
      case 'role-002': // Manager
        // Most permissions except some system ones
        permissionCategories.forEach(category => {
          category.permissions.forEach(permission => {
            mockPermissions[permission.id] = !['perm-028', 'perm-030', 'perm-031'].includes(permission.id);
          });
        });
        break;
      case 'role-003': // Editor
        // Content permissions and view permissions
        permissionCategories.forEach(category => {
          category.permissions.forEach(permission => {
            if (category.id === 'perm-cat-002') {
              // All content permissions except delete
              mockPermissions[permission.id] = permission.id !== 'perm-012';
            } else {
              // Only view permissions for other categories
              mockPermissions[permission.id] = permission.name.startsWith('View');
            }
          });
        });
        break;
      case 'role-004': // Viewer
        // Only view permissions
        permissionCategories.forEach(category => {
          category.permissions.forEach(permission => {
            mockPermissions[permission.id] = permission.name.startsWith('View');
          });
        });
        break;
      case 'role-005': // Sales Representative
        // Sales and customer related permissions
        permissionCategories.forEach(category => {
          category.permissions.forEach(permission => {
            if (category.id === 'perm-cat-003') {
              // All financial permissions except settings
              mockPermissions[permission.id] = permission.id !== 'perm-025';
            } else if (category.id === 'perm-cat-005') {
              // All analytics permissions
              mockPermissions[permission.id] = true;
            } else {
              // Only view permissions for other categories
              mockPermissions[permission.id] = permission.name.startsWith('View');
            }
          });
        });
        break;
      case 'role-006': // Support Agent
        // Support and customer related permissions
        permissionCategories.forEach(category => {
          category.permissions.forEach(permission => {
            if (category.id === 'perm-cat-001') {
              // User view and activity permissions
              mockPermissions[permission.id] = ['perm-001', 'perm-006'].includes(permission.id);
            } else if (category.id === 'perm-cat-002') {
              // Content view and comment permissions
              mockPermissions[permission.id] = ['perm-009', 'perm-017'].includes(permission.id);
            } else {
              // Only view permissions for other categories
              mockPermissions[permission.id] = permission.name.startsWith('View');
            }
          });
        });
        break;
      default:
        // No permissions by default
        break;
    }
    
    setRoleForm({
      ...roleForm,
      cloneFromRole: roleId,
      permissions: mockPermissions
    });
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!roleForm.name.trim()) {
      newErrors.name = 'Role name is required';
    }
    
    if (!roleForm.description.trim()) {
      newErrors.description = 'Role description is required';
    }
    
    const hasPermissions = Object.values(roleForm.permissions).some(value => value);
    if (!hasPermissions) {
      newErrors.permissions = 'At least one permission must be selected';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setShowConfirmDialog(true);
    }
  };
  
  // Handle role creation confirmation
  const handleCreateRole = () => {
    // In a real application, this would be an API call
    console.log('Creating role:', roleForm);
    
    // Close the dialog
    setShowConfirmDialog(false);
    
    // Redirect to roles list page
    router.push('/settings/roles-permissions/roles');
  };
  
  // Count selected permissions
  const countSelectedPermissions = () => {
    return Object.values(roleForm.permissions).filter(value => value).length;
  };
  
  // Get total permissions count
  const getTotalPermissionsCount = () => {
    return permissionCategories.reduce((total, category) => total + category.permissions.length, 0);
  };
  
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold">Create New Role</h1>
          <p className="text-gray-500 mt-1">Define a new role with specific permissions</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link href="/settings/roles-permissions/roles">
            <Button variant="outline">
              Cancel
            </Button>
          </Link>
          <Button onClick={handleSubmit}>
            Create Role
          </Button>
        </div>
      </div>
      
      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="general" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full md:w-auto grid-cols-3 md:inline-flex">
            <TabsTrigger value="general">General Information</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          
          {/* General Information Tab */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-base">
                      Role Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter role name"
                      value={roleForm.name}
                      onChange={handleInputChange}
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="description" className="text-base">
                      Description <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Enter role description"
                      value={roleForm.description}
                      onChange={handleInputChange}
                      className={errors.description ? 'border-red-500' : ''}
                      rows={4}
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={roleForm.isActive}
                      onCheckedChange={handleSwitchChange}
                    />
                    <Label htmlFor="isActive" className="text-base">Active</Label>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card>
              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-medium mb-4">Clone from Existing Role</h2>
                  <p className="text-sm text-gray-500 mb-4">
                    Optionally, you can clone permissions from an existing role as a starting point.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {existingRoles.map((role) => (
                      <div 
                        key={role.id} 
                        className={`p-4 border rounded-md cursor-pointer transition-colors ${roleForm.cloneFromRole === role.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                        onClick={() => handleCloneRole(role.id)}
                      >
                        <div className="font-medium">{role.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
            
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setActiveTab('permissions')}>
                Next: Permissions
              </Button>
            </div>
          </TabsContent>
          
          {/* Permissions Tab */}
          <TabsContent value="permissions" className="space-y-6">
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-medium">Role Permissions</h2>
                  <div className="text-sm text-gray-500">
                    {countSelectedPermissions()} of {getTotalPermissionsCount()} permissions selected
                  </div>
                </div>
                
                {errors.permissions && (
                  <div className="mb-4 p-4 bg-red-50 text-red-800 rounded-md">
                    <p>{errors.permissions}</p>
                  </div>
                )}
                
                <div className="space-y-6">
                  {permissionCategories.map((category) => (
                    <div key={category.id} className="border rounded-md overflow-hidden">
                      <div className="p-4 bg-gray-50 border-b">
                        <div className="flex items-center">
                          <Checkbox
                            id={`category-${category.id}`}
                            checked={isCategoryFullySelected(category.id)}
                            indeterminate={isCategoryPartiallySelected(category.id)}
                            onCheckedChange={(checked) => handleCategoryPermissionChange(category.id, checked)}
                          />
                          <Label htmlFor={`category-${category.id}`} className="ml-2 font-medium">
                            {category.name}
                          </Label>
                        </div>
                        <p className="mt-1 text-sm text-gray-500 ml-6">{category.description}</p>
                      </div>
                      
                      <div className="divide-y">
                        {category.permissions.map((permission) => (
                          <div key={permission.id} className="p-4 hover:bg-gray-50">
                            <div className="flex items-center">
                              <Checkbox
                                id={`permission-${permission.id}`}
                                checked={roleForm.permissions[permission.id] || false}
                                onCheckedChange={(checked) => handlePermissionChange(permission.id, checked)}
                              />
                              <Label htmlFor={`permission-${permission.id}`} className="ml-2 font-medium">
                                {permission.name}
                              </Label>
                            </div>
                            <p className="mt-1 text-sm text-gray-500 ml-6">{permission.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab('general')}>
                Back: General Information
              </Button>
              <Button variant="outline" onClick={() => setActiveTab('preview')}>
                Next: Preview
              </Button>
            </div>
          </TabsContent>
          
          {/* Preview Tab */}
          <TabsContent value="preview" className="space-y-6">
            <Card>
              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-medium mb-4">Role Summary</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Role Name</h3>
                      <p className="mt-1">{roleForm.name || 'Not specified'}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Status</h3>
                      <p className="mt-1">
                        {roleForm.isActive ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Inactive
                          </span>
                        )}
                      </p>
                    </div>
                    
                    <div className="md:col-span-2">
                      <h3 className="text-sm font-medium text-gray-500">Description</h3>
                      <p className="mt-1">{roleForm.description || 'Not specified'}</p>
                    </div>
                    
                    <div className="md:col-span-2">
                      <h3 className="text-sm font-medium text-gray-500">Permissions</h3>
                      <p className="mt-1">{countSelectedPermissions()} permissions selected</p>
                      
                      <div className="mt-4 space-y-4">
                        {permissionCategories.map((category) => {
                          const selectedPermissions = category.permissions.filter(
                            permission => roleForm.permissions[permission.id]
                          );
                          
                          if (selectedPermissions.length === 0) return null;
                          
                          return (
                            <div key={category.id}>
                              <h4 className="text-sm font-medium">{category.name}</h4>
                              <div className="mt-2 flex flex-wrap gap-2">
                                {selectedPermissions.map((permission) => (
                                  <span 
                                    key={permission.id}
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                  >
                                    {permission.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab('permissions')}>
                Back: Permissions
              </Button>
              <Button onClick={handleSubmit}>
                Create Role
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </form>
      
      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Role</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-gray-500">
              Are you sure you want to create the role <strong>"{roleForm.name}"</strong> with {countSelectedPermissions()} permissions?
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateRole}>
              Create Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}