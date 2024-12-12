import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GigCard.css'; // Create a simple CSS file for styling

const GigCard = ({ gig }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/gigdetail/${gig._id}`);
  };

  return (
    <div className="gig-card" onClick={handleCardClick}>
      <img src={gig.images[0]} alt={gig.title} className="gig-image" />
      <h3>{gig.title}</h3>
      <p>{gig.description}</p>
      <h3>From ₹{gig.price}</h3>
    </div>
  );
};

export default GigCard;
