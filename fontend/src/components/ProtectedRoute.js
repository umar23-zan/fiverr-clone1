import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // Check if user is authenticated
  const isAuthenticated = localStorage.getItem("userEmail"); // Replace with your actual auth logic

  return isAuthenticated ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
