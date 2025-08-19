import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsExpanded(false);
    }
  };

  const toggleSearch = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      // Focus the input when expanded
      setTimeout(() => {
        document.getElementById('search-input').focus();
      }, 100);
    }
  };

  return (
    <div className={`search-bar ${isExpanded ? 'expanded' : ''}`}>
      <button 
        className="search-icon" 
        onClick={toggleSearch}
        aria-label="Toggle search"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>
      
      <form onSubmit={handleSearch} className="search-form">
        <input
          id="search-input"
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button 
          type="submit" 
          className="search-submit"
          aria-label="Search"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </form>
      
      {isExpanded && (
        <button 
          className="search-close" 
          onClick={toggleSearch}
          aria-label="Close search"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default SearchBar;