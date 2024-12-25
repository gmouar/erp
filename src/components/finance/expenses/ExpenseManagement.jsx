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
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Receipt as ReceiptIcon,
  AttachFile as AttachFileIcon,
  Comment as CommentIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const approvalSteps = ['Submitted', 'Manager Review', 'Finance Review', 'Approved'];

const ExpenseManagement = () => {
  const [expenses, setExpenses] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [expenseSummary, setExpenseSummary] = useState({
    totalSubmitted: 0,
    totalApproved: 0,
    totalPending: 0,
    totalRejected: 0
  });

  const expenseCategories = [
    'Travel',
    'Office Supplies',
    'Software',
    'Hardware',
    'Training',
    'Entertainment',
    'Miscellaneous'
  ];

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      // This would be replaced with actual API call
      const mockData = [
        {
          id: 1,
          employeeId: 'EMP001',
          employeeName: 'John Doe',
          category: 'Travel',
          amount: 1500,
          date: '2024-02-15',
          description: 'Business trip to New York',
          status: 'Pending',
          currentStep: 1,
          receipts: ['receipt1.pdf'],
          comments: [
            {
              author: 'Manager',
              text: 'Please provide hotel invoice',
              date: '2024-02-16'
            }
          ]
        },
        {
          id: 2,
          employeeId: 'EMP002',
          employeeName: 'Jane Smith',
          category: 'Office Supplies',
          amount: 500,
          date: '2024-02-14',
          description: 'Office stationery and printer cartridges',
          status: 'Approved',
          currentStep: 3,
          receipts: ['receipt2.pdf'],
          comments: []
        }
      ];

      setExpenses(mockData);
      calculateExpenseSummary(mockData);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const calculateExpenseSummary = (expenseData) => {
    const summary = expenseData.reduce((acc, expense) => {
      acc.totalSubmitted += expense.amount;
      switch (expense.status.toLowerCase()) {
        case 'approved':
          acc.totalApproved += expense.amount;
          break;
        case 'pending':
          acc.totalPending += expense.amount;
          break;
        case 'rejected':
          acc.totalRejected += expense.amount;
          break;
      }
      return acc;
    }, {
      totalSubmitted: 0,
      totalApproved: 0,
      totalPending: 0,
      totalRejected: 0
    });

    setExpenseSummary(summary);
  };

  const handleOpenDialog = (expense = null) => {
    setSelectedExpense(expense);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedExpense(null);
    setOpenDialog(false);
  };

  const handleSaveExpense = async () => {
    try {
      if (selectedExpense) {
        const updatedExpenses = expenses.map(expense =>
          expense.id === selectedExpense.id ? selectedExpense : expense
        );
        setExpenses(updatedExpenses);
        calculateExpenseSummary(updatedExpenses);
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving expense:', error);
    }
  };

  const handleUpdateStatus = async (expenseId, newStatus) => {
    try {
      const updatedExpenses = expenses.map(expense =>
        expense.id === expenseId
          ? { ...expense, status: newStatus }
          : expense
      );
      setExpenses(updatedExpenses);
      calculateExpenseSummary(updatedExpenses);
    } catch (error) {
      console.error('Error updating expense status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'pending':
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
          Expense Management
        </Typography>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Submitted
                </Typography>
                <Typography variant="h4">
                  {formatCurrency(expenseSummary.totalSubmitted)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Approved
                </Typography>
                <Typography variant="h4" color="success.main">
                  {formatCurrency(expenseSummary.totalApproved)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Pending Approval
                </Typography>
                <Typography variant="h4" color="warning.main">
                  {formatCurrency(expenseSummary.totalPending)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Rejected
                </Typography>
                <Typography variant="h4" color="error.main">
                  {formatCurrency(expenseSummary.totalRejected)}
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
            Submit Expense
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Progress</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{expense.employeeName}</TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>{formatCurrency(expense.amount)}</TableCell>
                  <TableCell>
                    {new Date(expense.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>
                    <Chip
                      label={expense.status}
                      color={getStatusColor(expense.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Stepper activeStep={expense.currentStep} alternativeLabel>
                      {approvalSteps.map((label) => (
                        <Step key={label}>
                          <StepLabel>{label}</StepLabel>
                        </Step>
                      ))}
                    </Stepper>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(expense)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    {expense.status === 'Pending' && (
                      <>
                        <Tooltip title="Approve">
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => handleUpdateStatus(expense.id, 'Approved')}
                          >
                            <CheckCircleIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Reject">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleUpdateStatus(expense.id, 'Rejected')}
                          >
                            <CancelIcon />
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
            {selectedExpense ? 'Expense Details' : 'Submit New Expense'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={selectedExpense?.category || ''}
                    label="Category"
                    onChange={(e) =>
                      setSelectedExpense({
                        ...selectedExpense,
                        category: e.target.value
                      })
                    }
                  >
                    {expenseCategories.map((category) => (
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
                  label="Amount"
                  type="number"
                  value={selectedExpense?.amount || ''}
                  onChange={(e) =>
                    setSelectedExpense({
                      ...selectedExpense,
                      amount: parseFloat(e.target.value)
                    })
                  }
                  InputProps={{
                    startAdornment: '$'
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Date"
                  value={selectedExpense?.date || null}
                  onChange={(date) =>
                    setSelectedExpense({
                      ...selectedExpense,
                      date
                    })
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={selectedExpense?.description || ''}
                  onChange={(e) =>
                    setSelectedExpense({
                      ...selectedExpense,
                      description: e.target.value
                    })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  startIcon={<AttachFileIcon />}
                  component="label"
                >
                  Attach Receipt
                  <input
                    type="file"
                    hidden
                    accept="image/*,.pdf"
                    onChange={(e) => {
                      // Handle file upload
                      console.log('File selected:', e.target.files[0]);
                    }}
                  />
                </Button>
              </Grid>
              {selectedExpense?.comments?.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Comments
                  </Typography>
                  {selectedExpense.comments.map((comment, index) => (
                    <Box key={index} sx={{ mb: 1 }}>
                      <Typography variant="body2" color="textSecondary">
                        {comment.author} - {new Date(comment.date).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body1">{comment.text}</Typography>
                    </Box>
                  ))}
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSaveExpense} variant="contained">
              {selectedExpense ? 'Update' : 'Submit'} Expense
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default ExpenseManagement;
