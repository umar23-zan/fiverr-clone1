// src/components/ui/Alert.js
import React from 'react';
import './Alert.css'; // Add CSS for styling

export const Alert = ({ children, variant }) => (
  <div className={`alert alert-${variant}`}>{children}</div>
);

export const AlertDescription = ({ children }) => <p>{children}</p>;
