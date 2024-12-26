import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  AssignmentTurnedIn as TaskIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Flag as FlagIcon
} from '@mui/icons-material';
import hrService from '../../services/hrService';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    assignedTo: ''
  });

  const priorities = ['low', 'medium', 'high'];

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      // This would be replaced with actual API call
      const mockTasks = [
        {
          id: 1,
          title: 'Review Leave Requests',
          description: '5 pending leave requests need review',
          priority: 'high',
          dueDate: '2024-02-20',
          assignedTo: 'HR Manager',
          status: 'pending'
        },
        {
          id: 2,
          title: 'Process Payroll',
          description: 'Monthly payroll processing',
          priority: 'high',
          dueDate: '2024-02-25',
          assignedTo: 'HR Manager',
          status: 'pending'
        }
      ];
      setTasks(mockTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleOpenDialog = (task = null) => {
    if (task) {
      setSelectedTask(task);
      setNewTask(task);
    } else {
      setSelectedTask(null);
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        assignedTo: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTask(null);
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      assignedTo: ''
    });
  };

  const handleSaveTask = async () => {
    try {
      if (selectedTask) {
        // Update existing task
        const updatedTasks = tasks.map(task =>
          task.id === selectedTask.id ? { ...task, ...newTask } : task
        );
        setTasks(updatedTasks);
      } else {
        // Create new task
        const task = {
          id: tasks.length + 1,
          ...newTask,
          status: 'pending'
        };
        setTasks([...tasks, task]);
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Tasks</Typography>
        <Button
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          size="small"
        >
          Add Task
        </Button>
      </Box>

      <List>
        {tasks.map((task) => (
          <ListItem key={task.id}>
            <ListItemIcon>
              <TaskIcon />
            </ListItemIcon>
            <ListItemText
              primary={task.title}
              secondary={
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Chip
                    label={task.priority}
                    size="small"
                    color={getPriorityColor(task.priority)}
                  />
                  <Typography variant="body2" color="textSecondary">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </Typography>
                </Box>
              }
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                onClick={() => handleOpenDialog(task)}
                size="small"
              >
                <EditIcon />
              </IconButton>
              <IconButton
                edge="end"
                onClick={() => handleDeleteTask(task.id)}
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {selectedTask ? 'Edit Task' : 'New Task'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={newTask.priority}
                label="Priority"
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              >
                {priorities.map((priority) => (
                  <MenuItem key={priority} value={priority}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Due Date"
              type="date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              fullWidth
              label="Assigned To"
              value={newTask.assignedTo}
              onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveTask} variant="contained">
            {selectedTask ? 'Update' : 'Create'} Task
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default TaskList;
