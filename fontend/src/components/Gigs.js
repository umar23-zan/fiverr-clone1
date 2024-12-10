import React, { useState, useEffect } from 'react';
import { getUserGigs, createGig } from '../api/gigApi';
import GigCard from './GigCard';
import axios from 'axios';

const Gigs = () => {
  const [gigs, setGigs] = useState([]);
  const [showForm, setShowForm] = useState(false);
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

  // const fetchGigs = async () => {
  //   const gigs = await getAllGigs();
  //   setGigs(gigs);
  // };
  const fetchUserGigs = async () => {
    const userId = userid; // Replace 'USER_ID' with the logged-in user's ID
    const gigs = await getUserGigs(userId);
    setGigs(gigs);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGig({ ...newGig, [name]: value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const uploadImage = async () => {
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const response = await axios.post('/api/gigs/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.filePath; // Returns the uploaded image path
    } catch (error) {
      console.error('Image upload failed', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let uploadedImagePath = '';
    if (imageFile) {
      uploadedImagePath = await uploadImage();
    }

    const gigData = {
      ...newGig,
      images: uploadedImagePath ? [uploadedImagePath] : [],
    };

    await createGig(gigData);
    fetchUserGigs();
    setShowForm(false);
  };

  return (
    <div>
      <h1>Gigs</h1>
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : 'Create Gig'}
      </button>
      
      {showForm && (
        <form onSubmit={handleSubmit}>
          <input type="text" name="title" placeholder="Title" onChange={handleInputChange} />
          <textarea name="description" placeholder="Description" onChange={handleInputChange}></textarea>
          <input type="number" name="price" placeholder="Price" onChange={handleInputChange} />
          <input type="number" name="deliveryTime" placeholder="Delivery Time (in days)" onChange={handleInputChange} />
          <input type="text" name="category" placeholder="Category" onChange={handleInputChange} />
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <button type="submit">Create Gig</button>
        </form>
      )}

      <div className="gig-container">
        {gigs.map((gig) => (
          <GigCard key={gig._id} gig={gig} />
        ))}
      </div>
    </div>
  );
};

export default Gigs;
