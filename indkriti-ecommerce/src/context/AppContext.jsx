import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [navItems, setNavItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNavItems = async () => {
      try {
        setLoading(true);
        // Using mock data directly instead of API call
        setNavItems([
          { id: 1, title: 'Home', url: '/' },
          { id: 2, title: 'Products', url: '/products' },
          { id: 3, title: 'Categories', url: '/categories' },
          { id: 4, title: 'About', url: '/about' },
          { id: 5, title: 'Contact', url: '/contact' },
          { id: 6, title: 'Test Hierarchy', url: '/test-hierarchy' }
        ]);
      } catch (err) {
        console.error('Error setting navigation:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNavItems();
  }, []);

  return (
    <AppContext.Provider value={{
      navItems,
      loading,
      error
    }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;