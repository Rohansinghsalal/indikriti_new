import React, { useState } from 'react';
import Link from 'next/link';
import { FiBell, FiSearch, FiMenu, FiUser, FiSettings, FiLogOut, FiHelpCircle } from 'react-icons/fi';
import { useAuthContext } from '@/context/AuthContext';

interface HeaderProps {
  toggleSidebar: () => void;
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar, title = 'Dashboard' }) => {
  const { logout } = useAuthContext();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    if (isNotificationsOpen) setIsNotificationsOpen(false);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (isProfileOpen) setIsProfileOpen(false);
  };

  // Mock notifications
  const notifications = [
    { id: 1, message: 'New order received', time: '5 min ago', read: false },
    { id: 2, message: 'Server limit reached', time: '1 hour ago', read: false },
    { id: 3, message: 'New user registered', time: '2 hours ago', read: true },
    { id: 4, message: 'System update completed', time: 'Yesterday', read: true },
  ];

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-4 md:px-6">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-600 focus:outline-none"
        >
          <FiMenu className="h-6 w-6" />
        </button>
        <div className="ml-4 text-lg font-semibold text-gray-800">
          {title}
        </div>
      </div>

      <div className="hidden flex-1 px-8 md:block">
        <div className="relative max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-md border border-gray-300 bg-gray-50 py-2 pl-10 pr-3 text-sm placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="Search..."
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={toggleNotifications}
            className="relative rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-600 focus:outline-none"
          >
            <FiBell className="h-6 w-6" />
            {notifications.some(n => !n.read) && (
              <span className="absolute right-0 top-0 flex h-2 w-2 rounded-full bg-red-500"></span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="border-b px-4 py-2">
                <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                      >
                        <div className="flex items-start">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                            <p className="text-xs text-gray-500">{notification.time}</p>
                          </div>
                          {!notification.read && (
                            <div className="ml-2 flex-shrink-0">
                              <span className="inline-block h-2 w-2 rounded-full bg-blue-500"></span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-6 text-center text-sm text-gray-500">
                    No notifications
                  </div>
                )}
              </div>
              {notifications.length > 0 && (
                <div className="border-t px-4 py-2 text-center">
                  <button className="text-xs font-medium text-indigo-600 hover:text-indigo-500">
                    Mark all as read
                  </button>
                  <span className="mx-2 text-gray-300">|</span>
                  <button className="text-xs font-medium text-indigo-600 hover:text-indigo-500">
                    View all
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User profile */}
        <div className="relative">
          <button
            onClick={toggleProfile}
            className="flex items-center space-x-2 rounded-full focus:outline-none"
          >
            <div className="h-8 w-8 rounded-full bg-indigo-500 text-center text-white">
              <span className="leading-8">A</span>
            </div>
            <span className="hidden text-sm font-medium text-gray-700 md:block">Admin User</span>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                <Link 
                  href="/dashboard/profile" 
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FiUser className="mr-3 h-4 w-4 text-gray-500" />
                  Profile
                </Link>
                <Link 
                  href="/dashboard/settings" 
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FiSettings className="mr-3 h-4 w-4 text-gray-500" />
                  Settings
                </Link>
                <Link 
                  href="/dashboard/support" 
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FiHelpCircle className="mr-3 h-4 w-4 text-gray-500" />
                  Support
                </Link>
                <div className="border-t border-gray-100"></div>
                <button 
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={logout}
                >
                  <FiLogOut className="mr-3 h-4 w-4 text-gray-500" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 