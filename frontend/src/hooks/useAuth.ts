'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/context/AuthContext';
import api from '@/utils/api';
import tokenManager from '@/utils/tokenManager';

// Mock user for development without backend
const MOCK_USER: User = {
  id: 'mock-user-1',
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@example.com',
  role: 'admin',
  permissions: ['all'],
  userType: 'admin',
  accessLevel: 'super-admin',
  isSuperAdmin: true
};

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  token: string | null;
  userType: 'admin' | null;
}

export const useAuth = () => {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
    token: null,
    userType: null
  });

  useEffect(() => {
    // Initialize token manager
    tokenManager.init();

    // Check for existing token and validate it with backend
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const userType = localStorage.getItem('userType') as 'admin' | null;

      if (!token || !userType) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        const me = await api.auth.getMe();
        console.log('Auth check response:', me); // Debug log
        setAuthState({
          isAuthenticated: true,
          user: me?.data?.data?.user || me?.data?.user || MOCK_USER,
          isLoading: false,
          token,
          userType: me?.data?.data?.userType || me?.data?.userType || userType
        });
      } catch (error) {
        // Token invalid/expired
        console.error('Auth check failed:', error);
        tokenManager.clearTokens();
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await api.auth.login(email, password, 'admin');
      const token = res?.token;
      const refreshToken = res?.refreshToken;
      const user = res?.user || null;

      if (!token) {
        throw new Error('Login failed: missing token');
      }

      // Persist tokens and initialize token manager
      tokenManager.setTokens(token, refreshToken || '');
      localStorage.setItem('userType', 'admin');

      setAuthState({
        isAuthenticated: true,
        user: user || MOCK_USER,
        isLoading: false,
        token,
        userType: 'admin'
      });

      router.push('/dashboard');
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  const logout = () => {
    // Clear auth data using token manager
    tokenManager.clearTokens();

    // Update auth state
    setAuthState({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      token: null,
      userType: null
    });

    // Redirect to login page
    router.push('/login');
  };

  return {
    ...authState,
    login,
    logout,
  };
};

export default useAuth;