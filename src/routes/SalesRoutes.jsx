import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SalesDashboard from '../components/sales/SalesDashboard'; // Corrected path
import LeadManagement from '../components/sales/leads/LeadManagement';
import SalesPipeline from '../components/sales/pipeline/SalesPipeline';
import QuoteManagement from '../components/sales/quotes/QuoteManagement';

const SalesRoutes = () => {
  return (
    <Routes>
      <Route index element={<SalesDashboard />} />
      <Route path="leads/*" element={<LeadManagement />} />
      <Route path="pipeline" element={<SalesPipeline />} />
      <Route path="quotes/*" element={<QuoteManagement />} />
    </Routes>
  );
};

export default SalesRoutes;
