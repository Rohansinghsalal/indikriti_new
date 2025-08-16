'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import useAuth from '@/hooks/useAuth';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  permissions?: string[];
  companyId?: string;
  avatar?: string;
  userType?: 'admin';
  accessLevel?: string;
  isSuperAdmin?: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  userType: 'admin' | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();

  return (
    <AuthContext.Provider 
      value={{ 
        ...auth,
        userType: auth.user?.userType || auth.userType || null
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

// Export useAuth for backward compatibility and convenience
export { useAuth } from '@/hooks/useAuth';

export default AuthContext;