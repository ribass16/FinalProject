import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, userProfile, loading } = useAuth();

  if (loading) return null; // or a spinner

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Se requer admin e o usuário não é admin, redireciona para home
  if (adminOnly && userProfile?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
