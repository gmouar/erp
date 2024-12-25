import React from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  Card,
  CardContent,
  LinearProgress
} from '@mui/material';
import {
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  MonetizationOn as MonetizationOnIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';

const FinanceDashboard = () => {
  const financialMetrics = [
    {
      title: 'Revenue',
      value: '$1,250,000',
      change: '+12%',
      icon: MonetizationOnIcon,
      color: 'primary',
      progress: 75
    },
    {
      title: 'Expenses',
      value: '$850,000',
      change: '+5%',
      icon: ReceiptIcon,
      color: 'error',
      progress: 65
    },
    {
      title: 'Profit',
      value: '$400,000',
      change: '+8%',
      icon: TrendingUpIcon,
      color: 'success',
      progress: 80
    },
    {
      title: 'Cash Flow',
      value: '$300,000',
      change: '+15%',
      icon: AccountBalanceIcon,
      color: 'info',
      progress: 70
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom>
          Financial Overview
        </Typography>
        <Grid container spacing={3}>
          {financialMetrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <IconComponent color={metric.color} />
                      <Typography
                        variant="h6"
                        color="textSecondary"
                        sx={{ ml: 1 }}
                      >
                        {metric.title}
                      </Typography>
                    </Box>
                    <Typography variant="h4" gutterBottom>
                      {metric.value}
                    </Typography>
                    <Typography
                      variant="body2"
                      color={metric.change.startsWith('+') ? 'success.main' : 'error.main'}
                    >
                      {metric.change} from last month
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <LinearProgress
                        variant="determinate"
                        value={metric.progress}
                        color={metric.change.startsWith('+') ? 'success' : 'error'}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Paper>
    </Box>
  );
};

export default FinanceDashboard;
