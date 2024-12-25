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
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PictureAsPdf as PdfIcon,
  Email as EmailIcon,
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  Schedule as ScheduleIcon,
  LocalShipping as ShippingIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const InvoiceManagement = () => {
  const [invoices, setInvoices] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoiceSummary, setInvoiceSummary] = useState({
    totalInvoiced: 0,
    totalPaid: 0,
    totalOverdue: 0,
    totalPending: 0
  });

  const paymentTerms = [
    'Net 30',
    'Net 60',
    'Net 90',
    'Due on Receipt',
    'Custom'
  ];

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      // This would be replaced with actual API call
      const mockData = [
        {
          id: 'INV-2024-001',
          customerId: 'CUST001',
          customerName: 'Acme Corporation',
          amount: 15000,
          issueDate: '2024-02-01',
          dueDate: '2024-03-02',
          status: 'Pending',
          paymentTerms: 'Net 30',
          items: [
            {
              description: 'Consulting Services',
              quantity: 40,
              rate: 250,
              amount: 10000
            },
            {
              description: 'Software License',
              quantity: 1,
              rate: 5000,
              amount: 5000
            }
          ],
          notes: 'Please include invoice number in payment reference',
          paymentHistory: []
        },
        {
          id: 'INV-2024-002',
          customerId: 'CUST002',
          customerName: 'TechStart Inc',
          amount: 8000,
          issueDate: '2024-01-15',
          dueDate: '2024-02-14',
          status: 'Overdue',
          paymentTerms: 'Net 30',
          items: [
            {
              description: 'Web Development',
              quantity: 80,
              rate: 100,
              amount: 8000
            }
          ],
          notes: '',
          paymentHistory: []
        }
      ];

      setInvoices(mockData);
      calculateInvoiceSummary(mockData);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  const calculateInvoiceSummary = (invoiceData) => {
    const summary = invoiceData.reduce((acc, invoice) => {
      acc.totalInvoiced += invoice.amount;
      switch (invoice.status.toLowerCase()) {
        case 'paid':
          acc.totalPaid += invoice.amount;
          break;
        case 'overdue':
          acc.totalOverdue += invoice.amount;
          break;
        case 'pending':
          acc.totalPending += invoice.amount;
          break;
      }
      return acc;
    }, {
      totalInvoiced: 0,
      totalPaid: 0,
      totalOverdue: 0,
      totalPending: 0
    });

    setInvoiceSummary(summary);
  };

  const handleOpenDialog = (invoice = null) => {
    setSelectedInvoice(invoice || {
      items: [],
      paymentTerms: 'Net 30',
      status: 'Draft'
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedInvoice(null);
    setOpenDialog(false);
  };

  const handleAddItem = () => {
    setSelectedInvoice({
      ...selectedInvoice,
      items: [
        ...selectedInvoice.items,
        {
          description: '',
          quantity: 1,
          rate: 0,
          amount: 0
        }
      ]
    });
  };

  const handleUpdateItem = (index, field, value) => {
    const updatedItems = selectedInvoice.items.map((item, i) => {
      if (i === index) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updatedItem.amount = updatedItem.quantity * updatedItem.rate;
        }
        return updatedItem;
      }
      return item;
    });

    setSelectedInvoice({
      ...selectedInvoice,
      items: updatedItems
    });
  };

  const handleRemoveItem = (index) => {
    setSelectedInvoice({
      ...selectedInvoice,
      items: selectedInvoice.items.filter((_, i) => i !== index)
    });
  };

  const handleSaveInvoice = async () => {
    try {
      if (selectedInvoice.id) {
        // Update existing invoice
        const updatedInvoices = invoices.map(invoice =>
          invoice.id === selectedInvoice.id ? selectedInvoice : invoice
        );
        setInvoices(updatedInvoices);
        calculateInvoiceSummary(updatedInvoices);
      } else {
        // Create new invoice
        const newInvoice = {
          ...selectedInvoice,
          id: `INV-${new Date().getFullYear()}-${(invoices.length + 1).toString().padStart(3, '0')}`,
          status: 'Pending'
        };
        const updatedInvoices = [...invoices, newInvoice];
        setInvoices(updatedInvoices);
        calculateInvoiceSummary(updatedInvoices);
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving invoice:', error);
    }
  };

  const handleGeneratePDF = async (invoiceId) => {
    try {
      // This would be replaced with actual PDF generation logic
      console.log(`Generating PDF for invoice ${invoiceId}`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const handleSendEmail = async (invoiceId) => {
    try {
      // This would be replaced with actual email sending logic
      console.log(`Sending email for invoice ${invoiceId}`);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'success';
      case 'overdue':
        return 'error';
      case 'pending':
        return 'warning';
      case 'draft':
        return 'default';
      default:
        return 'default';
    }
  };

  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + item.amount, 0);
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
          Invoice Management
        </Typography>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Invoiced
                </Typography>
                <Typography variant="h4">
                  {formatCurrency(invoiceSummary.totalInvoiced)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Paid
                </Typography>
                <Typography variant="h4" color="success.main">
                  {formatCurrency(invoiceSummary.totalPaid)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Overdue
                </Typography>
                <Typography variant="h4" color="error.main">
                  {formatCurrency(invoiceSummary.totalOverdue)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Pending Payment
                </Typography>
                <Typography variant="h4" color="warning.main">
                  {formatCurrency(invoiceSummary.totalPending)}
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
            Create Invoice
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Invoice #</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Issue Date</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.id}</TableCell>
                  <TableCell>{invoice.customerName}</TableCell>
                  <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                  <TableCell>
                    {new Date(invoice.issueDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={invoice.status}
                      color={getStatusColor(invoice.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(invoice)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Generate PDF">
                      <IconButton
                        size="small"
                        onClick={() => handleGeneratePDF(invoice.id)}
                      >
                        <PdfIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Send Email">
                      <IconButton
                        size="small"
                        onClick={() => handleSendEmail(invoice.id)}
                      >
                        <EmailIcon />
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
            {selectedInvoice?.id ? `Edit Invoice ${selectedInvoice.id}` : 'Create New Invoice'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Customer Name"
                  value={selectedInvoice?.customerName || ''}
                  onChange={(e) =>
                    setSelectedInvoice({
                      ...selectedInvoice,
                      customerName: e.target.value
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Payment Terms</InputLabel>
                  <Select
                    value={selectedInvoice?.paymentTerms || ''}
                    label="Payment Terms"
                    onChange={(e) =>
                      setSelectedInvoice({
                        ...selectedInvoice,
                        paymentTerms: e.target.value
                      })
                    }
                  >
                    {paymentTerms.map((term) => (
                      <MenuItem key={term} value={term}>
                        {term}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Issue Date"
                  value={selectedInvoice?.issueDate || null}
                  onChange={(date) =>
                    setSelectedInvoice({
                      ...selectedInvoice,
                      issueDate: date
                    })
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Due Date"
                  value={selectedInvoice?.dueDate || null}
                  onChange={(date) =>
                    setSelectedInvoice({
                      ...selectedInvoice,
                      dueDate: date
                    })
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }}>Invoice Items</Divider>
                {selectedInvoice?.items.map((item, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Description"
                          value={item.description}
                          onChange={(e) =>
                            handleUpdateItem(index, 'description', e.target.value)
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
                            handleUpdateItem(index, 'quantity', parseFloat(e.target.value))
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          fullWidth
                          label="Rate"
                          type="number"
                          value={item.rate}
                          onChange={(e) =>
                            handleUpdateItem(index, 'rate', parseFloat(e.target.value))
                          }
                          InputProps={{
                            startAdornment: '$'
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          fullWidth
                          label="Amount"
                          value={formatCurrency(item.amount)}
                          disabled
                        />
                      </Grid>
                    </Grid>
                    <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        color="error"
                        onClick={() => handleRemoveItem(index)}
                      >
                        Remove
                      </Button>
                    </Box>
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
                <TextField
                  fullWidth
                  label="Notes"
                  multiline
                  rows={3}
                  value={selectedInvoice?.notes || ''}
                  onChange={(e) =>
                    setSelectedInvoice({
                      ...selectedInvoice,
                      notes: e.target.value
                    })
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Typography variant="h6">
                    Total: {formatCurrency(calculateTotal(selectedInvoice?.items || []))}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSaveInvoice} variant="contained">
              {selectedInvoice?.id ? 'Update' : 'Create'} Invoice
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default InvoiceManagement;
