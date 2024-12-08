import axios from 'axios';


export const signup = async (formData) => {
    const res = await axios.post('/api/auth/signup', formData);
    return res.data;
};

export const login = async (formData) => {
    const res = await axios.post('/api/auth/login', formData);
    return res.data;
};

export const forgotPassword = async (data) => {
  return await axios.post('/api/auth/forgot-password', data);
};

export const resetPassword = async (token, data) => {
  return await axios.post(`/api/auth/reset-password/${token}`, data);
};

export const getUserData = async (email) => {
  const res = await axios.get(`/api/auth/user/${email}`);
  return res.data;
};