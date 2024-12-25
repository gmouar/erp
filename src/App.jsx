import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Registration from './components/Registration';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './utils/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/register" element={<Registration />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
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
            <Route path="/hr/*" element={
              <ProtectedRoute allowedRoles={['HR', 'Superuser']}>
                <HRRoutes />
              </ProtectedRoute>
            } />
            {/* Add more protected routes for other roles */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;


