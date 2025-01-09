import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GigCard.css'; // Create a simple CSS file for styling

const GigCard = ({ gig }) => {
  const navigate = useNavigate();
  const userId =localStorage.getItem('userId')

  const handleCardClick = () => {
    console.log(gig)
    if(userId !== gig.freelancerId._id){
            // navigate(`/gigdetail/${gig._id}`);
    navigate(`/gigdetail/${gig._id}?freelancerId=${gig.freelancerId._id}`);
    }

    
    
  };

  return (
    <div className="gig-card" onClick={handleCardClick}>
      <img src={gig.images[0]} alt={gig.title} className="gig-image" />
      <h3 style={{maxWidth: "200px"}}>{gig.title}</h3>
      <p style={{maxWidth: "230px"}}>{gig.description}</p>
      <h3>From ₹{gig.price}</h3>
    </div>
  );
};

export default GigCard;
