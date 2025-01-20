import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Alert, AlertDescription } from "./ui/Alert"
import { Loader2 } from "lucide-react"
import './PaymentGateway.css'
import Header from './Header';

// Mock card database
const VALID_CARDS = {
  "4111111111111111": { valid: true, balance: 15000 },
  "4242424242424242": { valid: true, balance: 10000 },
  "4000000000000002": { valid: false, balance: 0 },
};
const formatCardNumber = (number) => {
  return number.replace(/(\d{4})/g, '$1 ').trim();
};

const PaymentGateway = () => {
 const location = useLocation()
 const navigate = useNavigate()
 const {buyerId, freelancerId, gigId ,gigTitle, amount, deliveryTime, requirements } =location.state || {}
 const [paymentStatus, setPaymentStatus] = useState('pending');
 console.log(buyerId, freelancerId, gigId, gigTitle, amount)

  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    amount: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const validateForm = () => {
    if (!formData.cardNumber || formData.cardNumber.length !== 16) {
      throw new Error('Invalid card number length');
    }
    if (!formData.expiryDate || !/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      throw new Error('Invalid expiry date format (MM/YY)');
    }
    if (!formData.cvv || formData.cvv.length !== 3) {
      throw new Error('Invalid CVV');
    }
    if (!amount || parseFloat(amount) <= 0) {
      throw new Error('Invalid amount');
    }
  };

  // Mock API call
  const processPayment = async (paymentData) => {

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const card = VALID_CARDS[paymentData.cardNumber];
          
          if (!card) {

            reject({ message: 'Invalid card number' });
            return;
          }
          
          if (!card.valid) {

            reject({ message: 'Card is expired or invalid' });
            return;
          }
          
          if (card.balance < parseFloat(paymentData.amount)) {
            // addDebugLog('Insufficient funds');
            reject({ message: 'Insufficient funds' });
            return;
          }
          

          resolve({
            transactionId: Math.random().toString(36).substring(7),
            amount: paymentData.amount,
            status: 'success',
            timestamp: new Date().toISOString()
          });
        } catch (err) {
          // addDebugLog(`Processing error: ${err.message}`);
          reject(err);
        }
      }, 1500);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      setPaymentStatus('processing');
      validateForm();
      const paymentResult = await processPayment(formData);
      setResponse(paymentResult);
      console.log("Incoming orderResponse", buyerId,
        freelancerId,
        gigId,
        gigTitle,
        amount,
      requirements )
        if (requirements) {
          const orderResponse = await axios.post('/api/orders', {
            buyerId,
            freelancerId,
            gigId,
            gigTitle,
            amount,
            deliveryTime,
            status: 'Active',
            requirements: [{
              description: requirements,
              createdAt: new Date()
            }]
          });

          if (orderResponse.data) {
            setPaymentStatus('success');
            setTimeout(() => {
              navigate(`/orders/buyer/${buyerId}`);
            }, 2000)
           
          }
        } else {
          const orderResponse = await axios.post('/api/orders', {
            buyerId,
            freelancerId,
            gigId,
            gigTitle,
            amount,
            deliveryTime,
            status: 'Active'
          });

          if (orderResponse.data) {
            setPaymentStatus('success');
            setTimeout(() => {
              navigate(`/orders/buyer/${buyerId}`);
            }, 2000)
           
          }
        }
      

      
    } catch (err) {
      setError(err.message);
      setPaymentStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // addDebugLog(`Input changed: ${name} = ${value}`);
    
    // Format input based on field
    let formattedValue = value;
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\D/g, '').slice(0, 16);
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 3);
    } else if (name === 'expiryDate') {
      formattedValue = value
        .replace(/\D/g, '')
        .slice(0, 4)
        .replace(/(\d{2})(\d{2})/, '$1/$2')
        .slice(0, 5);
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };


  if (!buyerId || !freelancerId || !gigId || !amount) {
    return <div>Invalid payment details. Please try again.</div>;
  }

  const LoadingOverlay = () => (
    <div className="loading-overlay">
      <Loader2 className="animate-spin h-8 w-8" />
      <p>Processing your payment...</p>
    </div>
  );
  return (
    
    <div className="payment-container1">
      <Header />
      <h1>Payment Gateway</h1>
      {loading && <LoadingOverlay />}
      <div className="saved-cards">
        {Object.entries(VALID_CARDS).map(([cardNumber, cardData]) => (
          <div 
            key={cardNumber}
            className='card'
            // onClick={() => handleCardSelect(cardNumber)}
          >
            <div className="card-header">
              <h3>Credit Card</h3>
              <span className={`card-status ${cardData.valid ? 'valid' : 'invalid'}`}>
                {cardData.valid ? 'Active' : 'Invalid'}
              </span>
            </div>
            <div className="card-number">
              {formatCardNumber(cardNumber)}
            </div>
            <div className="card-footer">
              <div className="card-holder">
                <span className="label">Balance</span>
                <span className="value">${cardData.balance.toLocaleString()}</span>
              </div>
              <div className="card-expiry">
                <span className="label">Status</span>
                <span className="value">{cardData.valid ? 'Valid' : 'Expired'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

                  {error && (
          <Alert variant="destructive" className="alert error1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12" y2="16"/>
            </svg>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
          {response && (
            <Alert className="alert-success">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <AlertDescription>
                Payment Successful!<br />
                Transaction ID: {response.transactionId}<br />
                Amount: ${response.amount}
              </AlertDescription>
            </Alert>
          )}
                <form onSubmit={handleSubmit} className="payment-form">
        <div className="form-group">
          <label>Card Number</label>
          <div className="input-container">
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleInputChange}
              placeholder="5455 0563 6057 2880"
            />
            <button type="button" className="copy-button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Amount</label>
          <input
            type="number"
            name="amount"
            value={amount}
            disabled
            // onChange={handleInputChange}
            // placeholder="5999"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Valid Thru</label>
            <input
              type="text"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleInputChange}
              placeholder="21/24"
            />
          </div>
          <div className="form-group">
            <label>CVV</label>
            <div className="cvv-container">
              <input
                type="password"
                name="cvv"
                value={formData.cvv}
                onChange={handleInputChange}
                placeholder="XXX"
                maxLength="3"
              />
              <button type="button" className="help-button">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <button type="submit" className="save-button" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="spinner" />
              Processing...
            </>
          ) : 'Pay'}
        </button>
      </form>
    </div>
  );
};



export default PaymentGateway;