import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <p className="mt-2 text-sm text-gray-600">
            Multi-company management system
          </p>
        </div>
        {children}
      </div>
    </div>
  );
} 