import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import '../styles/dashboard.css';
import HRDashboard from './dashboards/HRDashboard';
import FinanceDashboard from './dashboards/FinanceDashboard';
import ManagerDashboard from './dashboards/ManagerDashboard';
import EmployeeDashboard from './dashboards/EmployeeDashboard';
import UnassignedDashboard from './dashboards/UnassignedDashboard';

export default function Dashboard() {
  const { role, user } = useAuth();

  useEffect(() => {
    // Check if user needs 2FA setup (for sensitive roles)
    if ((role === 'Finance' || role === 'Superuser') && !user.has2FAEnabled) {
      // Redirect or show 2FA setup modal
    }
  }, [role, user]);

  const getDashboardByRole = () => {
    switch (role) {
      case 'HR':
        return <HRDashboard />;
      case 'Finance':
        return <FinanceDashboard />;
      case 'Manager':
        return <ManagerDashboard />;
      case 'Employee':
        return <EmployeeDashboard />;
      case 'Field Worker':
        return <FieldWorkerDashboard />;
      case 'Work from Home':
        return <WFHDashboard />;
      default:
        return <UnassignedDashboard />;
    }
  };

  return (
    <div className="dashboard-container">
      <header>
        <h1>Welcome to {role} Dashboard</h1>
        {(role === 'Finance' || role === 'Superuser') && !user.has2FAEnabled && (
          <div className="warning-banner">
            Please set up two-factor authentication for enhanced security
          </div>
        )}
        <nav className="dashboard-nav">
          <Link to="/communication" className="nav-link">
            Communication Center
          </Link>
        </nav>
      </header>
      {getDashboardByRole()}
    </div>
  );
}
