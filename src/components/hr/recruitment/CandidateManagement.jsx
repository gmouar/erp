import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Schedule as ScheduleIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';

const interviewSteps = [
  'Application Received',
  'Resume Screening',
  'Technical Interview',
  'HR Interview',
  'Offer'
];

const CandidateManagement = () => {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [interviewFeedback, setInterviewFeedback] = useState('');

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      // This would be replaced with actual API call
      const mockData = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@email.com',
          phone: '123-456-7890',
          position: 'Senior Software Engineer',
          experience: '5 years',
          status: 'In Progress',
          currentStage: 2,
          education: 'MS Computer Science',
          skills: ['React', 'Node.js', 'Python'],
          appliedDate: '2024-01-15',
          resumeUrl: '#',
          interviews: [
            {
              stage: 'Technical Interview',
              date: '2024-01-20',
              feedback: 'Strong technical skills, good problem-solving ability'
            }
          ]
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane.smith@email.com',
          phone: '098-765-4321',
          position: 'Marketing Manager',
          experience: '3 years',
          status: 'Scheduled',
          currentStage: 1,
          education: 'MBA Marketing',
          skills: ['Digital Marketing', 'SEO', 'Content Strategy'],
          appliedDate: '2024-01-16',
          resumeUrl: '#',
          interviews: []
        }
      ];
      setCandidates(mockData);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    }
  };

  const handleOpenDialog = (candidate = null) => {
    setSelectedCandidate(candidate);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedCandidate(null);
    setOpenDialog(false);
  };

  const handleOpenDetailsDialog = (candidate) => {
    setSelectedCandidate(candidate);
    setOpenDetailsDialog(true);
  };

  const handleCloseDetailsDialog = () => {
    setSelectedCandidate(null);
    setOpenDetailsDialog(false);
  };

  const handleUpdateStatus = async (candidateId, newStatus) => {
    try {
      // This would be replaced with actual API call
      setCandidates(candidates.map(candidate =>
        candidate.id === candidateId
          ? { ...candidate, status: newStatus }
          : candidate
      ));
    } catch (error) {
      console.error('Error updating candidate status:', error);
    }
  };

  const handleSaveInterview = async () => {
    try {
      if (selectedCandidate && interviewFeedback) {
        const updatedCandidates = candidates.map(candidate =>
          candidate.id === selectedCandidate.id
            ? {
                ...candidate,
                interviews: [
                  ...candidate.interviews,
                  {
                    stage: interviewSteps[candidate.currentStage],
                    date: new Date().toISOString(),
                    feedback: interviewFeedback
                  }
                ],
                currentStage: candidate.currentStage + 1
              }
            : candidate
        );
        setCandidates(updatedCandidates);
        setInterviewFeedback('');
        handleCloseDetailsDialog();
      }
    } catch (error) {
      console.error('Error saving interview feedback:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'in progress':
        return 'primary';
      case 'scheduled':
        return 'warning';
      case 'rejected':
        return 'error';
      case 'hired':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Candidate Management
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Experience</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Stage</TableCell>
              <TableCell>Applied Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {candidates.map((candidate) => (
              <TableRow key={candidate.id}>
                <TableCell>{candidate.name}</TableCell>
                <TableCell>{candidate.position}</TableCell>
                <TableCell>{candidate.experience}</TableCell>
                <TableCell>
                  <Chip
                    label={candidate.status}
                    color={getStatusColor(candidate.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {interviewSteps[candidate.currentStage]}
                </TableCell>
                <TableCell>
                  {new Date(candidate.appliedDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDetailsDialog(candidate)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(candidate)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Candidate Details Dialog */}
      <Dialog
        open={openDetailsDialog}
        onClose={handleCloseDetailsDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedCandidate && (
          <>
            <DialogTitle>Candidate Details</DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Box sx={{ textAlign: 'center', mb: 2 }}>
                        <Avatar
                          sx={{ width: 100, height: 100, margin: '0 auto' }}
                        >
                          {selectedCandidate.name.charAt(0)}
                        </Avatar>
                        <Typography variant="h6" sx={{ mt: 2 }}>
                          {selectedCandidate.name}
                        </Typography>
                        <Typography color="textSecondary">
                          {selectedCandidate.position}
                        </Typography>
                      </Box>
                      <List>
                        <ListItem>
                          <ListItemIcon>
                            <EmailIcon />
                          </ListItemIcon>
                          <ListItemText primary={selectedCandidate.email} />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <PhoneIcon />
                          </ListItemIcon>
                          <ListItemText primary={selectedCandidate.phone} />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <WorkIcon />
                          </ListItemIcon>
                          <ListItemText primary={selectedCandidate.experience} />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <SchoolIcon />
                          </ListItemIcon>
                          <ListItemText primary={selectedCandidate.education} />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Interview Progress
                    </Typography>
                    <Stepper
                      activeStep={selectedCandidate.currentStage}
                      alternativeLabel
                    >
                      {interviewSteps.map((label) => (
                        <Step key={label}>
                          <StepLabel>{label}</StepLabel>
                        </Step>
                      ))}
                    </Stepper>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Skills
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {selectedCandidate.skills.map((skill) => (
                        <Chip key={skill} label={skill} />
                      ))}
                    </Box>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Interview Feedback
                    </Typography>
                    {selectedCandidate.interviews.map((interview, index) => (
                      <Card key={index} sx={{ mb: 2 }}>
                        <CardContent>
                          <Typography variant="subtitle1">
                            {interview.stage}
                          </Typography>
                          <Typography color="textSecondary" gutterBottom>
                            {new Date(interview.date).toLocaleDateString()}
                          </Typography>
                          <Typography variant="body2">
                            {interview.feedback}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))}
                    {selectedCandidate.currentStage < interviewSteps.length - 1 && (
                      <Box sx={{ mt: 2 }}>
                        <TextField
                          fullWidth
                          label="Add Interview Feedback"
                          multiline
                          rows={4}
                          value={interviewFeedback}
                          onChange={(e) => setInterviewFeedback(e.target.value)}
                        />
                        <Button
                          variant="contained"
                          onClick={handleSaveInterview}
                          sx={{ mt: 2 }}
                          disabled={!interviewFeedback}
                        >
                          Save Feedback & Move to Next Stage
                        </Button>
                      </Box>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDetailsDialog}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default CandidateManagement;
