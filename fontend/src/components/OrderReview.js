// OrderReview.jsx
import React, { useState } from 'react';
import { Clock, MessageSquare, Award, ThumbsUp, FileText } from 'lucide-react';
import './OrderReview.css';
import HeaderBuy from './HeaderBuy';

const OrderReview = () => {
  const [acceptDelivery, setAcceptDelivery] = useState(false)
  const [ratings, setRatings] = useState({
    communication: 5,
    service: 5,
    recommend: 5
  });
  const [review, setReview] = useState('');

  const renderStars = (count) => {
    return '★'.repeat(count) + '☆'.repeat(5 - count);
  };

  const handleRatingChange = (category, value) => {
    setRatings(prev => ({
      ...prev,
      [category]: value
    }));
  };

  return (
    <div>
      <HeaderBuy />
<div className="review-container">
      <div className="review-header">
        <h1 className="review-title">Order #GIG84752 - Review</h1>
        <span className="status-badge-review">Pending Review</span>
      </div>

      <div className="review-content">
        <div className="delivery-section">
          <h2 className="section-title">Delivery Preview</h2>
          <div className="preview-image">
            
          </div>

          <div className="delivered-files">
            <h3 className="section-title">Delivered Files:</h3>
            <div className="file-item">
              <FileText size={20} className="file-icon" />
              <span>final_design_v1.fig</span>
            </div>
            <div className="file-item">
              <FileText size={20} className="file-icon" />
              <span>assets.zip</span>
            </div>
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
            <button className="submit-review">Submit Review</button>
            
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
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
            <div className="review-actions">
            <button className="submit-review" onClick={()=>{setAcceptDelivery(false)}}>Submit Revision</button>
            
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