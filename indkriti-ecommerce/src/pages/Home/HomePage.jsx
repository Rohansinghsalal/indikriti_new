import { useState, useEffect } from 'react';
import ProductListing from '../../components/product/ProductListing';
import SimplicitySection from '../../components/home/SimplicitySection';
import FAQSection from '../../components/home/FAQSection';
import '../../styles/components.css';

const HomePage = () => {
  const [heroData, setHeroData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5001/api/hero-sections');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch hero data: ${response.statusText}`);
        }
        
        const data = await response.json();
        setHeroData(data);
      } catch (err) {
        console.error('Error fetching hero data:', err);
        setError(err.message);
        // Fallback data for development
        setHeroData([
          {
            id: 1,
            title: 'Bedsheets',
            image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop',
            link: '/categories/bedsheets'
          },
          {
            id: 2,
            title: 'Spring Shades',
            image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
            link: '/collections/spring'
          },
          {
            id: 3,
            title: 'New Arrivals',
            image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop',
            link: '/collections/new-arrivals'
          },
          {
            id: 4,
            title: 'Home Decor',
            image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&h=300&fit=crop',
            link: '/categories/home-decor'
          },
          {
            id: 5,
            title: 'Planters',
            image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=300&fit=crop',
            link: '/categories/planters'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            {heroData.map(item => (
              <div key={item.id} className="hero-card fade-in">
                <img src={item.image} alt={item.title} />
                <div className="card-overlay">
                  <div className="card-title">{item.title} →</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simplicity Section */}
      <SimplicitySection />

      {/* Featured Products */}
      <ProductListing title="Featured Products" limit={4} />

      {/* New Arrivals */}
      <ProductListing title="New Arrivals" category="new" limit={4} />

      {/* FAQ Section */}
      <FAQSection />
    </div>
  );
};

export default HomePage;