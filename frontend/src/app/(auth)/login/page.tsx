'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthContext } from '@/context/AuthContext';
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuthContext();
  const [formData, setFormData] = useState({
    email: 'superadmin@example.com',
    password: 'admin123',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if user is already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const success = await login(formData.email, formData.password);
      
      if (success) {
        // Redirect handled in the login function
        setSuccess('Login successful! Redirecting...');
      } else {
        setError('Invalid email or password. Please check your credentials and try again.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login. Please try again later.');
      console.error('Login error:', err);
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  // If still checking authentication, show loading
  if (isLoading) {

    return (
      <div className="flex justify-center">
        <div className="mt-8 w-8 h-8 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to access the admin dashboard
          </p>
        </div>
        
        {error && (
          <Alert variant="error">
            {error}
          </Alert>
        )}
        {success && (
          <Alert variant="success">
            {success}
          </Alert>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <Input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                Forgot password?
              </a>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              fullWidth
              isLoading={loading}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </div>
          
          <div className="text-center mt-4">
            <div className="mt-4 text-xs text-gray-500">
              <p>Demo Admin Login:</p>
              <p>Email: admin@example.com / Password: admin123</p>
              <p className="mt-2 font-medium">No actual backend connection - automatic login enabled</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 