import React from 'react';
import {
  Popover,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  IconButton
} from '@mui/material';
import {
  Email as EmailIcon,
  Announcement as AnnouncementIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  DoneAll as DoneAllIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import useNotifications from '../../hooks/useNotifications';

const NotificationsPopover = ({ anchorEl, onClose }) => {
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    clearNotification 
  } = useNotifications();

  const getIcon = (type) => {
    switch (type) {
      case 'message':
        return <EmailIcon color="primary" />;
      case 'announcement':
        return <AnnouncementIcon color="info" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      default:
        return <InfoIcon color="action" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error.main';
      case 'medium':
        return 'warning.main';
      case 'low':
        return 'success.main';
      default:
        return 'text.secondary';
    }
  };

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <Box sx={{ width: 360, maxHeight: 480 }}>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Notifications</Typography>
          <Button
            startIcon={<DoneAllIcon />}
            size="small"
            onClick={markAllAsRead}
          >
            Mark all as read
          </Button>
        </Box>
        <Divider />
        <List sx={{ py: 0 }}>
          {notifications.map((notification) => (
            <ListItem
              key={notification.id}
              sx={{
                bgcolor: notification.isRead ? 'transparent' : 'action.hover',
                '&:hover': { bgcolor: 'action.selected' }
              }}
            >
              <ListItemIcon>
                {getIcon(notification.type)}
              </ListItemIcon>
              <ListItemText
                primary={notification.title}
                secondary={
                  <Typography
                    variant="body2"
                    color={getPriorityColor(notification.priority)}
                  >
                    {notification.content}
                  </Typography>
                }
              />
              <Box>
                <IconButton
                  size="small"
                  onClick={() => markAsRead(notification.id)}
                  sx={{ mr: 1 }}
                >
                  <DoneAllIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => clearNotification(notification.id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </ListItem>
          ))}
        </List>
        {notifications.length === 0 && (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography color="textSecondary">
              No new notifications
            </Typography>
          </Box>
        )}
      </Box>
    </Popover>
  );
};

export default NotificationsPopover;
