'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';

export default function RolesPermissionsPage() {
  // Mock data for roles
  const roles = [
    {
      id: 'role-001',
      name: 'Administrator',
      description: 'Full system access with all permissions',
      usersCount: 5,
      permissionsCount: 42,
      isSystem: true,
      lastUpdated: '2023-05-15 14:30:22'
    },
    {
      id: 'role-002',
      name: 'Manager',
      description: 'Access to manage users, content, and view reports',
      usersCount: 12,
      permissionsCount: 28,
      isSystem: true,
      lastUpdated: '2023-05-20 09:45:18'
    },
    {
      id: 'role-003',
      name: 'Editor',
      description: 'Can create and edit content, but cannot manage users or system settings',
      usersCount: 24,
      permissionsCount: 18,
      isSystem: true,
      lastUpdated: '2023-05-22 11:20:05'
    },
    {
      id: 'role-004',
      name: 'Viewer',
      description: 'Read-only access to content and reports',
      usersCount: 36,
      permissionsCount: 10,
      isSystem: true,
      lastUpdated: '2023-05-25 16:15:30'
    },
    {
      id: 'role-005',
      name: 'Sales Representative',
      description: 'Access to sales data, customer information, and order management',
      usersCount: 18,
      permissionsCount: 15,
      isSystem: false,
      lastUpdated: '2023-06-02 10:30:45'
    },
    {
      id: 'role-006',
      name: 'Support Agent',
      description: 'Access to support tickets, customer information, and knowledge base',
      usersCount: 22,
      permissionsCount: 14,
      isSystem: false,
      lastUpdated: '2023-06-05 13:25:10'
    }
  ];

  // Mock data for permission categories
  const permissionCategories = [
    {
      id: 'perm-cat-001',
      name: 'User Management',
      description: 'Permissions related to user accounts and profiles',
      permissionsCount: 8,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      id: 'perm-cat-002',
      name: 'Content Management',
      description: 'Permissions related to creating and managing content',
      permissionsCount: 10,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      )
    },
    {
      id: 'perm-cat-003',
      name: 'Financial Operations',
      description: 'Permissions related to financial data and transactions',
      permissionsCount: 7,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 'perm-cat-004',
      name: 'System Settings',
      description: 'Permissions related to system configuration and settings',
      permissionsCount: 6,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      id: 'perm-cat-005',
      name: 'Analytics & Reporting',
      description: 'Permissions related to viewing and exporting reports',
      permissionsCount: 5,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      id: 'perm-cat-006',
      name: 'API & Integration',
      description: 'Permissions related to API access and third-party integrations',
      permissionsCount: 4,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  // Mock data for recent activities
  const recentActivities = [
    {
      id: 'act-001',
      action: 'Role Created',
      description: 'Created new role "Marketing Specialist"',
      user: 'John Doe',
      timestamp: '2023-06-10 09:15:22'
    },
    {
      id: 'act-002',
      action: 'Permission Added',
      description: 'Added "Export Reports" permission to "Manager" role',
      user: 'Jane Smith',
      timestamp: '2023-06-09 14:30:45'
    },
    {
      id: 'act-003',
      action: 'Role Updated',
      description: 'Updated permissions for "Editor" role',
      user: 'Michael Johnson',
      timestamp: '2023-06-08 11:20:18'
    },
    {
      id: 'act-004',
      action: 'User Role Changed',
      description: 'Changed role for user "Emily Davis" from "Viewer" to "Editor"',
      user: 'Sarah Brown',
      timestamp: '2023-06-07 16:45:30'
    },
    {
      id: 'act-005',
      action: 'Role Deleted',
      description: 'Deleted role "Temporary Access"',
      user: 'John Doe',
      timestamp: '2023-06-06 10:05:12'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold">Roles & Permissions</h1>
          <p className="text-gray-500 mt-1">Manage user roles and access permissions across the system</p>
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

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-800">
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Total Roles</h2>
              <p className="text-2xl font-semibold text-gray-900">{roles.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-800">
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Permission Categories</h2>
              <p className="text-2xl font-semibold text-gray-900">{permissionCategories.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-800">
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Total Permissions</h2>
              <p className="text-2xl font-semibold text-gray-900">
                {permissionCategories.reduce((total, category) => total + category.permissionsCount, 0)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Roles */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Roles</h2>
                <Link href="/settings/roles-permissions/roles">
                  <Button variant="outline" size="sm">
                    Manage Roles
                  </Button>
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {roles.map((role) => (
                <div key={role.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center">
                        <h3 className="text-md font-medium text-gray-900">{role.name}</h3>
                        {role.isSystem && (
                          <Badge className="ml-2 bg-blue-100 text-blue-800">System</Badge>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{role.description}</p>
                    </div>
                    <Link href={`/settings/roles-permissions/roles/${role.id}`}>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                  <div className="mt-4 flex items-center text-sm text-gray-500 space-x-6">
                    <div>
                      <span className="font-medium">{role.usersCount}</span> users
                    </div>
                    <div>
                      <span className="font-medium">{role.permissionsCount}</span> permissions
                    </div>
                    <div>
                      Last updated: {role.lastUpdated}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column - Permissions & Recent Activity */}
        <div className="space-y-6">
          {/* Permission Categories */}
          <Card>
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Permission Categories</h2>
                <Link href="/settings/roles-permissions/permissions">
                  <Button variant="outline" size="sm">
                    Manage Permissions
                  </Button>
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {permissionCategories.map((category) => (
                <div key={category.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 p-2 rounded-md bg-gray-100">
                      {category.icon}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900">{category.name}</h3>
                      <p className="text-xs text-gray-500">{category.permissionsCount} permissions</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card>
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium">Recent Activity</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    </div>
                    <div className="ml-3">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">{activity.action}</span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{activity.description}</p>
                      <div className="mt-2 text-xs text-gray-500">
                        <span>{activity.user}</span>
                        <span className="mx-1">•</span>
                        <span>{activity.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 hover:bg-gray-50">
          <Link href="/settings/roles-permissions/roles" className="block">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-800">
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-md font-medium text-gray-900">Role Management</h3>
                <p className="mt-1 text-sm text-gray-500">Create, edit, and manage user roles</p>
              </div>
            </div>
          </Link>
        </Card>

        <Card className="p-6 hover:bg-gray-50">
          <Link href="/settings/roles-permissions/permissions" className="block">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-800">
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-md font-medium text-gray-900">Permission Management</h3>
                <p className="mt-1 text-sm text-gray-500">Configure and assign permissions</p>
              </div>
            </div>
          </Link>
        </Card>

        <Card className="p-6 hover:bg-gray-50">
          <Link href="/settings/audit-logs?filter=roles-permissions" className="block">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-800">
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-md font-medium text-gray-900">Access Audit Logs</h3>
                <p className="mt-1 text-sm text-gray-500">Review role and permission changes</p>
              </div>
            </div>
          </Link>
        </Card>
      </div>
    </div>
  );
}