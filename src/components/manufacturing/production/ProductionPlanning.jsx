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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Chip,
  Stack,
  Tooltip,
  Alert,
  LinearProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow as StartIcon,
  Stop as StopIcon,
  Pause as PauseIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const ProductionPlanning = () => {
  const [productionOrders, setProductionOrders] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [productionSummary, setProductionSummary] = useState({
    totalOrders: 0,
    inProgress: 0,
    completed: 0,
    delayed: 0
  });

  const productionStatuses = [
    'Planned',
    'In Progress',
    'Completed',
    'Delayed',
    'On Hold'
  ];

  const priorities = ['Low', 'Medium', 'High', 'Urgent'];

  useEffect(() => {
    fetchProductionOrders();
  }, []);

  const fetchProductionOrders = async () => {
    try {
      // This would be replaced with actual API call
      const mockData = [
        {
          id: 'PO-2024-001',
          productName: 'Widget A',
          quantity: 1000,
          startDate: '2024-02-15T08:00:00',
          endDate: '2024-02-20T17:00:00',
          status: 'In Progress',
          priority: 'High',
          completionPercentage: 45,
          assignedTo: 'Production Team A',
          materials: [
            { name: 'Raw Material X', required: 500, available: 450 },
            { name: 'Raw Material Y', required: 300, available: 300 }
          ],
          notes: 'Standard production run'
        },
        {
          id: 'PO-2024-002',
          productName: 'Widget B',
          quantity: 500,
          startDate: '2024-02-18T08:00:00',
          endDate: '2024-02-22T17:00:00',
          status: 'Planned',
          priority: 'Medium',
          completionPercentage: 0,
          assignedTo: 'Production Team B',
          materials: [
            { name: 'Raw Material Z', required: 250, available: 200 }
          ],
          notes: 'Custom specifications required'
        }
      ];

      setProductionOrders(mockData);
      calculateProductionSummary(mockData);
    } catch (error) {
      console.error('Error fetching production orders:', error);
    }
  };

  const calculateProductionSummary = (orders) => {
    const summary = orders.reduce((acc, order) => {
      acc.totalOrders++;
      switch (order.status.toLowerCase()) {
        case 'in progress':
          acc.inProgress++;
          break;
        case 'completed':
          acc.completed++;
          break;
        case 'delayed':
          acc.delayed++;
          break;
      }
      return acc;
    }, {
      totalOrders: 0,
      inProgress: 0,
      completed: 0,
      delayed: 0
    });

    setProductionSummary(summary);
  };

  const handleOpenDialog = (order = null) => {
    setSelectedOrder(order || {
      productName: '',
      quantity: 0,
      startDate: new Date(),
      endDate: new Date(),
      status: 'Planned',
      priority: 'Medium',
      completionPercentage: 0,
      assignedTo: '',
      materials: [],
      notes: ''
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedOrder(null);
    setOpenDialog(false);
  };

  const handleAddMaterial = () => {
    setSelectedOrder({
      ...selectedOrder,
      materials: [
        ...selectedOrder.materials,
        { name: '', required: 0, available: 0 }
      ]
    });
  };

  const handleUpdateMaterial = (index, field, value) => {
    const updatedMaterials = selectedOrder.materials.map((material, i) => {
      if (i === index) {
        return { ...material, [field]: value };
      }
      return material;
    });

    setSelectedOrder({
      ...selectedOrder,
      materials: updatedMaterials
    });
  };

  const handleRemoveMaterial = (index) => {
    setSelectedOrder({
      ...selectedOrder,
      materials: selectedOrder.materials.filter((_, i) => i !== index)
    });
  };

  const handleSaveOrder = async () => {
    try {
      if (selectedOrder.id) {
        // Update existing order
        const updatedOrders = productionOrders.map(order =>
          order.id === selectedOrder.id ? selectedOrder : order
        );
        setProductionOrders(updatedOrders);
        calculateProductionSummary(updatedOrders);
      } else {
        // Create new order
        const newOrder = {
          ...selectedOrder,
          id: `PO-${new Date().getFullYear()}-${(productionOrders.length + 1).toString().padStart(3, '0')}`
        };
        const updatedOrders = [...productionOrders, newOrder];
        setProductionOrders(updatedOrders);
        calculateProductionSummary(updatedOrders);
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving production order:', error);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const updatedOrders = productionOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      );
      setProductionOrders(updatedOrders);
      calculateProductionSummary(updatedOrders);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'in progress':
        return 'primary';
      case 'delayed':
        return 'error';
      case 'on hold':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'urgent':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Production Planning
        </Typography>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Orders
                </Typography>
                <Typography variant="h4">
                  {productionSummary.totalOrders}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  In Progress
                </Typography>
                <Typography variant="h4" color="primary">
                  {productionSummary.inProgress}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Completed
                </Typography>
                <Typography variant="h4" color="success.main">
                  {productionSummary.completed}
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
                  {productionSummary.delayed}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Create Production Order
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Product</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Progress</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productionOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.productName}</TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>
                    {new Date(order.startDate).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {new Date(order.endDate).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={order.priority}
                      color={getPriorityColor(order.priority)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={order.completionPercentage}
                        sx={{ flexGrow: 1 }}
                      />
                      <Typography variant="body2">
                        {order.completionPercentage}%
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(order)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    {order.status === 'Planned' && (
                      <Tooltip title="Start Production">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleUpdateStatus(order.id, 'In Progress')}
                        >
                          <StartIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    {order.status === 'In Progress' && (
                      <>
                        <Tooltip title="Pause Production">
                          <IconButton
                            size="small"
                            color="warning"
                            onClick={() => handleUpdateStatus(order.id, 'On Hold')}
                          >
                            <PauseIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Complete Production">
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => handleUpdateStatus(order.id, 'Completed')}
                          >
                            <StopIcon />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {selectedOrder?.id ? 'Edit Production Order' : 'Create Production Order'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Product Name"
                  value={selectedOrder?.productName || ''}
                  onChange={(e) =>
                    setSelectedOrder({
                      ...selectedOrder,
                      productName: e.target.value
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Quantity"
                  type="number"
                  value={selectedOrder?.quantity || ''}
                  onChange={(e) =>
                    setSelectedOrder({
                      ...selectedOrder,
                      quantity: parseInt(e.target.value)
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DateTimePicker
                  label="Start Date"
                  value={selectedOrder?.startDate || null}
                  onChange={(date) =>
                    setSelectedOrder({
                      ...selectedOrder,
                      startDate: date
                    })
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DateTimePicker
                  label="End Date"
                  value={selectedOrder?.endDate || null}
                  onChange={(date) =>
                    setSelectedOrder({
                      ...selectedOrder,
                      endDate: date
                    })
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={selectedOrder?.status || ''}
                    label="Status"
                    onChange={(e) =>
                      setSelectedOrder({
                        ...selectedOrder,
                        status: e.target.value
                      })
                    }
                  >
                    {productionStatuses.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={selectedOrder?.priority || ''}
                    label="Priority"
                    onChange={(e) =>
                      setSelectedOrder({
                        ...selectedOrder,
                        priority: e.target.value
                      })
                    }
                  >
                    {priorities.map((priority) => (
                      <MenuItem key={priority} value={priority}>
                        {priority}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Assigned To"
                  value={selectedOrder?.assignedTo || ''}
                  onChange={(e) =>
                    setSelectedOrder({
                      ...selectedOrder,
                      assignedTo: e.target.value
                    })
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Required Materials
                </Typography>
                {selectedOrder?.materials.map((material, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Material Name"
                          value={material.name}
                          onChange={(e) =>
                            handleUpdateMaterial(index, 'name', e.target.value)
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          fullWidth
                          label="Required Quantity"
                          type="number"
                          value={material.required}
                          onChange={(e) =>
                            handleUpdateMaterial(index, 'required', parseInt(e.target.value))
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          fullWidth
                          label="Available Quantity"
                          type="number"
                          value={material.available}
                          onChange={(e) =>
                            handleUpdateMaterial(index, 'available', parseInt(e.target.value))
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Button
                          color="error"
                          onClick={() => handleRemoveMaterial(index)}
                        >
                          Remove
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                ))}
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddMaterial}
                >
                  Add Material
                </Button>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  multiline
                  rows={3}
                  value={selectedOrder?.notes || ''}
                  onChange={(e) =>
                    setSelectedOrder({
                      ...selectedOrder,
                      notes: e.target.value
                    })
                  }
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSaveOrder} variant="contained">
              {selectedOrder?.id ? 'Update' : 'Create'} Order
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default ProductionPlanning;
