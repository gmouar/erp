import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Updated import
import DashboardLayout from './layouts/DashboardLayout';
import { Box, Grid, Typography, Paper, CircularProgress } from '@mui/material';
import StatsCard from './common/StatsCard';
import ModuleCard from './common/ModuleCard';
import useNotifications from '../hooks/useNotifications';

const Dashboard = () => {
  const { user, role, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAuthenticated && role) {
      const redirectMap = {
        'HR': '/hr/dashboard',
        'Finance': '/finance/dashboard',
        'Manufacturing Manager': '/manufacturing/dashboard',
        'Sales': '/sales/dashboard',
        'Supply Chain Manager': '/supply-chain/dashboard',
        'Unassigned': '/unassigned/dashboard'
      };

      const targetRoute = redirectMap[role];
      if (targetRoute) {
        // Use replace instead of push to prevent history stacking
        requestAnimationFrame(() => {
          navigate(targetRoute, { replace: true });
        });
      }
    }
  }, [role, isAuthenticated, loading]);

  if (loading) {
    return <CircularProgress />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const renderRoleDashboard = () => {
    switch (role) {
      case 'HR':
        return <Navigate to="/hr" replace />;
      case 'Finance':
        return <Navigate to="/finance" replace />;
      case 'Manufacturing Manager':
        return <Navigate to="/manufacturing" replace />;
      case 'Sales':
        return <Navigate to="/sales" replace />;
      case 'Supply Chain Manager':
        return <Navigate to="/supply-chain" replace />;
      case 'Unassigned':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Welcome to the ERP System
            </Typography>
            <Typography>
              Your role is currently unassigned. Please contact your administrator for access.
            </Typography>
          </Box>
        );
      default:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <ModuleCard
                title="Quick Actions"
                items={[
                  { label: 'View Schedule', link: '/schedule' },
                  { label: 'Submit Request', link: '/requests' },
                  { label: 'Team Chat', link: '/communication' }
                ]}
              />
            </Grid>
          </Grid>
        );
    }
  };

  return (
    <DashboardLayout>
      <Box className="dashboard-content">
        {renderRoleDashboard()}
      </Box>
    </DashboardLayout>
  );
};

export default Dashboard;
