import React from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  Avatar,
  Chip,
  Box,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Person as PersonIcon,
  Work as WorkIcon,
  EventNote as EventNoteIcon,
  Payment as PaymentIcon,
  Assignment as AssignmentIcon,
  Info as InfoIcon
} from '@mui/icons-material';

const ActivityFeed = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'employee':
        return <PersonIcon />;
      case 'recruitment':
        return <WorkIcon />;
      case 'leave':
        return <EventNoteIcon />;
      case 'payroll':
        return <PaymentIcon />;
      case 'task':
        return <AssignmentIcon />;
      default:
        return <InfoIcon />;
    }
  };

  const getActivityColor = (type) => {
    switch (type.toLowerCase()) {
      case 'employee':
        return 'primary';
      case 'recruitment':
        return 'secondary';
      case 'leave':
        return 'warning';
      case 'payroll':
        return 'success';
      case 'task':
        return 'info';
      default:
        return 'default';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) {
      return 'Just now';
    } else if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Recent Activities
      </Typography>
      <Divider sx={{ mb: 2 }} />
      
      <List>
        {activities.map((activity, index) => (
          <React.Fragment key={activity.id}>
            <ListItem>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: `${getActivityColor(activity.type)}.main` }}>
                  {getActivityIcon(activity.type)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle2">
                      {activity.title}
                    </Typography>
                    <Chip
                      label={activity.type}
                      size="small"
                      color={getActivityColor(activity.type)}
                    />
                  </Box>
                }
                secondary={
                  <>
                    <Typography variant="body2">
                      {activity.description}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {formatTimestamp(activity.timestamp)}
                    </Typography>
                  </>
                }
              />
              {activity.actionable && (
                <Tooltip title="View Details">
                  <IconButton size="small">
                    <InfoIcon />
                  </IconButton>
                </Tooltip>
              )}
            </ListItem>
            {index < activities.length - 1 && <Divider variant="inset" component="li" />}
          </React.Fragment>
        ))}
        {activities.length === 0 && (
          <ListItem>
            <ListItemText
              primary={
                <Typography color="textSecondary" align="center">
                  No recent activities
                </Typography>
              }
            />
          </ListItem>
        )}
      </List>
    </Paper>
  );
};

export default ActivityFeed;
