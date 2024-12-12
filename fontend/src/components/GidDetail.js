// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { getGigDetails } from '../api/gigApi';
// import axios from 'axios';

// const GidDetail = () => {
//   const { id } = useParams();
//   console.log(id)
//   const [gig, setGig] = useState(null);
//   const [owner, setOwner] = useState(null);

//   useEffect(() => {
//     fetchGigDetails();
//   }, []);

//   const fetchGigDetails = async () => {
//     try {
//       // Fetch gig details
//       const gigData = await getGigDetails(id);
//       setGig(gigData);

//       // Fetch owner details
//       const ownerResponse = await axios.get(`/api/users/${gigData.data.freelancerId}`);
//       console.log(ownerResponse.data)
//       setOwner(ownerResponse.data);
//     } catch (error) {
//       console.error('Error fetching gig details:', error);
//     }
//   };
//   console.log(gig)
//   // if (!gig || !owner) return <p>Loading...</p>;

//   return (
//     <div className="gig-detail">
//       <h1>{gig.title}</h1>
//       <img src={gig.images[0]} alt={gig.title} />
//       <p><strong>Category:</strong> {gig.category}</p>
//       <p><strong>Description:</strong> {gig.description}</p>
//       <p><strong>Price:</strong> ${gig.price}</p>
//       <p><strong>Delivery Time:</strong> {gig.deliveryTime} days</p>

//       <h2>About the Freelancer</h2>
//       <p><strong>Name:</strong> {owner.name}</p>
//       <p><strong>Email:</strong> {owner.email}</p>
//     </div>
//   )
// }

// export default GidDetail

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const GidDetail = () => {
  const { id } = useParams();
  const [gig, setGig] = useState(null);
  const [owner, setOwner] = useState(null);

  useEffect(() => {
    fetchGigDetails();
  }, []);

  const fetchGigDetails = async () => {
    try {
      // Fetch gig details
      const gigData = await axios.get(`/api/gigs/${id}`);
      console.log(gigData.data)
      setGig(gigData.data);

      // Fetch owner details
      const ownerResponse = await axios.get(`/api/auth/user/${gigData.data.freelancerId.email}`);
      setOwner(ownerResponse.data);
    } catch (error) {
      console.error('Error fetching gig details:', error);
    }
  };

  if (!gig || !owner) return <p>Loading...</p>;

  return (
    <div className="gig-detail">
      <h1>{gig.title}</h1>
      <img src={`http://your-server-url${gig.images[0]}`} alt={gig.title} />
      <p><strong>Category:</strong> {gig.category}</p>
      <p><strong>Description:</strong> {gig.description}</p>
      <p><strong>Price:</strong> ${gig.price}</p>
      <p><strong>Delivery Time:</strong> {gig.deliveryTime} days</p>

      <h2>About the Freelancer</h2>
      <p><strong>Name:</strong> {owner.name}</p>
      <p><strong>Email:</strong> {owner.email}</p>
    </div>
  );
};

export default GidDetail;
