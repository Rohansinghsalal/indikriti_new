import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Company</h3>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/careers">Careers</Link></li>
            <li><Link to="/blog">Blog</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Policies</h3>
          <ul>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/terms-of-service">Terms of Service</Link></li>
            <li><Link to="/shipping-policy">Shipping Policy</Link></li>
            <li><Link to="/return-policy">Return Policy</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/faq">FAQs</Link></li>
            <li><Link to="/track-order">Track Order</Link></li>
            <li><Link to="/gift-cards">Gift Cards</Link></li>
            <li><Link to="/wholesale">Wholesale</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Connect With Us</h3>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">📘</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">📸</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">🐦</a>
            <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" aria-label="Pinterest">📌</a>
          </div>
          <div className="newsletter">
            <h4>Subscribe to our newsletter</h4>
            <form>
              <input type="email" placeholder="Your email address" required />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Indikriti. All rights reserved.</p>
        <div className="payment-icons">
          <span>💳</span>
          <span>💳</span>
          <span>💳</span>
          <span>💳</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;