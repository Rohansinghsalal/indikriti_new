import { useState, useEffect } from 'react';

// Import pages
import Home from '../pages/Home.jsx';
import Cart from '../pages/Cart.jsx';
import ProductDetail from '../pages/ProductDetail.jsx';
import CategoryPage from '../pages/CategoryPage.jsx';
import SearchPage from '../pages/SearchPage.jsx';

const AppRouter = () => {
  const [currentRoute, setCurrentRoute] = useState('home');
  const [routeParams, setRouteParams] = useState({});

  useEffect(() => {
    // Parse current URL hash
    const parseRoute = () => {
      const hash = window.location.hash.slice(1) || 'home';
      const [route, ...params] = hash.split('/');
      
      setCurrentRoute(route);
      
      // Parse route parameters
      const paramObj = {};
      if (params.length > 0) {
        paramObj.id = params[0];
      }
      
      // Parse query parameters
      const queryIndex = hash.indexOf('?');
      if (queryIndex !== -1) {
        const queryString = hash.slice(queryIndex + 1);
        const searchParams = new URLSearchParams(queryString);
        for (const [key, value] of searchParams) {
          paramObj[key] = value;
        }
      }
      
      setRouteParams(paramObj);
    };

    // Listen for hash changes
    window.addEventListener('hashchange', parseRoute);
    parseRoute(); // Parse initial route

    return () => window.removeEventListener('hashchange', parseRoute);
  }, []);

  // Navigation function
  const navigate = (route, params = {}) => {
    let url = `#${route}`;
    
    if (params.id) {
      url += `/${params.id}`;
    }
    
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (key !== 'id' && value !== undefined) {
        queryParams.append(key, value);
      }
    });
    
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }
    
    window.location.hash = url;
  };

  // No authentication required - all routes are public

  // Route components - all public, no authentication required
  const getRouteComponent = () => {
    switch (currentRoute) {
      case 'home':
      case '':
        return <Home onNavigate={navigate} routeParams={routeParams} />;

      case 'cart':
        return <Cart onNavigate={navigate} routeParams={routeParams} />;

      case 'product':
        return <ProductDetail onNavigate={navigate} routeParams={routeParams} />;

      case 'category':
        return <CategoryPage onNavigate={navigate} routeParams={routeParams} />;

      case 'search':
        return <SearchPage onNavigate={navigate} routeParams={routeParams} />;
      
      default:
        return (
          <div className="container mx-auto px-4 py-8 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Page Not Found</h1>
            <p className="text-gray-600 mb-4">The page you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('home')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Home
            </button>
          </div>
        );
    }
  };

  return (
    <div>
      {getRouteComponent()}
    </div>
  );
};

export default AppRouter;
