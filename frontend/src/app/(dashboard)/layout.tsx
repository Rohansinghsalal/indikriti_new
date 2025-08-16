'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { useAuthContext } from '@/context/AuthContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, logout } = useAuthContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Get the current page title from the pathname
  const getPageTitle = () => {
    const path = pathname || '';
    const parts = path.split('/').filter(Boolean);
    
    if (parts.length === 0) return 'Dashboard';
    
    // Capitalize the first letter and replace hyphens with spaces
    const title = parts[parts.length - 1]
      .replace(/-/g, ' ')
      .replace(/^\w/, c => c.toUpperCase());
    
    return title;
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent align-[-0.125em]"></div>
          <h2 className="text-lg font-semibold text-gray-700">Loading...</h2>
        </div>
      </div>
    );
  }

  // If not authenticated and not loading, show redirecting message
  if (!isAuthenticated && !isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent align-[-0.125em]"></div>
          <h2 className="text-lg font-semibold text-gray-700">Redirecting to login...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar}
        onLogout={logout}
      />

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top header */}
        <Header toggleSidebar={toggleSidebar} title={getPageTitle()} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>

      {/* Mobile menu backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={toggleMobileMenu}
        ></div>
      )}
    </div>
  );
}