import React from 'react';
import './GigCard.css'; // Create a simple CSS file for styling

const GigCard = ({ gig }) => {
  return (
    <div className="gig-card">
      <img src={gig.images[0]} alt={gig.title} className="gig-image" />
      <h3>{gig.title}</h3>
      <p>{gig.description}</p>
      <h3>From ₹{gig.price}</h3>
    </div>
  );
};

export default GigCard;
