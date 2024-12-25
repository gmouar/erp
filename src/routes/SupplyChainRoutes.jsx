import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SupplyChainDashboard from '../components/supply-chain/SupplyChainDashboard'; // Updated path
import ProcurementManagement from '../components/supply-chain/procurement/ProcurementManagement';
import InventoryManagement from '../components/supply-chain/inventory/InventoryManagement';
import VendorManagement from '../components/supply-chain/VendorManagement';
import ShipmentTracking from '../components/supply-chain/shipping/ShipmentTracking';

const SupplyChainRoutes = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route index element={<SupplyChainDashboard />} />
      <Route path="procurement/*" element={<ProcurementManagement />} />
      <Route path="inventory/*" element={<InventoryManagement />} />
      <Route path="vendors/*" element={<VendorManagement />} />
      <Route path="shipments/*" element={<ShipmentTracking />} />
    </Routes>
  );
};

export default SupplyChainRoutes;
