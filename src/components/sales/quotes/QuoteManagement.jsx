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
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PictureAsPdf as PdfIcon,
  Email as EmailIcon,
  ShoppingCart as OrderIcon,
  Calculate as CalculateIcon,
  LocalOffer as DiscountIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const QuoteManagement = () => {
  const [quotes, setQuotes] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [quoteSummary, setQuoteSummary] = useState({
    totalQuotes: 0,
    pendingQuotes: 0,
    acceptedQuotes: 0,
    totalValue: 0
  });

  const quoteStatuses = [
    'Draft',
    'Sent',
    'Under Review',
    'Accepted',
    'Rejected',
    'Expired'
  ];

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      // This would be replaced with actual API call
      const mockData = [
        {
          id: 'QT-2024-001',
          customer: {
            name: 'Tech Solutions Inc',
            email: 'contact@techsolutions.com',
            address: '123 Tech St, Silicon Valley'
          },
          date: '2024-02-15',
          validUntil: '2024-03-15',
          status: 'Sent',
          items: [
            {
              description: 'Enterprise Software License',
              quantity: 1,
              unitPrice: 10000,
              discount: 1000,
              tax: 900,
              total: 9900
            },
            {
              description: 'Implementation Service',
              quantity: 40,
              unitPrice: 150,
              discount: 0,
              tax: 600,
              total: 6600
            }
          ],
          subtotal: 16000,
          totalDiscount: 1000,
          totalTax: 1500,
          total: 16500,
          terms: 'Net 30',
          notes: 'Includes 1 year support'
        },
        {
          id: 'QT-2024-002',
          customer: {
            name: 'Global Manufacturing Ltd',
            email: 'procurement@globalmanuf.com',
            address: '456 Industrial Ave, Detroit'
          },
          date: '2024-02-16',
          validUntil: '2024-03-16',
          status: 'Under Review',
          items: [
            {
              description: 'Production Management System',
              quantity: 1,
              unitPrice: 25000,
              discount: 2500,
              tax: 2250,
              total: 24750
            }
          ],
          subtotal: 25000,
          totalDiscount: 2500,
          totalTax: 2250,
          total: 24750,
          terms: 'Net 45',
          notes: 'Custom implementation included'
        }
      ];

      setQuotes(mockData);
      calculateQuoteSummary(mockData);
    } catch (error) {
      console.error('Error fetching quotes:', error);
    }
  };

  const calculateQuoteSummary = (quotesData) => {
    const summary = quotesData.reduce((acc, quote) => {
      acc.totalQuotes++;
      acc.totalValue += quote.total;
      
      switch (quote.status.toLowerCase()) {
        case 'sent':
        case 'under review':
          acc.pendingQuotes++;
          break;
        case 'accepted':
          acc.acceptedQuotes++;
          break;
      }
      
      return acc;
    }, {
      totalQuotes: 0,
      pendingQuotes: 0,
      acceptedQuotes: 0,
      totalValue: 0
    });

    setQuoteSummary(summary);
  };

  const handleOpenDialog = (quote = null) => {
    setSelectedQuote(quote || {
      customer: {
        name: '',
        email: '',
        address: ''
      },
      date: new Date(),
      validUntil: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      status: 'Draft',
      items: [],
      terms: 'Net 30',
      notes: ''
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedQuote(null);
    setOpenDialog(false);
  };

  const handleAddItem = () => {
    setSelectedQuote({
      ...selectedQuote,
      items: [
        ...selectedQuote.items,
        {
          description: '',
          quantity: 1,
          unitPrice: 0,
          discount: 0,
          tax: 0,
          total: 0
        }
      ]
    });
  };

  const handleUpdateItem = (index, field, value) => {
    const updatedItems = selectedQuote.items.map((item, i) => {
      if (i === index) {
        const updatedItem = { ...item, [field]: value };
        // Recalculate item total
        const subtotal = updatedItem.quantity * updatedItem.unitPrice;
        updatedItem.total = subtotal - updatedItem.discount + updatedItem.tax;
        return updatedItem;
      }
      return item;
    });

    // Recalculate quote totals
    const subtotal = updatedItems.reduce((sum, item) => 
      sum + (item.quantity * item.unitPrice), 0
    );
    const totalDiscount = updatedItems.reduce((sum, item) => 
      sum + item.discount, 0
    );
    const totalTax = updatedItems.reduce((sum, item) => 
      sum + item.tax, 0
    );
    const total = subtotal - totalDiscount + totalTax;

    setSelectedQuote({
      ...selectedQuote,
      items: updatedItems,
      subtotal,
      totalDiscount,
      totalTax,
      total
    });
  };

  const handleRemoveItem = (index) => {
    const updatedItems = selectedQuote.items.filter((_, i) => i !== index);
    
    // Recalculate quote totals
    const subtotal = updatedItems.reduce((sum, item) => 
      sum + (item.quantity * item.unitPrice), 0
    );
    const totalDiscount = updatedItems.reduce((sum, item) => 
      sum + item.discount, 0
    );
    const totalTax = updatedItems.reduce((sum, item) => 
      sum + item.tax, 0
    );
    const total = subtotal - totalDiscount + totalTax;

    setSelectedQuote({
      ...selectedQuote,
      items: updatedItems,
      subtotal,
      totalDiscount,
      totalTax,
      total
    });
  };

  const handleSaveQuote = async () => {
    try {
      if (selectedQuote.id) {
        // Update existing quote
        const updatedQuotes = quotes.map(quote =>
          quote.id === selectedQuote.id ? selectedQuote : quote
        );
        setQuotes(updatedQuotes);
        calculateQuoteSummary(updatedQuotes);
      } else {
        // Create new quote
        const newQuote = {
          ...selectedQuote,
          id: `QT-${new Date().getFullYear()}-${(quotes.length + 1).toString().padStart(3, '0')}`
        };
        const updatedQuotes = [...quotes, newQuote];
        setQuotes(updatedQuotes);
        calculateQuoteSummary(updatedQuotes);
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving quote:', error);
    }
  };

  const handleGeneratePDF = async (quoteId) => {
    try {
      // This would be replaced with actual PDF generation logic
      console.log(`Generating PDF for quote ${quoteId}`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const handleSendEmail = async (quoteId) => {
    try {
      // This would be replaced with actual email sending logic
      console.log(`Sending email for quote ${quoteId}`);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const handleCreateOrder = async (quoteId) => {
    try {
      // This would be replaced with actual order creation logic
      console.log(`Creating order from quote ${quoteId}`);
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'error';
      case 'sent':
      case 'under review':
        return 'warning';
      case 'expired':
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
          Quote Management
        </Typography>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Quotes
                </Typography>
                <Typography variant="h4">
                  {quoteSummary.totalQuotes}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Pending Quotes
                </Typography>
                <Typography variant="h4" color="warning.main">
                  {quoteSummary.pendingQuotes}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Accepted Quotes
                </Typography>
                <Typography variant="h4" color="success.main">
                  {quoteSummary.acceptedQuotes}
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
                  {formatCurrency(quoteSummary.totalValue)}
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
            Create Quote
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Quote #</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Valid Until</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {quotes.map((quote) => (
                <TableRow key={quote.id}>
                  <TableCell>{quote.id}</TableCell>
                  <TableCell>{quote.customer.name}</TableCell>
                  <TableCell>
                    {new Date(quote.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(quote.validUntil).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{formatCurrency(quote.total)}</TableCell>
                  <TableCell>
                    <Chip
                      label={quote.status}
                      color={getStatusColor(quote.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(quote)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Generate PDF">
                      <IconButton
                        size="small"
                        onClick={() => handleGeneratePDF(quote.id)}
                      >
                        <PdfIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Send Email">
                      <IconButton
                        size="small"
                        onClick={() => handleSendEmail(quote.id)}
                      >
                        <EmailIcon />
                      </IconButton>
                    </Tooltip>
                    {quote.status === 'Accepted' && (
                      <Tooltip title="Create Order">
                        <IconButton
                          size="small"
                          onClick={() => handleCreateOrder(quote.id)}
                        >
                          <OrderIcon />
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
            {selectedQuote?.id ? 'Edit Quote' : 'Create New Quote'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Customer Information
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Customer Name"
                  value={selectedQuote?.customer?.name || ''}
                  onChange={(e) =>
                    setSelectedQuote({
                      ...selectedQuote,
                      customer: {
                        ...selectedQuote.customer,
                        name: e.target.value
                      }
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  value={selectedQuote?.customer?.email || ''}
                  onChange={(e) =>
                    setSelectedQuote({
                      ...selectedQuote,
                      customer: {
                        ...selectedQuote.customer,
                        email: e.target.value
                      }
                    })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  value={selectedQuote?.customer?.address || ''}
                  onChange={(e) =>
                    setSelectedQuote({
                      ...selectedQuote,
                      customer: {
                        ...selectedQuote.customer,
                        address: e.target.value
                      }
                    })
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Quote Date"
                  value={selectedQuote?.date || null}
                  onChange={(date) =>
                    setSelectedQuote({
                      ...selectedQuote,
                      date
                    })
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Valid Until"
                  value={selectedQuote?.validUntil || null}
                  onChange={(date) =>
                    setSelectedQuote({
                      ...selectedQuote,
                      validUntil: date
                    })
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }}>Quote Items</Divider>
                {selectedQuote?.items?.map((item, index) => (
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
                            handleUpdateItem(index, 'quantity', parseInt(e.target.value))
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
                          label="Discount"
                          type="number"
                          value={item.discount}
                          onChange={(e) =>
                            handleUpdateItem(index, 'discount', parseFloat(e.target.value))
                          }
                          InputProps={{
                            startAdornment: '$'
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          fullWidth
                          label="Tax"
                          type="number"
                          value={item.tax}
                          onChange={(e) =>
                            handleUpdateItem(index, 'tax', parseFloat(e.target.value))
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
                <Divider sx={{ my: 2 }}>Quote Summary</Divider>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Terms"
                      value={selectedQuote?.terms || ''}
                      onChange={(e) =>
                        setSelectedQuote({
                          ...selectedQuote,
                          terms: e.target.value
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={selectedQuote?.status || ''}
                        label="Status"
                        onChange={(e) =>
                          setSelectedQuote({
                            ...selectedQuote,
                            status: e.target.value
                          })
                        }
                      >
                        {quoteStatuses.map((status) => (
                          <MenuItem key={status} value={status}>
                            {status}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Notes"
                      multiline
                      rows={3}
                      value={selectedQuote?.notes || ''}
                      onChange={(e) =>
                        setSelectedQuote({
                          ...selectedQuote,
                          notes: e.target.value
                        })
                      }
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Totals
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        label="Subtotal"
                        value={formatCurrency(selectedQuote?.subtotal || 0)}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        label="Total Discount"
                        value={formatCurrency(selectedQuote?.totalDiscount || 0)}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        label="Total Tax"
                        value={formatCurrency(selectedQuote?.totalTax || 0)}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        label="Total"
                        value={formatCurrency(selectedQuote?.total || 0)}
                        disabled
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSaveQuote} variant="contained">
              {selectedQuote?.id ? 'Update' : 'Create'} Quote
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default QuoteManagement;
