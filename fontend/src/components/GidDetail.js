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
          <div className="mini-chat">
        {!showChat ? (
          <button
            className="chat-toggle-button"
            onClick={() => setShowChat(true)}
          >
            <img
              src={owner.profilePicture || account}
              alt="Freelancer"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                marginRight: "10px",
              }}
            />
            Message {owner.name}
            <span style={{ fontSize: "12px", color: "grey", marginLeft: "10px" }}>
              Away · Avg. response time: 1 Hour
            </span>
          </button>
        ) : (
          <div>
            <img src={close} alt="close-icon" onClick={() => setShowChat(false)} className='mini-chat-mode-icon'/>
            <MiniMessaging
            isMiniChat={true}
            receiverId={freelancerId}
            senderId={senderId}
          />
          </div>
          
        )}
      </div>
    </div>
  );
};

export default GidDetail;
