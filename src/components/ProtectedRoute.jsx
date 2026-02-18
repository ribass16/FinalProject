import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/authContextObject';

const ProtectedRoute = ({ children }) => {
  const { user, loading, userProfile } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If accessing admin routes, require role === 'admin'
  if (location.pathname.startsWith('/admin')) {
    if (!userProfile || userProfile.role !== 'admin') {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
