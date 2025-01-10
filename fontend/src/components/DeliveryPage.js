import React, { useState } from 'react';
import { Clock, MessageSquare, Award, ThumbsUp, FileText, Upload, XCircle, Menu, Bell } from 'lucide-react';
import './DeliveryPage.css';
import Header from './Header'
import axios from 'axios';
import { useParams } from 'react-router-dom';

const DeliveryPage = () => {
  const {orderId} = useParams();
  const [files, setFiles] = useState([]);
  const [deliveryMessage, setDeliveryMessage] = useState('');
  const [isRevisionRequested, setIsRevisionRequested] = useState(false);
  const [revisionDetails, setRevisionDetails] = useState({
    message: "Client requested changes to the color scheme and layout spacing",
    requestedAt: "2024-01-05"
  });

  const handleFileUpload = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles([...files, ...newFiles]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleDeliverySubmit = async () => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    formData.append('deliveryMessage', deliveryMessage);
  
    try {
      const response = await axios.post(`/api/orders/${orderId}/deliver`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert(response.data.message);
    } catch (error) {
      console.error('Delivery Error:', error);
      alert('Failed to deliver the order.');
    }
  };

  return (
    <div className="seller-page">
      <Header />
      <div className="main-container2">
        <div className="page-header">
          <h1 className="page-title">Order #GIG84752 - Delivery</h1>
          <span className="status-badge">
            {isRevisionRequested ? 'Revision Requested' : 'In Progress'}
          </span>
        </div>

        {isRevisionRequested && (
          <div className="revision-alert">
            <h2 className="section-title">Revision Request</h2>
            <p>{revisionDetails.message}</p>
            <p className="upload-text">Requested on: {revisionDetails.requestedAt}</p>
          </div>
        )}

        <div className="grid-container">
          <div>
            <div className="section">
              <h2 className="section-title">Upload Delivery Files</h2>
              
              <div className="upload-area">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Upload size={48} />
                  <div className="upload-text">Click to upload files</div>
                  <div className="upload-text">or drag and drop</div>
                </label>
              </div>

              <div className="file-list">
                {files.map((file, index) => (
                  <div key={index} className="file-item">
                    <div className="file-info">
                      <FileText size={20} />
                      <span>{file.name}</span>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="remove-button"
                    >
                      <XCircle size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="section">
              <h2 className="section-title">Delivery Message</h2>
              <textarea
                className="textarea"
                placeholder="Add a message to your buyer about the delivery..."
                value={deliveryMessage}
                onChange={(e) => setDeliveryMessage(e.target.value)}
              />
            </div>
          </div>

          <div>
            <div className="section">
              <h2 className="section-title">Order Requirements</h2>
              <div className="requirements-section">
                <h3 className="section-title">Project Brief</h3>
                <p>Website redesign for a local restaurant with modern aesthetic and mobile-first approach.</p>
                
                <h3 className="section-title">Specific Requirements</h3>
                <ul className="requirements-list">
                  <li>Responsive design for all devices</li>
                  <li>Brand color scheme implementation</li>
                  <li>Interactive menu section</li>
                  <li>Contact form integration</li>
                </ul>
              </div>
            </div>

            <div className="button-container">
              <button className="primary-button" onClick={handleDeliverySubmit}>
                Send Delivery
              </button>
              <button className="secondary-button">
                Save Draft
              </button>
            </div>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <Clock className="stat-icon" size={24} />
            <div className="stat-value">2 day early</div>
            <div className="stat-label">Delivery Time</div>
          </div>
          <div className="stat-card">
            <MessageSquare className="stat-icon" size={24} />
            <div className="stat-value">12 messages</div>
            <div className="stat-label">Messages</div>
          </div>
          <div className="stat-card">
            <Award className="stat-icon" size={24} />
            <div className="stat-value">0 of 3 used</div>
            <div className="stat-label">Revisions</div>
          </div>
          <div className="stat-card">
            <ThumbsUp className="stat-icon" size={24} />
            <div className="stat-value">4.9 (843 reviews)</div>
            <div className="stat-label">Seller Rating</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryPage;