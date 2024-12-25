import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { checkPermission } from '../../utils/roleUtils';
import { auditLogger } from '../../services/auditLogger';

export default function ProtectedRoute({ children, allowedRoles, requires2FA = false }) {
  const { user, role, isAuthenticated, requires2FA: userRequires2FA } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login and save the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user needs to complete 2FA setup/verification
  if (requires2FA && userRequires2FA) {
    return <Navigate to="/2fa-verify" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (allowedRoles && !allowedRoles.includes(role)) {
    auditLogger.unauthorized(user.id, `Attempted to access ${location.pathname}`);
    return <Navigate to="/unauthorized" replace />;
  }

  // Check specific permissions if defined on the route
  const requiredPermissions = location.state?.requiredPermissions;
  if (requiredPermissions) {
    const hasPermission = requiredPermissions.every(
      permission => checkPermission(role, permission)
    );
    if (!hasPermission) {
      auditLogger.unauthorized(user.id, `Permission denied for ${location.pathname}`);
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
}
