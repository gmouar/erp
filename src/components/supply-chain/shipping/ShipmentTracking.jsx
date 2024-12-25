import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Chip,
  TextField,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  LocalShipping as LocalShippingIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import { supplyChainService } from '../../../services/supplyChainService';

const ShipmentTracking = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trackingNumber, setTrackingNumber] = useState('');

  useEffect(() => {
    loadShipments();
  }, []);

  const loadShipments = async () => {
    try {
      // This would be replaced with actual API call through supplyChainService
      const mockData = [
        {
          id: 'SHP001',
          orderId: 'ORD001',
          carrier: 'FedEx',
          trackingNumber: 'FX123456789',
          status: 'in-transit',
          estimatedDelivery: '2024-03-01',
          origin: 'New York, NY',
          destination: 'Los Angeles, CA'
        },
        {
          id: 'SHP002',
          orderId: 'ORD002',
          carrier: 'UPS',
          trackingNumber: 'UPS987654321',
          status: 'delivered',
          estimatedDelivery: '2024-02-15',
          origin: 'Chicago, IL',
          destination: 'Miami, FL'
        }
      ];
      setShipments(mockData);
    } catch (error) {
      console.error('Error loading shipments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'in-transit':
        return 'primary';
      case 'delayed':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Shipment Tracking
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Shipments
              </Typography>
              <Typography variant="h4">
                {shipments.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                In Transit
              </Typography>
              <Typography variant="h4" color="primary">
                {shipments.filter(s => s.status === 'in-transit').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Delivered
              </Typography>
              <Typography variant="h4" color="success.main">
                {shipments.filter(s => s.status === 'delivered').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Delayed
              </Typography>
              <Typography variant="h4" color="error.main">
                {shipments.filter(s => s.status === 'delayed').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Track Shipment"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter tracking number"
              InputProps={{
                endAdornment: (
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={loadShipments}
            >
              Refresh Shipments
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Shipment ID</TableCell>
              <TableCell>Order ID</TableCell>
              <TableCell>Carrier</TableCell>
              <TableCell>Tracking Number</TableCell>
              <TableCell>Origin</TableCell>
              <TableCell>Destination</TableCell>
              <TableCell>Est. Delivery</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shipments.map((shipment) => (
              <TableRow key={shipment.id}>
                <TableCell>{shipment.id}</TableCell>
                <TableCell>{shipment.orderId}</TableCell>
                <TableCell>{shipment.carrier}</TableCell>
                <TableCell>{shipment.trackingNumber}</TableCell>
                <TableCell>{shipment.origin}</TableCell>
                <TableCell>{shipment.destination}</TableCell>
                <TableCell>
                  {new Date(shipment.estimatedDelivery).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Chip
                    label={shipment.status}
                    color={getStatusColor(shipment.status)}
                    icon={<LocalShippingIcon />}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ShipmentTracking;
