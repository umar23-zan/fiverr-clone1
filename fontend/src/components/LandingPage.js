import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);

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
        navigate(`/searchResults?category=${searchTerm}`);
      }
    };
  return (
    <div className="landing-page">
       <header className="header">
        <img src={logo} alt="logo" className='logo'/>
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
            <span className="highlight">freelance services</span>
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

        <section className="categories-section">
          <h2 className="section-title">Popular Categories</h2>
          <div className="categories-grid">
            {categories.map(category => (
              <div key={category} className="category-card">
                <div className="category-name" style={{color: "black"}}>{category}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="featured-section">
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
        </section>

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