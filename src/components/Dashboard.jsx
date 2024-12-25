import React from 'react';
import { useAuth } from '../context/AuthContext';
import HRDashboard from './dashboards/HRDashboard';
import FinanceDashboard from './dashboards/FinanceDashboard';
import ManagerDashboard from './dashboards/ManagerDashboard';
import EmployeeDashboard from './dashboards/EmployeeDashboard';
import UnassignedDashboard from './dashboards/UnassignedDashboard';

const Dashboard = () => {
  const { role } = useAuth();

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
      </header>
      {getDashboardByRole()}
    </div>
  );
};

export default Dashboard;
