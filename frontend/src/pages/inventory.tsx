import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import InventoryManagement from '@/components/inventory/InventoryManagement';

const InventoryPage: NextPage = () => {
  const { user, isLoading: loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Check if user has permission to access inventory
  const hasInventoryAccess = user && (user.role === 'admin' || user.role === 'manager');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  if (!hasInventoryAccess) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access inventory management.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Inventory Management - Admin Panel</title>
        <meta name="description" content="Manage and monitor your product inventory across all brands" />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <InventoryManagement />
        </div>
      </div>
    </>
  );
};

export default InventoryPage;
