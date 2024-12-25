import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { checkPermission } from '../../utils/roleUtils';
import {
  Box,
  Card,
  Typography,
  Button,
  Grid,
  LinearProgress,
  Chip
} from '@mui/material';

const WorkOrder = () => {
  const { user } = useAuth();
  const [workOrders, setWorkOrders] = useState([]);
  const [workOrderStatus, setWorkOrderStatus] = useState({});

  const updateWorkOrderStatus = async (orderId, status) => {
    if (!checkPermission(user.role, 'production.edit')) {
      alert('Insufficient permissions');
      return;
    }

    try {
      await fetch(`/api/manufacturing/work-orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      setWorkOrderStatus({ ...workOrderStatus, [orderId]: status });
    } catch (error) {
      console.error('Error updating work order:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'planned': 'info',
      'in-progress': 'warning',
      'completed': 'success',
      'on-hold': 'error',
      'cancelled': 'default'
    };
    return colors[status] || 'default';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Work Orders</Typography>
      <Grid container spacing={3}>
        {workOrders.map(order => (
          <Grid item xs={12} md={6} lg={4} key={order.id}>
            <Card sx={{ p: 2 }}>
              <Typography variant="h6">Work Order #{order.id}</Typography>
              <Box sx={{ my: 2 }}>
                <Typography>Product: {order.productName}</Typography>
                <Typography>Quantity: {order.quantity}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 1 }}>
                  <Typography>Progress:</Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={order.progress} 
                    sx={{ flexGrow: 1 }}
                  />
                  <Typography>{order.progress}%</Typography>
                </Box>
                <Chip 
                  label={order.status}
                  color={getStatusColor(order.status)}
                  sx={{ mt: 1 }}
                />
              </Box>
              <div className="status-controls">
                {['in-progress', 'completed', 'on-hold'].map(status => (
                  <Button
                    key={status}
                    onClick={() => updateWorkOrderStatus(order.id, status)}
                    variant="contained"
                    color={getStatusColor(status)}
                    sx={{ mr: 1 }}
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default WorkOrder;
