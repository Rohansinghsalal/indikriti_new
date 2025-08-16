import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiHome, FiUsers, FiShoppingBag, FiSettings,
  FiShoppingCart, FiDollarSign, FiHeadphones,
  FiFileText, FiDatabase, FiBarChart2, FiMonitor,
  FiHelpCircle, FiX, FiLogOut, FiLayers, FiCreditCard,
  FiPackage
} from 'react-icons/fi';

export const Sidebar = ({ 
  isOpen, 
  toggleSidebar,
  onLogout
}) => {
  const location = useLocation();
  // Track active submenu sections
  const [openSubmenus, setOpenSubmenus] = useState({});

  const toggleSubmenu = (name) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  // Check if a menu item is active
  const isActive = (href) => {
    return location.pathname?.startsWith(href);
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: FiHome },
    { 
      name: 'User Management', 
      href: '/users', 
      icon: FiUsers,
      submenu: [
        { name: 'Customers', href: '/users/customers' },
        { name: 'Referrals', href: '/users/referrals' },
        { name: 'Staff', href: '/users/staff' }
      ]
    },
    {
      name: 'Products',
      href: '/products',
      icon: FiShoppingBag,
      submenu: [
        { name: 'All Products', href: '/products' },
        { name: 'Categories', href: '/categories' },
        { name: 'Add Product', href: '/products/create' }
      ]
    },
    {
      name: 'Inventory',
      href: '/inventory',
      icon: FiPackage,
      submenu: [
        { name: 'All Inventory', href: '/inventory' },
        { name: 'Low Stock', href: '/inventory?lowStock=true' },
        { name: 'Out of Stock', href: '/inventory?outOfStock=true' }
      ]
    },
    {
      name: 'Orders',
      href: '/orders',
      icon: FiShoppingCart,
      submenu: [
        { name: 'All Orders', href: '/orders' },
        { name: 'Processing', href: '/orders/processing' },
        { name: 'Fulfilled', href: '/orders/fulfilled' }
      ]
    },
    {
      name: 'Point of Sale',
      href: '/pos',
      icon: FiCreditCard,
      submenu: [
        { name: 'POS Terminal', href: '/pos' },
        { name: 'Transactions', href: '/pos/transactions' },
        { name: 'Reports', href: '/pos/reports' }
      ]
    },
    {
      name: 'Invoices',
      href: '/invoices',
      icon: FiFileText,
      submenu: [
        { name: 'All Invoices', href: '/invoices' },
        { name: 'Pending', href: '/invoices?status=sent' },
        { name: 'Paid', href: '/invoices?status=paid' },
        { name: 'Overdue', href: '/invoices?status=overdue' }
      ]
    },
    { 
      name: 'Finances', 
      href: '/finances', 
      icon: FiDollarSign,
      submenu: [
        { name: 'Overview', href: '/finances' },
        { name: 'Transactions', href: '/finances/transactions' },
        { name: 'Refunds', href: '/finances/refunds' },
        { name: 'Discounts', href: '/finances/discounts' }
      ]
    },
    { name: 'Analytics', href: '/analytics', icon: FiBarChart2 },
    { 
      name: 'Content', 
      href: '/content', 
      icon: FiFileText,
      submenu: [
        { name: 'Pages', href: '/content/pages' },
        { name: 'Media', href: '/content/media' },
        { name: 'SEO', href: '/content/seo' }
      ]
    },
    { name: 'Settings', href: '/settings', icon: FiSettings },
    { name: 'Support', href: '/support', icon: FiHelpCircle },
  ];

  return (
    <div
      className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex h-full flex-col">
        {/* Sidebar header */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          <div className="flex items-center">
            <span className="text-xl font-semibold text-gray-800">Admin Panel</span>
          </div>
          <button
            onClick={toggleSidebar}
            className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-600 md:hidden"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navigation.map((item) => (
              <li key={item.name} className="mb-1">
                {item.submenu ? (
                  <div className="mb-1">
                    <button
                      onClick={() => toggleSubmenu(item.name)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-lg transition-colors duration-200 ${isActive(item.href) ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      <span className="flex items-center">
                        <item.icon className="h-5 w-5 mr-3" />
                        <span className="font-medium">{item.name}</span>
                      </span>
                      <svg
                        className={`w-5 h-5 transition-transform duration-200 ${openSubmenus[item.name] ? 'transform rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openSubmenus[item.name] && (
                      <ul className="mt-1 ml-4 space-y-1 border-l-2 border-gray-200 pl-3">
                        {item.submenu.map((subItem) => (
                          <li key={subItem.name}>
                            <Link
                              to={subItem.href}
                              className={`block py-2 px-3 rounded-md text-sm transition-colors duration-200 ${isActive(subItem.href) ? 'text-indigo-600 bg-indigo-50 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                              {subItem.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    className={`flex items-center p-2.5 rounded-lg transition-colors duration-200 ${isActive(item.href) ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <span>{item.name}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar footer */}
        <div className="border-t p-4">
          <button
            onClick={onLogout}
            className="flex w-full items-center rounded-md px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          >
            <FiLogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
