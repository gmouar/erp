import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ManufacturingDashboard from '../components/manufacturing/ManufacturingDashboard';
import ProductionPlanning from '../components/manufacturing/production/ProductionPlanning';
import InventoryManagement from '../components/manufacturing/inventory/InventoryManagement';
import QualityControl from '../components/manufacturing/quality/QualityControl';
import MaintenanceManagement from '../components/manufacturing/maintenance/MaintenanceManagement';

const ManufacturingRoutes = () => {
  const { user, isAuthenticated } = useAuth();

  // Check if user has Manufacturing access
  const hasAccess = () => {
    if (!isAuthenticated || !user) return false;
    return ['Manufacturing Manager', 'Production Supervisor', 'Superuser'].includes(user.role);
  };

  if (!hasAccess()) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Routes>
      {/* Manufacturing Dashboard */}
      <Route path="/" element={<ManufacturingDashboard />} />

      {/* Production Planning */}
      <Route path="/production" element={<ProductionPlanning />} />

      {/* Inventory Management */}
      <Route path="/inventory" element={<InventoryManagement />} />

      {/* Quality Control */}
      <Route path="/quality" element={<QualityControl />} />

      {/* Maintenance Management */}
      <Route path="/maintenance" element={<MaintenanceManagement />} />

      {/* Redirect any unmatched routes to Manufacturing Dashboard */}
      <Route path="*" element={<Navigate to="/manufacturing" replace />} />
    </Routes>
  );
};

export default ManufacturingRoutes;
