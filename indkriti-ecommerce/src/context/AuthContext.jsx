import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const checkAuth = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    // In a real app, this would make an API call to authenticate
    // For demo purposes, we'll simulate a successful login
    try {
      // Simulate API call delay
      setLoading(true);
      
      // Mock successful login response
      const mockUser = {
        id: '123',
        name: 'Demo User',
        email: credentials.email,
        avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
      };
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      // Update state
      setUser(mockUser);
      setIsAuthenticated(true);
      
      return { success: true, user: mockUser };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Invalid credentials' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Remove user data from localStorage
    localStorage.removeItem('user');
    
    // Update state
    setUser(null);
    setIsAuthenticated(false);
    
    return { success: true };
  };

  const register = async (userData) => {
    // In a real app, this would make an API call to register a new user
    // For demo purposes, we'll simulate a successful registration
    try {
      setLoading(true);
      
      // Mock successful registration
      const mockUser = {
        id: '123',
        name: userData.name,
        email: userData.email,
        avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
      };
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      // Update state
      setUser(mockUser);
      setIsAuthenticated(true);
      
      return { success: true, user: mockUser };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      loading,
      login,
      logout,
      register
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;