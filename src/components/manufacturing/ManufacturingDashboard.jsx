import React from 'react';
import { Box, Grid, Paper, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ProductionIcon from '@mui/icons-material/PrecisionManufacturing'; // Changed from Precision
import InventoryIcon from '@mui/icons-material/Inventory';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BuildIcon from '@mui/icons-material/Build';
import VerifiedIcon from '@mui/icons-material/VerifiedUser';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import ScheduleIcon from '@mui/icons-material/Schedule';
import SettingsIcon from '@mui/icons-material/Settings';

const ManufacturingDashboard = () => {
  const navigate = useNavigate();

  const modules = [
    {
      title: 'Production Planning',
      icon: <ProductionIcon fontSize="large" />,
      path: '/manufacturing/production',
      description: 'Plan and schedule production activities'
    },
    {
      title: 'Inventory Management',
      icon: <InventoryIcon fontSize="large" />,
      path: '/manufacturing/inventory',
      description: 'Track raw materials and stock'
    },
    {
      title: 'Work Orders',
      icon: <AssignmentIcon fontSize="large" />,
      path: '/manufacturing/work-orders',
      description: 'Manage production work orders'
    },
    {
      title: 'Quality Control',
      icon: <VerifiedIcon fontSize="large" />,
      path: '/manufacturing/quality',
      description: 'Monitor product quality'
    },
    {
      title: 'Maintenance',
      icon: <BuildIcon fontSize="large" />,
      path: '/manufacturing/maintenance',
      description: 'Equipment maintenance scheduling'
    },
    {
      title: 'Cost Management',
      icon: <AnalyticsIcon fontSize="large" />,
      path: '/manufacturing/costs',
      description: 'Track production costs'
    },
    {
      title: 'Production Schedule',
      icon: <ScheduleIcon fontSize="large" />,
      path: '/manufacturing/schedule',
      description: 'View production timeline'
    },
    {
      title: 'Machine Setup',
      icon: <SettingsIcon fontSize="large" />,
      path: '/manufacturing/machines',
      description: 'Configure machine settings'
    }
  ];

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Manufacturing Management System
      </Typography>

      <Grid container spacing={3}>
        {modules.map((module) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={module.title}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 200,
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
              onClick={() => navigate(module.path)}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexGrow: 1,
                  gap: 2
                }}
              >
                {module.icon}
                <Typography variant="h6" component="h2" align="center">
                  {module.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                >
                  {module.description}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<AssignmentIcon />}
              onClick={() => navigate('/manufacturing/work-orders/create')}
            >
              Create Work Order
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<InventoryIcon />}
              onClick={() => navigate('/manufacturing/inventory/check')}
            >
              Check Inventory
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<AnalyticsIcon />}
              onClick={() => navigate('/manufacturing/reports')}
            >
              View Reports
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ManufacturingDashboard;
