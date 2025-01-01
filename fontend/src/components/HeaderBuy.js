import React, {useState, useEffect, useRef} from 'react';
import logo from '../images/Giggo-logo.svg'
import account from '../images/account-icon.svg'
import './header.css'
import { useNavigate } from 'react-router-dom';
import { getUserData} from '../api/auth';
import {getAllTags} from '../api/gigApi'

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

const HeaderBuy = () => {
   const [user, setUser] = useState(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false); 
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [tags, setTags] = useState([]);
  const id =localStorage.getItem('userEmail')
  const userId =localStorage.getItem('userId')
  const userRole=localStorage.getItem('userRole')
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);

  useEffect(() => {
      const fetchTags = async () => {
        try {
          const fetchedTags = await getAllTags(); // Call to gigApi.js
          setTags(fetchedTags);
        } catch (error) {
          console.error('Error fetching tags:', error);
        }
      };
      fetchTags();
    }, []);
  
  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleOutsideClick = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
      const fetchUser = async () => {
        try {
          const data = await getUserData(id);
          setUser(data);
          
        } catch (error) {
          console.error("Failed to fetch user data:", error.message);
          setErrors((prev) => ({ ...prev, global: "Failed to load profile data." }));
        } finally {
          setLoading(false);
        }
      };
    
      fetchUser();
    }, [id]);
    



  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('userEmail', 'useId', 'userRole');
    navigate('/');
  };

  const handleInputChange = (e) => {
    const input = e.target.value;
    setSearchTerm(input);

    // Filter categories for suggestions
    if (input) {
      const categorySuggestions = categories.filter((category) =>
        category.toLowerCase().includes(input.toLowerCase())
      );
      const tagSuggestions = tags.filter((tag) =>
        tag
      );
      setFilteredSuggestions([...categorySuggestions, ...tagSuggestions]);
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
      // navigate(`/searchResults?category=${searchTerm}`);
      if (categories.includes(searchTerm)) {
        navigate(`/searchResults?category=${encodeURIComponent(searchTerm)}`);
      } else if (tags.includes(searchTerm)) {
        navigate(`/searchResults?tag=${encodeURIComponent(searchTerm)}`);
      } else {
        console.warn('Search term does not match any category or tag');
      }
    }
  };

  return (
    <div className='header-section-main'>
    <div className='header-section'>
      <img src={logo} alt="Fiverr" className='fiverr-logo'  onClick={() => {navigate('/dashboard')}}/>
      <div className='input-section'>
        <input 
        type="text" 
        placeholder='What Services are you looking today' 
        value={searchTerm}
        onChange={handleInputChange}
        />
        <div className='search-icon' onClick={handleSearch}>
        <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="white"><path d="m15.89 14.653-3.793-3.794a.37.37 0 0 0-.266-.109h-.412A6.499 6.499 0 0 0 6.5 0C2.91 0 0 2.91 0 6.5a6.499 6.499 0 0 0 10.75 4.919v.412c0 .1.04.194.11.266l3.793 3.794a.375.375 0 0 0 .531 0l.707-.707a.375.375 0 0 0 0-.53ZM6.5 11.5c-2.763 0-5-2.238-5-5 0-2.763 2.237-5 5-5 2.762 0 5 2.237 5 5 0 2.762-2.238 5-5 5Z"></path></svg>
        </div>
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
      <div className='action-section'>
      <svg  cursor={'pointer'} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="currentFill"><path d="M3.494 6.818a6.506 6.506 0 0 1 13.012 0v2.006c0 .504.2.988.557 1.345l1.492 1.492a3.869 3.869 0 0 1 1.133 2.735 2.11 2.11 0 0 1-2.11 2.11H2.422a2.11 2.11 0 0 1-2.11-2.11c0-1.026.408-2.01 1.134-2.735l1.491-1.492c.357-.357.557-.84.557-1.345V6.818Zm-1.307 7.578c0 .13.106.235.235.235h15.156c.13 0 .235-.105.235-.235 0-.529-.21-1.036-.584-1.41l-1.492-1.491a3.778 3.778 0 0 1-1.106-2.671V6.818a4.63 4.63 0 1 0-9.262 0v2.006a3.778 3.778 0 0 1-1.106 2.671L2.77 12.987c-.373.373-.583.88-.583 1.41Zm4.49 4.354c0-.517.419-.937.937-.937h4.772a.938.938 0 0 1 0 1.875H7.614a.937.937 0 0 1-.938-.938Z"></path></svg>
      <svg onClick={() => {navigate('/chatapp')}} cursor={'pointer'}  viewBox="0 0 18 16" xmlns="http://www.w3.org/2000/svg" fill="currentFill"><path fill-rule="evenodd" clip-rule="evenodd" d="M.838 4.647a.75.75 0 0 1 1.015-.309L9 8.15l7.147-3.812a.75.75 0 0 1 .706 1.324l-7.5 4a.75.75 0 0 1-.706 0l-7.5-4a.75.75 0 0 1-.309-1.015Z"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M2.5 2.25a.25.25 0 0 0-.25.25v11c0 .138.112.25.25.25h13a.25.25 0 0 0 .25-.25v-11a.25.25 0 0 0-.25-.25h-13ZM.75 2.5c0-.966.784-1.75 1.75-1.75h13c.966 0 1.75.784 1.75 1.75v11a1.75 1.75 0 0 1-1.75 1.75h-13A1.75 1.75 0 0 1 .75 13.5v-11Z"></path></svg>
      <svg   cursor={'pointer'} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M14.325 2.00937C12.5188 0.490623 9.72813 0.718748 8 2.47812C6.27188 0.718748 3.48125 0.487498 1.675 2.00937C-0.674996 3.9875 -0.331246 7.2125 1.34375 8.92187L6.825 14.5062C7.1375 14.825 7.55625 15.0031 8 15.0031C8.44688 15.0031 8.8625 14.8281 9.175 14.5094L14.6563 8.925C16.3281 7.21562 16.6781 3.99062 14.325 2.00937ZM13.5875 7.86875L8.10625 13.4531C8.03125 13.5281 7.96875 13.5281 7.89375 13.4531L2.4125 7.86875C1.27188 6.70625 1.04063 4.50625 2.64063 3.15937C3.85625 2.1375 5.73125 2.29062 6.90625 3.4875L8 4.60312L9.09375 3.4875C10.275 2.28437 12.15 2.1375 13.3594 3.15625C14.9563 4.50312 14.7188 6.71562 13.5875 7.86875Z"></path></svg>
      <div><p style={{color: "black", cursor: "pointer", margin: "0px"}} onClick={() => {
        if(userRole==='Buyer'){
          navigate(`/orders/buyer/${userId}`)
        }else{
          navigate(`/orders/freelancer/${userId}`)
        }
        
        }}>Orders</p></div>
      
      <div>
        {/* <span>{user.name}</span> */}
        {!loading && (<img 
                // src={user && user.profilePicture || account} 
                src={`${user && user.profilePicture || account}`} 
                alt="account" 
                onClick={toggleDropdown} 
                style={{borderRadius: "50px"}}
                ref={dropdownRef} />)}
                
      </div>
      </div>
      {isDropdownOpen && (
        <div className="profile-dropdown" ref={dropdownRef}>
          <ul>
            <li>
            <p style={{color: 'Black'}} onClick={() =>{
                navigate('/profile')
              }}>Profile</p>
              {/* <p style={{color: 'Black'}} onClick={() =>{
                navigate('/gigs')
              }}>Gigs</p> */}
              <p style={{color: 'Black'}}  className="logout-btn" onClick={handleLogout}>Logout</p>
            </li>
          </ul>
        </div>
      )}
    </div>
    {/* <div className="categories">
        {categories.map((category) => (
          <p key={category}>{category}</p>
        ))}
      </div> */}
    </div>
  )
}

export default HeaderBuy