import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/auth/Login';
import Registration from './components/auth/Registration';
import RoleAssignment from './components/auth/RoleAssignment';
import TwoFactorSetup from './components/auth/TwoFactorSetup';
import TwoFactorVerification from './components/auth/TwoFactorVerification';
import Dashboard from './components/Dashboard';
import HRRoutes from './routes/HRRoutes';
import FinanceRoutes from './routes/FinanceRoutes';
import './App.css';
import AuthProvider from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ManufacturingRoutes from './routes/ManufacturingRoutes';
import SalesRoutes from './routes/SalesRoutes';
import SupplyChainRoutes from './routes/SupplyChainRoutes';
import CommunicationRoutes from './routes/CommunicationRoutes';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Router future flags configuration
const routerConfig = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <AuthProvider>
        <Router {...routerConfig}>
          <div className="app-container">
            <Routes>
              {/* Public Routes */}
              <Route path="/register" element={<Registration />} />
              <Route path="/login" element={<Login />} />
              <Route path="/2fa-verify" element={<TwoFactorVerification />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/2fa-setup" element={
                <ProtectedRoute requires2FA={true}>
                  <TwoFactorSetup />
                </ProtectedRoute>
              } />

              <Route path="/hr/*" element={
                <ProtectedRoute 
                  allowedRoles={['HR', 'Superuser']}
                  requires2FA={true}
                >
                  <HRRoutes />
                </ProtectedRoute>
              } />

              {/* Additional module routes with appropriate role restrictions */}
              <Route path="/role-assignment" element={
                <ProtectedRoute allowedRoles={['HR', 'Superuser']}>
                  <RoleAssignment />
                </ProtectedRoute>
              } />
              
              <Route path="/finance/*" element={
                <ProtectedRoute allowedRoles={['Finance', 'Superuser']}>
                  <FinanceRoutes />
                </ProtectedRoute>
              } />
              <Route path="/manufacturing/*" element={
                <ProtectedRoute allowedRoles={['Manufacturing Manager', 'Production Supervisor', 'Superuser']}>
                  <ManufacturingRoutes />
                </ProtectedRoute>
              } />
              <Route path="/sales/*" element={
                <ProtectedRoute allowedRoles={['Sales', 'Sales Manager', 'Superuser']}>
                  <SalesRoutes />
                </ProtectedRoute>
              } />
              <Route path="/supply-chain/*" element={
                <ProtectedRoute allowedRoles={['Supply Chain Manager', 'Inventory Manager', 'Superuser']}>
                  <SupplyChainRoutes />
                </ProtectedRoute>
              } />
              <Route path="/communication/*" element={
                <ProtectedRoute>
                  <CommunicationRoutes />
                </ProtectedRoute>
              } />
              <Route path="/" element={
                <div className="home-page">
                  <h1>Welcome to ERP System</h1>
                  <div className="home-content">
                    <nav className="home-navigation">
                      <Link to="/login" className="nav-button">Login</Link>
                      <Link to="/register" className="nav-button">Register</Link>
                    </nav>
                    <section className="features">
                      <h2>Key Features</h2>
                      <ul>
                        <li>User Management</li>
                        <li>Dashboard Analytics</li>
                        <li>Resource Planning</li>
                        <li>Real-time Updates</li>
                      </ul>
                    </section>
                    <footer className="home-footer">
                      <p>© 2024 ERP System. All rights reserved.</p>
                    </footer>
                  </div>
                </div>
              } />
              {/* Add more protected routes for other roles */}
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </LocalizationProvider>
  );
}

export default App;
