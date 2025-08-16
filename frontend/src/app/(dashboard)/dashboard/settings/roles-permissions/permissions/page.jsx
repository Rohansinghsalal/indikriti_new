'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';

export default function PermissionsPage() {
  // State for active tab
  const [activeTab, setActiveTab] = useState('categories');
  
  // State for search query
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for category filter
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // State for dialogs
  const [showCreateCategoryDialog, setShowCreateCategoryDialog] = useState(false);
  const [showCreatePermissionDialog, setShowCreatePermissionDialog] = useState(false);
  const [showEditCategoryDialog, setShowEditCategoryDialog] = useState(false);
  const [showEditPermissionDialog, setShowEditPermissionDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // State for selected item to edit or delete
  const [selectedItem, setSelectedItem] = useState(null);
  
  // State for form data
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: ''
  });
  
  const [permissionForm, setPermissionForm] = useState({
    name: '',
    description: '',
    categoryId: ''
  });
  
  // Mock data for permission categories
  const [permissionCategories, setPermissionCategories] = useState([
    {
      id: 'perm-cat-001',
      name: 'User Management',
      description: 'Permissions related to user accounts and profiles',
      permissionCount: 8,
      systemDefined: true
    },
    {
      id: 'perm-cat-002',
      name: 'Content Management',
      description: 'Permissions related to creating and managing content',
      permissionCount: 10,
      systemDefined: true
    },
    {
      id: 'perm-cat-003',
      name: 'Financial Operations',
      description: 'Permissions related to financial data and transactions',
      permissionCount: 7,
      systemDefined: true
    },
    {
      id: 'perm-cat-004',
      name: 'System Settings',
      description: 'Permissions related to system configuration and settings',
      permissionCount: 6,
      systemDefined: true
    },
    {
      id: 'perm-cat-005',
      name: 'Analytics & Reporting',
      description: 'Permissions related to viewing and exporting reports',
      permissionCount: 5,
      systemDefined: true
    },
    {
      id: 'perm-cat-006',
      name: 'API & Integration',
      description: 'Permissions related to API access and third-party integrations',
      permissionCount: 4,
      systemDefined: true
    },
    {
      id: 'perm-cat-007',
      name: 'Custom Features',
      description: 'Permissions for custom features and modules',
      permissionCount: 3,
      systemDefined: false
    }
  ]);
  
  // Mock data for permissions
  const [permissions, setPermissions] = useState([
    // User Management permissions
    { id: 'perm-001', name: 'View Users', description: 'Can view user list and profiles', categoryId: 'perm-cat-001', systemDefined: true, usedByRoles: 5 },
    { id: 'perm-002', name: 'Create Users', description: 'Can create new user accounts', categoryId: 'perm-cat-001', systemDefined: true, usedByRoles: 2 },
    { id: 'perm-003', name: 'Edit Users', description: 'Can edit user profiles and information', categoryId: 'perm-cat-001', systemDefined: true, usedByRoles: 2 },
    { id: 'perm-004', name: 'Delete Users', description: 'Can delete user accounts', categoryId: 'perm-cat-001', systemDefined: true, usedByRoles: 1 },
    { id: 'perm-005', name: 'Manage User Roles', description: 'Can assign roles to users', categoryId: 'perm-cat-001', systemDefined: true, usedByRoles: 2 },
    { id: 'perm-006', name: 'View User Activity', description: 'Can view user activity logs', categoryId: 'perm-cat-001', systemDefined: true, usedByRoles: 3 },
    { id: 'perm-007', name: 'Export User Data', description: 'Can export user data', categoryId: 'perm-cat-001', systemDefined: true, usedByRoles: 2 },
    { id: 'perm-008', name: 'Impersonate Users', description: 'Can impersonate other users (for support purposes)', categoryId: 'perm-cat-001', systemDefined: true, usedByRoles: 1 },
    
    // Content Management permissions
    { id: 'perm-009', name: 'View Content', description: 'Can view all content', categoryId: 'perm-cat-002', systemDefined: true, usedByRoles: 6 },
    { id: 'perm-010', name: 'Create Content', description: 'Can create new content', categoryId: 'perm-cat-002', systemDefined: true, usedByRoles: 3 },
    { id: 'perm-011', name: 'Edit Content', description: 'Can edit existing content', categoryId: 'perm-cat-002', systemDefined: true, usedByRoles: 3 },
    { id: 'perm-012', name: 'Delete Content', description: 'Can delete content', categoryId: 'perm-cat-002', systemDefined: true, usedByRoles: 2 },
    { id: 'perm-013', name: 'Publish Content', description: 'Can publish content to live site', categoryId: 'perm-cat-002', systemDefined: true, usedByRoles: 2 },
    { id: 'perm-014', name: 'Manage Categories', description: 'Can manage content categories', categoryId: 'perm-cat-002', systemDefined: true, usedByRoles: 2 },
    { id: 'perm-015', name: 'Manage Tags', description: 'Can manage content tags', categoryId: 'perm-cat-002', systemDefined: true, usedByRoles: 2 },
    { id: 'perm-016', name: 'Manage Media', description: 'Can upload and manage media files', categoryId: 'perm-cat-002', systemDefined: true, usedByRoles: 3 },
    { id: 'perm-017', name: 'Manage Comments', description: 'Can moderate and manage comments', categoryId: 'perm-cat-002', systemDefined: true, usedByRoles: 3 },
    { id: 'perm-018', name: 'Export Content', description: 'Can export content data', categoryId: 'perm-cat-002', systemDefined: true, usedByRoles: 2 },
    
    // Financial Operations permissions
    { id: 'perm-019', name: 'View Transactions', description: 'Can view financial transactions', categoryId: 'perm-cat-003', systemDefined: true, usedByRoles: 4 },
    { id: 'perm-020', name: 'Process Payments', description: 'Can process payments', categoryId: 'perm-cat-003', systemDefined: true, usedByRoles: 2 },
    { id: 'perm-021', name: 'Issue Refunds', description: 'Can issue refunds', categoryId: 'perm-cat-003', systemDefined: true, usedByRoles: 2 },
    { id: 'perm-022', name: 'Manage Discounts', description: 'Can create and manage discounts', categoryId: 'perm-cat-003', systemDefined: true, usedByRoles: 2 },
    { id: 'perm-023', name: 'View Financial Reports', description: 'Can view financial reports', categoryId: 'perm-cat-003', systemDefined: true, usedByRoles: 3 },
    { id: 'perm-024', name: 'Export Financial Data', description: 'Can export financial data', categoryId: 'perm-cat-003', systemDefined: true, usedByRoles: 2 },
    { id: 'perm-025', name: 'Manage Payment Settings', description: 'Can configure payment settings', categoryId: 'perm-cat-003', systemDefined: true, usedByRoles: 1 },
    
    // System Settings permissions
    { id: 'perm-026', name: 'View System Settings', description: 'Can view system settings', categoryId: 'perm-cat-004', systemDefined: true, usedByRoles: 3 },
    { id: 'perm-027', name: 'Edit System Settings', description: 'Can edit system settings', categoryId: 'perm-cat-004', systemDefined: true, usedByRoles: 1 },
    { id: 'perm-028', name: 'Manage Backups', description: 'Can create and restore backups', categoryId: 'perm-cat-004', systemDefined: true, usedByRoles: 1 },
    { id: 'perm-029', name: 'View Audit Logs', description: 'Can view system audit logs', categoryId: 'perm-cat-004', systemDefined: true, usedByRoles: 2 },
    { id: 'perm-030', name: 'Manage Roles & Permissions', description: 'Can manage roles and permissions', categoryId: 'perm-cat-004', systemDefined: true, usedByRoles: 1 },
    { id: 'perm-031', name: 'System Maintenance', description: 'Can perform system maintenance tasks', categoryId: 'perm-cat-004', systemDefined: true, usedByRoles: 1 },
    
    // Analytics & Reporting permissions
    { id: 'perm-032', name: 'View Analytics Dashboard', description: 'Can view analytics dashboard', categoryId: 'perm-cat-005', systemDefined: true, usedByRoles: 4 },
    { id: 'perm-033', name: 'View Sales Reports', description: 'Can view sales reports', categoryId: 'perm-cat-005', systemDefined: true, usedByRoles: 3 },
    { id: 'perm-034', name: 'View User Analytics', description: 'Can view user analytics', categoryId: 'perm-cat-005', systemDefined: true, usedByRoles: 3 },
    { id: 'perm-035', name: 'View Product Analytics', description: 'Can view product analytics', categoryId: 'perm-cat-005', systemDefined: true, usedByRoles: 3 },
    { id: 'perm-036', name: 'Create Custom Reports', description: 'Can create custom reports', categoryId: 'perm-cat-005', systemDefined: true, usedByRoles: 2 },
    
    // API & Integration permissions
    { id: 'perm-037', name: 'Generate API Keys', description: 'Can generate API keys', categoryId: 'perm-cat-006', systemDefined: true, usedByRoles: 1 },
    { id: 'perm-038', name: 'Manage API Access', description: 'Can manage API access and permissions', categoryId: 'perm-cat-006', systemDefined: true, usedByRoles: 1 },
    { id: 'perm-039', name: 'Configure Integrations', description: 'Can configure third-party integrations', categoryId: 'perm-cat-006', systemDefined: true, usedByRoles: 1 },
    { id: 'perm-040', name: 'View API Logs', description: 'Can view API usage logs', categoryId: 'perm-cat-006', systemDefined: true, usedByRoles: 2 },
    
    // Custom Features permissions
    { id: 'perm-041', name: 'Access Custom Module A', description: 'Can access custom module A', categoryId: 'perm-cat-007', systemDefined: false, usedByRoles: 2 },
    { id: 'perm-042', name: 'Access Custom Module B', description: 'Can access custom module B', categoryId: 'perm-cat-007', systemDefined: false, usedByRoles: 1 },
    { id: 'perm-043', name: 'Access Custom Module C', description: 'Can access custom module C', categoryId: 'perm-cat-007', systemDefined: false, usedByRoles: 1 }
  ]);
  
  // Filter permissions based on search query and category filter
  const filteredPermissions = permissions.filter(permission => {
    const matchesSearch = permission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         permission.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || permission.categoryId === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Handle category filter change
  const handleCategoryFilterChange = (value) => {
    setCategoryFilter(value);
  };
  
  // Handle create category form input change
  const handleCategoryFormChange = (e) => {
    const { name, value } = e.target;
    setCategoryForm({
      ...categoryForm,
      [name]: value
    });
  };
  
  // Handle create permission form input change
  const handlePermissionFormChange = (e) => {
    const { name, value } = e.target;
    setPermissionForm({
      ...permissionForm,
      [name]: value
    });
  };
  
  // Handle permission category selection
  const handleCategorySelect = (value) => {
    setPermissionForm({
      ...permissionForm,
      categoryId: value
    });
  };
  
  // Open create category dialog
  const openCreateCategoryDialog = () => {
    setCategoryForm({
      name: '',
      description: ''
    });
    setShowCreateCategoryDialog(true);
  };
  
  // Open create permission dialog
  const openCreatePermissionDialog = () => {
    setPermissionForm({
      name: '',
      description: '',
      categoryId: ''
    });
    setShowCreatePermissionDialog(true);
  };
  
  // Open edit category dialog
  const openEditCategoryDialog = (category) => {
    setSelectedItem(category);
    setCategoryForm({
      name: category.name,
      description: category.description
    });
    setShowEditCategoryDialog(true);
  };
  
  // Open edit permission dialog
  const openEditPermissionDialog = (permission) => {
    setSelectedItem(permission);
    setPermissionForm({
      name: permission.name,
      description: permission.description,
      categoryId: permission.categoryId
    });
    setShowEditPermissionDialog(true);
  };
  
  // Open delete dialog
  const openDeleteDialog = (item, type) => {
    setSelectedItem({ ...item, type });
    setShowDeleteDialog(true);
  };
  
  // Handle create category
  const handleCreateCategory = () => {
    // In a real application, this would be an API call
    const newCategory = {
      id: `perm-cat-${permissionCategories.length + 1}`,
      name: categoryForm.name,
      description: categoryForm.description,
      permissionCount: 0,
      systemDefined: false
    };
    
    setPermissionCategories([...permissionCategories, newCategory]);
    setShowCreateCategoryDialog(false);
  };
  
  // Handle create permission
  const handleCreatePermission = () => {
    // In a real application, this would be an API call
    const newPermission = {
      id: `perm-${permissions.length + 1}`,
      name: permissionForm.name,
      description: permissionForm.description,
      categoryId: permissionForm.categoryId,
      systemDefined: false,
      usedByRoles: 0
    };
    
    setPermissions([...permissions, newPermission]);
    
    // Update permission count for the category
    const updatedCategories = permissionCategories.map(category => {
      if (category.id === permissionForm.categoryId) {
        return {
          ...category,
          permissionCount: category.permissionCount + 1
        };
      }
      return category;
    });
    
    setPermissionCategories(updatedCategories);
    setShowCreatePermissionDialog(false);
  };
  
  // Handle edit category
  const handleEditCategory = () => {
    // In a real application, this would be an API call
    const updatedCategories = permissionCategories.map(category => {
      if (category.id === selectedItem.id) {
        return {
          ...category,
          name: categoryForm.name,
          description: categoryForm.description
        };
      }
      return category;
    });
    
    setPermissionCategories(updatedCategories);
    setShowEditCategoryDialog(false);
  };
  
  // Handle edit permission
  const handleEditPermission = () => {
    // In a real application, this would be an API call
    const oldCategoryId = selectedItem.categoryId;
    const newCategoryId = permissionForm.categoryId;
    
    const updatedPermissions = permissions.map(permission => {
      if (permission.id === selectedItem.id) {
        return {
          ...permission,
          name: permissionForm.name,
          description: permissionForm.description,
          categoryId: newCategoryId
        };
      }
      return permission;
    });
    
    setPermissions(updatedPermissions);
    
    // Update permission counts for categories if the category changed
    if (oldCategoryId !== newCategoryId) {
      const updatedCategories = permissionCategories.map(category => {
        if (category.id === oldCategoryId) {
          return {
            ...category,
            permissionCount: category.permissionCount - 1
          };
        } else if (category.id === newCategoryId) {
          return {
            ...category,
            permissionCount: category.permissionCount + 1
          };
        }
        return category;
      });
      
      setPermissionCategories(updatedCategories);
    }
    
    setShowEditPermissionDialog(false);
  };
  
  // Handle delete
  const handleDelete = () => {
    // In a real application, this would be an API call
    if (selectedItem.type === 'category') {
      // Check if category has permissions
      const hasPermissions = permissions.some(permission => permission.categoryId === selectedItem.id);
      
      if (hasPermissions) {
        alert('Cannot delete category with permissions. Please move or delete the permissions first.');
        setShowDeleteDialog(false);
        return;
      }
      
      const updatedCategories = permissionCategories.filter(category => category.id !== selectedItem.id);
      setPermissionCategories(updatedCategories);
    } else if (selectedItem.type === 'permission') {
      // Check if permission is used by roles
      if (selectedItem.usedByRoles > 0) {
        alert(`Cannot delete permission used by ${selectedItem.usedByRoles} roles. Please remove from roles first.`);
        setShowDeleteDialog(false);
        return;
      }
      
      const updatedPermissions = permissions.filter(permission => permission.id !== selectedItem.id);
      setPermissions(updatedPermissions);
      
      // Update permission count for the category
      const updatedCategories = permissionCategories.map(category => {
        if (category.id === selectedItem.categoryId) {
          return {
            ...category,
            permissionCount: category.permissionCount - 1
          };
        }
        return category;
      });
      
      setPermissionCategories(updatedCategories);
    }
    
    setShowDeleteDialog(false);
  };
  
  // Get category name by ID
  const getCategoryName = (categoryId) => {
    const category = permissionCategories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown Category';
  };
  
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold">Permissions Management</h1>
          <p className="text-gray-500 mt-1">Manage system permissions and categories</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={openCreatePermissionDialog}>
            Create Permission
          </Button>
          <Button onClick={openCreateCategoryDialog}>
            Create Category
          </Button>
        </div>
      </div>
      
      {/* Tabs */}
      <Tabs defaultValue="categories" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:inline-flex">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>
        
        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium">Permission Categories</h2>
                <div className="text-sm text-gray-500">
                  {permissionCategories.length} categories
                </div>
              </div>
              
              <div className="space-y-4">
                {permissionCategories.map((category) => (
                  <div key={category.id} className="p-4 border rounded-md">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-medium">{category.name}</h3>
                          {category.systemDefined && (
                            <Badge variant="outline" className="ml-2">
                              System
                            </Badge>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-gray-500">{category.description}</p>
                        <div className="mt-2 text-sm">
                          <span className="text-gray-500">{category.permissionCount} permissions</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openEditCategoryDialog(category)}
                          disabled={category.systemDefined}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => openDeleteDialog(category, 'category')}
                          disabled={category.systemDefined || category.permissionCount > 0}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>
        
        {/* Permissions Tab */}
        <TabsContent value="permissions" className="space-y-6">
          <Card>
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-6">
                <h2 className="text-lg font-medium">System Permissions</h2>
                
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                  <div className="w-full md:w-64">
                    <Input
                      placeholder="Search permissions..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                  </div>
                  
                  <Select value={categoryFilter} onValueChange={handleCategoryFilterChange}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {permissionCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-4">
                {filteredPermissions.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No permissions found matching your criteria.</p>
                  </div>
                ) : (
                  filteredPermissions.map((permission) => (
                    <div key={permission.id} className="p-4 border rounded-md">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-medium">{permission.name}</h3>
                            {permission.systemDefined && (
                              <Badge variant="outline" className="ml-2">
                                System
                              </Badge>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-gray-500">{permission.description}</p>
                          <div className="mt-2 flex items-center space-x-4 text-sm">
                            <span className="text-gray-500">
                              Category: <span className="font-medium">{getCategoryName(permission.categoryId)}</span>
                            </span>
                            <span className="text-gray-500">
                              Used by: <span className="font-medium">{permission.usedByRoles} roles</span>
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => openEditPermissionDialog(permission)}
                            disabled={permission.systemDefined}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => openDeleteDialog(permission, 'permission')}
                            disabled={permission.systemDefined || permission.usedByRoles > 0}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Create Category Dialog */}
      <Dialog open={showCreateCategoryDialog} onOpenChange={setShowCreateCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Permission Category</DialogTitle>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="name" className="text-base">
                Category Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter category name"
                value={categoryForm.name}
                onChange={handleCategoryFormChange}
              />
            </div>
            
            <div>
              <Label htmlFor="description" className="text-base">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter category description"
                value={categoryForm.description}
                onChange={handleCategoryFormChange}
                rows={4}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateCategoryDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateCategory}
              disabled={!categoryForm.name || !categoryForm.description}
            >
              Create Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Create Permission Dialog */}
      <Dialog open={showCreatePermissionDialog} onOpenChange={setShowCreatePermissionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Permission</DialogTitle>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="name" className="text-base">
                Permission Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter permission name"
                value={permissionForm.name}
                onChange={handlePermissionFormChange}
              />
            </div>
            
            <div>
              <Label htmlFor="description" className="text-base">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter permission description"
                value={permissionForm.description}
                onChange={handlePermissionFormChange}
                rows={4}
              />
            </div>
            
            <div>
              <Label htmlFor="categoryId" className="text-base">
                Category <span className="text-red-500">*</span>
              </Label>
              <Select value={permissionForm.categoryId} onValueChange={handleCategorySelect}>
                <SelectTrigger id="categoryId">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {permissionCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreatePermissionDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreatePermission}
              disabled={!permissionForm.name || !permissionForm.description || !permissionForm.categoryId}
            >
              Create Permission
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Category Dialog */}
      <Dialog open={showEditCategoryDialog} onOpenChange={setShowEditCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Permission Category</DialogTitle>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="edit-name" className="text-base">
                Category Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-name"
                name="name"
                placeholder="Enter category name"
                value={categoryForm.name}
                onChange={handleCategoryFormChange}
              />
            </div>
            
            <div>
              <Label htmlFor="edit-description" className="text-base">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="edit-description"
                name="description"
                placeholder="Enter category description"
                value={categoryForm.description}
                onChange={handleCategoryFormChange}
                rows={4}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditCategoryDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleEditCategory}
              disabled={!categoryForm.name || !categoryForm.description}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Permission Dialog */}
      <Dialog open={showEditPermissionDialog} onOpenChange={setShowEditPermissionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Permission</DialogTitle>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="edit-perm-name" className="text-base">
                Permission Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-perm-name"
                name="name"
                placeholder="Enter permission name"
                value={permissionForm.name}
                onChange={handlePermissionFormChange}
              />
            </div>
            
            <div>
              <Label htmlFor="edit-perm-description" className="text-base">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="edit-perm-description"
                name="description"
                placeholder="Enter permission description"
                value={permissionForm.description}
                onChange={handlePermissionFormChange}
                rows={4}
              />
            </div>
            
            <div>
              <Label htmlFor="edit-perm-categoryId" className="text-base">
                Category <span className="text-red-500">*</span>
              </Label>
              <Select value={permissionForm.categoryId} onValueChange={handleCategorySelect}>
                <SelectTrigger id="edit-perm-categoryId">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {permissionCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditPermissionDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleEditPermission}
              disabled={!permissionForm.name || !permissionForm.description || !permissionForm.categoryId}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Delete {selectedItem?.type === 'category' ? 'Category' : 'Permission'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-gray-500">
              Are you sure you want to delete the {selectedItem?.type === 'category' ? 'category' : 'permission'} <strong>"{selectedItem?.name}"</strong>? This action cannot be undone.
            </p>
            
            {selectedItem?.type === 'category' && selectedItem?.permissionCount > 0 && (
              <div className="mt-4 p-4 bg-amber-50 text-amber-800 rounded-md">
                <p className="text-sm">
                  <strong>Warning:</strong> This category has {selectedItem.permissionCount} permissions. You must move or delete these permissions before deleting the category.
                </p>
              </div>
            )}
            
            {selectedItem?.type === 'permission' && selectedItem?.usedByRoles > 0 && (
              <div className="mt-4 p-4 bg-amber-50 text-amber-800 rounded-md">
                <p className="text-sm">
                  <strong>Warning:</strong> This permission is used by {selectedItem.usedByRoles} roles. You must remove it from all roles before deleting.
                </p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={
                (selectedItem?.type === 'category' && selectedItem?.permissionCount > 0) ||
                (selectedItem?.type === 'permission' && selectedItem?.usedByRoles > 0)
              }
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}