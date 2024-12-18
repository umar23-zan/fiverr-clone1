import React, { useState, useEffect } from 'react';
import { getUserGigs, createGig } from '../api/gigApi';
import GigCard from './GigCard';
import axios from 'axios';
import './Gigs.css';

const Gigs = () => {
  const [gigs, setGigs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const userid = localStorage.getItem('userId');
  const [imageFile, setImageFile] = useState(null);

  const [newGig, setNewGig] = useState({
    freelancerId: userid,
    title: '',
    description: '',
    price: '',
    deliveryTime: '',
    category: '',
    images: [],
  });

  useEffect(() => {
    fetchUserGigs();
  }, []);

  const fetchUserGigs = async () => {
    try {
      setLoading(true);
      const gigs = await getUserGigs(userid);
      setGigs(gigs);
      setError(null);
    } catch (err) {
      setError('Failed to fetch gigs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGig({ ...newGig, [name]: value });

    // Remove error for the current field when the user starts typing
    setFormErrors({ ...formErrors, [name]: '' });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && !file.type.startsWith('image/')) {
      setFormErrors({ ...formErrors, imageFile: 'Invalid file type. Please upload an image.' });
      return;
    }
    setImageFile(file);
    setFormErrors({ ...formErrors, imageFile: '' });
  };

  const validateForm = () => {
    const errors = {};
    if (!newGig.title.trim()) errors.title = 'Title is required.';
    if (!newGig.category.trim()) errors.category = 'Category is required.';
    if (!newGig.description.trim()) errors.description = 'Description is required.';
    if (newGig.description.trim().split(/\s+/).length > 25)
      errors.description = 'Description cannot exceed 25 words.';
    if (!newGig.price || isNaN(newGig.price) || newGig.price <= 0)
      errors.price = 'Price must be a positive number.';
    if (!newGig.deliveryTime || isNaN(newGig.deliveryTime) || newGig.deliveryTime <= 0)
      errors.deliveryTime = 'Delivery time must be a positive number.';
    if (!imageFile) errors.imageFile = 'Please upload an image for the gig.';
    return errors;
  };

  const uploadImage = async () => {
    if (!imageFile) return null;

    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const response = await axios.post('/api/gigs/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.filePath;
    } catch (error) {
      setError('Image upload failed. Please try again.');
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const uploadedImagePath = await uploadImage();
      if (!uploadedImagePath) throw new Error('Image upload failed.');

      const gigData = {
        ...newGig,
        images: [uploadedImagePath],
      };

      await createGig(gigData);
      fetchUserGigs();
      setShowForm(false);
      setNewGig({
        freelancerId: userid,
        title: '',
        description: '',
        price: '',
        deliveryTime: '',
        category: '',
        images: [],
      });
      setImageFile(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create gig. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='main-division1'>
      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading-message">Loading...</div>}
      {showForm ? (
        <form className='create-gig-form' onSubmit={handleSubmit}>
          <h1>Create Gig</h1>
          <div className='gigform-sections'>
            <label>Gig Title</label>
            <input
              type="text"
              name="title"
              placeholder="Title"
              onChange={handleInputChange}
              value={newGig.title}
            />
            {formErrors.title && <div className="form-error">{formErrors.title}</div>}
          </div>
          <div className='gigform-sections'>
            <label>Category</label>
            <select name="category" onChange={handleInputChange} value={newGig.category}>
              <option value="" disabled>Select a category</option>
              <option value="Graphics & Design">Graphics & Design</option>
              <option value="Programming & Tech">Programming & Tech</option>
              <option value="Digital Marketing">Digital Marketing</option>
              <option value="Video & Animation">Video & Animation</option>
              <option value="Writing & Translation">Writing & Translation</option>
              <option value="Music & Audio">Music & Audio</option>
              <option value="Business">Business</option>
              <option value="Finance">Finance</option>
              <option value="AI Services">AI Services</option>
            </select>
            {formErrors.category && <div className="form-error">{formErrors.category}</div>}
          </div>
          <div className='gigform-sections'>
            <label>Description</label>
            <textarea
              name="description"
              placeholder="Description (Max 25 words)"
              onChange={handleInputChange}
              value={newGig.description}
            ></textarea>
            <p>{newGig.description.trim().split(/\s+/).length} / 25 words</p>
            {formErrors.description && <div className="form-error">{formErrors.description}</div>}
          </div>
          <div className='gigform-sections'>
            <label>Price</label>
            <input
              type="number"
              name="price"
              placeholder="Price"
              onChange={handleInputChange}
              value={newGig.price}
            />
            {formErrors.price && <div className="form-error">{formErrors.price}</div>}
          </div>
          <div className='gigform-sections'>
            <label>Delivery Time</label>
            <input
              type="number"
              name="deliveryTime"
              placeholder="Delivery Time (in days)"
              onChange={handleInputChange}
              value={newGig.deliveryTime}
            />
            {formErrors.deliveryTime && <div className="form-error">{formErrors.deliveryTime}</div>}
          </div>
          <div className='gigform-sections'>
            <label>Upload Image</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {formErrors.imageFile && <div className="form-error">{formErrors.imageFile}</div>}
          </div>
          <div className='gigform-actions'>
            <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
            <button type="submit" disabled={loading}>Publish Gig</button>
          </div>
        </form>
      ) : (
        <div>
          <div className='CreateGig-section'>
            <h1>Freelance services at your fingertips</h1>
            <button onClick={() => setShowForm(true)}>Create Gig</button>
          </div>
          <h1>Gigs</h1>
          <div className="gig-container">
            {gigs.length > 0 ? (
              gigs.map((gig) => <GigCard key={gig._id} gig={gig} />)
            ) : (
              <p>No gigs found. Create one!</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Gigs;
