import React from 'react';
import { Box, Grid, Paper, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PaymentsIcon from '@mui/icons-material/Payments';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalculateIcon from '@mui/icons-material/Calculate';
import InventoryIcon from '@mui/icons-material/Inventory';

const FinanceDashboard = () => {
  const navigate = useNavigate();

  const modules = [
    {
      title: 'Payroll Management',
      icon: <PaymentsIcon fontSize="large" />,
      path: '/finance/payroll',
      description: 'Process salaries and manage compensation'
    },
    {
      title: 'Budget Management',
      icon: <AccountBalanceWalletIcon fontSize="large" />,
      path: '/finance/budget',
      description: 'Track and allocate departmental budgets'
    },
    {
      title: 'Expense Management',
      icon: <ReceiptIcon fontSize="large" />,
      path: '/finance/expenses',
      description: 'Handle expense claims and approvals'
    },
    {
      title: 'Invoicing',
      icon: <CalculateIcon fontSize="large" />,
      path: '/finance/invoicing',
      description: 'Generate and track invoices'
    },
    {
      title: 'Financial Reports',
      icon: <AssessmentIcon fontSize="large" />,
      path: '/finance/reports',
      description: 'View financial analytics and reports'
    },
    {
      title: 'Tax Management',
      icon: <AccountBalanceIcon fontSize="large" />,
      path: '/finance/tax',
      description: 'Handle tax calculations and filing'
    },
    {
      title: 'Asset Management',
      icon: <InventoryIcon fontSize="large" />,
      path: '/finance/assets',
      description: 'Track and manage company assets'
    },
    {
      title: 'Revenue Analytics',
      icon: <TrendingUpIcon fontSize="large" />,
      path: '/finance/revenue',
      description: 'Monitor revenue and growth trends'
    }
  ];

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Finance Management System
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
              startIcon={<PaymentsIcon />}
              onClick={() => navigate('/finance/payroll/process')}
            >
              Process Payroll
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<ReceiptIcon />}
              onClick={() => navigate('/finance/expenses/approve')}
            >
              Review Expenses
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<AssessmentIcon />}
              onClick={() => navigate('/finance/reports/generate')}
            >
              Generate Reports
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default FinanceDashboard;
