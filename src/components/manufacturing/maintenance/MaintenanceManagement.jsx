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
  Build as BuildIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Engineering as EngineeringIcon
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const MaintenanceManagement = () => {
  const [maintenanceTasks, setMaintenanceTasks] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [maintenanceSummary, setMaintenanceSummary] = useState({
    totalTasks: 0,
    completed: 0,
    pending: 0,
    overdue: 0
  });

  const maintenanceTypes = [
    'Preventive',
    'Corrective',
    'Predictive',
    'Routine',
    'Emergency'
  ];

  const priorities = ['Low', 'Medium', 'High', 'Critical'];

  useEffect(() => {
    fetchMaintenanceTasks();
  }, []);

  const fetchMaintenanceTasks = async () => {
    try {
      // This would be replaced with actual API call
      const mockData = [
        {
          id: 'MT-2024-001',
          equipmentId: 'EQ001',
          equipmentName: 'Production Line A',
          type: 'Preventive',
          description: 'Monthly maintenance check',
          assignedTo: 'John Smith',
          scheduledDate: '2024-02-20T10:00:00',
          status: 'Pending',
          priority: 'High',
          estimatedDuration: '2 hours',
          parts: [
            { name: 'Filter', quantity: 2 },
            { name: 'Lubricant', quantity: 1 }
          ],
          lastMaintenance: '2024-01-20T10:00:00',
          notes: 'Regular maintenance schedule'
        },
        {
          id: 'MT-2024-002',
          equipmentId: 'EQ002',
          equipmentName: 'CNC Machine B',
          type: 'Corrective',
          description: 'Repair hydraulic system',
          assignedTo: 'Mike Johnson',
          scheduledDate: '2024-02-18T14:00:00',
          status: 'In Progress',
          priority: 'Critical',
          estimatedDuration: '4 hours',
          parts: [
            { name: 'Hydraulic Pump', quantity: 1 },
            { name: 'Seals', quantity: 4 }
          ],
          lastMaintenance: '2024-02-01T09:00:00',
          notes: 'Urgent repair needed'
        }
      ];

      setMaintenanceTasks(mockData);
      calculateMaintenanceSummary(mockData);
    } catch (error) {
      console.error('Error fetching maintenance tasks:', error);
    }
  };

  const calculateMaintenanceSummary = (tasks) => {
    const summary = tasks.reduce((acc, task) => {
      acc.totalTasks++;
      switch (task.status.toLowerCase()) {
        case 'completed':
          acc.completed++;
          break;
        case 'pending':
        case 'in progress':
          acc.pending++;
          break;
        case 'overdue':
          acc.overdue++;
          break;
      }
      return acc;
    }, {
      totalTasks: 0,
      completed: 0,
      pending: 0,
      overdue: 0
    });

    setMaintenanceSummary(summary);
  };

  const handleOpenDialog = (task = null) => {
    setSelectedTask(task || {
      equipmentId: '',
      equipmentName: '',
      type: '',
      description: '',
      assignedTo: '',
      scheduledDate: new Date(),
      status: 'Pending',
      priority: 'Medium',
      estimatedDuration: '',
      parts: [],
      notes: ''
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedTask(null);
    setOpenDialog(false);
  };

  const handleAddPart = () => {
    setSelectedTask({
      ...selectedTask,
      parts: [
        ...selectedTask.parts,
        { name: '', quantity: 1 }
      ]
    });
  };

  const handleUpdatePart = (index, field, value) => {
    const updatedParts = selectedTask.parts.map((part, i) => {
      if (i === index) {
        return { ...part, [field]: value };
      }
      return part;
    });

    setSelectedTask({
      ...selectedTask,
      parts: updatedParts
    });
  };

  const handleRemovePart = (index) => {
    setSelectedTask({
      ...selectedTask,
      parts: selectedTask.parts.filter((_, i) => i !== index)
    });
  };

  const handleSaveTask = async () => {
    try {
      if (selectedTask.id) {
        // Update existing task
        const updatedTasks = maintenanceTasks.map(task =>
          task.id === selectedTask.id ? selectedTask : task
        );
        setMaintenanceTasks(updatedTasks);
        calculateMaintenanceSummary(updatedTasks);
      } else {
        // Create new task
        const newTask = {
          ...selectedTask,
          id: `MT-${new Date().getFullYear()}-${(maintenanceTasks.length + 1).toString().padStart(3, '0')}`
        };
        const updatedTasks = [...maintenanceTasks, newTask];
        setMaintenanceTasks(updatedTasks);
        calculateMaintenanceSummary(updatedTasks);
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving maintenance task:', error);
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      const updatedTasks = maintenanceTasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      );
      setMaintenanceTasks(updatedTasks);
      calculateMaintenanceSummary(updatedTasks);
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'in progress':
        return 'info';
      case 'pending':
        return 'warning';
      case 'overdue':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'critical':
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
          Maintenance Management
        </Typography>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Tasks
                </Typography>
                <Typography variant="h4">
                  {maintenanceSummary.totalTasks}
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
                  {maintenanceSummary.completed}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Pending
                </Typography>
                <Typography variant="h4" color="warning.main">
                  {maintenanceSummary.pending}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Overdue
                </Typography>
                <Typography variant="h4" color="error.main">
                  {maintenanceSummary.overdue}
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
            Schedule Maintenance
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Equipment</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Scheduled Date</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {maintenanceTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.id}</TableCell>
                  <TableCell>{task.equipmentName}</TableCell>
                  <TableCell>{task.type}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>{task.assignedTo}</TableCell>
                  <TableCell>
                    {new Date(task.scheduledDate).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={task.priority}
                      color={getPriorityColor(task.priority)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={task.status}
                      color={getStatusColor(task.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(task)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    {task.status !== 'Completed' && (
                      <Tooltip title="Mark as Completed">
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleUpdateStatus(task.id, 'Completed')}
                        >
                          <CheckCircleIcon />
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
            {selectedTask?.id ? 'Edit Maintenance Task' : 'Schedule Maintenance Task'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Equipment ID"
                  value={selectedTask?.equipmentId || ''}
                  onChange={(e) =>
                    setSelectedTask({
                      ...selectedTask,
                      equipmentId: e.target.value
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Equipment Name"
                  value={selectedTask?.equipmentName || ''}
                  onChange={(e) =>
                    setSelectedTask({
                      ...selectedTask,
                      equipmentName: e.target.value
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Maintenance Type</InputLabel>
                  <Select
                    value={selectedTask?.type || ''}
                    label="Maintenance Type"
                    onChange={(e) =>
                      setSelectedTask({
                        ...selectedTask,
                        type: e.target.value
                      })
                    }
                  >
                    {maintenanceTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={selectedTask?.priority || ''}
                    label="Priority"
                    onChange={(e) =>
                      setSelectedTask({
                        ...selectedTask,
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
                  label="Description"
                  multiline
                  rows={3}
                  value={selectedTask?.description || ''}
                  onChange={(e) =>
                    setSelectedTask({
                      ...selectedTask,
                      description: e.target.value
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Assigned To"
                  value={selectedTask?.assignedTo || ''}
                  onChange={(e) =>
                    setSelectedTask({
                      ...selectedTask,
                      assignedTo: e.target.value
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Estimated Duration"
                  value={selectedTask?.estimatedDuration || ''}
                  onChange={(e) =>
                    setSelectedTask({
                      ...selectedTask,
                      estimatedDuration: e.target.value
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DateTimePicker
                  label="Scheduled Date"
                  value={selectedTask?.scheduledDate || null}
                  onChange={(date) =>
                    setSelectedTask({
                      ...selectedTask,
                      scheduledDate: date
                    })
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Required Parts
                </Typography>
                {selectedTask?.parts.map((part, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={8}>
                        <TextField
                          fullWidth
                          label="Part Name"
                          value={part.name}
                          onChange={(e) =>
                            handleUpdatePart(index, 'name', e.target.value)
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          fullWidth
                          label="Quantity"
                          type="number"
                          value={part.quantity}
                          onChange={(e) =>
                            handleUpdatePart(index, 'quantity', parseInt(e.target.value))
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <IconButton
                          color="error"
                          onClick={() => handleRemovePart(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Box>
                ))}
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddPart}
                >
                  Add Part
                </Button>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  multiline
                  rows={3}
                  value={selectedTask?.notes || ''}
                  onChange={(e) =>
                    setSelectedTask({
                      ...selectedTask,
                      notes: e.target.value
                    })
                  }
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSaveTask} variant="contained">
              {selectedTask?.id ? 'Update' : 'Schedule'} Task
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default MaintenanceManagement;
