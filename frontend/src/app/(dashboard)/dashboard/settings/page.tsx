'use client';

import React, { useState } from 'react';
import { FiSave, FiRefreshCw } from 'react-icons/fi';
import Card from '@/components/ui/Card';

export default function SettingsPage() {
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Multi-Company Admin',
    siteDescription: 'E-commerce administration panel',
    contactEmail: 'admin@example.com',
    supportPhone: '+1 (555) 123-4567',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    timezone: 'UTC-5',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    orderNotifications: true,
    inventoryAlerts: true,
    securityAlerts: true,
    marketingEmails: false,
    systemUpdates: true,
  });

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'light',
    sidebarColor: 'default',
    compactMode: false,
    animationsEnabled: true,
  });

  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setGeneralSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationSettings(prev => ({ ...prev, [name]: checked }));
  };

  const handleAppearanceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setAppearanceSettings(prev => ({ ...prev, [name]: newValue }));
  };

  const handleSaveSettings = () => {
    // In a real app, this would save to API/backend
    alert('Settings saved successfully!');
  };

  const handleResetSettings = () => {
    // Reset to default values
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      // Reset logic would go here
      alert('Settings have been reset to defaults');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <div className="flex space-x-3">
          <button
            onClick={handleResetSettings}
            className="flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <FiRefreshCw className="mr-2 h-4 w-4" />
            Reset to Defaults
          </button>
          <button
            onClick={handleSaveSettings}
            className="flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <FiSave className="mr-2 h-4 w-4" />
            Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* General Settings */}
        <Card title="General Settings">
          <div className="space-y-4">
            <div>
              <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">
                Site Name
              </label>
              <input
                type="text"
                id="siteName"
                name="siteName"
                value={generalSettings.siteName}
                onChange={handleGeneralChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700">
                Site Description
              </label>
              <input
                type="text"
                id="siteDescription"
                name="siteDescription"
                value={generalSettings.siteDescription}
                onChange={handleGeneralChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                Contact Email
              </label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                value={generalSettings.contactEmail}
                onChange={handleGeneralChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="supportPhone" className="block text-sm font-medium text-gray-700">
                Support Phone
              </label>
              <input
                type="text"
                id="supportPhone"
                name="supportPhone"
                value={generalSettings.supportPhone}
                onChange={handleGeneralChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700">
                  Date Format
                </label>
                <select
                  id="dateFormat"
                  name="dateFormat"
                  value={generalSettings.dateFormat}
                  onChange={handleGeneralChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>

              <div>
                <label htmlFor="timeFormat" className="block text-sm font-medium text-gray-700">
                  Time Format
                </label>
                <select
                  id="timeFormat"
                  name="timeFormat"
                  value={generalSettings.timeFormat}
                  onChange={handleGeneralChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="12h">12h (AM/PM)</option>
                  <option value="24h">24h</option>
                </select>
              </div>

              <div>
                <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
                  Timezone
                </label>
                <select
                  id="timezone"
                  name="timezone"
                  value={generalSettings.timezone}
                  onChange={handleGeneralChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="UTC-5">UTC-5</option>
                  <option value="UTC-4">UTC-4</option>
                  <option value="UTC+0">UTC+0</option>
                  <option value="UTC+1">UTC+1</option>
                  <option value="UTC+5:30">UTC+5:30 (IST)</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card title="Notification Settings">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Email Notifications</h3>
                <p className="text-sm text-gray-500">Receive email notifications for important events</p>
              </div>
              <div className="flex h-6 items-center">
                <input
                  id="emailNotifications"
                  name="emailNotifications"
                  type="checkbox"
                  checked={notificationSettings.emailNotifications}
                  onChange={handleNotificationChange}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Order Notifications</h3>
                <p className="text-sm text-gray-500">Get notified when new orders are placed</p>
              </div>
              <div className="flex h-6 items-center">
                <input
                  id="orderNotifications"
                  name="orderNotifications"
                  type="checkbox"
                  checked={notificationSettings.orderNotifications}
                  onChange={handleNotificationChange}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Inventory Alerts</h3>
                <p className="text-sm text-gray-500">Get notified when inventory levels are low</p>
              </div>
              <div className="flex h-6 items-center">
                <input
                  id="inventoryAlerts"
                  name="inventoryAlerts"
                  type="checkbox"
                  checked={notificationSettings.inventoryAlerts}
                  onChange={handleNotificationChange}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Appearance Settings */}
        <Card title="Appearance Settings">
          <div className="space-y-4">
            <div>
              <label htmlFor="theme" className="block text-sm font-medium text-gray-700">
                Theme
              </label>
              <select
                id="theme"
                name="theme"
                value={appearanceSettings.theme}
                onChange={handleAppearanceChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System Default</option>
              </select>
            </div>

            <div>
              <label htmlFor="sidebarColor" className="block text-sm font-medium text-gray-700">
                Sidebar Color
              </label>
              <select
                id="sidebarColor"
                name="sidebarColor"
                value={appearanceSettings.sidebarColor}
                onChange={handleAppearanceChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              >
                <option value="default">Default (White)</option>
                <option value="dark">Dark</option>
                <option value="indigo">Indigo</option>
                <option value="green">Green</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Security Settings */}
        <Card title="Security Settings">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Change Password</h3>
              <div className="mt-2 space-y-3">
                <input
                  type="password"
                  placeholder="Current Password"
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
                <button className="mt-2 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
