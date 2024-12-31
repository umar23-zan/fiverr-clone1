import axios from 'axios';

const API_URL = '/api/gigs';

// export const getAllGigs = async () => {
//   const response = await axios.get(API_URL);
//   return response.data;
// };
export const getAllGigs = async (tags) => {
  try {
    const params = tags ? { params: { tags: tags.join(',') } } : {};
    const response = await axios.get('/api/gigs', params);
    if (response.status !== 200) {
      throw new Error('Failed to fetch gigs');
    }
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(error.response?.data?.message || 'An unexpected error occurred');
  }
};
export const getGigsByCategory = async (category) => {
  try {
    const response = await axios.get(`${API_URL}?category=${encodeURIComponent(category)}`);
    if (response.status !== 200) {
      throw new Error('Failed to fetch gigs by category');
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching gigs by category:', error);
    throw new Error(error.response?.data?.message || 'An unexpected error occurred');
  }
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

// Get gig details by ID
export const getGigDetails = async (id) => {
  try {
    const response = await axios.get(`/api/gigs/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching gig details:', error);
    throw new Error('Failed to fetch gig details');
  }
};

// Delete a gig by ID
export const deleteGig = async (id) => {
  try {
    await axios.delete(`/api/gigs/${id}`);
  } catch (error) {
    console.error('Error deleting gig:', error);
    throw new Error('Failed to delete gig');
  }
};

export const getCategoryPreviews = async () => {
  try {
    const response = await fetch('/api/gigs/category-preview');
    if (!response.ok) {
      throw new Error('Failed to fetch category previews');
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// export const deleteGig = async (id) => {
//   await fetch(`/api/gigs/${id}`, { method: "DELETE" });
// };

// Get all unique tags
export const getAllTags = async () => {
  try {
    const response = await axios.get(`${API_URL}/tags`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw new Error('Failed to fetch tags');
  }
};

// Get tags for a specific category
export const getCategoryTags = async (category) => {
  try {
    const response = await axios.get(`${API_URL}/category/${encodeURIComponent(category)}/tags`);
    return response.data;
  } catch (error) {
    console.error('Error fetching category tags:', error);
    throw new Error('Failed to fetch category tags');
  }
};
// Search gigs by tags
export const searchGigsByTags = async (tags) => {
  try {
    const response = await axios.get(`${API_URL}/search/tags`, {
      params: { tags: tags.join(',') }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching gigs by tags:', error);
    throw new Error('Failed to search gigs by tags');
  }
};