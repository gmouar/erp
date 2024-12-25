import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Stack,
  Avatar,
  Tooltip,
  Switch,
  FormControlLabel,
  Paper
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import CampaignIcon from '@mui/icons-material/Campaign';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import GroupIcon from '@mui/icons-material/Group';
import ScheduleIcon from '@mui/icons-material/Schedule';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: 'Company Meeting',
      content: 'Annual company meeting next Friday at 10 AM in the main conference room.',
      date: new Date().toISOString(),
      priority: 'high',
      target: ['all'],
      scheduled: false,
      author: 'John Doe',
      department: 'HR'
    },
    {
      id: 2,
      title: 'New Policy Update',
      content: 'Updated work from home policy is now in effect. Please review the documents.',
      date: new Date(Date.now() - 86400000).toISOString(),
      priority: 'medium',
      target: ['HR', 'Management'],
      scheduled: false,
      author: 'Jane Smith',
      department: 'HR'
    }
  ]);

  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    priority: 'medium',
    target: ['all'],
    scheduled: false,
    scheduledDate: new Date(),
    author: 'Current User', // This would come from auth context
    department: 'HR' // This would come from user's department
  });

  const departments = ['HR', 'Finance', 'Sales', 'Engineering', 'Marketing'];

  const handleClickOpen = () => {
    setOpen(true);
    setEditMode(false);
    setNewAnnouncement({
      title: '',
      content: '',
      priority: 'medium',
      target: ['all'],
      scheduled: false,
      scheduledDate: new Date(),
      author: 'Current User',
      department: 'HR'
    });
  };

  const handleEdit = (announcement) => {
    setSelectedAnnouncement(announcement);
    setNewAnnouncement({
      ...announcement,
      scheduledDate: new Date(announcement.date)
    });
    setEditMode(true);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setSelectedAnnouncement(null);
  };

  const handleSubmit = () => {
    if (newAnnouncement.title && newAnnouncement.content) {
      if (editMode && selectedAnnouncement) {
        setAnnouncements(announcements.map(announcement =>
          announcement.id === selectedAnnouncement.id
            ? { ...newAnnouncement, id: selectedAnnouncement.id }
            : announcement
        ));
      } else {
        setAnnouncements([
          ...announcements,
          {
            ...newAnnouncement,
            id: Date.now(),
            date: newAnnouncement.scheduled 
              ? newAnnouncement.scheduledDate.toISOString()
              : new Date().toISOString()
          }
        ]);
      }
      handleClose();
    }
  };

  const handleDelete = (id) => {
    setAnnouncements(announcements.filter(announcement => announcement.id !== id));
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
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Announcements
        </Typography>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
          size="small"
        >
          New Announcement
        </Button>
      </Box>

      <List>
        {announcements.map((announcement) => (
          <Paper
            key={announcement.id}
            elevation={1}
            sx={{ mb: 2, overflow: 'hidden' }}
          >
            <ListItem
              sx={{
                borderLeft: 6,
                borderColor: `${getPriorityColor(announcement.priority)}.main`
              }}
            >
              <ListItemIcon>
                <CampaignIcon color={getPriorityColor(announcement.priority)} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle1" component="span">
                      {announcement.title}
                    </Typography>
                    <Chip
                      label={announcement.priority}
                      size="small"
                      color={getPriorityColor(announcement.priority)}
                    />
                    {announcement.scheduled && (
                      <Chip
                        icon={<ScheduleIcon />}
                        label="Scheduled"
                        size="small"
                        color="info"
                      />
                    )}
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {announcement.content}
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ mt: 1 }}
                    >
                      <Typography variant="caption" color="textSecondary">
                        Posted by {announcement.author} • {announcement.department}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {new Date(announcement.date).toLocaleString()}
                      </Typography>
                      {announcement.target.map((target) => (
                        <Chip
                          key={target}
                          label={target}
                          size="small"
                          icon={<GroupIcon />}
                          variant="outlined"
                        />
                      ))}
                    </Stack>
                  </Box>
                }
              />
              <Stack direction="row" spacing={1}>
                <IconButton
                  size="small"
                  onClick={() => handleEdit(announcement)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDelete(announcement.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>
            </ListItem>
          </Paper>
        ))}
      </List>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editMode ? 'Edit Announcement' : 'New Announcement'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            variant="outlined"
            value={newAnnouncement.title}
            onChange={(e) => setNewAnnouncement({
              ...newAnnouncement,
              title: e.target.value
            })}
          />
          <TextField
            margin="dense"
            label="Content"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={newAnnouncement.content}
            onChange={(e) => setNewAnnouncement({
              ...newAnnouncement,
              content: e.target.value
            })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Priority</InputLabel>
            <Select
              value={newAnnouncement.priority}
              onChange={(e) => setNewAnnouncement({
                ...newAnnouncement,
                priority: e.target.value
              })}
              label="Priority"
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Target Audience</InputLabel>
            <Select
              multiple
              value={newAnnouncement.target}
              onChange={(e) => setNewAnnouncement({
                ...newAnnouncement,
                target: e.target.value
              })}
              input={<OutlinedInput label="Target Audience" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              <MenuItem value="all">All Employees</MenuItem>
              {departments.map((dept) => (
                <MenuItem key={dept} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={newAnnouncement.scheduled}
                  onChange={(e) => setNewAnnouncement({
                    ...newAnnouncement,
                    scheduled: e.target.checked
                  })}
                />
              }
              label="Schedule Announcement"
            />
          </Box>
          {newAnnouncement.scheduled && (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Schedule Date & Time"
                value={newAnnouncement.scheduledDate}
                onChange={(newValue) => setNewAnnouncement({
                  ...newAnnouncement,
                  scheduledDate: newValue
                })}
                renderInput={(params) => (
                  <TextField {...params} fullWidth margin="dense" />
                )}
                minDateTime={new Date()}
              />
            </LocalizationProvider>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editMode ? 'Update' : 'Post'} Announcement
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Announcements;
