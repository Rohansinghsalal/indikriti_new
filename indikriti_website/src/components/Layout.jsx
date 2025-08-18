import Header from './Header.jsx';
import Navbar from './Navbar.jsx';

const Layout = ({ children, currentPage = 'home', title, showBack = false, onBack }) => {
  const handleNavigation = (page, data) => {
    console.log('Navigate to:', page, data);
    
    // Handle different navigation scenarios
    switch (page) {
      case 'home':
        window.location.hash = '';
        break;
      case 'search':
        window.location.hash = 'search';
        break;
      case 'cart':
        window.location.hash = 'cart';
        break;
      case 'wishlist':
        window.location.hash = 'wishlist';
        break;
      case 'profile':
        window.location.hash = 'profile';
        break;
      case 'login':
        // No login required - redirect to home
        window.location.hash = 'home';
        break;
      case 'category':
        if (data) {
          window.location.hash = `category/${data.id}`;
        }
        break;
      case 'product':
        if (data) {
          window.location.hash = `product/${data.id || data.product_id}`;
        }
        break;
      case 'checkout':
        window.location.hash = 'checkout';
        break;
      case 'sales':
        window.location.hash = 'sales';
        break;
      default:
        console.log('Unknown navigation target:', page);
    }
  };

  const handleSearch = (query) => {
    console.log('Search for:', query);
    window.location.hash = `search?q=${encodeURIComponent(query)}`;
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
      {/* Header */}
      <Header
        title={title}
        onSearch={handleSearch}
        onNavigate={handleNavigation}
        showBack={showBack}
        onBack={onBack}
      />

      {/* Main Content */}
      <main className="pb-24 min-h-screen">
        {children}
      </main>

      {/* Navigation */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigation}
      />


    </div>
  );
};

export default Layout;
