'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function SystemSettingsPage() {
  // State for active tab
  const [activeTab, setActiveTab] = useState('general');
  
  // State for form data
  const [formData, setFormData] = useState({
    // General Settings
    siteName: 'Admin Dashboard',
    siteDescription: 'Comprehensive admin dashboard for business management',
    adminEmail: 'admin@example.com',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    
    // Security Settings
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      expiryDays: 90
    },
    twoFactorAuth: {
      enabled: true,
      requiredForAdmins: true,
      requiredForAllUsers: false
    },
    sessionTimeout: 30, // minutes
    maxLoginAttempts: 5,
    lockoutDuration: 15, // minutes
    
    // Notification Settings
    emailNotifications: {
      newOrders: true,
      lowStock: true,
      customerSupport: true,
      systemAlerts: true
    },
    pushNotifications: {
      newOrders: false,
      lowStock: false,
      customerSupport: true,
      systemAlerts: true
    },
    
    // API Settings
    apiEnabled: true,
    apiRateLimit: 100, // requests per minute
    webhookUrl: 'https://example.com/webhook',
    
    // Maintenance Settings
    maintenanceMode: false,
    maintenanceMessage: 'The system is currently undergoing scheduled maintenance. Please check back later.',
    allowAdminAccess: true,
    scheduledMaintenance: {
      enabled: false,
      startDate: '',
      endDate: ''
    }
  });
  
  // Mock data for system status
  const systemStatus = {
    serverStatus: 'Operational',
    databaseStatus: 'Operational',
    cacheStatus: 'Operational',
    queueStatus: 'Operational',
    lastChecked: '2023-06-15 10:30:45',
    uptime: '99.98%',
    serverLoad: '23%',
    memoryUsage: '45%',
    diskUsage: '62%'
  };
  
  // Mock data for recent system events
  const recentEvents = [
    {
      id: 1,
      type: 'info',
      message: 'System backup completed successfully',
      timestamp: '2023-06-15 03:00:00',
      details: 'Backup size: 2.3GB'
    },
    {
      id: 2,
      type: 'warning',
      message: 'High server load detected',
      timestamp: '2023-06-14 15:45:22',
      details: 'Server load reached 85% for 5 minutes'
    },
    {
      id: 3,
      type: 'error',
      message: 'Failed login attempts exceeded threshold',
      timestamp: '2023-06-14 10:12:18',
      details: '10 failed attempts from IP 192.168.1.105'
    },
    {
      id: 4,
      type: 'info',
      message: 'System updates installed',
      timestamp: '2023-06-13 22:30:00',
      details: '3 security patches applied'
    },
    {
      id: 5,
      type: 'success',
      message: 'Database optimization completed',
      timestamp: '2023-06-12 04:15:00',
      details: 'Performance improved by 15%'
    }
  ];
  
  // Handle form input changes
  const handleInputChange = (section, field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: value
      }
    }));
  };
  
  // Handle simple input changes
  const handleSimpleInputChange = (field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, this would make an API call to save the settings
    console.log('Settings data:', formData);
    alert('Settings saved successfully!');
  };
  
  // Handle maintenance mode toggle
  const handleMaintenanceToggle = () => {
    setFormData(prevData => ({
      ...prevData,
      maintenanceMode: !prevData.maintenanceMode
    }));
  };
  
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold">System Settings</h1>
          <p className="text-gray-500 mt-1">Configure and manage system-wide settings</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button onClick={handleSubmit}>
            Save Changes
          </Button>
        </div>
      </div>
      
      {/* Settings Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'general' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setActiveTab('general')}
          >
            General
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'security' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setActiveTab('security')}
          >
            Security
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'notifications' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setActiveTab('notifications')}
          >
            Notifications
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'api' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setActiveTab('api')}
          >
            API
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'maintenance' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setActiveTab('maintenance')}
          >
            Maintenance
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'status' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setActiveTab('status')}
          >
            System Status
          </button>
        </nav>
      </div>
      
      {/* Settings Content */}
      <div className="space-y-6">
        {/* General Settings */}
        {activeTab === 'general' && (
          <Card className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">General Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-1">
                  Site Name
                </label>
                <input
                  type="text"
                  id="siteName"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={formData.siteName}
                  onChange={(e) => handleSimpleInputChange('siteName', e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Site Description
                </label>
                <input
                  type="text"
                  id="siteDescription"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={formData.siteDescription}
                  onChange={(e) => handleSimpleInputChange('siteDescription', e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Email
                </label>
                <input
                  type="email"
                  id="adminEmail"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={formData.adminEmail}
                  onChange={(e) => handleSimpleInputChange('adminEmail', e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">
                  Timezone
                </label>
                <select
                  id="timezone"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={formData.timezone}
                  onChange={(e) => handleSimpleInputChange('timezone', e.target.value)}
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="Europe/London">Greenwich Mean Time (GMT)</option>
                  <option value="Europe/Paris">Central European Time (CET)</option>
                  <option value="Asia/Tokyo">Japan Standard Time (JST)</option>
                  <option value="Australia/Sydney">Australian Eastern Time (AET)</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700 mb-1">
                  Date Format
                </label>
                <select
                  id="dateFormat"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={formData.dateFormat}
                  onChange={(e) => handleSimpleInputChange('dateFormat', e.target.value)}
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  <option value="YYYY/MM/DD">YYYY/MM/DD</option>
                  <option value="DD-MMM-YYYY">DD-MMM-YYYY</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="timeFormat" className="block text-sm font-medium text-gray-700 mb-1">
                  Time Format
                </label>
                <select
                  id="timeFormat"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={formData.timeFormat}
                  onChange={(e) => handleSimpleInputChange('timeFormat', e.target.value)}
                >
                  <option value="12h">12-hour (AM/PM)</option>
                  <option value="24h">24-hour</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button onClick={handleSubmit}>
                Save General Settings
              </Button>
            </div>
          </Card>
        )}
        
        {/* Security Settings */}
        {activeTab === 'security' && (
          <Card className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h2>
            
            <div className="space-y-6">
              {/* Password Policy */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-3">Password Policy</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="minLength" className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Password Length
                    </label>
                    <input
                      type="number"
                      id="minLength"
                      min="6"
                      max="32"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={formData.passwordPolicy.minLength}
                      onChange={(e) => handleInputChange('passwordPolicy', 'minLength', parseInt(e.target.value))}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="expiryDays" className="block text-sm font-medium text-gray-700 mb-1">
                      Password Expiry (Days)
                    </label>
                    <input
                      type="number"
                      id="expiryDays"
                      min="0"
                      max="365"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={formData.passwordPolicy.expiryDays}
                      onChange={(e) => handleInputChange('passwordPolicy', 'expiryDays', parseInt(e.target.value))}
                    />
                    <p className="mt-1 text-xs text-gray-500">Set to 0 for no expiry</p>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="requireUppercase"
                      className="h-4 w-4 text-blue-600 rounded"
                      checked={formData.passwordPolicy.requireUppercase}
                      onChange={(e) => handleInputChange('passwordPolicy', 'requireUppercase', e.target.checked)}
                    />
                    <label htmlFor="requireUppercase" className="ml-2 block text-sm text-gray-700">
                      Require uppercase letters
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="requireLowercase"
                      className="h-4 w-4 text-blue-600 rounded"
                      checked={formData.passwordPolicy.requireLowercase}
                      onChange={(e) => handleInputChange('passwordPolicy', 'requireLowercase', e.target.checked)}
                    />
                    <label htmlFor="requireLowercase" className="ml-2 block text-sm text-gray-700">
                      Require lowercase letters
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="requireNumbers"
                      className="h-4 w-4 text-blue-600 rounded"
                      checked={formData.passwordPolicy.requireNumbers}
                      onChange={(e) => handleInputChange('passwordPolicy', 'requireNumbers', e.target.checked)}
                    />
                    <label htmlFor="requireNumbers" className="ml-2 block text-sm text-gray-700">
                      Require numbers
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="requireSpecialChars"
                      className="h-4 w-4 text-blue-600 rounded"
                      checked={formData.passwordPolicy.requireSpecialChars}
                      onChange={(e) => handleInputChange('passwordPolicy', 'requireSpecialChars', e.target.checked)}
                    />
                    <label htmlFor="requireSpecialChars" className="ml-2 block text-sm text-gray-700">
                      Require special characters
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Two-Factor Authentication */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-3">Two-Factor Authentication</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="twoFactorEnabled"
                      className="h-4 w-4 text-blue-600 rounded"
                      checked={formData.twoFactorAuth.enabled}
                      onChange={(e) => handleInputChange('twoFactorAuth', 'enabled', e.target.checked)}
                    />
                    <label htmlFor="twoFactorEnabled" className="ml-2 block text-sm text-gray-700">
                      Enable two-factor authentication
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="requiredForAdmins"
                      className="h-4 w-4 text-blue-600 rounded"
                      checked={formData.twoFactorAuth.requiredForAdmins}
                      onChange={(e) => handleInputChange('twoFactorAuth', 'requiredForAdmins', e.target.checked)}
                      disabled={!formData.twoFactorAuth.enabled}
                    />
                    <label htmlFor="requiredForAdmins" className={`ml-2 block text-sm ${!formData.twoFactorAuth.enabled ? 'text-gray-400' : 'text-gray-700'}`}>
                      Required for administrators
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="requiredForAllUsers"
                      className="h-4 w-4 text-blue-600 rounded"
                      checked={formData.twoFactorAuth.requiredForAllUsers}
                      onChange={(e) => handleInputChange('twoFactorAuth', 'requiredForAllUsers', e.target.checked)}
                      disabled={!formData.twoFactorAuth.enabled}
                    />
                    <label htmlFor="requiredForAllUsers" className={`ml-2 block text-sm ${!formData.twoFactorAuth.enabled ? 'text-gray-400' : 'text-gray-700'}`}>
                      Required for all users
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Session & Login Settings */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-3">Session & Login Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="sessionTimeout" className="block text-sm font-medium text-gray-700 mb-1">
                      Session Timeout (Minutes)
                    </label>
                    <input
                      type="number"
                      id="sessionTimeout"
                      min="5"
                      max="1440"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={formData.sessionTimeout}
                      onChange={(e) => handleSimpleInputChange('sessionTimeout', parseInt(e.target.value))}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="maxLoginAttempts" className="block text-sm font-medium text-gray-700 mb-1">
                      Max Login Attempts
                    </label>
                    <input
                      type="number"
                      id="maxLoginAttempts"
                      min="1"
                      max="10"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={formData.maxLoginAttempts}
                      onChange={(e) => handleSimpleInputChange('maxLoginAttempts', parseInt(e.target.value))}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="lockoutDuration" className="block text-sm font-medium text-gray-700 mb-1">
                      Account Lockout Duration (Minutes)
                    </label>
                    <input
                      type="number"
                      id="lockoutDuration"
                      min="5"
                      max="1440"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={formData.lockoutDuration}
                      onChange={(e) => handleSimpleInputChange('lockoutDuration', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button onClick={handleSubmit}>
                Save Security Settings
              </Button>
            </div>
          </Card>
        )}
        
        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <Card className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Notification Settings</h2>
            
            <div className="space-y-6">
              {/* Email Notifications */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-3">Email Notifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="emailNewOrders"
                      className="h-4 w-4 text-blue-600 rounded"
                      checked={formData.emailNotifications.newOrders}
                      onChange={(e) => handleInputChange('emailNotifications', 'newOrders', e.target.checked)}
                    />
                    <label htmlFor="emailNewOrders" className="ml-2 block text-sm text-gray-700">
                      New orders
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="emailLowStock"
                      className="h-4 w-4 text-blue-600 rounded"
                      checked={formData.emailNotifications.lowStock}
                      onChange={(e) => handleInputChange('emailNotifications', 'lowStock', e.target.checked)}
                    />
                    <label htmlFor="emailLowStock" className="ml-2 block text-sm text-gray-700">
                      Low stock alerts
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="emailCustomerSupport"
                      className="h-4 w-4 text-blue-600 rounded"
                      checked={formData.emailNotifications.customerSupport}
                      onChange={(e) => handleInputChange('emailNotifications', 'customerSupport', e.target.checked)}
                    />
                    <label htmlFor="emailCustomerSupport" className="ml-2 block text-sm text-gray-700">
                      Customer support tickets
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="emailSystemAlerts"
                      className="h-4 w-4 text-blue-600 rounded"
                      checked={formData.emailNotifications.systemAlerts}
                      onChange={(e) => handleInputChange('emailNotifications', 'systemAlerts', e.target.checked)}
                    />
                    <label htmlFor="emailSystemAlerts" className="ml-2 block text-sm text-gray-700">
                      System alerts
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Push Notifications */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-3">Push Notifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="pushNewOrders"
                      className="h-4 w-4 text-blue-600 rounded"
                      checked={formData.pushNotifications.newOrders}
                      onChange={(e) => handleInputChange('pushNotifications', 'newOrders', e.target.checked)}
                    />
                    <label htmlFor="pushNewOrders" className="ml-2 block text-sm text-gray-700">
                      New orders
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="pushLowStock"
                      className="h-4 w-4 text-blue-600 rounded"
                      checked={formData.pushNotifications.lowStock}
                      onChange={(e) => handleInputChange('pushNotifications', 'lowStock', e.target.checked)}
                    />
                    <label htmlFor="pushLowStock" className="ml-2 block text-sm text-gray-700">
                      Low stock alerts
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="pushCustomerSupport"
                      className="h-4 w-4 text-blue-600 rounded"
                      checked={formData.pushNotifications.customerSupport}
                      onChange={(e) => handleInputChange('pushNotifications', 'customerSupport', e.target.checked)}
                    />
                    <label htmlFor="pushCustomerSupport" className="ml-2 block text-sm text-gray-700">
                      Customer support tickets
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="pushSystemAlerts"
                      className="h-4 w-4 text-blue-600 rounded"
                      checked={formData.pushNotifications.systemAlerts}
                      onChange={(e) => handleInputChange('pushNotifications', 'systemAlerts', e.target.checked)}
                    />
                    <label htmlFor="pushSystemAlerts" className="ml-2 block text-sm text-gray-700">
                      System alerts
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button onClick={handleSubmit}>
                Save Notification Settings
              </Button>
            </div>
          </Card>
        )}
        
        {/* API Settings */}
        {activeTab === 'api' && (
          <Card className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">API Settings</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="apiEnabled"
                    className="h-4 w-4 text-blue-600 rounded"
                    checked={formData.apiEnabled}
                    onChange={(e) => handleSimpleInputChange('apiEnabled', e.target.checked)}
                  />
                  <label htmlFor="apiEnabled" className="ml-2 block text-sm font-medium text-gray-700">
                    Enable API Access
                  </label>
                </div>
                
                <Link href="/dashboard/settings/api-keys" passHref>
                  <Button variant="outline" size="sm">
                    Manage API Keys
                  </Button>
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="apiRateLimit" className="block text-sm font-medium text-gray-700 mb-1">
                    API Rate Limit (Requests per Minute)
                  </label>
                  <input
                    type="number"
                    id="apiRateLimit"
                    min="10"
                    max="1000"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    value={formData.apiRateLimit}
                    onChange={(e) => handleSimpleInputChange('apiRateLimit', parseInt(e.target.value))}
                    disabled={!formData.apiEnabled}
                  />
                </div>
                
                <div>
                  <label htmlFor="webhookUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    Webhook URL
                  </label>
                  <input
                    type="url"
                    id="webhookUrl"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    value={formData.webhookUrl}
                    onChange={(e) => handleSimpleInputChange('webhookUrl', e.target.value)}
                    disabled={!formData.apiEnabled}
                  />
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-md font-medium text-gray-900 mb-2">API Documentation</h3>
                <p className="text-sm text-gray-500 mb-3">
                  Access our API documentation to learn how to integrate with our system.
                </p>
                <div className="flex space-x-3">
                  <Button variant="outline" size="sm">
                    View Documentation
                  </Button>
                  <Button variant="outline" size="sm">
                    Download Swagger JSON
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button onClick={handleSubmit}>
                Save API Settings
              </Button>
            </div>
          </Card>
        )}
        
        {/* Maintenance Settings */}
        {activeTab === 'maintenance' && (
          <Card className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Maintenance Settings</h2>
            
            <div className="space-y-6">
              {/* Maintenance Mode */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Maintenance Mode</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        When enabled, the site will be inaccessible to regular users. Only administrators will be able to access the site if "Allow Admin Access" is enabled.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <button
                      type="button"
                      className={`${formData.maintenanceMode ? 'bg-yellow-600' : 'bg-gray-200'} relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500`}
                      role="switch"
                      aria-checked={formData.maintenanceMode}
                      onClick={handleMaintenanceToggle}
                    >
                      <span className="sr-only">Enable maintenance mode</span>
                      <span
                        aria-hidden="true"
                        className={`${formData.maintenanceMode ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                      />
                    </button>
                    <span className="ml-3 text-sm font-medium text-gray-900">
                      {formData.maintenanceMode ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  
                  {formData.maintenanceMode && (
                    <Button variant="outline" size="sm" className="text-yellow-700 border-yellow-300 hover:bg-yellow-50">
                      Preview Maintenance Page
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Maintenance Settings */}
              <div className={`space-y-4 ${!formData.maintenanceMode && 'opacity-50'}`}>
                <div>
                  <label htmlFor="maintenanceMessage" className="block text-sm font-medium text-gray-700 mb-1">
                    Maintenance Message
                  </label>
                  <textarea
                    id="maintenanceMessage"
                    rows="3"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    value={formData.maintenanceMessage}
                    onChange={(e) => handleSimpleInputChange('maintenanceMessage', e.target.value)}
                    disabled={!formData.maintenanceMode}
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="allowAdminAccess"
                    className="h-4 w-4 text-blue-600 rounded"
                    checked={formData.allowAdminAccess}
                    onChange={(e) => handleSimpleInputChange('allowAdminAccess', e.target.checked)}
                    disabled={!formData.maintenanceMode}
                  />
                  <label htmlFor="allowAdminAccess" className="ml-2 block text-sm text-gray-700">
                    Allow administrator access during maintenance
                  </label>
                </div>
                
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-3">Schedule Maintenance</h3>
                  <div className="flex items-center mb-3">
                    <input
                      type="checkbox"
                      id="scheduledMaintenanceEnabled"
                      className="h-4 w-4 text-blue-600 rounded"
                      checked={formData.scheduledMaintenance.enabled}
                      onChange={(e) => handleInputChange('scheduledMaintenance', 'enabled', e.target.checked)}
                      disabled={!formData.maintenanceMode}
                    />
                    <label htmlFor="scheduledMaintenanceEnabled" className="ml-2 block text-sm text-gray-700">
                      Schedule maintenance window
                    </label>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        id="startDate"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={formData.scheduledMaintenance.startDate}
                        onChange={(e) => handleInputChange('scheduledMaintenance', 'startDate', e.target.value)}
                        disabled={!formData.maintenanceMode || !formData.scheduledMaintenance.enabled}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                        End Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        id="endDate"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={formData.scheduledMaintenance.endDate}
                        onChange={(e) => handleInputChange('scheduledMaintenance', 'endDate', e.target.value)}
                        disabled={!formData.maintenanceMode || !formData.scheduledMaintenance.enabled}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button onClick={handleSubmit}>
                Save Maintenance Settings
              </Button>
            </div>
          </Card>
        )}
        
        {/* System Status */}
        {activeTab === 'status' && (
          <div className="space-y-6">
            {/* System Status Overview */}
            <Card className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">System Status</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-100 rounded-md p-2">
                      <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">Server Status</h3>
                      <p className="text-sm text-green-700 mt-1">{systemStatus.serverStatus}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-100 rounded-md p-2">
                      <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">Database Status</h3>
                      <p className="text-sm text-green-700 mt-1">{systemStatus.databaseStatus}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-100 rounded-md p-2">
                      <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">Cache Status</h3>
                      <p className="text-sm text-green-700 mt-1">{systemStatus.cacheStatus}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-100 rounded-md p-2">
                      <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">Queue Status</h3>
                      <p className="text-sm text-green-700 mt-1">{systemStatus.queueStatus}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="border rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Uptime</h3>
                  <p className="text-2xl font-semibold text-gray-900">{systemStatus.uptime}</p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Server Load</h3>
                  <p className="text-2xl font-semibold text-gray-900">{systemStatus.serverLoad}</p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Memory Usage</h3>
                  <p className="text-2xl font-semibold text-gray-900">{systemStatus.memoryUsage}</p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Disk Usage</h3>
                  <p className="text-2xl font-semibold text-gray-900">{systemStatus.diskUsage}</p>
                </div>
              </div>
              
              <div className="mt-6 text-sm text-gray-500 flex justify-between items-center">
                <p>Last checked: {systemStatus.lastChecked}</p>
                <Button variant="outline" size="sm">
                  Refresh Status
                </Button>
              </div>
            </Card>
            
            {/* Recent System Events */}
            <Card className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Recent System Events</h2>
              
              <div className="overflow-hidden">
                <ul className="divide-y divide-gray-200">
                  {recentEvents.map((event) => (
                    <li key={event.id} className="py-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          {event.type === 'info' && (
                            <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-100">
                              <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                              </svg>
                            </span>
                          )}
                          {event.type === 'warning' && (
                            <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-yellow-100">
                              <svg className="h-5 w-5 text-yellow-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </span>
                          )}
                          {event.type === 'error' && (
                            <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-red-100">
                              <svg className="h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                            </span>
                          )}
                          {event.type === 'success' && (
                            <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-green-100">
                              <svg className="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </span>
                          )}
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-900">{event.message}</h3>
                            <p className="text-sm text-gray-500">{event.timestamp}</p>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{event.details}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-6 flex justify-between items-center">
                <Link href="/dashboard/settings/system-logs" passHref>
                  <Button variant="outline" size="sm">
                    View All System Logs
                  </Button>
                </Link>
                
                <Link href="/dashboard/settings/audit-logs" passHref>
                  <Button variant="outline" size="sm">
                    View Audit Logs
                  </Button>
                </Link>
              </div>
            </Card>
            
            {/* System Tools */}
            <Card className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">System Tools</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="text-md font-medium text-gray-900 mb-2">Cache Management</h3>
                  <p className="text-sm text-gray-500 mb-4">Clear system cache to refresh data and fix potential issues.</p>
                  <Button variant="outline" size="sm">
                    Clear Cache
                  </Button>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="text-md font-medium text-gray-900 mb-2">Database Tools</h3>
                  <p className="text-sm text-gray-500 mb-4">Optimize database performance and run maintenance tasks.</p>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Optimize
                    </Button>
                    <Button variant="outline" size="sm">
                      Backup
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="text-md font-medium text-gray-900 mb-2">System Updates</h3>
                  <p className="text-sm text-gray-500 mb-4">Check for and install system updates and security patches.</p>
                  <Button variant="outline" size="sm">
                    Check for Updates
                  </Button>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <Link href="/dashboard/settings/backups" passHref>
                  <Button variant="outline">
                    Manage Backups
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        )}
      </div>
      
      {/* Quick Links */}
      <Card className="p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Settings Links</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link href="/dashboard/settings/audit-logs" passHref>
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <h3 className="text-md font-medium text-gray-900 mb-1">Audit Logs</h3>
              <p className="text-sm text-gray-500">View system audit logs and user activity</p>
            </div>
          </Link>
          
          <Link href="/dashboard/settings/backups" passHref>
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <h3 className="text-md font-medium text-gray-900 mb-1">Backup Management</h3>
              <p className="text-sm text-gray-500">Manage system backups and restoration</p>
            </div>
          </Link>
          
          <Link href="/dashboard/settings/user-activity" passHref>
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <h3 className="text-md font-medium text-gray-900 mb-1">User Activity</h3>
              <p className="text-sm text-gray-500">Monitor user activity and sessions</p>
            </div>
          </Link>
          
          <Link href="/dashboard/settings/roles-permissions" passHref>
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <h3 className="text-md font-medium text-gray-900 mb-1">Roles & Permissions</h3>
              <p className="text-sm text-gray-500">Manage user roles and permissions</p>
            </div>
          </Link>
        </div>
      </Card>
    </div>
  );
}