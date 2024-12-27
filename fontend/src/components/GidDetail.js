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
import { MessageCircle, ThumbsUp } from 'lucide-react';

const GidDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const [gigs, setGigs] = useState([]);
  const [gig, setGig] = useState(null);
  const [owner, setOwner] = useState(null);
  const senderId=localStorage.getItem('userId')
  const queryParams = new URLSearchParams(location.search);
  const freelancerId = queryParams.get('freelancerId');
  const [activeTab, setActiveTab] = useState('overview');
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

  const renderContent = () => {
    switch (activeTab) {
      case 'gigs':
        return (
          <div className="gig-container">
            {gigs.map((gig) => (
              <GigCard key={gig._id} gig={gig} />
            ))}
          </div>
        );
      case 'reviews':
        return <div>Reviews Content</div>;
      default:
        return (
          <div className='contents'>
          <div className="content-left">
            <section className="section">
              <h2>About Me</h2>
              <p>
                {owner.about}
              </p>
            </section>
  
            <section className="section">
              <h2>Skills</h2>
              <div className="skills-container">
                {['UI Design', 'UX Design', 'Figma', 'Adobe XD', 'Prototyping', 'Wireframing'].map(skill => (
                  <span key={skill} className="skill-tag">{skill}</span>
                ))}
              </div>
            </section>
  
            <section className="section">
              <h2>Languages</h2>
              <div className="language-item">
                <span>{owner.language}</span>
                <span className="language-level">Native/Bilingual</span>
              </div>
              <div className="language-item">
                <span>Spanish</span>
                <span className="language-level">Conversational</span>
              </div>
            </section>
          </div>
                  <div className="content-right">
                  <div className="sidebar-card">
                    <h2>Quick Stats</h2>
                    <div className="stat-row">
                      <MessageCircle className="stat-icon" />
                      <div className="stat-text">
                        <h4>1hr</h4>
                        <div className="stat-label">Avg. Response Time</div>
                      </div>
                    </div>
                    <div className="stat-row">
                      <ThumbsUp className="stat-icon" />
                      <div className="stat-text">
                        <h4>95%</h4>
                        <div className="stat-label">Order Completion</div>
                      </div>
                    </div>
                  </div>
        
                  <div className="sidebar-card">
                    <h2>Availability</h2>
                    <div className="availability-status">Available for work</div>
                    <div className="response-time">Typically responds within 1 hour</div>
                  </div>
                </div>
                </div>
        );
    }
  };

  return (
    <div className="gig-detail">
      <Header />
      <div className="profile-container1">
      <div className="profile-header">
        <div className="profile-header-left">
          <div className="profile-image-container">
            <img 
              src={owner.profilePicture || account}
              alt="Profile" 
              className="profile-image"
            />
            <div className="online-indicator" />
          </div>
          
          <div className="profile-info">
            <h1>{owner.name}</h1>
            <div className="location">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{owner.country}</span>
            </div>
            <div className="rating-info">
              <span className="star">★</span>
              <span className="rating">4.9</span>
              <span>(124 reviews)</span>
              <span>•</span>
              <span>Member since 2022</span>
            </div>
          </div>
        </div>
        
        <button className="contact-button">Contact Me</button>
      </div>

      <div className="stats-grid">
        <div className="stat-item">
          <h3>98%</h3>
          <div className="stat-label">Job Success</div>
        </div>
        <div className="stat-item">
          <h3>843</h3>
          <div className="stat-label">Jobs Completed</div>
        </div>
        <div className="stat-item">
          <h3>₹ {gig.price}</h3>
          <div className="stat-label">Starting Rate</div>
        </div>
      </div>

      <div className="nav-tabs">
        <nav>
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-button ${activeTab === 'gigs' ? 'active' : ''}`}
            onClick={() => setActiveTab('gigs')}
          >
            Active Gigs
          </button>
          <button 
            className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews
          </button>
        </nav>
      </div>

      <div className="main-content">
        {renderContent()}
      </div>
    </div>
    </div>
  );
};

export default GidDetail;
