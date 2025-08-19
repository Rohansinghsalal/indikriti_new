import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-grid">
        <div className="hero-card hero-card-large">
          <img src="/images/hero-1.jpg" alt="Bedsheets collection" />
          <div className="hero-content">
            <h2>Bedsheets Collection</h2>
            <p>Handcrafted with love</p>
            <Link to="/bedsheets" className="btn-shop">Shop Now</Link>
          </div>
        </div>
        
        <div className="hero-card">
          <img src="/images/hero-2.jpg" alt="Home decor" />
          <div className="hero-content">
            <h2>Home Decor</h2>
            <p>Elevate your space</p>
            <Link to="/home-decor" className="btn-shop">Shop Now</Link>
          </div>
        </div>
        
        <div className="hero-card">
          <img src="/images/hero-3.jpg" alt="Tableware" />
          <div className="hero-content">
            <h2>Tableware</h2>
            <p>Dine in style</p>
            <Link to="/tableware" className="btn-shop">Shop Now</Link>
          </div>
        </div>
        
        <div className="hero-card">
          <img src="/images/hero-4.jpg" alt="Kitchenware" />
          <div className="hero-content">
            <h2>Kitchenware</h2>
            <p>Cook with passion</p>
            <Link to="/kitchenware" className="btn-shop">Shop Now</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;