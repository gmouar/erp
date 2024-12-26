import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Rating,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Send as SendIcon,
  Schedule as ScheduleIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import recruitmentService from '../../../services/recruitmentService';

const ApplicationReview = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [decision, setDecision] = useState('');

  const applicationStatuses = [
    'pending',
    'reviewing',
    'interview',
    'accepted',
    'rejected'
  ];

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      // This would be replaced with actual API call
      const mockData = [
        {
          id: 'APP001',
          jobId: 'JOB001',
          jobTitle: 'Senior Software Engineer',
          applicant: {
            name: 'John Doe',
            email: 'john.doe@email.com',
            phone: '123-456-7890'
          },
          submittedAt: '2024-02-15T10:00:00',
          status: 'reviewing',
          coverLetter: 'I am excited to apply...',
          experience: [
            'Software Engineer at Tech Co (2020-2024)',
            'Junior Developer at Start Up (2018-2020)'
          ],
          skills: ['React', 'Node.js', 'Python'],
          rating: 4,
          notes: 'Strong technical background'
        }
      ];
      setApplications(mockData);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedApplication(null);
    setOpenDialog(false);
    setFeedback('');
    setDecision('');
  };

  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      await recruitmentService.updateApplicationStatus(applicationId, newStatus);
      setApplications(applications.map(app =>
        app.id === applicationId ? { ...app, status: newStatus } : app
      ));
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  const handleScheduleInterview = async (applicationId) => {
    try {
      // This would open interview scheduling dialog
      console.log('Schedule interview for:', applicationId);
    } catch (error) {
      console.error('Error scheduling interview:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'default';
      case 'reviewing':
        return 'info';
      case 'interview':
        return 'warning';
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Application Review
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Application ID</TableCell>
              <TableCell>Job Title</TableCell>
              <TableCell>Applicant</TableCell>
              <TableCell>Submitted</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.map((application) => (
              <TableRow key={application.id}>
                <TableCell>{application.id}</TableCell>
                <TableCell>{application.jobTitle}</TableCell>
                <TableCell>{application.applicant.name}</TableCell>
                <TableCell>
                  {new Date(application.submittedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Chip
                    label={application.status}
                    color={getStatusColor(application.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Rating value={application.rating} readOnly size="small" />
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleViewDetails(application)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  {application.status === 'reviewing' && (
                    <IconButton
                      size="small"
                      onClick={() => handleScheduleInterview(application.id)}
                    >
                      <ScheduleIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        {selectedApplication && (
          <>
            <DialogTitle>
              Application Details - {selectedApplication.applicant.name}
            </DialogTitle>
            <DialogContent>
              <Stack spacing={3} sx={{ mt: 2 }}>
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Contact Information
                  </Typography>
                  <Typography>Email: {selectedApplication.applicant.email}</Typography>
                  <Typography>Phone: {selectedApplication.applicant.phone}</Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Cover Letter
                  </Typography>
                  <Typography>{selectedApplication.coverLetter}</Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Experience
                  </Typography>
                  {selectedApplication.experience.map((exp, index) => (
                    <Typography key={index}>{exp}</Typography>
                  ))}
                </Box>

                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Skills
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    {selectedApplication.skills.map((skill, index) => (
                      <Chip key={index} label={skill} size="small" />
                    ))}
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Application Status
                  </Typography>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={selectedApplication.status}
                      label="Status"
                      onChange={(e) => handleUpdateStatus(selectedApplication.id, e.target.value)}
                    >
                      {applicationStatuses.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Feedback
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Enter feedback for the applicant..."
                  />
                </Box>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button
                startIcon={<ThumbDownIcon />}
                color="error"
                onClick={() => handleUpdateStatus(selectedApplication.id, 'rejected')}
              >
                Reject
              </Button>
              <Button
                startIcon={<ScheduleIcon />}
                color="warning"
                onClick={() => handleScheduleInterview(selectedApplication.id)}
              >
                Schedule Interview
              </Button>
              <Button
                startIcon={<ThumbUpIcon />}
                color="success"
                onClick={() => handleUpdateStatus(selectedApplication.id, 'accepted')}
              >
                Accept
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default ApplicationReview;
