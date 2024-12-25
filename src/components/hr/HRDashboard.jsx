import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  Button,
  Stack,
  CircularProgress 
} from '@mui/material';
import {
  People as PeopleIcon,
  WorkHistory as WorkHistoryIcon,
  EventNote as EventNoteIcon,
  AccountBalance as AccountBalanceIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import hrService from '../../services/hrService';

const HRDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalEmployees: 0,
    activeLeaveRequests: 0,
    openPositions: 0,
    attendance: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [employees, leaves, jobs, attendance] = await Promise.all([
        hrService.getEmployees(),
        hrService.getLeaveRequests({ status: 'pending' }),
        hrService.getJobPostings({ status: 'open' }),
        hrService.getAttendance({ date: new Date().toISOString().split('T')[0] })
      ]);

      setMetrics({
        totalEmployees: employees.total,
        activeLeaveRequests: leaves.total,
        openPositions: jobs.total,
        attendance: attendance.presentCount
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  const modules = [
    {
      title: 'Employee Management',
      icon: <PeopleIcon fontSize="large" />,
      path: '/hr/employees',
      description: 'Manage employee profiles and records'
    },
    {
      title: 'Recruitment',
      icon: <PersonIcon fontSize="large" />,
      path: '/hr/recruitment',
      description: 'Handle job postings and candidates'
    },
    {
      title: 'Attendance',
      icon: <EventNoteIcon fontSize="large" />,
      path: '/hr/attendance',
      description: 'Track employee attendance'
    },
    {
      title: 'Leave Management',
      icon: <WorkHistoryIcon fontSize="large" />,
      path: '/hr/leave',
      description: 'Process leave requests'
    },
    {
      title: 'Payroll',
      icon: <AccountBalanceIcon fontSize="large" />,
      path: '/hr/payroll',
      description: 'Manage employee compensation'
    },
    {
      title: 'Reports',
      icon: <AssignmentIcon fontSize="large" />,
      path: '/hr/reports',
      description: 'View HR analytics and reports'
    }
  ];

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        HR Management System
      </Typography>

      <Grid container spacing={3}>
        {modules.map((module) => (
          <Grid item xs={12} sm={6} md={4} key={module.title}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 200,
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
              onClick={() => navigate(module.path)}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexGrow: 1,
                  gap: 2
                }}
              >
                {module.icon}
                <Typography variant="h6" component="h2" align="center">
                  {module.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                >
                  {module.description}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Quick Actions
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            startIcon={<PersonIcon />}
            onClick={() => navigate('/hr/recruitment/new-position')}
          >
            Post New Position
          </Button>
          <Button
            variant="contained"
            startIcon={<WorkHistoryIcon />}
            onClick={() => navigate('/hr/leave/requests')}
          >
            View Leave Requests
          </Button>
          <Button
            variant="contained"
            startIcon={<AssignmentIcon />}
            onClick={() => navigate('/hr/reports')}
          >
            Generate Reports
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default HRDashboard;
