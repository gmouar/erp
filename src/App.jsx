import { useState, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, CircularProgress, Box } from '@mui/material';
import theme from './theme';
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
import JobPortal from './components/JobPortal';

// Router future flags configuration
const routerConfig = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

function LoadingScreen() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        bgcolor: 'background.default'
      }}
    >
      <CircularProgress />
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <AuthProvider>
          <Router {...routerConfig}>
            <Suspense fallback={<LoadingScreen />}>
              <div className="app-container">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/register" element={<Registration />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/2fa-verify" element={<TwoFactorVerification />} />
                  <Route path="/careers" element={<JobPortal />} />
                  
                  {/* Root route - redirect based on auth status */}
                  <Route path="/" element={
                    <ProtectedRoute>
                      <Navigate to="/dashboard" replace />
                    </ProtectedRoute>
                  } />
                  
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
                    <ProtectedRoute 
                      allowedRoles={['HR', 'Superuser']} 
                      requires2FA={true}
                    >
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
                  
                  {/* Catch all route - redirect to dashboard or login */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
            </Suspense>
          </Router>
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
