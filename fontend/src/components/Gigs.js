import React, { useState, useEffect } from 'react';
import { getAllGigs, createGig } from '../api/gigApi';
import GigCard from './GigCard';

const Gigs = () => {
  const [gigs, setGigs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const userId = localStorage.getItem('userId');
  const [newGig, setNewGig] = useState({
    freelancerId: userId, 
    title: '',
    description: '',
    price: 0,
    deliveryTime: 0,
    category: '',
    images: [],
  });

  useEffect(() => {
    fetchGigs();
  }, []);

  const fetchGigs = async () => {
    const gigs = await getAllGigs();
    setGigs(gigs);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGig({ ...newGig, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createGig(newGig);
    fetchGigs();
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
          <input type="text" name="images" placeholder="Image URL" onChange={(e) => handleInputChange(e)} />
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
