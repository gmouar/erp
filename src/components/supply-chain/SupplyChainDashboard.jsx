import React from 'react';
import { Box, Grid, Paper, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AssessmentIcon from '@mui/icons-material/Assessment';

const SupplyChainDashboard = () => {
  const navigate = useNavigate();

  const modules = [
    {
      title: 'Inventory Management',
      icon: <InventoryIcon fontSize="large" />,
      path: '/supply-chain/inventory',
      description: 'Manage stock levels and inventory tracking'
    },
    {
      title: 'Vendor Management',
      icon: <PeopleIcon fontSize="large" />,
      path: '/supply-chain/vendors',
      description: 'Manage supplier relationships and contracts'
    },
    {
      title: 'Procurement',
      icon: <ShoppingCartIcon fontSize="large" />,
      path: '/supply-chain/procurement',
      description: 'Handle purchase orders and requisitions'
    },
    {
      title: 'Shipment Tracking',
      icon: <LocalShippingIcon fontSize="large" />,
      path: '/supply-chain/shipments',
      description: 'Track shipments and deliveries'
    },
    {
      title: 'Analytics & Reports',
      icon: <AssessmentIcon fontSize="large" />,
      path: '/supply-chain/analytics',
      description: 'View supply chain metrics and reports'
    }
  ];

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Supply Chain Management
      </Typography>

      <Grid container spacing={3}>
        {modules.map((module) => (
          <Grid item xs={12} sm={6} md={4} key={module.title}>
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
                <Typography variant="body2" color="text.secondary" align="center">
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
              startIcon={<ShoppingCartIcon />}
              onClick={() => navigate('/supply-chain/procurement/new')}
            >
              Create Purchase Order
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<PeopleIcon />}
              onClick={() => navigate('/supply-chain/vendors/new')}
            >
              Add Vendor
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<AssessmentIcon />}
              onClick={() => navigate('/supply-chain/analytics')}
            >
              View Reports
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default SupplyChainDashboard;
