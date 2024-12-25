import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Stack
} from '@mui/material';
import {
  People as PeopleIcon,
  Work as WorkIcon,
  EventAvailable as EventAvailableIcon,
  MonetizationOn as MonetizationOnIcon,
  Notifications as NotificationsIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const HRDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    employeeCount: 0,
    activeRecruitments: 0,
    pendingLeaves: 0,
    upcomingPayroll: 0,
    recentActivities: [],
    pendingTasks: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // This would be replaced with actual API call
      const mockData = {
        employeeCount: 150,
        activeRecruitments: 8,
        pendingLeaves: 12,
        upcomingPayroll: 145,
        recentActivities: [
          { id: 1, type: 'New Employee', description: 'John Doe joined as Software Engineer', timestamp: '2024-02-18T10:00:00' },
          { id: 2, type: 'Leave Request', description: 'Jane Smith requested annual leave', timestamp: '2024-02-18T09:30:00' },
          { id: 3, type: 'Payroll', description: 'February payroll processing started', timestamp: '2024-02-18T09:00:00' }
        ],
        pendingTasks: [
          { id: 1, title: 'Review 5 leave requests', priority: 'High' },
          { id: 2, title: 'Complete payroll processing', priority: 'High' },
          { id: 3, title: 'Schedule interviews for Developer position', priority: 'Medium' }
        ]
      };

      setDashboardData(mockData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const quickLinks = [
    { title: 'Employee Management', path: '/hr/employees', icon: <PeopleIcon /> },
    { title: 'Recruitment', path: '/hr/recruitment', icon: <WorkIcon /> },
    { title: 'Leave Management', path: '/hr/leave', icon: <EventAvailableIcon /> },
    { title: 'Payroll', path: '/hr/payroll', icon: <MonetizationOnIcon /> }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        HR Dashboard
      </Typography>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Employees
              </Typography>
              <Typography variant="h4">
                {dashboardData.employeeCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Recruitments
              </Typography>
              <Typography variant="h4">
                {dashboardData.activeRecruitments}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Pending Leaves
              </Typography>
              <Typography variant="h4">
                {dashboardData.pendingLeaves}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Upcoming Payroll
              </Typography>
              <Typography variant="h4">
                {dashboardData.upcomingPayroll}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Links */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {quickLinks.map((link) => (
          <Grid item xs={12} sm={6} md={3} key={link.title}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                '&:hover': { bgcolor: 'action.hover' }
              }}
              onClick={() => navigate(link.path)}
            >
              {link.icon}
              <Typography sx={{ ml: 2 }}>{link.title}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Activities */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activities
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List>
              {dashboardData.recentActivities.map((activity) => (
                <ListItem
                  key={activity.id}
                  secondaryAction={
                    <IconButton edge="end">
                      <ArrowForwardIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={activity.description}
                    secondary={new Date(activity.timestamp).toLocaleString()}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Pending Tasks */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Pending Tasks
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List>
              {dashboardData.pendingTasks.map((task) => (
                <ListItem
                  key={task.id}
                  secondaryAction={
                    <Button size="small" variant="outlined">
                      Action
                    </Button>
                  }
                >
                  <ListItemText
                    primary={task.title}
                    secondary={`Priority: ${task.priority}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HRDashboard;
