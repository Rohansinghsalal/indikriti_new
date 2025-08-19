import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CartIcon from './CartIcon';
import DarkModeToggle from '../DarkModeToggle/DarkModeToggle';
import { CategoryMenu } from '../../../components/category';
import '../../../styles/components.css';

const Header = ({ navItems = [] }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState('indikriti');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Top Banner */}
      <div className="top-banner">
        FOR CUSTOMISED FITTED BEDSHEETS CONTACT 8700825418
      </div>

      {/* Header */}
      <header className={`header ${isScrolled ? 'bg-opacity-95' : ''}`}>
        <div className="nav-container">
          <Link to="/" className="logo">Indikriti</Link>

          {/* Hamburger for mobile */}
          <div className="hamburger" onClick={toggleMenu}>
            <span></span><span></span><span></span>
          </div>

          <nav>
            <ul className="nav-menu" style={{ display: isMenuOpen ? 'flex' : '' }}>
              <li><Link to="/">Home</Link></li>
              <li className="category-menu-container">
                <CategoryMenu brand={selectedBrand} onBrandChange={setSelectedBrand} />
              </li>
              {navItems.length > 0 ? (
                navItems.map(item => (
                  <li key={item.id}><Link to={item.path}>{item.title}</Link></li>
                ))
              ) : (
                // Fallback navigation if API fails
                <>
                  <li><Link to="/gifting">Gifting</Link></li>
                  <li><Link to="/handicraft">Handicraft</Link></li>
                  <li><Link to="/contact">Contact</Link></li>
                </>
              )}
            </ul>
          </nav>

          <div className="nav-icons">
            <Link to="/search" className="search-icon" aria-label="Search">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </Link>
            
            <Link to="/account" className="account-icon" aria-label="My Account">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </Link>
            
            <DarkModeToggle />
            
            <CartIcon />
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;