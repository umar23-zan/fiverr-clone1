import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './GigSlider.css';

const FeaturedSection = ({ categoryGigs }) => {
  const navigate=useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const itemsPerSlide = 5;
  
  // Flatten all gigs from different categories into a single array
  const allGigs = categoryGigs.reduce((acc, category) => {
    // Take only first two gigs from each category
    const topTwoGigs = category.gigs.slice(0, 2);
    return [...acc, ...topTwoGigs.map(gig => ({
      ...gig,
      category: category.category // Add category information to each gig
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
            transform: `translateX(-${currentSlide * (100 / itemsPerSlide)}%)`
          }}
        >
          {allGigs.map((gig) => (
            <div key={gig._id} className="gig-card" onClick={() => {navigate('/login')}}>
              <img
                src={gig.images?.[0] || '/api/placeholder/200/150'}
                alt={gig.title}
                className="gig-image"
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