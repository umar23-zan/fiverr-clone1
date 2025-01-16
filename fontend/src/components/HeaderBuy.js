import React, {useState, useEffect, useRef} from 'react';
import logo from '../images/Giggo-logo.svg'
import account from '../images/account-icon.svg'
import './header.css'
import { useNavigate } from 'react-router-dom';
import { getUserData} from '../api/auth';
import {getAllTags} from '../api/gigApi'
import { io } from 'socket.io-client';
import axios from 'axios';

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
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const socketRef = useRef();
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
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/notifications/${userId}`);
      setNotifications(response.data);
  
      // Count unread notifications
      const unread = response.data.filter((n) => !n.isRead).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, [userId]);

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - notificationTime) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.put('http://localhost:5000/api/notifications/read', {
        notificationIds: [notificationId],
      });
      
      setNotifications(prev =>
        prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markNotificationsAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter((n) => !n.isRead).map((n) => n._id);
  
      if (unreadNotifications.length > 0) {
        await axios.put('http://localhost:5000/api/notifications/read', {
          notificationIds: unreadNotifications,
        });
  
        // Update local state
        setNotifications((prev) =>
          prev.map((n) => ({ ...n, isRead: true }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/notifications/${notificationId}`);
  
      if (response.status === 200) {
        // Update local state only after successful API call
        const deletedNotification = notifications.find(n => n._id === notificationId);
        
        setNotifications(prev => prev.filter(n => n._id !== notificationId));
        
        // Update unread count if the deleted notification was unread
        if (deletedNotification && !deletedNotification.isRead) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      // Optionally show an error message to the user
      alert('Failed to delete notification. Please try again.');
    }
  };

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
    
    useEffect(() => {
        socketRef.current = io('http://localhost:5000');
        socketRef.current.emit('join', userId);
    
        socketRef.current.on('newNotification', (notification) => {
          setNotifications((prev) => [notification, ...prev]);
          setUnreadCount((prev) => prev + 1);
        });
    
        return () => {
          socketRef.current.disconnect();
        };
      }, [userId]);
    
      const handleNotificationClick = () => {
        setNotificationOpen(!isNotificationOpen);
        markNotificationsAsRead();
      };


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

  const handleNotificationItemClick = (notification) => {
    // First mark as read
    markAsRead(notification._id);
    
    // Then navigate based on notification type
    switch (notification.type) {
      case 'NEW_ORDER':
          navigate(`/orders/buyer/${userId}`);
        break;
        
      case 'NEW_MESSAGE':
        navigate(`/chatapp`);
        break;
        
      case 'NEW_REQUIREMENT':
          navigate(`/ordersdetails/${notification.orderId}`);        
        break;
        
      case 'REVISION_REQUESTED':
        navigate(`/orders/buyer/${userId}`);
        break;

      case 'ORDER_DELIVERED':
        navigate(`/orderreview/${userId}`);
        break;
    }

    
    
    // Close the notification dropdown
    setNotificationOpen(false);
  };

  const renderNotificationSection = () => (
    <div className="notification-system">
      <button className="notification-btn" onClick={handleNotificationClick}>
        <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="currentFill">
          <path d="M3.494 6.818a6.506 6.506 0 0 1 13.012 0v2.006c0 .504.2.988.557 1.345l1.492 1.492a3.869 3.869 0 0 1 1.133 2.735 2.11 2.11 0 0 1-2.11 2.11H2.422a2.11 2.11 0 0 1-2.11-2.11c0-1.026.408-2.01 1.134-2.735l1.491-1.492c.357-.357.557-.84.557-1.345V6.818Z"></path>
        </svg>
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {isNotificationOpen && (
        <div className="notification-dropdown" ref={dropdownRef}>
          <div className="notification-header">
            <h3 className="notification-title">Notifications</h3>
            {unreadCount > 0 && (
              <button className="mark-all-read" onClick={markNotificationsAsRead}>
                Mark all as read
              </button>
            )}
          </div>

          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                onClick={() => handleNotificationItemClick(notification)}
    style={{ cursor: 'pointer' }}
              >
                <div className="notification-content">
                  <p className="notification-message">{notification.message}</p>
                  <span className="notification-time">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 6v6l4 2"/>
                    </svg>
                    {formatTimeAgo(notification.createdAt)}
                  </span>
                </div>
                <div className="notification-actions" onClick={(e) => e.stopPropagation()}>
                  {!notification.isRead && (
                    <button
                      className="action-btn read"
                      onClick={() => markAsRead(notification._id)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                    </button>
                  )}
                  <button
                    className="action-btn delete"
                    onClick={() => deleteNotification(notification._id)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-notifications">
              No notifications
            </div>
          )}
        </div>
      )}
    </div>
  );

  const handleClear = () => {
    setSearchTerm('');
  };


  return (
    <div className='header-section-main'>
    <div className='header-section'>
      <img src={logo} alt="Fiverr" className='fiverr-logo'  onClick={() => {navigate('/dashboard')}}/>
      <div className='search-container2' >
      <div className="search-icon-start">
        <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
          <path d="m15.89 14.653-3.793-3.794a.37.37 0 0 0-.266-.109h-.412A6.499 6.499 0 0 0 6.5 0C2.91 0 0 2.91 0 6.5a6.499 6.499 0 0 0 10.75 4.919v.412c0 .1.04.194.11.266l3.793 3.794a.375.375 0 0 0 .531 0l.707-.707a.375.375 0 0 0 0-.53ZM6.5 11.5c-2.763 0-5-2.238-5-5 0-2.763 2.237-5 5-5 2.762 0 5 2.237 5 5 0 2.762-2.238 5-5 5Z" />
        </svg>
      </div>
        <input 
        type="text" 
        placeholder='What Services are you looking today' 
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className='search-input2'
        />
        <button className="clear-button" onClick={handleClear}>
          <svg width="14" height="14" viewBox="0 0 24 24">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </button>
        <button className='search-button2' onClick={handleSearch}>
        <svg width="17" height="17" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="white"><path d="m15.89 14.653-3.793-3.794a.37.37 0 0 0-.266-.109h-.412A6.499 6.499 0 0 0 6.5 0C2.91 0 0 2.91 0 6.5a6.499 6.499 0 0 0 10.75 4.919v.412c0 .1.04.194.11.266l3.793 3.794a.375.375 0 0 0 .531 0l.707-.707a.375.375 0 0 0 0-.53ZM6.5 11.5c-2.763 0-5-2.238-5-5 0-2.763 2.237-5 5-5 2.762 0 5 2.237 5 5 0 2.762-2.238 5-5 5Z"></path></svg>
        </button>
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
      {renderNotificationSection()}

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