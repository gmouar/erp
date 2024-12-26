import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import { 
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot 
} from '@mui/lab';
import hrService from '../../../services/hrService';

const PerformanceManagement = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [goals, setGoals] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dialogType, setDialogType] = useState('review'); // 'review' or 'goal'

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    try {
      // This would be replaced with actual API calls
      const mockReviews = [
        {
          id: 1,
          employeeName: 'John Doe',
          position: 'Software Engineer',
          period: '2024 Q1',
          rating: 4,
          goals: ['Complete project X', 'Learn new technology Y'],
          strengths: ['Technical skills', 'Team collaboration'],
          improvements: ['Communication', 'Documentation'],
          status: 'Completed',
          reviewerName: 'Jane Smith',
          reviewDate: '2024-03-15'
        }
      ];

      const mockGoals = [
        {
          id: 1,
          title: 'Improve Team Productivity',
          description: 'Implement new development processes',
          startDate: '2024-01-01',
          dueDate: '2024-06-30',
          status: 'In Progress',
          progress: 60,
          assignee: 'Development Team'
        }
      ];

      setReviews(mockReviews);
      setGoals(mockGoals);
    } catch (error) {
      console.error('Error fetching performance data:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleOpenDialog = (type, item = null) => {
    setDialogType(type);
    setSelectedItem(item);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null);
  };

  const handleSave = async () => {
    try {
      // Implementation for saving review or goal
      handleCloseDialog();
      fetchPerformanceData();
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Performance Management
      </Typography>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Reviews" />
          <Tab label="Goals" />
          <Tab label="Development" />
        </Tabs>

        <Box sx={{ p: 2 }}>
          {activeTab === 0 && (
            <>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  onClick={() => handleOpenDialog('review')}
                >
                  New Review
                </Button>
              </Box>
              <Grid container spacing={3}>
                {reviews.map((review) => (
                  <Grid item xs={12} md={6} key={review.id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6">{review.employeeName}</Typography>
                        <Typography color="textSecondary" gutterBottom>
                          {review.position}
                        </Typography>
                        <Rating value={review.rating} readOnly />
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          Period: {review.period}
                        </Typography>
                        <Typography variant="body2">
                          Reviewer: {review.reviewerName}
                        </Typography>
                        <Button 
                          size="small" 
                          sx={{ mt: 1 }}
                          onClick={() => handleOpenDialog('review', review)}
                        >
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          )}

          {activeTab === 1 && (
            <>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  onClick={() => handleOpenDialog('goal')}
                >
                  New Goal
                </Button>
              </Box>
              <Timeline>
                {goals.map((goal) => (
                  <TimelineItem key={goal.id}>
                    <TimelineSeparator>
                      <TimelineDot color="primary" />
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Card>
                        <CardContent>
                          <Typography variant="h6">{goal.title}</Typography>
                          <Typography color="textSecondary">
                            {goal.description}
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            Progress: {goal.progress}%
                          </Typography>
                          <Button 
                            size="small" 
                            sx={{ mt: 1 }}
                            onClick={() => handleOpenDialog('goal', goal)}
                          >
                            View Details
                          </Button>
                        </CardContent>
                      </Card>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </>
          )}

          {activeTab === 2 && (
            <Typography>Development tracking and planning features coming soon.</Typography>
          )}
        </Box>
      </Paper>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedItem ? 'Edit' : 'New'} {dialogType === 'review' ? 'Performance Review' : 'Goal'}
        </DialogTitle>
        <DialogContent>
          {dialogType === 'review' ? (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Employee Name"
                  value={selectedItem?.employeeName || ''}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Position"
                  value={selectedItem?.position || ''}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Period"
                  value={selectedItem?.period || ''}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Rating</InputLabel>
                  <Select
                    value={selectedItem?.rating || ''}
                    label="Rating"
                  >
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <MenuItem key={rating} value={rating}>
                        {rating}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Comments"
                  value={selectedItem?.comments || ''}
                />
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Goal Title"
                  value={selectedItem?.title || ''}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  value={selectedItem?.description || ''}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Start Date"
                  value={selectedItem?.startDate || ''}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Due Date"
                  value={selectedItem?.dueDate || ''}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PerformanceManagement;
