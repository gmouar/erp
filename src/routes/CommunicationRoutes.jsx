import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CommunicationDashboard from '../components/communication/CommunicationDashboard';
import { useAuth } from '../context/AuthContext';

const CommunicationRoutes = () => {
  const { user, isAuthenticated } = useAuth();

  // Check if user has access to communication features
  const hasAccess = () => {
    if (!isAuthenticated || !user) return false;
    
    // Add role-based access control
    const allowedRoles = ['admin', 'hr', 'manager', 'employee'];
    return allowedRoles.includes(user.role);
  };

  if (!hasAccess()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<CommunicationDashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default CommunicationRoutes;
