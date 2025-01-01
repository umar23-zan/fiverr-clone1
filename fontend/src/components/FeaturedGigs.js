import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './GigSlider.css';
import { useWindowSize } from 'react-use';

const FeaturedSection = ({ categoryGigs }) => {
  const navigate=useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const { width } = useWindowSize();
  const [itemsPerSlide, setItemsPerSlide] = useState(5);

  useEffect(() => {
    if (width < 640) { // Mobile
      setItemsPerSlide(2);
    } else if (width < 768) { // Small tablets
      setItemsPerSlide(3);
    } else if (width < 1024) { // Tablets
      setItemsPerSlide(4);
    } else if (width < 1280) { // Small desktop
      setItemsPerSlide(4);
    } else { // Large desktop
      setItemsPerSlide(5);
    }
    // Reset current slide when screen size changes
    setCurrentSlide(0);
  }, [width]);
  
 
  const allGigs = categoryGigs.reduce((acc, category) => {
   
    const topTwoGigs = category.gigs.slice(0, 2);
    return [...acc, ...topTwoGigs.map(gig => ({
      ...gig,
      category: category.category 
    }))];
  }, []);

  const handleNext = () => {
    setCurrentSlide(prev => 
      Math.min(prev + itemsPerSlide, allGigs.length - itemsPerSlide)
    );
  };

  const handlePrev = () => {
    setCurrentSlide(prev => Math.max(prev - itemsPerSlide, 0));
  };

  return (
    <section className="featured-section">
      <h2 className="section-title">Featured Gigs</h2>
      <div className="slider-container">
        <div
          className="featured-grid"
          style={{
            transform: `translateX(-${currentSlide * (100 / itemsPerSlide)}%)`,
            // gridTemplateColumns: `repeat(${allGigs.length}, minmax(0, 1fr))`
          }}
        >
          {allGigs.map((gig) => (
            <div key={gig._id} className="gig-card1" onClick={() => {navigate('/login')}}>
              <img
                src={gig.images?.[0] || '/api/placeholder/200/150'}
                alt={gig.title}
                className="gig-image1"
              />
              <div className="gig-details">
                <span className="gig-category">{gig.category}</span>
                <h3 className="gig-title">{gig.title}</h3>
                <p className="gig-price">From ${gig.price}</p>
              </div>
            </div>
          ))}
        </div>
        {allGigs.length > itemsPerSlide && (
          <>
            <button
              className="slider-button prev"
              onClick={handlePrev}
              disabled={currentSlide === 0}
            >
              ←
            </button>
            <button
              className="slider-button next"
              onClick={handleNext}
              disabled={currentSlide >= allGigs.length - itemsPerSlide}
            >
              →
            </button>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedSection;