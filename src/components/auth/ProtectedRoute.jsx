import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { checkPermission } from '../../utils/roleUtils';
import { auditLogger } from '../../services/auditLogger';

export default function ProtectedRoute({ children, allowedRoles, requires2FA = false }) {
  const { user, role, isAuthenticated, requires2FA: userRequires2FA } = useAuth();
  const location = useLocation();

  // Create a single source of redirection logic
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requires2FA && userRequires2FA) {
    // Prevent flooding by using replace
    return <Navigate to="/2fa-verify" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Use replace to prevent navigation stack buildup
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
