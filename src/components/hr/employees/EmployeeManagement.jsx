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
  Tabs,
  Tab,
  Avatar,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Badge as BadgeIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  AttachMoney as AttachMoneyIcon,
  CalendarMonth as CalendarMonthIcon,
  Add as AddIcon
} from '@mui/icons-material';
import hrService from '../../../services/hrService';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [newEmployee, setNewEmployee] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    joiningDate: '',
    salary: '',
    status: 'Active'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const departments = [
    'Engineering',
    'Sales',
    'Marketing',
    'Finance',
    'HR',
    'Operations'
  ];

  const employeeStatuses = ['Active', 'On Leave', 'Terminated'];

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await hrService.getEmployees();
      setEmployees(data || []); // Ensure we always have an array
      setError(null);
    } catch (err) {
      setError('Failed to fetch employees');
      console.error('Error:', err);
      setEmployees([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEmployee = async (employeeData) => {
    try {
      await hrService.createEmployee(employeeData);
      await fetchEmployees();
      setDialogOpen(false);
    } catch (err) {
      setError('Failed to create employee');
      console.error('Error:', err);
    }
  };

  const handleUpdateEmployee = async (id, employeeData) => {
    try {
      await hrService.updateEmployee(id, employeeData);
      await fetchEmployees();
      setDialogOpen(false);
      setSelectedEmployee(null);
    } catch (err) {
      setError('Failed to update employee');
      console.error('Error:', err);
    }
  };

  const handleOpenDialog = (employee = null) => {
    if (employee) {
      setSelectedEmployee(employee);
      setNewEmployee(employee);
    } else {
      setSelectedEmployee(null);
      setNewEmployee({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        department: '',
        position: '',
        joiningDate: '',
        salary: '',
        status: 'Active'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEmployee(null);
  };

  const handleOpenDetailsDialog = (employee) => {
    setSelectedEmployee(employee);
    setOpenDetailsDialog(true);
  };

  const handleCloseDetailsDialog = () => {
    setOpenDetailsDialog(false);
    setSelectedEmployee(null);
    setTabValue(0);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSaveEmployee = async () => {
    try {
      if (selectedEmployee) {
        // Update existing employee
        const updatedEmployees = employees.map(emp =>
          emp.id === selectedEmployee.id ? { ...emp, ...newEmployee } : emp
        );
        setEmployees(updatedEmployees);
      } else {
        // Create new employee
        const employee = {
          id: employees.length + 1,
          ...newEmployee
        };
        setEmployees([...employees, employee]);
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    try {
      setEmployees(employees.filter(emp => emp.id !== employeeId));
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const renderDetailsTab = () => {
    if (!selectedEmployee) return null;

    switch (tabValue) {
      case 0: // Personal Info
        return (
          <List>
            <ListItem>
              <ListItemIcon><EmailIcon /></ListItemIcon>
              <ListItemText primary="Email" secondary={selectedEmployee.email} />
            </ListItem>
            <ListItem>
              <ListItemIcon><PhoneIcon /></ListItemIcon>
              <ListItemText primary="Phone" secondary={selectedEmployee.phone} />
            </ListItem>
            <ListItem>
              <ListItemIcon><BadgeIcon /></ListItemIcon>
              <ListItemText primary="Department" secondary={selectedEmployee.department} />
            </ListItem>
            <ListItem>
              <ListItemIcon><WorkIcon /></ListItemIcon>
              <ListItemText primary="Position" secondary={selectedEmployee.position} />
            </ListItem>
            <ListItem>
              <ListItemIcon><CalendarMonthIcon /></ListItemIcon>
              <ListItemText 
                primary="Joining Date" 
                secondary={new Date(selectedEmployee.joiningDate).toLocaleDateString()} 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><AttachMoneyIcon /></ListItemIcon>
              <ListItemText 
                primary="Salary" 
                secondary={`$${parseInt(selectedEmployee.salary).toLocaleString()}`} 
              />
            </ListItem>
          </List>
        );

      case 1: // Education & Skills
        return (
          <Box>
            <Typography variant="h6" gutterBottom>Education</Typography>
            {selectedEmployee.education.map((edu, index) => (
              <Card key={index} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1">{edu.degree}</Typography>
                  <Typography color="textSecondary">{edu.institution}</Typography>
                  <Typography variant="body2">Year: {edu.year}</Typography>
                </CardContent>
              </Card>
            ))}

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Skills</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {selectedEmployee.skills.map((skill) => (
                <Chip key={skill} label={skill} />
              ))}
            </Box>
          </Box>
        );

      case 2: // Documents
        return (
          <List>
            {selectedEmployee.documents.map((doc, index) => (
              <ListItem key={index}>
                <ListItemText primary={doc.name} />
                <Button href={doc.url} target="_blank">
                  View
                </Button>
              </ListItem>
            ))}
          </List>
        );

      case 3: // Emergency Contact
        return (
          <List>
            <ListItem>
              <ListItemText 
                primary="Emergency Contact" 
                secondary={selectedEmployee.emergencyContact.name} 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Relationship" 
                secondary={selectedEmployee.emergencyContact.relationship} 
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Phone" 
                secondary={selectedEmployee.emergencyContact.phone} 
              />
            </ListItem>
          </List>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Employee Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Employee
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees?.map((employee) => ( // Add null check with optional chaining
              <TableRow key={employee.id}>
                <TableCell>
                  {`${employee.firstName} ${employee.lastName}`}
                </TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>{employee.position}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>
                  <Chip
                    label={employee.status}
                    color={employee.status === 'Active' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDetailsDialog(employee)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(employee)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteEmployee(employee.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Employee Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedEmployee ? 'Edit Employee' : 'Add New Employee'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value={newEmployee.firstName}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, firstName: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={newEmployee.lastName}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, lastName: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={newEmployee.email}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, email: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={newEmployee.phone}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, phone: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  value={newEmployee.department}
                  label="Department"
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, department: e.target.value })
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
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Position"
                value={newEmployee.position}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, position: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Joining Date"
                type="date"
                value={newEmployee.joiningDate}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, joiningDate: e.target.value })
                }
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Salary"
                type="number"
                value={newEmployee.salary}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, salary: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={newEmployee.status}
                  label="Status"
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, status: e.target.value })
                  }
                >
                  {employeeStatuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveEmployee} variant="contained">
            {selectedEmployee ? 'Update' : 'Add'} Employee
          </Button>
        </DialogActions>
      </Dialog>

      {/* Employee Details Dialog */}
      <Dialog
        open={openDetailsDialog}
        onClose={handleCloseDetailsDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedEmployee && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  {selectedEmployee.firstName.charAt(0)}
                  {selectedEmployee.lastName.charAt(0)}
                </Avatar>
                <Typography variant="h6">
                  {`${selectedEmployee.firstName} ${selectedEmployee.lastName}`}
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
              >
                <Tab label="Personal Info" />
                <Tab label="Education & Skills" />
                <Tab label="Documents" />
                <Tab label="Emergency Contact" />
              </Tabs>
              {renderDetailsTab()}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDetailsDialog}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default EmployeeManagement;
