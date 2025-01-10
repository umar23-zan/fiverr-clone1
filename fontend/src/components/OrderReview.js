// OrderReview.jsx
import React, { useState } from 'react';
import { Clock, MessageSquare, Award, ThumbsUp, FileText } from 'lucide-react';
import './OrderReview.css';
import HeaderBuy from './HeaderBuy';
import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const OrderReview = () => {
  const location = useLocation();
  const { orderDetails } = location.state;
  const {orderId} = useParams();
  const [acceptDelivery, setAcceptDelivery] = useState(false)
  const [ratings, setRatings] = useState({
    communication: 0,
    service: 0,
    recommend: 0
  });
  const [review, setReview] = useState('');
  const [remarks, setRemarks] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const clearMessages = () => {
    setTimeout(() => {
      setSuccessMessage('');
      setErrorMessage('');
    }, 2000); // Clears messages after 3 seconds
  };
  

  const renderStars = (count) => {
    return '★'.repeat(count) + '☆'.repeat(5 - count);
  };

  const handleRatingChange = (category, value) => {
    setRatings(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleSubmitReview = async () => {
    try {
     
      const response = await axios.post(`/api/orders/${orderId}/review`, {
        ratings,
        review,
      });
      setSuccessMessage('Review submitted successfully!');
      setErrorMessage('');
      console.log(response.data); 
      setRatings({ communication: 5, service: 5, recommend: 5 });
    setReview('');
      clearMessages();
    } catch (error) {
      setErrorMessage('Error submitting review. Please try again.');
      setSuccessMessage('');
      console.error('Error submitting review:', error);
      clearMessages();
    }
  };

  const handleRequestRevision = async () => {
    try {
      
      const response = await axios.post(`/api/orders/${orderId}/revision`, { remarks });
      setSuccessMessage('Revision requested successfully!');
      setErrorMessage('');
      console.log(response.data); 
      setRemarks('');
      clearMessages();
    } catch (error) {
      setErrorMessage('Error requesting revision. Please try again.');
      setSuccessMessage('');
      console.error('Error requesting revision:', error);
      clearMessages();
    }
  };

  return (
    <div>
      <HeaderBuy />
<div className="review-container">
      <div className="review-header">
        <h1 className="review-title">Order {orderId} - Review</h1>
        <span className="status-badge-review">Pending Review</span>
      </div>

      <div className="review-content">
        <div className="delivery-section">
          <h2 className="section-title">Delivery Description</h2>
          <div className="delivery-info">
            {orderDetails.deliveries[0].description}
          </div>

          <div className="delivered-files">
            <h3 className="section-title">Delivered Files:</h3>
            {orderDetails.deliveries[0].files.map((fileUrl, index) => (
                <div className="file-item" key={index}>
                  <FileText size={20} className="file-icon" />
                  <a href={fileUrl} download target="_blank" rel="noopener noreferrer">
                    <span>{fileUrl.split('/').pop()}</span>
                  </a>
                </div>
              ))}
          </div>
        </div>
        {acceptDelivery? (
          <div className="rating-section">
          <h2 className="section-title">Rate This Delivery</h2>
          
          <div className="star-rating">
            {Object.entries(ratings).map(([category, value]) => (
              <div key={category} className="rating-category">
                <label className="rating-label">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </label>
                <div className="stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      onClick={() => handleRatingChange(category, star)}
                      style={{ cursor: 'pointer' }}
                    >
                      {star <= value ? '★' : '☆'}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="review-input">
            <h3 className="section-title">Write Your Review</h3>
            <textarea
              className="review-textarea"
              placeholder="Share your experience with this seller..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
          </div>

          <div className="review-actions">
            <button className="submit-review" onClick={handleSubmitReview}>Submit Review</button>
            {successMessage && <p className="success-message">{successMessage}</p>}
                {errorMessage && <p className="error-message">{errorMessage}</p>}
          </div>
        </div>
        ):(
          <div className="rating-section">
            <h2 className="section-title">Delivery Status</h2>
            <button className="submit-review" onClick={()=>{setAcceptDelivery(true)}}>Accept Delivery and Write Review</button>
            <p>Or</p>
            <button className="request-revision">Request Revision</button>
            <div className="review-input">
            <h3 className="section-title">Write Your Remarks</h3>
            <textarea
              className="review-textarea"
              placeholder="Write your remarks on this Revision"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
            <div className="review-actions">
            <button className="submit-review" onClick={handleRequestRevision}>Submit Revision</button>
            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </div>
          </div>


          </div>
        )}
        
      </div>

      <div className="order-stats">
        <div className="stat-item">
          <Clock className="stat-icon" size={24} />
          <div className="stat-value">1 day early</div>
          <div className="stat-label">Delivery Time</div>
        </div>
        <div className="stat-item">
          <MessageSquare className="stat-icon" size={24} />
          <div className="stat-value">12 messages</div>
          <div className="stat-label">Messages</div>
        </div>
        <div className="stat-item">
          <Award className="stat-icon" size={24} />
          <div className="stat-value">0 of 3 used</div>
          <div className="stat-label">Revisions</div>
        </div>
        <div className="stat-item">
          <ThumbsUp className="stat-icon" size={24} />
          <div className="stat-value">4.9 (843 reviews)</div>
          <div className="stat-label">Seller Rating</div>
        </div>
      </div>
    </div>
    </div>
    
  );
};

export default OrderReview;