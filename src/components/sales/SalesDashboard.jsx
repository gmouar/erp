import React from 'react';
import { Box, Grid, Paper, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import TimelineIcon from '@mui/icons-material/Timeline';
import SupportIcon from '@mui/icons-material/Support';
import AnalyticsIcon from '@mui/icons-material/Analytics';

const SalesDashboard = () => {
  const navigate = useNavigate();

  const modules = [
    {
      title: 'Lead Management',
      icon: <PersonAddIcon fontSize="large" />,
      path: '/sales/leads',
      description: 'Track and manage sales leads'
    },
    {
      title: 'Sales Pipeline',
      icon: <TimelineIcon fontSize="large" />,
      path: '/sales/pipeline',
      description: 'Monitor sales opportunities'
    },
    {
      title: 'Customer Management',
      icon: <PeopleIcon fontSize="large" />,
      path: '/sales/customers',
      description: 'Manage customer relationships'
    },
    {
      title: 'Quotations',
      icon: <AssignmentIcon fontSize="large" />,
      path: '/sales/quotes',
      description: 'Create and manage quotes'
    },
    {
      title: 'Orders',
      icon: <ReceiptIcon fontSize="large" />,
      path: '/sales/orders',
      description: 'Track sales orders'
    },
    {
      title: 'Invoicing',
      icon: <MonetizationOnIcon fontSize="large" />,
      path: '/sales/invoicing',
      description: 'Manage invoices and payments'
    },
    {
      title: 'Customer Support',
      icon: <SupportIcon fontSize="large" />,
      path: '/sales/support',
      description: 'Handle customer inquiries'
    },
    {
      title: 'Analytics',
      icon: <AnalyticsIcon fontSize="large" />,
      path: '/sales/analytics',
      description: 'View sales reports and metrics'
    }
  ];

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Sales Management System
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
              startIcon={<PersonAddIcon />}
              onClick={() => navigate('/sales/leads/new')}
            >
              Add New Lead
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<AssignmentIcon />}
              onClick={() => navigate('/sales/quotes/create')}
            >
              Create Quote
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<AnalyticsIcon />}
              onClick={() => navigate('/sales/analytics')}
            >
              View Reports
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default SalesDashboard;
