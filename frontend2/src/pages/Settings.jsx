import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  FiUsers,
  FiSettings,
  FiShield,
  FiDatabase,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiSave,
  FiRefreshCw
} from 'react-icons/fi';
import { Button, Card, Input, Select, Modal } from '../components/ui';
import api from '../utils/api';
import { useAuth } from '../hooks/useAuth';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(false);

  // Check if user has admin access
  const isAdmin = user?.isSuperAdmin || user?.accessLevel === 'super' || user?.accessLevel === 'full' || user?.role === 'admin';
  const isSuperAdmin = user?.isSuperAdmin || user?.accessLevel === 'super';

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <FiShield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You need administrator privileges to access this page.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <FiShield className="w-4 h-4" />
          <span>{user?.accessLevel === 'super' ? 'Super Admin' : 'Admin'} Access</span>
        </div>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Admin Settings</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-4 border-l-4 border-blue-500">
              <div className="flex items-center">
                <FiUsers className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <h4 className="font-medium text-gray-900">User Management</h4>
                  <p className="text-sm text-gray-600">Manage users and permissions</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 border-l-4 border-purple-500">
              <div className="flex items-center">
                <FiShield className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <h4 className="font-medium text-gray-900">Security</h4>
                  <p className="text-sm text-gray-600">Configure security settings</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 border-l-4 border-green-500">
              <div className="flex items-center">
                <FiDatabase className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <h4 className="font-medium text-gray-900">Database</h4>
                  <p className="text-sm text-gray-600">Database management tools</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Coming Soon</h4>
            <p className="text-blue-700">
              Full user management interface with role-based access control,
              user creation, editing, and permission management will be available soon.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <FiShield className="w-4 h-4" />
          <span>{user?.accessLevel === 'super' ? 'Super Admin' : 'Admin'} Access</span>
        </div>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Admin Settings</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-4 border-l-4 border-blue-500">
              <div className="flex items-center">
                <FiUsers className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <h4 className="font-medium text-gray-900">User Management</h4>
                  <p className="text-sm text-gray-600">Manage users and permissions</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 border-l-4 border-purple-500">
              <div className="flex items-center">
                <FiShield className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <h4 className="font-medium text-gray-900">Security</h4>
                  <p className="text-sm text-gray-600">Configure security settings</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 border-l-4 border-green-500">
              <div className="flex items-center">
                <FiDatabase className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <h4 className="font-medium text-gray-900">Database</h4>
                  <p className="text-sm text-gray-600">Database management tools</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Coming Soon</h4>
            <p className="text-blue-700">
              Full user management interface with role-based access control,
              user creation, editing, and permission management will be available soon.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
