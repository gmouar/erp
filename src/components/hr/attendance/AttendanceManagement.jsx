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
  Alert
} from '@mui/material';
import {
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  AccessTime as AccessTimeIcon,
  CalendarMonth as CalendarMonthIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const AttendanceManagement = () => {
  const [attendance, setAttendance] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [summary, setSummary] = useState({
    present: 0,
    absent: 0,
    late: 0,
    onLeave: 0
  });

  const departments = ['all', 'Engineering', 'Sales', 'Marketing', 'Finance', 'HR', 'Operations'];

  useEffect(() => {
    fetchAttendance();
  }, [selectedDate, filterDepartment]);

  const fetchAttendance = async () => {
    try {
      // This would be replaced with actual API call
      const mockData = [
        {
          id: 1,
          employeeId: 'EMP001',
          employeeName: 'John Doe',
          department: 'Engineering',
          date: selectedDate.toISOString(),
          checkIn: '09:00',
          checkOut: '17:30',
          status: 'Present',
          notes: ''
        },
        {
          id: 2,
          employeeId: 'EMP002',
          employeeName: 'Jane Smith',
          department: 'Marketing',
          date: selectedDate.toISOString(),
          checkIn: '09:15',
          checkOut: '17:45',
          status: 'Late',
          notes: 'Traffic delay'
        }
      ];

      const filteredData = filterDepartment === 'all'
        ? mockData
        : mockData.filter(record => record.department === filterDepartment);

      setAttendance(filteredData);
      updateSummary(filteredData);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const updateSummary = (data) => {
    const summary = data.reduce((acc, record) => {
      acc[record.status.toLowerCase()]++;
      return acc;
    }, {
      present: 0,
      absent: 0,
      late: 0,
      onLeave: 0
    });

    setSummary(summary);
  };

  const handleOpenDialog = (record = null) => {
    setSelectedRecord(record);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedRecord(null);
    setOpenDialog(false);
  };

  const handleSaveAttendance = async () => {
    try {
      if (selectedRecord) {
        // Update existing record
        const updatedAttendance = attendance.map(record =>
          record.id === selectedRecord.id ? selectedRecord : record
        );
        setAttendance(updatedAttendance);
        updateSummary(updatedAttendance);
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving attendance:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'present':
        return 'success';
      case 'absent':
        return 'error';
      case 'late':
        return 'warning';
      case 'on leave':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'present':
        return <CheckCircleIcon color="success" />;
      case 'absent':
        return <CancelIcon color="error" />;
      case 'late':
        return <AccessTimeIcon color="warning" />;
      default:
        return null;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Attendance Management
        </Typography>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Present
                </Typography>
                <Typography variant="h4">
                  {summary.present}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Absent
                </Typography>
                <Typography variant="h4">
                  {summary.absent}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Late
                </Typography>
                <Typography variant="h4">
                  {summary.late}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  On Leave
                </Typography>
                <Typography variant="h4">
                  {summary.onLeave}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper sx={{ p: 2, mb: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <DatePicker
              label="Select Date"
              value={selectedDate}
              onChange={setSelectedDate}
              renderInput={(params) => <TextField {...params} />}
            />
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Department</InputLabel>
              <Select
                value={filterDepartment}
                label="Department"
                onChange={(e) => setFilterDepartment(e.target.value)}
              >
                {departments.map((dept) => (
                  <MenuItem key={dept} value={dept}>
                    {dept.charAt(0).toUpperCase() + dept.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Paper>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Check In</TableCell>
                <TableCell>Check Out</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Notes</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendance.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.employeeId}</TableCell>
                  <TableCell>{record.employeeName}</TableCell>
                  <TableCell>{record.department}</TableCell>
                  <TableCell>{record.checkIn}</TableCell>
                  <TableCell>{record.checkOut}</TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(record.status)}
                      label={record.status}
                      color={getStatusColor(record.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{record.notes}</TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(record)}
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            Edit Attendance Record
          </DialogTitle>
          <DialogContent>
            {selectedRecord && (
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Check In Time"
                    type="time"
                    value={selectedRecord.checkIn}
                    onChange={(e) =>
                      setSelectedRecord({
                        ...selectedRecord,
                        checkIn: e.target.value
                      })
                    }
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      step: 300
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Check Out Time"
                    type="time"
                    value={selectedRecord.checkOut}
                    onChange={(e) =>
                      setSelectedRecord({
                        ...selectedRecord,
                        checkOut: e.target.value
                      })
                    }
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      step: 300
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={selectedRecord.status}
                      label="Status"
                      onChange={(e) =>
                        setSelectedRecord({
                          ...selectedRecord,
                          status: e.target.value
                        })
                      }
                    >
                      <MenuItem value="Present">Present</MenuItem>
                      <MenuItem value="Absent">Absent</MenuItem>
                      <MenuItem value="Late">Late</MenuItem>
                      <MenuItem value="On Leave">On Leave</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Notes"
                    multiline
                    rows={3}
                    value={selectedRecord.notes}
                    onChange={(e) =>
                      setSelectedRecord({
                        ...selectedRecord,
                        notes: e.target.value
                      })
                    }
                  />
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSaveAttendance} variant="contained">
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default AttendanceManagement;
