import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './LandingSearch.css'
import axios from 'axios';
import logo from '../images/Giggo-logo.svg'
import { getGigsByCategory } from "../api/gigApi";

const SearchResults = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const category = decodeURIComponent(searchParams.get('category'));
  console.log(category)

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const response = await axios.get(`/api/gigs/category?category=${encodeURIComponent(category)}`);
        console.log(category)
        console.log(response.data)
        setGigs(response.data);
      } catch (error) {
        console.error("Failed to fetch gigs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGigs();
  }, [category]);

  // useEffect(() => {
  //   const fetchGigs = async () => {
  //     try {
  //       const data = await getGigsByCategory(category);
  //       setGigs(data);
  //     } catch (error) {
  //       console.error("Error fetching gigs:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchGigs();
  // }, [category]);

  

  return (
    <div>
      <header className="header">
        <img src={logo} alt="logo" className='logo'/>
        <nav className="nav-menu">
          {/* <button className="nav-link">Browse</button>
          <button className="nav-link">Become a Seller</button> */}
          <button className="nav-link" onClick={() => {navigate('/login')}}>Sign in</button>
          <button className="join-button" onClick={() => {navigate('/signup')}}>Join</button>
        </nav>
      </header>
        <div className="search-results-page">
      
      <div className="search-header">
        <h1>Gigs in {category}</h1>
        <button onClick={() => navigate('/')} className="back-button">
          Back to Home
        </button>
      </div>

      {loading && <div className="loading">Loading gigs...</div>}
      {error && <div className="error-message">{error}</div>}
      
      <div className="gigs-grid">
        {gigs.map((gig) => (
          <div key={gig._id} className="gig-card" onClick={() => {navigate('/login')}}>
            <img
              src={gig.images?.[0] || '/api/placeholder/200/150'}
              alt={gig.title}
              className="gig-image"
            />
            <div className="gig-details">
              <h3 className="gig-title">{gig.title}</h3>
              <p className="gig-price">From ${gig.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
    
  );
};

export default SearchResults;