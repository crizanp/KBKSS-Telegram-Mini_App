import React from 'react';
import { Navigate } from 'react-router-dom';
import { usePoints } from '../context/PointsContext';

const ProtectedRoute = ({ children }) => {
  const { userID } = usePoints();
  const isLocalhost = window.location.hostname === 'localhost';

  // If userID is not set and not on localhost, redirect to LoadingPage
  if (!userID && !isLocalhost) {
    return <Navigate to="/" />;
  }

  // If userID is set or running on localhost, allow access to the page
  return children;
};

export default ProtectedRoute;
