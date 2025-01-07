// OrderDetails.jsx
import React, {useState, useEffect} from 'react';
import { Clock, MessageSquare, Calendar } from 'lucide-react';
import './OrderDetails.css';
import HeaderBuy from './HeaderBuy';
import { useNavigate } from 'react-router-dom';

const OrderDetails = () => {
  const navigate= useNavigate();
  const [isRequirements, setIsRequirements] = useState(false)
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const steps = ['Order Placed', 'In Progress', 'Review', 'Complete'];


  return (
    <div>
      <HeaderBuy />
      <div className="order-container1">
      <div className="order-progress1">
        <div className="order-header1">
          <span className="order-number1">Order #GIG84752</span>
          <span className="status-badge1">Active</span>
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
              <div className="placeholder-image1"></div>
              <div>
              <h4 className="package-title1">I will design modern UI/UX for your application</h4>
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
              {!isRequirements ? (
                
              <div>
                <button className='add-button1'
                onClick={()=> {setIsRequirements(true)}}
              >Add Requirements</button>
              <div></div>
              </div>
              ): (<div className='requirements-input1' >
                
                <textarea placeholder='Add your requirements here'></textarea>
                <button style={{
                  backgroundColor: "#1a237e",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={()=> {setIsRequirements(false)}}
                >Submit</button>
              </div>)}
              
            </div>
          </div>
          <div className='order-review1'>
            <h3 className='section-title1' style={{
                textAlign: "left"
              }}>Review</h3>
            <button className='add-button1'  style={{
                  backgroundColor: "#1a237e",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={()=>{navigate('/orderreview')}}>Visit Review Page</button>
        </div>
        </div>
        

        <div className="sidebar1">
          <div className="summary-box1">
            <h3 className="section-title1">Order Summary</h3>
            <div className="summary-row1">
              <span>Subtotal</span>
              <span>$99.00</span>
            </div>
            <div className="summary-row1">
              <span>Service Fee</span>
              <span>$9.90</span>
            </div>
            <div className="summary-row1 summary-total1">
              <span>Total</span>
              <span>$108.90</span>
            </div>
          </div>

          <div className="summary-box1">
            <h3 className="section-title1">Timeline</h3>
            <div className="timeline-item1">
              <Clock className="timeline-icon1" size={20} />
              <div className="timeline-content1">
                <div className="timeline-label1">Delivery Time</div>
                <div className="timeline-value1">3 days remaining</div>
              </div>
            </div>
            <div className="timeline-item1">
              <Calendar className="timeline-icon1" size={20} />
              <div className="timeline-content1">
                <div className="timeline-label1">Start Date</div>
                <div className="timeline-value1">{formatDate('2025-01-15')}</div>
              </div>
            </div>
            <div className="timeline-item1">
              <Calendar className="timeline-icon1" size={20} />
              <div className="timeline-content1">
                <div className="timeline-label1">Due Date</div>
                <div className="timeline-value1">{formatDate('2025-01-18')}</div>
              </div>
            </div>
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