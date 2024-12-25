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
  Warning as WarningIcon,
  Refresh as RefreshIcon,
  History as HistoryIcon,
  LocalShipping as ShippingIcon,
  Inventory as InventoryIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [inventorySummary, setInventorySummary] = useState({
    totalItems: 0,
    lowStock: 0,
    outOfStock: 0,
    totalValue: 0
  });

  const itemCategories = [
    'Raw Materials',
    'Work in Progress',
    'Finished Goods',
    'Packaging',
    'Spare Parts'
  ];

  const warehouses = [
    'Warehouse A',
    'Warehouse B',
    'Production Floor',
    'Shipping Area'
  ];

  const units = ['pcs', 'kg', 'liters', 'meters', 'boxes'];

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      // This would be replaced with actual API call
      const mockData = [
        {
          id: 'INV001',
          name: 'Raw Material A',
          category: 'Raw Materials',
          quantity: 1500,
          unit: 'kg',
          minQuantity: 1000,
          maxQuantity: 5000,
          reorderPoint: 1200,
          unitCost: 25,
          location: 'Warehouse A',
          supplier: 'Supplier XYZ',
          lastRestocked: '2024-02-01',
          expiryDate: '2024-12-31',
          status: 'In Stock'
        },
        {
          id: 'INV002',
          name: 'Component B',
          category: 'Work in Progress',
          quantity: 200,
          unit: 'pcs',
          minQuantity: 500,
          maxQuantity: 2000,
          reorderPoint: 600,
          unitCost: 50,
          location: 'Production Floor',
          supplier: 'Manufacturer ABC',
          lastRestocked: '2024-01-15',
          expiryDate: null,
          status: 'Low Stock'
        }
      ];

      setInventory(mockData);
      calculateInventorySummary(mockData);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  const calculateInventorySummary = (items) => {
    const summary = items.reduce((acc, item) => {
      acc.totalItems++;
      acc.totalValue += item.quantity * item.unitCost;
      
      if (item.quantity === 0) {
        acc.outOfStock++;
      } else if (item.quantity < item.minQuantity) {
        acc.lowStock++;
      }
      
      return acc;
    }, {
      totalItems: 0,
      lowStock: 0,
      outOfStock: 0,
      totalValue: 0
    });

    setInventorySummary(summary);
  };

  const handleOpenDialog = (item = null) => {
    setSelectedItem(item || {
      name: '',
      category: '',
      quantity: 0,
      unit: '',
      minQuantity: 0,
      maxQuantity: 0,
      reorderPoint: 0,
      unitCost: 0,
      location: '',
      supplier: '',
      lastRestocked: new Date(),
      expiryDate: null,
      status: 'In Stock'
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedItem(null);
    setOpenDialog(false);
  };

  const handleSaveItem = async () => {
    try {
      if (selectedItem.id) {
        // Update existing item
        const updatedInventory = inventory.map(item =>
          item.id === selectedItem.id ? selectedItem : item
        );
        setInventory(updatedInventory);
        calculateInventorySummary(updatedInventory);
      } else {
        // Create new item
        const newItem = {
          ...selectedItem,
          id: `INV${(inventory.length + 1).toString().padStart(3, '0')}`,
          status: selectedItem.quantity === 0 ? 'Out of Stock' :
                 selectedItem.quantity < selectedItem.minQuantity ? 'Low Stock' :
                 'In Stock'
        };
        const updatedInventory = [...inventory, newItem];
        setInventory(updatedInventory);
        calculateInventorySummary(updatedInventory);
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving inventory item:', error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      const updatedInventory = inventory.filter(item => item.id !== itemId);
      setInventory(updatedInventory);
      calculateInventorySummary(updatedInventory);
    } catch (error) {
      console.error('Error deleting inventory item:', error);
    }
  };

  const getStockLevel = (item) => {
    const percentage = (item.quantity / item.maxQuantity) * 100;
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress
            variant="determinate"
            value={percentage}
            color={
              item.quantity <= item.reorderPoint
                ? 'warning'
                : item.quantity <= item.minQuantity
                ? 'error'
                : 'success'
            }
          />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">
            {`${Math.round(percentage)}%`}
          </Typography>
        </Box>
      </Box>
    );
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'in stock':
        return 'success';
      case 'low stock':
        return 'warning';
      case 'out of stock':
        return 'error';
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
          Inventory Management
        </Typography>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Items
                </Typography>
                <Typography variant="h4">
                  {inventorySummary.totalItems}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Low Stock Items
                </Typography>
                <Typography variant="h4" color="warning.main">
                  {inventorySummary.lowStock}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Out of Stock
                </Typography>
                <Typography variant="h4" color="error.main">
                  {inventorySummary.outOfStock}
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
                  {formatCurrency(inventorySummary.totalValue)}
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
            Add Item
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Stock Level</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Value</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>
                    {item.quantity} {item.unit}
                  </TableCell>
                  <TableCell>{getStockLevel(item)}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>{formatCurrency(item.quantity * item.unitCost)}</TableCell>
                  <TableCell>
                    <Chip
                      label={item.status}
                      color={getStatusColor(item.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(item)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="View History">
                      <IconButton size="small">
                        <HistoryIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {selectedItem?.id ? 'Edit Inventory Item' : 'Add Inventory Item'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Item Name"
                  value={selectedItem?.name || ''}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      name: e.target.value
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={selectedItem?.category || ''}
                    label="Category"
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        category: e.target.value
                      })
                    }
                  >
                    {itemCategories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Quantity"
                  type="number"
                  value={selectedItem?.quantity || ''}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      quantity: parseInt(e.target.value)
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Unit</InputLabel>
                  <Select
                    value={selectedItem?.unit || ''}
                    label="Unit"
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        unit: e.target.value
                      })
                    }
                  >
                    {units.map((unit) => (
                      <MenuItem key={unit} value={unit}>
                        {unit}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Minimum Quantity"
                  type="number"
                  value={selectedItem?.minQuantity || ''}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      minQuantity: parseInt(e.target.value)
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Maximum Quantity"
                  type="number"
                  value={selectedItem?.maxQuantity || ''}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      maxQuantity: parseInt(e.target.value)
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Reorder Point"
                  type="number"
                  value={selectedItem?.reorderPoint || ''}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      reorderPoint: parseInt(e.target.value)
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Unit Cost"
                  type="number"
                  value={selectedItem?.unitCost || ''}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      unitCost: parseFloat(e.target.value)
                    })
                  }
                  InputProps={{
                    startAdornment: '$'
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Location</InputLabel>
                  <Select
                    value={selectedItem?.location || ''}
                    label="Location"
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        location: e.target.value
                      })
                    }
                  >
                    {warehouses.map((warehouse) => (
                      <MenuItem key={warehouse} value={warehouse}>
                        {warehouse}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Supplier"
                  value={selectedItem?.supplier || ''}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      supplier: e.target.value
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Last Restocked"
                  value={selectedItem?.lastRestocked || null}
                  onChange={(date) =>
                    setSelectedItem({
                      ...selectedItem,
                      lastRestocked: date
                    })
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Expiry Date"
                  value={selectedItem?.expiryDate || null}
                  onChange={(date) =>
                    setSelectedItem({
                      ...selectedItem,
                      expiryDate: date
                    })
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSaveItem} variant="contained">
              {selectedItem?.id ? 'Update' : 'Add'} Item
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default InventoryManagement;
