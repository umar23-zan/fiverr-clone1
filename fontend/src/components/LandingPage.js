import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllGigs } from "../api/gigApi";
// import GigCard from "./GigCard";
import FeaturedGigs from './FeaturedGigs'
import logo from '../images/Giggo-logo.svg'
import './LandingPage.css';

const categories = [
  'Graphics & Design',
  'Programming & Tech',
  'Digital Marketing',
  'Video & Animation',
  'Writing & Translation',
  'Music & Audio',
  'Business',
  'Finance',
  'AI Services',
];

const featuredGigs = [
  { title: 'I will design modern UI/UX', price: 50, image: '/api/placeholder/200/150' },
  { title: 'I will write SEO content', price: 30, image: '/api/placeholder/200/150' }
];

const LandingPage = () => {
  const [categoryGigs, setCategoryGigs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);

    useEffect(() => {
      fetchCategoryGigs();
    }, []);
  
    const fetchCategoryGigs = async () => {
      setLoading(true);
      setError(null);
      try {
        // Update your API call to use the new endpoint
        const response = await fetch('/api/gigs/category-preview');
        const data = await response.json();
        
        if (!data || data.length === 0) {
          setError("No gigs found. Please try again later.");
        } else {
          setCategoryGigs(data);
        }
      } catch (err) {
        setError("Failed to fetch gigs. Please check your internet connection or try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  

    const handleInputChange = (e) => {
      const input = e.target.value;
      setSearchTerm(input);
  
      // Filter categories for suggestions
      if (input) {
        const suggestions = categories.filter((category) =>
          category.toLowerCase().includes(input.toLowerCase())
        );
        setFilteredSuggestions(suggestions);
      } else {
        setFilteredSuggestions([]);
      }
    };
  
    const handleSuggestionClick = (suggestion) => {
      setSearchTerm(suggestion);
      setFilteredSuggestions([]);
    };
  
    const handleSearch = () => {
      if (searchTerm) {
        navigate(`/landingsearchResults?category=${encodeURIComponent(searchTerm)}`);
      }
    };
  return (
    <div className="landing-page">
       <header className="header">
        <div>
        <img src={logo} alt="logo" className='logo'/>
        </div>
        
        <nav className="nav-menu">
          {/* <button className="nav-link">Browse</button>
          <button className="nav-link">Become a Seller</button> */}
          <button className="nav-link" onClick={() => {navigate('/login')}}>Sign in</button>
          <button className="join-button" onClick={() => {navigate('/signup')}}>Join</button>
        </nav>
      </header>

      <main className="main-content">
        <section className="hero-section">
          <h1 className="hero-title">
            Find the perfect
            <span className="highlight1">freelance services</span>
            for your business
          </h1>
          
          <div className="search-container">
          <input 
        type="text" 
        placeholder='What Services are you looking today' 
        value={searchTerm}
        onChange={handleInputChange}
        />
        <button className='search-button' onClick={handleSearch}>Search</button>
        {filteredSuggestions.length > 0 && (
            <div className="suggestions-dropdown">
              {filteredSuggestions.map((suggestion) => (
                <div
                  key={suggestion}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
        )}
          </div>
        </section>

        {/* <section className="categories-section">
          <h2 className="section-title">Popular Categories</h2>
          <div className="categories-grid">
            {categories.map(category => (
              <div key={category} className="category-card">
                <div className="category-name" style={{color: "black"}}>{category}</div>
              </div>
            ))}
          </div>
        </section> */}
        <div className="categories-grid">
  {categories.map(category => (
    <div
      key={category}
      className="category-card"
      onClick={() => {
        console.log(category)
        navigate(`/landingsearchResults?category=${encodeURIComponent(category)}`)}
      }
      style={{ cursor: 'pointer' }}
    >
      <div className="category-name" style={{color: "black"}}>
        {category}
      </div>
    </div>
  ))}
</div>

        {/* <section className="featured-section">
          <h2 className="section-title">Featured Gigs</h2>
          <div className="featured-grid">
            {featuredGigs.map(gig => (
              <div key={gig.title} className="gig-card">
                <img src={gig.image} alt={gig.title} className="gig-image" />
                <div className="gig-details">
                  <h3 className="gig-title">{gig.title}</h3>
                  <p className="gig-price">From ${gig.price}</p>
                </div>
              </div>
            ))}
          </div>
        </section> */}
        <FeaturedGigs categoryGigs={categoryGigs} />

        <section className="how-it-works">
          <h2 className="section-title">How Giggo Works</h2>
          <div className="steps-grid">
            {[
              { number: 1, title: 'Post a job' },
              { number: 2, title: 'Choose freelancers' },
              { number: 3, title: 'Pay safely' }
            ].map(step => (
              <div key={step.number} className="step-item">
                <div className="step-number">{step.number}</div>
                <p className="step-title">{step.title}</p>
              </div>
            ))}
          </div>
        </section>
      </main>      
    </div>
  )
}

export default LandingPage