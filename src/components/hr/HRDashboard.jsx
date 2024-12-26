import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  CircularProgress
} from '@mui/material';
import {
  People as PeopleIcon,
  Work as WorkIcon,
  EventNote as EventNoteIcon,
  Payment as PaymentIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import hrService from '../../services/hrService';
import TaskList from './TaskList';
import ActivityFeed from './ActivityFeed';

const HRDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const dashboardStats = await hrService.getDashboardStats();
      setStats(dashboardStats);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        HR Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Employees
              </Typography>
              <Typography variant="h3">
                {stats?.totalEmployees}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Quick Links */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <List>
              <ListItem button component={Link} to="/hr/employees/new">
                <ListItemIcon><PeopleIcon /></ListItemIcon>
                <ListItemText primary="Add Employee" />
              </ListItem>
              <ListItem button component={Link} to="/hr/recruitment/jobs/new">
                <ListItemIcon><WorkIcon /></ListItemIcon>
                <ListItemText primary="Post Job" />
              </ListItem>
              <ListItem button component={Link} to="/hr/leave/requests">
                <ListItemIcon><EventNoteIcon /></ListItemIcon>
                <ListItemText primary="Leave Requests" />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Task Management */}
        <Grid item xs={12} md={4}>
          <TaskList />
        </Grid>

        {/* Activity Feed */}
        <Grid item xs={12}>
          <ActivityFeed activities={stats?.recentActivities || []} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default HRDashboard;
