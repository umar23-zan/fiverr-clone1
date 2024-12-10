import axios from 'axios';

const API_URL = '/api/gigs';

export const getAllGigs = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Get gigs by user ID
export const getUserGigs = async (freelancerId) => {
  const response = await axios.get(`/api/gigs/user/${freelancerId}`);
  return response.data;
};


export const createGig = async (gigData) => {
  const response = await axios.post(API_URL, gigData);
  return response.data;
};

export const getGigs = async () => {
  const res = await fetch("/api/gigs/freelancer/123"); // Example freelancerId
  return res.json();
};

// export const createGig = async (gig) => {
//   const res = await fetch("/api/gigs", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(gig),
//   });
//   return res.json();
// };

export const deleteGig = async (id) => {
  await fetch(`/api/gigs/${id}`, { method: "DELETE" });
};

