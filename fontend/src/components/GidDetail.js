import React, { useState, useEffect } from 'react';
import { getUserGigs} from '../api/gigApi';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import account from '../images/account-icon.svg'
import './GidDetails.css'
import GigCard from './GigCard';
import MiniMessaging from './MiniMessaging';
import close from '../images/close.svg'

const GidDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const [gigs, setGigs] = useState([]);
  const [gig, setGig] = useState(null);
  const [owner, setOwner] = useState(null);
  const senderId=localStorage.getItem('userId')
  const queryParams = new URLSearchParams(location.search);
  const freelancerId = queryParams.get('freelancerId');
  const [showChat, setShowChat] = useState(false); // Toggle chat
  useEffect(() => {
    fetchGigDetails();
    fetchUserGigs();
  }, []);

  const fetchUserGigs = async () => {
      const userId = freelancerId; 
      console.log(userId)
      const gigs = await getUserGigs(userId);
      console.log(gigs)
      setGigs(gigs);
    };

  const fetchGigDetails = async () => {
    try {
      // Fetch gig details
      const gigData = await axios.get(`/api/gigs/${id}`);
      console.log(gigData.data)
      setGig(gigData.data);

      
      const ownerResponse = await axios.get(`/api/auth/user/${gigData.data.freelancerId.email}`);
      setOwner(ownerResponse.data);
    } catch (error) {
      console.error('Error fetching gig details:', error);
    }
  };

  if (!gig || !owner) return <p>Loading...</p>;

  return (
    <div className="gig-detail">
      <Header />
      <div className='gigDetail-container'>
        <div className='gigOwner-container'>
          <h1>{gig.title}</h1>
          <div className='gigOwner-details'>
            <img src={owner.profilePicture || account} alt={owner.name} style={{width: "150px", height: "150px"}}/>
            <div className='gigOwner-personal'>
              <p><strong>{owner.name}</strong></p>
              <div className='gigOwner-native'>
                <span> Location: {owner.country}</span>
                <span>Language: {owner.language}</span>
              </div>
            </div>
          </div>
          <div className='gigOwner-about'>
            <p><strong>{owner.profession}</strong></p>
            <p style={{color: "grey"}}>{owner.about}</p>
          </div>
        </div>
        <div className='payment-container'>
          <div className='payment-category'>
            <p><strong>Basic</strong></p>
          </div>
          <div className='payment-details-container'>
            <div className='payment-price'>
              <span><strong>Basic</strong></span>
              <span>₹ {gig.price}</span>
            </div>
            <p>{gig.description}</p>
            <p>{gig.deliveryTime}-day delivery</p>
            <button>continue</button>
          </div>
        </div>
      </div>
      <h1>Checkout my other gigs</h1>
      <div className="gig-container">
            {gigs.map((gig) => (
              <GigCard key={gig._id} gig={gig} />
            ))}
          </div>
    <div className="chat-interface">
      {!showChat ? (
        <button
          className="chat-button"
          onClick={() => setShowChat(true)}
          aria-label={`Message ${owner.name}`}
        >
          <div className="chat-button-content">
            <div className="chat-avatar">
              <img
                src={owner.profilePicture || account}
                alt={owner.name}
                className="chat-avatar-image"
              />
              <span className="status-indicator"></span>
            </div>
            <div className="chat-info">
              <span className="chat-name">Message {owner.name}</span>
              <div className="chat-status">
                <span className="status-dot"></span>
                <span className="status-text">Away · Avg. response time: 1 Hour</span>
              </div>
            </div>
          </div>
        </button>
      ) : (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-header-info">
              <img
                src={owner.profilePicture || account}
                alt={owner.name}
                className="chat-header-avatar"
              />
              <div className="chat-header-text">
                <span className="chat-header-name">{owner.name}</span>
                <span className="chat-header-status">Away</span>
              </div>
            </div>
            <button 
              className="close-button"
              onClick={() => setShowChat(false)}
              aria-label="Close chat"
            >
              <img src={close} alt="close" className="close-icon" />
            </button>
          </div>
          <div className="chat-body">
            <MiniMessaging
              isMiniChat={true}
              receiverId={freelancerId}
              senderId={senderId}
            />
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default GidDetail;
