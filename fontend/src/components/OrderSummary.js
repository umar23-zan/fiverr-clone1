
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './OrderSummary.css'
import HeaderBuy from './HeaderBuy';

const OrderSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { buyerId, freelancerId, gigId, gigTitle, amount, deliveryTime } = location.state || {};
  const [requirements, setRequirements] = useState('');

  
  const serviceCharge = parseFloat((amount * 0.10).toFixed(2));
  const totalAmount = amount + serviceCharge;

  const handlePaymentNavigation = () => {
    navigate('/paymentGateway', {
      state: {
        buyerId,
        freelancerId,
        gigId,
        gigTitle,
        amount: totalAmount,
        deliveryTime,
        requirements
      }
    });
  };

  

  return (
    <div>
      <HeaderBuy />
      <div className="order-summary-container">
        <h1>Order Summary</h1>
        
        <div className="summary-content">
          <div className="order-info">
            <h2>Order Details</h2>
            <div className="info-group">
              <h3>{gigTitle}</h3>
              <p className="delivery-time"><strong>Delivery Time:</strong> {deliveryTime} days</p>
            </div>

            <div className="requirements-section1">
              <h3>Project Requirements</h3>
              <textarea
                placeholder="Please describe your specific requirements, preferences, and any additional details for the freelancer..."
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
              />
            </div>
          </div>

          <div className="price-summary">
            <h2>Price Details</h2>
            <div className="price-breakdown">
              <div className="price-row">
                <span>Subtotal</span>
                <span>₹{amount}</span>
              </div>
              <div className="price-row">
                <span>Service Fee</span>
                <span>₹{serviceCharge}</span>
              </div>
              <div className="price-row total">
                <span>Total</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>

            <button 
              className="proceed-button"
              onClick={handlePaymentNavigation}
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default OrderSummary;