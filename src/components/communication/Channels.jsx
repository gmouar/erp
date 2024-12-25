import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Collapse,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput
} from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import BusinessIcon from '@mui/icons-material/Business';
import WorkIcon from '@mui/icons-material/Work';
import AddIcon from '@mui/icons-material/Add';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import NotificationsIcon from '@mui/icons-material/Notifications';

const Channels = () => {
  const [openChannels, setOpenChannels] = useState({
    departments: true,
    projects: false,
    teams: false
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [newChannel, setNewChannel] = useState({
    name: '',
    description: '',
    type: '',
    members: []
  });

  const channels = {
    departments: [
      { id: 1, name: 'HR Channel', unread: 3 },
      { id: 2, name: 'Finance Channel', unread: 0 },
      { id: 3, name: 'Sales Channel', unread: 2 }
    ],
    projects: [
      { id: 4, name: 'Project Alpha', unread: 1 },
      { id: 5, name: 'Project Beta', unread: 0 }
    ],
    teams: [
      { id: 6, name: 'Development Team', unread: 5 },
      { id: 7, name: 'Marketing Team', unread: 1 }
    ]
  };

  const availableMembers = [
    { id: 1, name: 'John Doe', role: 'HR Manager' },
    { id: 2, name: 'Jane Smith', role: 'Developer' },
    { id: 3, name: 'Mike Johnson', role: 'Sales Lead' },
    { id: 4, name: 'Sarah Wilson', role: 'Marketing Manager' }
  ];

  const handleToggle = (section) => {
    setOpenChannels({
      ...openChannels,
      [section]: !openChannels[section]
    });
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewChannel({
      name: '',
      description: '',
      type: '',
      members: []
    });
    setSelectedMembers([]);
  };

  const handleCreateChannel = () => {
    // TODO: Implement channel creation logic
    console.log('New Channel:', newChannel);
    handleCloseDialog();
  };

  const handleMemberChange = (event) => {
    setSelectedMembers(event.target.value);
    setNewChannel({
      ...newChannel,
      members: event.target.value
    });
  };

  const getChannelIcon = (section) => {
    switch (section) {
      case 'departments':
        return <BusinessIcon />;
      case 'projects':
        return <WorkIcon />;
      case 'teams':
        return <GroupIcon />;
      default:
        return <GroupIcon />;
    }
  };

  const renderChannelSection = (title, items, section) => (
    <>
      <ListItem button onClick={() => handleToggle(section)}>
        <ListItemIcon>
          {getChannelIcon(section)}
        </ListItemIcon>
        <ListItemText primary={title} />
        {openChannels[section] ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={openChannels[section]} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {items.map((item) => (
            <ListItem button key={item.id} sx={{ pl: 4 }}>
              <ListItemText primary={item.name} />
              {item.unread > 0 && (
                <Chip
                  icon={<NotificationsIcon />}
                  label={item.unread}
                  size="small"
                  color="primary"
                />
              )}
            </ListItem>
          ))}
        </List>
      </Collapse>
    </>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Channels
        </Typography>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          size="small"
          onClick={handleOpenDialog}
        >
          New Channel
        </Button>
      </Box>
      
      <List>
        {renderChannelSection('Departments', channels.departments, 'departments')}
        {renderChannelSection('Projects', channels.projects, 'projects')}
        {renderChannelSection('Teams', channels.teams, 'teams')}
      </List>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Channel</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Channel Name"
            fullWidth
            variant="outlined"
            value={newChannel.name}
            onChange={(e) => setNewChannel({ ...newChannel, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={newChannel.description}
            onChange={(e) => setNewChannel({ ...newChannel, description: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Channel Type</InputLabel>
            <Select
              value={newChannel.type}
              onChange={(e) => setNewChannel({ ...newChannel, type: e.target.value })}
              label="Channel Type"
            >
              <MenuItem value="department">Department</MenuItem>
              <MenuItem value="project">Project</MenuItem>
              <MenuItem value="team">Team</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Members</InputLabel>
            <Select
              multiple
              value={selectedMembers}
              onChange={handleMemberChange}
              input={<OutlinedInput label="Members" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((memberId) => (
                    <Chip
                      key={memberId}
                      label={availableMembers.find(m => m.id === memberId)?.name}
                      size="small"
                    />
                  ))}
                </Box>
              )}
            >
              {availableMembers.map((member) => (
                <MenuItem key={member.id} value={member.id}>
                  {member.name} - {member.role}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleCreateChannel} variant="contained">
            Create Channel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Channels;
