import React, { createContext, useContext } from 'react';
import useAuth from '../hooks/useAuth';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
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
export { useAuth } from '../hooks/useAuth';

export default AuthContext;
