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
  LinearProgress,
  Tooltip,
  Alert
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const BudgetManagement = () => {
  const [budgets, setBudgets] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [budgetSummary, setBudgetSummary] = useState({
    totalBudget: 0,
    totalSpent: 0,
    totalRemaining: 0
  });

  const departments = [
    'Engineering',
    'Sales',
    'Marketing',
    'Finance',
    'HR',
    'Operations'
  ];

  useEffect(() => {
    fetchBudgets();
  }, [selectedYear]);

  const fetchBudgets = async () => {
    try {
      // This would be replaced with actual API call
      const mockData = [
        {
          id: 1,
          department: 'Engineering',
          totalBudget: 500000,
          spent: 250000,
          remaining: 250000,
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          categories: {
            'Software Licenses': 150000,
            'Hardware': 200000,
            'Training': 100000,
            'Miscellaneous': 50000
          },
          expenses: [
            { month: 'Jan', amount: 30000 },
            { month: 'Feb', amount: 45000 },
            { month: 'Mar', amount: 35000 }
          ]
        },
        {
          id: 2,
          department: 'Marketing',
          totalBudget: 300000,
          spent: 180000,
          remaining: 120000,
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          categories: {
            'Advertising': 150000,
            'Events': 100000,
            'Content Creation': 30000,
            'Tools': 20000
          },
          expenses: [
            { month: 'Jan', amount: 25000 },
            { month: 'Feb', amount: 35000 },
            { month: 'Mar', amount: 40000 }
          ]
        }
      ];

      setBudgets(mockData);
      calculateBudgetSummary(mockData);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  };

  const calculateBudgetSummary = (budgetData) => {
    const summary = budgetData.reduce((acc, budget) => {
      acc.totalBudget += budget.totalBudget;
      acc.totalSpent += budget.spent;
      acc.totalRemaining += budget.remaining;
      return acc;
    }, {
      totalBudget: 0,
      totalSpent: 0,
      totalRemaining: 0
    });

    setBudgetSummary(summary);
  };

  const handleOpenDialog = (budget = null) => {
    setSelectedBudget(budget);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedBudget(null);
    setOpenDialog(false);
  };

  const handleSaveBudget = async () => {
    try {
      // This would be replaced with actual API call
      if (selectedBudget) {
        const updatedBudgets = budgets.map(budget =>
          budget.id === selectedBudget.id ? selectedBudget : budget
        );
        setBudgets(updatedBudgets);
        calculateBudgetSummary(updatedBudgets);
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving budget:', error);
    }
  };

  const getSpendingStatus = (spent, total) => {
    const percentage = (spent / total) * 100;
    if (percentage >= 90) return 'error';
    if (percentage >= 70) return 'warning';
    return 'success';
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
          Budget Management
        </Typography>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Budget
                </Typography>
                <Typography variant="h4">
                  {formatCurrency(budgetSummary.totalBudget)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Spent
                </Typography>
                <Typography variant="h4">
                  {formatCurrency(budgetSummary.totalSpent)}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(budgetSummary.totalSpent / budgetSummary.totalBudget) * 100}
                  color={getSpendingStatus(budgetSummary.totalSpent, budgetSummary.totalBudget)}
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Remaining Budget
                </Typography>
                <Typography variant="h4">
                  {formatCurrency(budgetSummary.totalRemaining)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Year</InputLabel>
              <Select
                value={selectedYear}
                label="Year"
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                {[2023, 2024, 2025].map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Add Budget
            </Button>
          </Box>

          <Box sx={{ height: 300, mb: 3 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={budgets.map(budget => ({
                  department: budget.department,
                  budget: budget.totalBudget,
                  spent: budget.spent
                }))}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis />
                <ChartTooltip />
                <Legend />
                <Bar dataKey="budget" name="Total Budget" fill="#8884d8" />
                <Bar dataKey="spent" name="Spent" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Department</TableCell>
                <TableCell align="right">Total Budget</TableCell>
                <TableCell align="right">Spent</TableCell>
                <TableCell align="right">Remaining</TableCell>
                <TableCell>Progress</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {budgets.map((budget) => (
                <TableRow key={budget.id}>
                  <TableCell>{budget.department}</TableCell>
                  <TableCell align="right">
                    {formatCurrency(budget.totalBudget)}
                  </TableCell>
                  <TableCell align="right">
                    {formatCurrency(budget.spent)}
                  </TableCell>
                  <TableCell align="right">
                    {formatCurrency(budget.remaining)}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LinearProgress
                        variant="determinate"
                        value={(budget.spent / budget.totalBudget) * 100}
                        color={getSpendingStatus(budget.spent, budget.totalBudget)}
                        sx={{ flexGrow: 1, mr: 1 }}
                      />
                      <Typography variant="body2">
                        {Math.round((budget.spent / budget.totalBudget) * 100)}%
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {budget.remaining < budget.totalBudget * 0.1 && (
                      <Tooltip title="Low Budget Warning">
                        <WarningIcon color="error" />
                      </Tooltip>
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(budget)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small">
                      <AssessmentIcon />
                    </IconButton>
                    <IconButton size="small">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {selectedBudget ? 'Edit Budget' : 'Create New Budget'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={selectedBudget?.department || ''}
                    label="Department"
                    onChange={(e) =>
                      setSelectedBudget({
                        ...selectedBudget,
                        department: e.target.value
                      })
                    }
                  >
                    {departments.map((dept) => (
                      <MenuItem key={dept} value={dept}>
                        {dept}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Total Budget"
                  type="number"
                  value={selectedBudget?.totalBudget || ''}
                  onChange={(e) =>
                    setSelectedBudget({
                      ...selectedBudget,
                      totalBudget: parseFloat(e.target.value)
                    })
                  }
                  InputProps={{
                    startAdornment: '$'
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Start Date"
                  value={selectedBudget?.startDate || null}
                  onChange={(date) =>
                    setSelectedBudget({
                      ...selectedBudget,
                      startDate: date
                    })
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="End Date"
                  value={selectedBudget?.endDate || null}
                  onChange={(date) =>
                    setSelectedBudget({
                      ...selectedBudget,
                      endDate: date
                    })
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSaveBudget} variant="contained">
              {selectedBudget ? 'Update' : 'Create'} Budget
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default BudgetManagement;
