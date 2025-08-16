import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { Button, Input, Card } from '../components/ui';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const { login, isAuthenticated, isLoading } = useAuthContext();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        toast.success('Login successful!');
      } else {
        toast.error(result.error || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
          <h2 className="text-lg font-semibold text-gray-700">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Admin Dashboard - Indikriti
          </p>
        </div>
        
        <Card className="mt-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              label="Email address"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />

            <Input
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />

            <Button
              type="submit"
              fullWidth
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </Card>

        {/* Database Credentials */}
        <Card className="mt-4 bg-green-50 border-green-200">
          <div className="p-4">
            <h3 className="text-sm font-medium text-green-900 mb-2">Default Admin Credentials</h3>
            <div className="space-y-2 text-sm text-green-800">
              <div className="flex justify-between">
                <span>Email:</span>
                <span className="font-mono">superadmin@example.com</span>
              </div>
              <div className="flex justify-between">
                <span>Password:</span>
                <span className="font-mono">admin123</span>
              </div>
              <div className="mt-2 pt-2 border-t border-green-200">
                <p className="text-xs text-green-600">
                  🔒 This is the default super admin account created automatically when the server starts.
                  Please change the password after first login for security.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
