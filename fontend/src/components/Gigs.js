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
  const userid = localStorage.getItem('userId');
  const [imageFile, setImageFile] = useState(null);

  const [newGig, setNewGig] = useState({
    freelancerId: userid,
    title: '',
    description: '',
    price: 0,
    deliveryTime: 0,
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
    if (name === "description") {
      const wordCount = value.trim().split(/\s+/).length;
      if (wordCount > 25) {
        setError("Description cannot exceed 25 words.");
        return;
      } else {
        setError(null);
      }
    }
  
    setNewGig({ ...newGig, [name]: value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const uploadImage = async () => {
    if (!imageFile) return null;

    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const response = await axios.post('/api/gigs/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.filePath; // Returns the uploaded image path
    } catch (error) {
      setError('Image upload failed. Please check the file and try again.');
      console.error(error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let uploadedImagePath = '';
      if (imageFile) {
        uploadedImagePath = await uploadImage();
        if (!uploadedImagePath) throw new Error('Image upload failed.');
      }

      const gigData = {
        ...newGig,
        images: uploadedImagePath ? [uploadedImagePath] : [],
      };

      await createGig(gigData);
      setError(null);
      fetchUserGigs();
      setShowForm(false);
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
            <div className='gigform-label'><p> <strong>Gig Title</strong></p></div>
            <input type="text" name="title" placeholder="Title" onChange={handleInputChange} />
          </div>
          <div className='gigform-sections'>
            <div className='gigform-label'><p><strong>Category</strong></p></div>
            
            {/* <input type="text" name="category" placeholder="Category" onChange={handleInputChange} /> */}
            <select
                name="category"
                onChange={handleInputChange}
                value={newGig.category} // To bind the selected value
                required
                style={{padding: "5px", borderRadius: "4px", border: "1px solid #ccc" }}
              >
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
          </div>
          {/* <div className='gigform-sections'>
            <div className='gigform-label'><p><strong>Description</strong></p></div>
            
            <textarea name="description" placeholder="Description" onChange={handleInputChange}></textarea>
          </div> */}
          <div className='gigform-sections'>
            <div className='gigform-label'><p><strong>Description</strong></p></div>
            <div>
              <textarea
                name="description"
                placeholder="Description (Max 25 words)"
                onChange={handleInputChange}
                value={newGig.description}
              ></textarea>
              <p style={{ fontSize: "12px", color: "gray", textAlign:"right", margin: "0px"}}>
                {newGig.description.trim().split(/\s+/).length} / 25 words
              </p>
            </div>
            
          </div>

          <div className='gigform-sections'>
            <div className='gigform-label'><p><strong>Price</strong></p></div>
            
            <input type="number" name="price" placeholder="Price" onChange={handleInputChange} />
          </div>
          <div className='gigform-sections'>
            <div className='gigform-label'><p><strong>Delivery Time</strong></p></div>
            
            <input type="number" name="deliveryTime" placeholder="Delivery Time (in days)" onChange={handleInputChange} />
          </div>
          <div className='gigform-sections'>
            <div className='gigform-label'><p><strong>Upload Image</strong></p></div>
            
            <input type="file" accept="image/*" onChange={handleFileChange} />
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
