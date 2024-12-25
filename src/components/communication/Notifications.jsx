import React, { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  Typography,
  Badge,
  IconButton,
  Avatar,
  Box,
  Menu,
  MenuItem,
  Divider,
  Button,
  Tooltip,
  Chip
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import TaskIcon from '@mui/icons-material/Task';
import EmailIcon from '@mui/icons-material/Email';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);

  useEffect(() => {
    // Mock notifications data - would be replaced with real API calls
    const mockNotifications = [
      {
        id: 1,
        type: 'task',
        title: 'New Task Assigned',
        message: 'You have been assigned to Project Alpha',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: false,
        priority: 'high'
      },
      {
        id: 2,
        type: 'message',
        title: 'New Message from HR',
        message: 'Please review the updated company policies',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        read: false,
        priority: 'medium'
      },
      {
        id: 3,
        type: 'announcement',
        title: 'Company Meeting',
        message: 'All-hands meeting scheduled for next Friday',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        read: true,
        priority: 'low'
      }
    ];
    setNotifications(mockNotifications);
  }, []);

  const handleMenuOpen = (event, notification) => {
    setAnchorEl(event.currentTarget);
    setSelectedNotification(notification);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedNotification(null);
  };

  const handleMarkAsRead = (notificationId) => {
    setNotifications(notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification
    ));
    handleMenuClose();
  };

  const handleDeleteNotification = (notificationId) => {
    setNotifications(notifications.filter(notification => 
      notification.id !== notificationId
    ));
    handleMenuClose();
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'task':
        return <TaskIcon color="primary" />;
      case 'message':
        return <EmailIcon color="secondary" />;
      case 'announcement':
        return <AnnouncementIcon color="warning" />;
      default:
        return <NotificationsIcon />;
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

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) { // less than 1 minute
      return 'Just now';
    } else if (diff < 3600000) { // less than 1 hour
      const minutes = Math.floor(diff / 60000);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diff < 86400000) { // less than 1 day
      const hours = Math.floor(diff / 3600000);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Notifications
        </Typography>
        <Box>
          <Badge 
            badgeContent={notifications.filter(n => !n.read).length} 
            color="error"
            sx={{ mr: 2 }}
          >
            <NotificationsIcon />
          </Badge>
          <Button
            size="small"
            startIcon={<DoneAllIcon />}
            onClick={handleMarkAllAsRead}
          >
            Mark all as read
          </Button>
        </Box>
      </Box>

      <List>
        {notifications.map((notification) => (
          <ListItem
            key={notification.id}
            sx={{
              bgcolor: notification.read ? 'transparent' : 'action.hover',
              mb: 1,
              borderRadius: 1
            }}
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: 'background.paper' }}>
                {getIcon(notification.type)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {notification.title}
                  <Chip
                    label={notification.priority}
                    size="small"
                    color={getPriorityColor(notification.priority)}
                  />
                </Box>
              }
              secondary={
                <>
                  <Typography variant="body2" component="span">
                    {notification.message}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    sx={{ display: 'block' }}
                  >
                    {formatTimestamp(notification.timestamp)}
                  </Typography>
                </>
              }
            />
            <IconButton
              edge="end"
              onClick={(e) => handleMenuOpen(e, notification)}
            >
              <MoreVertIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {selectedNotification && !selectedNotification.read && (
          <MenuItem onClick={() => handleMarkAsRead(selectedNotification.id)}>
            <ListItemIcon>
              <DoneAllIcon fontSize="small" />
            </ListItemIcon>
            Mark as read
          </MenuItem>
        )}
        <MenuItem onClick={() => handleDeleteNotification(selectedNotification?.id)}>
          <ListItemIcon>
            <DeleteOutlineIcon fontSize="small" />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>

      {notifications.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <Typography color="textSecondary">
            No notifications to display
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Notifications;
