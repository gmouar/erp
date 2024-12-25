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
  Chip,
  Card,
  CardContent,
  Stack,
  Alert,
  Tooltip,
  Divider
} from '@mui/material';
import {
  PictureAsPdf as PdfIcon,
  Email as EmailIcon,
  Edit as EditIcon,
  Calculate as CalculateIcon,
  AccountBalance as AccountBalanceIcon,
  LocalAtm as LocalAtmIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const PayrollManagement = () => {
  const [payrollRecords, setPayrollRecords] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [payrollSummary, setPayrollSummary] = useState({
    totalSalaries: 0,
    totalDeductions: 0,
    totalBonuses: 0,
    netPayable: 0
  });

  useEffect(() => {
    fetchPayrollRecords();
  }, [selectedMonth]);

  const fetchPayrollRecords = async () => {
    try {
      // This would be replaced with actual API call
      const mockData = [
        {
          id: 1,
          employeeId: 'EMP001',
          employeeName: 'John Doe',
          department: 'Engineering',
          position: 'Senior Software Engineer',
          basicSalary: 120000,
          allowances: 20000,
          deductions: 15000,
          bonus: 10000,
          netSalary: 135000,
          paymentStatus: 'Pending',
          bankAccount: '**** 1234',
          taxDetails: {
            taxableAmount: 140000,
            taxRate: '25%',
            taxDeducted: 35000
          }
        },
        {
          id: 2,
          employeeId: 'EMP002',
          employeeName: 'Jane Smith',
          department: 'Marketing',
          position: 'Marketing Manager',
          basicSalary: 90000,
          allowances: 15000,
          deductions: 10000,
          bonus: 5000,
          netSalary: 100000,
          paymentStatus: 'Paid',
          bankAccount: '**** 5678',
          taxDetails: {
            taxableAmount: 105000,
            taxRate: '20%',
            taxDeducted: 21000
          }
        }
      ];

      setPayrollRecords(mockData);
      calculatePayrollSummary(mockData);
    } catch (error) {
      console.error('Error fetching payroll records:', error);
    }
  };

  const calculatePayrollSummary = (records) => {
    const summary = records.reduce((acc, record) => {
      acc.totalSalaries += record.basicSalary;
      acc.totalDeductions += record.deductions;
      acc.totalBonuses += record.bonus;
      acc.netPayable += record.netSalary;
      return acc;
    }, {
      totalSalaries: 0,
      totalDeductions: 0,
      totalBonuses: 0,
      netPayable: 0
    });

    setPayrollSummary(summary);
  };

  const handleOpenDialog = (record = null) => {
    setSelectedRecord(record);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedRecord(null);
    setOpenDialog(false);
  };

  const handleProcessPayroll = async () => {
    try {
      // This would be replaced with actual API call
      const updatedRecords = payrollRecords.map(record => ({
        ...record,
        paymentStatus: 'Processing'
      }));
      setPayrollRecords(updatedRecords);
    } catch (error) {
      console.error('Error processing payroll:', error);
    }
  };

  const handleGeneratePayslip = async (employeeId) => {
    try {
      // This would be replaced with actual API call to generate PDF
      console.log(`Generating payslip for employee ${employeeId}`);
    } catch (error) {
      console.error('Error generating payslip:', error);
    }
  };

  const handleEmailPayslip = async (employeeId) => {
    try {
      // This would be replaced with actual API call to send email
      console.log(`Sending payslip email to employee ${employeeId}`);
    } catch (error) {
      console.error('Error sending payslip email:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Payroll Management
        </Typography>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocalAtmIcon color="primary" />
                  <Typography color="textSecondary">Total Salaries</Typography>
                </Box>
                <Typography variant="h4" sx={{ mt: 2 }}>
                  ${payrollSummary.totalSalaries.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TimelineIcon color="error" />
                  <Typography color="textSecondary">Total Deductions</Typography>
                </Box>
                <Typography variant="h4" sx={{ mt: 2 }}>
                  ${payrollSummary.totalDeductions.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccountBalanceIcon color="success" />
                  <Typography color="textSecondary">Total Bonuses</Typography>
                </Box>
                <Typography variant="h4" sx={{ mt: 2 }}>
                  ${payrollSummary.totalBonuses.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalculateIcon color="info" />
                  <Typography color="textSecondary">Net Payable</Typography>
                </Box>
                <Typography variant="h4" sx={{ mt: 2 }}>
                  ${payrollSummary.netPayable.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper sx={{ p: 2, mb: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <DatePicker
              label="Select Month"
              views={['year', 'month']}
              value={selectedMonth}
              onChange={setSelectedMonth}
              renderInput={(params) => <TextField {...params} />}
            />
            <Button
              variant="contained"
              startIcon={<CalculateIcon />}
              onClick={handleProcessPayroll}
            >
              Process Payroll
            </Button>
          </Stack>
        </Paper>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Basic Salary</TableCell>
                <TableCell>Allowances</TableCell>
                <TableCell>Deductions</TableCell>
                <TableCell>Bonus</TableCell>
                <TableCell>Net Salary</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payrollRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.employeeName}</TableCell>
                  <TableCell>{record.department}</TableCell>
                  <TableCell>${record.basicSalary.toLocaleString()}</TableCell>
                  <TableCell>${record.allowances.toLocaleString()}</TableCell>
                  <TableCell>${record.deductions.toLocaleString()}</TableCell>
                  <TableCell>${record.bonus.toLocaleString()}</TableCell>
                  <TableCell>${record.netSalary.toLocaleString()}</TableCell>
                  <TableCell>
                    <Chip
                      label={record.paymentStatus}
                      color={getStatusColor(record.paymentStatus)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="View/Edit Details">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(record)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Generate Payslip">
                      <IconButton
                        size="small"
                        onClick={() => handleGeneratePayslip(record.employeeId)}
                      >
                        <PdfIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Email Payslip">
                      <IconButton
                        size="small"
                        onClick={() => handleEmailPayslip(record.employeeId)}
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
          {selectedRecord && (
            <>
              <DialogTitle>
                Payroll Details - {selectedRecord.employeeName}
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={3} sx={{ mt: 1 }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Employee ID"
                      value={selectedRecord.employeeId}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Position"
                      value={selectedRecord.position}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Divider>Salary Details</Divider>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Basic Salary"
                      type="number"
                      value={selectedRecord.basicSalary}
                      InputProps={{
                        startAdornment: '$'
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Allowances"
                      type="number"
                      value={selectedRecord.allowances}
                      InputProps={{
                        startAdornment: '$'
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Deductions"
                      type="number"
                      value={selectedRecord.deductions}
                      InputProps={{
                        startAdornment: '$'
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Bonus"
                      type="number"
                      value={selectedRecord.bonus}
                      InputProps={{
                        startAdornment: '$'
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Divider>Tax Information</Divider>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Taxable Amount"
                      value={selectedRecord.taxDetails.taxableAmount}
                      InputProps={{
                        startAdornment: '$'
                      }}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Tax Rate"
                      value={selectedRecord.taxDetails.taxRate}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Tax Deducted"
                      value={selectedRecord.taxDetails.taxDeducted}
                      InputProps={{
                        startAdornment: '$'
                      }}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Divider>Payment Information</Divider>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Bank Account"
                      value={selectedRecord.bankAccount}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Payment Status</InputLabel>
                      <Select
                        value={selectedRecord.paymentStatus}
                        label="Payment Status"
                      >
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Processing">Processing</MenuItem>
                        <MenuItem value="Paid">Paid</MenuItem>
                        <MenuItem value="Failed">Failed</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                <Button variant="contained" onClick={handleCloseDialog}>
                  Save Changes
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default PayrollManagement;
