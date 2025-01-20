// OrderDetails.jsx
import React, {useState, useEffect} from 'react';
import { Clock, MessageSquare, Calendar } from 'lucide-react';
import './OrderDetails.css';
import account from '../images/account-icon.svg'
import close from '../images/close.svg'
import HeaderBuy from './HeaderBuy';
import MiniMessaging from './MiniMessaging';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const OrderDetails = () => {
  const {orderId} = useParams();
  console.log(orderId)
  const [orderDetails, setOrderDetails]=useState([])
  const navigate= useNavigate();
  const [isRequirements, setIsRequirements] = useState(false)
  const [description, setDescription] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const addDays = (date, days) => {
    const parsedDate = new Date(date);
    parsedDate.setDate(parsedDate.getDate() + days);
    return parsedDate;
  };
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const steps = ['Order Placed', 'In Progress', 'Review', 'Complete'];

 useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      const response = await axios.get(`/api/orders/${orderId}`);
      setOrderDetails(response.data);
      console.log('Order Details:', response.data);
    } catch (error) {
      console.error('Error fetching order details:', error);
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };
  const handleAddRequirement = async () => {
    try {
      if (!description.trim()) {
        setError('Description is required');
        return;
      }

      const response = await axios.post(`/api/orders/${orderId}/requirements`, { description });
      setIsRequirements(false)
      setDescription(''); 
      fetchOrderDetails();
      setError(null);
      
    } catch (err) {
      console.error('Error adding requirement:', err);
      setError('Failed to add requirement');
    }
  };


  return (
    <div>
      <HeaderBuy />
      <div className="order-container1">
      <div className="order-progress1">
        <div className="order-header1">
          <span className="order-number1">Order {orderDetails._id}</span>
          <span className="status-badge1">{orderDetails.status}</span>
        </div>
        
        <div className="progress-tracker1">
          <div className="progress-line1"></div>
          {steps.map((step, index) => (
            <div key={step} className="progress-step1">
              <div className={`step-circle1 ${index <= 1 ? 'step-active1' : 'step-inactive1'}`}>
                {index + 1}
              </div>
              <span className="step-label1">{step}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="main-content1">
        <div className="left-column1">
          <div className="order-details1">
            <h3 className="section-title1">Order Details</h3>
            <div className='section-details1'>
            <div className="placeholder-image1">
        {orderDetails?.gigId?.images ? (
          <img src={orderDetails.gigId.images} alt="gig-image" />
        ) : (
          <p>Loading image...</p>
        )}
      </div>
              <div>
              <h4 className="package-title1">{orderDetails.gigTitle}</h4>
              <p className="package-subtitle1">Basic Package - One page design</p>
              </div>
              
            </div>
            
            
            <div className="features-list1">
              <h4 className="section-title1" style={{
                textAlign: "left"
              }}>Package Features</h4>
              <div className="features-grid1">
                {['Source file', 'Responsive design', '3 revisions', 'Commercial use'].map(feature => (
                  <div key={feature} className="feature-item1">
                    <span className="check-icon1">✓</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="order-requirements1">
            <h3 className="section-title1" style={{
                textAlign: "left"
              }}>Requirements</h3>
            <div className="requirements1">
               {Array.isArray(orderDetails.requirements) && orderDetails.requirements.length > 0 ? (
               orderDetails.requirements.map((req, index) => (
                  <div key={index} className="requirement-item">
                    <ul>
                      <li>{req.description}</li>
                    </ul>
                  </div>
                ))
              ): (<p>No requirements found.</p>)}
              {!isRequirements ? (
                
              <div>
                <button className='add-button1'
                onClick={()=> {setIsRequirements(true)}}
              >Add Requirements</button>
              <div></div>
              </div>
              ): (<div className='requirements-input1' >
                
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter requirement description"
                  rows="3"
                />
                <button style={{
                  backgroundColor: "#1a237e",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={handleAddRequirement}
                >Submit</button>
                {error && <div className="error">{error}</div>}
              </div>)}
              
            </div>
          </div>
          <div className='order-review1'>
            <h3 className='section-title1' style={{
                textAlign: "left"
              }}>Review</h3>
            {orderDetails.deliveries && orderDetails.deliveries.length > 0 ? (
            <button 
              className='add-button1'  
              style={{
                backgroundColor: "#1a237e",
                color: "white",
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
              }}
              onClick={() => { navigate(`/orderreview/${orderId}`, { state: { orderDetails } }) }}
            >
              Visit Review Page
            </button>
          ) : (
            <p style={{ color: "gray", fontStyle: "italic" }}>Order Not Delivered for Review</p>
          )}
        </div>
        </div>
        

        <div className="sidebar1">
          <div className="summary-box1">
            <h3 className="section-title1">Order Summary</h3>
            <div className="summary-row1">
              <span>Subtotal</span>
              <span>₹{orderDetails.amount}</span>
            </div>
            <div className="summary-row1">
              <span>Service Fee</span>
              <span>₹{(orderDetails.amount/10).toFixed(2)}</span>
            </div>
            <div className="summary-row1 summary-total1">
              <span>Total</span>
              <span>₹{(orderDetails.amount +parseFloat((orderDetails.amount/10).toFixed(2))).toFixed(2)}</span>
            </div>
          </div>

          <div className="summary-box1">
            <h3 className="section-title1">Timeline</h3>
            <div className="timeline-item1">
              <Clock className="timeline-icon1" size={20} />
              <div className="timeline-content1">
                <div className="timeline-label1">Delivery Time</div>
                <div className="timeline-value1">{orderDetails?.gigId?.deliveryTime 
          ? `${orderDetails.gigId.deliveryTime} days remaining` 
          : 'Loading...'}</div>
              </div>
            </div>
            <div className="timeline-item1">
              <Calendar className="timeline-icon1" size={20} />
              <div className="timeline-content1">
                <div className="timeline-label1">Start Date</div>
                <div className="timeline-value1">{formatDate (orderDetails.createdAt)}</div>
              </div>
            </div>
            <div className="timeline-item1">
              <Calendar className="timeline-icon1" size={20} />
              <div className="timeline-content1">
                <div className="timeline-label1">Due Date</div>
                <div className="timeline-value1">{orderDetails?.gigId?.deliveryTime && orderDetails?.createdAt ? formatDate(addDays   (orderDetails.createdAt, orderDetails.gigId.deliveryTime))
                 : 'Loading...'}</div>
              </div>
            </div>
          </div>
          <div className="summary-box1">
            <h3 className="section-title1">Message</h3>
            <p>Want to Discuss click the button below to chat</p>
            {/* <button className="add-button1">Message me</button> */}
            {!showChat ? (
          <button className="add-button1" onClick={() => setShowChat(true)}>Chat Now</button>
        ):(
          <div className="chat-window">
          <div className="chat-header">
            <div className="chat-header-info">
              <img
                src={account}
                alt={orderDetails.freelancerId.name}
                className="chat-header-avatar"
              />
              <div className="chat-header-text">
                <span className="chat-header-name">{orderDetails.freelancerId.name}</span>
                <span className="chat-header-status">Away</span>
              </div>
            </div>
            <button 
              className="close-button"
              onClick={() => setShowChat(false)}
              aria-label="Close chat"
            >
              <img src={close} alt="close" className="close-icon" />
            </button>
          </div>
          <div className="chat-body">
            <MiniMessaging
              isMiniChat={true}
              receiverId={orderDetails.freelancerId._id}
              senderId={orderDetails.buyerId._id}
            />
          </div>
        </div>

        )}
          </div>

          <div className="summary-box1">
            <h3 className="section-title1">Need Help?</h3>
            <p>Contact our support team for any questions about your order.</p>
            <button className="support-button1">Contact Support</button>
          </div>
        </div>
 
      </div>
    </div>
    </div>
    
  );
};

export default OrderDetails;