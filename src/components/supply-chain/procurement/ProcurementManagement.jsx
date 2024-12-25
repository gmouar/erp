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
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  LocalShipping as ShippingIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const ProcurementManagement = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPO, setSelectedPO] = useState(null);
  const [procurementSummary, setProcurementSummary] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalValue: 0
  });

  const poStatuses = [
    'Draft',
    'Sent',
    'Confirmed',
    'In Transit',
    'Received',
    'Cancelled'
  ];

  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  const fetchPurchaseOrders = async () => {
    try {
      // This would be replaced with actual API call
      const mockData = [
        {
          id: 'PO-2024-001',
          vendor: {
            id: 'V001',
            name: 'Global Supplies Inc',
            email: 'orders@globalsupplies.com',
            contact: '123-456-7890'
          },
          orderDate: '2024-02-15',
          deliveryDate: '2024-03-01',
          status: 'Confirmed',
          items: [
            {
              id: 1,
              name: 'Raw Material A',
              quantity: 1000,
              unit: 'kg',
              unitPrice: 50,
              total: 50000
            },
            {
              id: 2,
              name: 'Raw Material B',
              quantity: 500,
              unit: 'liters',
              unitPrice: 30,
              total: 15000
            }
          ],
          subtotal: 65000,
          tax: 6500,
          shipping: 1000,
          total: 72500,
          terms: 'Net 30',
          notes: 'Regular monthly order'
        },
        {
          id: 'PO-2024-002',
          vendor: {
            id: 'V002',
            name: 'Tech Components Ltd',
            email: 'sales@techcomponents.com',
            contact: '098-765-4321'
          },
          orderDate: '2024-02-16',
          deliveryDate: '2024-03-15',
          status: 'Sent',
          items: [
            {
              id: 3,
              name: 'Electronic Component X',
              quantity: 2000,
              unit: 'pcs',
              unitPrice: 25,
              total: 50000
            }
          ],
          subtotal: 50000,
          tax: 5000,
          shipping: 800,
          total: 55800,
          terms: 'Net 45',
          notes: 'Urgent order'
        }
      ];

      setPurchaseOrders(mockData);
      calculateProcurementSummary(mockData);
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
    }
  };

  const calculateProcurementSummary = (orders) => {
    const summary = orders.reduce((acc, order) => {
      acc.totalOrders++;
      acc.totalValue += order.total;
      
      switch (order.status.toLowerCase()) {
        case 'sent':
        case 'confirmed':
        case 'in transit':
          acc.pendingOrders++;
          break;
        case 'received':
          acc.completedOrders++;
          break;
      }
      
      return acc;
    }, {
      totalOrders: 0,
      pendingOrders: 0,
      completedOrders: 0,
      totalValue: 0
    });

    setProcurementSummary(summary);
  };

  const handleOpenDialog = (po = null) => {
    setSelectedPO(po || {
      vendor: {
        id: '',
        name: '',
        email: '',
        contact: ''
      },
      orderDate: new Date(),
      deliveryDate: new Date(),
      status: 'Draft',
      items: [],
      terms: 'Net 30',
      notes: ''
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedPO(null);
    setOpenDialog(false);
  };

  const handleAddItem = () => {
    setSelectedPO({
      ...selectedPO,
      items: [
        ...selectedPO.items,
        {
          id: Date.now(),
          name: '',
          quantity: 0,
          unit: '',
          unitPrice: 0,
          total: 0
        }
      ]
    });
  };

  const handleUpdateItem = (index, field, value) => {
    const updatedItems = selectedPO.items.map((item, i) => {
      if (i === index) {
        const updatedItem = { ...item, [field]: value };
        // Recalculate item total if quantity or unit price changes
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
        }
        return updatedItem;
      }
      return item;
    });

    // Recalculate order totals
    const subtotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.1; // Assuming 10% tax
    const shipping = selectedPO.shipping || 0;
    const total = subtotal + tax + shipping;

    setSelectedPO({
      ...selectedPO,
      items: updatedItems,
      subtotal,
      tax,
      total
    });
  };

  const handleRemoveItem = (index) => {
    const updatedItems = selectedPO.items.filter((_, i) => i !== index);
    
    // Recalculate order totals
    const subtotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.1;
    const shipping = selectedPO.shipping || 0;
    const total = subtotal + tax + shipping;

    setSelectedPO({
      ...selectedPO,
      items: updatedItems,
      subtotal,
      tax,
      total
    });
  };

  const handleSavePO = async () => {
    try {
      if (selectedPO.id) {
        // Update existing PO
        const updatedPOs = purchaseOrders.map(po =>
          po.id === selectedPO.id ? selectedPO : po
        );
        setPurchaseOrders(updatedPOs);
        calculateProcurementSummary(updatedPOs);
      } else {
        // Create new PO
        const newPO = {
          ...selectedPO,
          id: `PO-${new Date().getFullYear()}-${(purchaseOrders.length + 1).toString().padStart(3, '0')}`
        };
        const updatedPOs = [...purchaseOrders, newPO];
        setPurchaseOrders(updatedPOs);
        calculateProcurementSummary(updatedPOs);
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving purchase order:', error);
    }
  };

  const handleUpdateStatus = async (poId, newStatus) => {
    try {
      const updatedPOs = purchaseOrders.map(po =>
        po.id === poId ? { ...po, status: newStatus } : po
      );
      setPurchaseOrders(updatedPOs);
      calculateProcurementSummary(updatedPOs);
    } catch (error) {
      console.error('Error updating PO status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'received':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'sent':
      case 'confirmed':
        return 'primary';
      case 'in transit':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Procurement Management
        </Typography>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Orders
                </Typography>
                <Typography variant="h4">
                  {procurementSummary.totalOrders}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Pending Orders
                </Typography>
                <Typography variant="h4" color="warning.main">
                  {procurementSummary.pendingOrders}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Completed Orders
                </Typography>
                <Typography variant="h4" color="success.main">
                  {procurementSummary.completedOrders}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Value
                </Typography>
                <Typography variant="h4" color="primary.main">
                  {formatCurrency(procurementSummary.totalValue)}
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
            Create Purchase Order
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>PO #</TableCell>
                <TableCell>Vendor</TableCell>
                <TableCell>Order Date</TableCell>
                <TableCell>Delivery Date</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {purchaseOrders.map((po) => (
                <TableRow key={po.id}>
                  <TableCell>{po.id}</TableCell>
                  <TableCell>{po.vendor.name}</TableCell>
                  <TableCell>
                    {new Date(po.orderDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(po.deliveryDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{formatCurrency(po.total)}</TableCell>
                  <TableCell>
                    <Chip
                      label={po.status}
                      color={getStatusColor(po.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(po)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    {po.status === 'Draft' && (
                      <Tooltip title="Send to Vendor">
                        <IconButton
                          size="small"
                          onClick={() => handleUpdateStatus(po.id, 'Sent')}
                        >
                          <SendIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    {po.status === 'Sent' && (
                      <>
                        <Tooltip title="Confirm Order">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleUpdateStatus(po.id, 'Confirmed')}
                          >
                            <CheckCircleIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Cancel Order">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleUpdateStatus(po.id, 'Cancelled')}
                          >
                            <CancelIcon />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                    {po.status === 'Confirmed' && (
                      <Tooltip title="Mark In Transit">
                        <IconButton
                          size="small"
                          color="warning"
                          onClick={() => handleUpdateStatus(po.id, 'In Transit')}
                        >
                          <ShippingIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    {po.status === 'In Transit' && (
                      <Tooltip title="Mark Received">
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleUpdateStatus(po.id, 'Received')}
                        >
                          <ReceiptIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {selectedPO?.id ? 'Edit Purchase Order' : 'Create Purchase Order'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Vendor Information
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Vendor Name"
                  value={selectedPO?.vendor?.name || ''}
                  onChange={(e) =>
                    setSelectedPO({
                      ...selectedPO,
                      vendor: {
                        ...selectedPO.vendor,
                        name: e.target.value
                      }
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Vendor Email"
                  value={selectedPO?.vendor?.email || ''}
                  onChange={(e) =>
                    setSelectedPO({
                      ...selectedPO,
                      vendor: {
                        ...selectedPO.vendor,
                        email: e.target.value
                      }
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Vendor Contact"
                  value={selectedPO?.vendor?.contact || ''}
                  onChange={(e) =>
                    setSelectedPO({
                      ...selectedPO,
                      vendor: {
                        ...selectedPO.vendor,
                        contact: e.target.value
                      }
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={selectedPO?.status || ''}
                    label="Status"
                    onChange={(e) =>
                      setSelectedPO({
                        ...selectedPO,
                        status: e.target.value
                      })
                    }
                  >
                    {poStatuses.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Order Date"
                  value={selectedPO?.orderDate || null}
                  onChange={(date) =>
                    setSelectedPO({
                      ...selectedPO,
                      orderDate: date
                    })
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Delivery Date"
                  value={selectedPO?.deliveryDate || null}
                  onChange={(date) =>
                    setSelectedPO({
                      ...selectedPO,
                      deliveryDate: date
                    })
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Order Items
                </Typography>
                {selectedPO?.items?.map((item, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Item Name"
                          value={item.name}
                          onChange={(e) =>
                            handleUpdateItem(index, 'name', e.target.value)
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          fullWidth
                          label="Quantity"
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleUpdateItem(index, 'quantity', parseInt(e.target.value))
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          fullWidth
                          label="Unit"
                          value={item.unit}
                          onChange={(e) =>
                            handleUpdateItem(index, 'unit', e.target.value)
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          fullWidth
                          label="Unit Price"
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) =>
                            handleUpdateItem(index, 'unitPrice', parseFloat(e.target.value))
                          }
                          InputProps={{
                            startAdornment: '$'
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          fullWidth
                          label="Total"
                          value={formatCurrency(item.total)}
                          disabled
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          color="error"
                          onClick={() => handleRemoveItem(index)}
                        >
                          Remove Item
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                ))}
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddItem}
                >
                  Add Item
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Order Summary
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Subtotal"
                      value={formatCurrency(selectedPO?.subtotal || 0)}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Tax"
                      value={formatCurrency(selectedPO?.tax || 0)}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Shipping"
                      type="number"
                      value={selectedPO?.shipping || 0}
                      onChange={(e) =>
                        setSelectedPO({
                          ...selectedPO,
                          shipping: parseFloat(e.target.value),
                          total: (selectedPO.subtotal || 0) + 
                                (selectedPO.tax || 0) + 
                                parseFloat(e.target.value)
                        })
                      }
                      InputProps={{
                        startAdornment: '$'
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Total"
                      value={formatCurrency(selectedPO?.total || 0)}
                      disabled
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Payment Terms"
                  value={selectedPO?.terms || ''}
                  onChange={(e) =>
                    setSelectedPO({
                      ...selectedPO,
                      terms: e.target.value
                    })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  multiline
                  rows={3}
                  value={selectedPO?.notes || ''}
                  onChange={(e) =>
                    setSelectedPO({
                      ...selectedPO,
                      notes: e.target.value
                    })
                  }
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSavePO} variant="contained">
              {selectedPO?.id ? 'Update' : 'Create'} Order
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default ProcurementManagement;
