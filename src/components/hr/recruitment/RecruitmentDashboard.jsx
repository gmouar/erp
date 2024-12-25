import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
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
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const RecruitmentDashboard = () => {
  const [openJobDialog, setOpenJobDialog] = useState(false);
  const [jobPostings, setJobPostings] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [newJob, setNewJob] = useState({
    title: '',
    department: '',
    location: '',
    type: 'Full-time',
    experience: '',
    salary: '',
    description: '',
    requirements: '',
    status: 'Open'
  });

  const departments = [
    'Engineering',
    'Sales',
    'Marketing',
    'Finance',
    'HR',
    'Operations'
  ];

  const jobTypes = [
    'Full-time',
    'Part-time',
    'Contract',
    'Internship',
    'Remote'
  ];

  useEffect(() => {
    fetchJobPostings();
  }, []);

  const fetchJobPostings = async () => {
    try {
      // This would be replaced with actual API call
      const mockData = [
        {
          id: 1,
          title: 'Senior Software Engineer',
          department: 'Engineering',
          location: 'New York',
          type: 'Full-time',
          experience: '5+ years',
          salary: '$120,000 - $150,000',
          status: 'Open',
          applicants: 12
        },
        {
          id: 2,
          title: 'Marketing Manager',
          department: 'Marketing',
          location: 'Remote',
          type: 'Full-time',
          experience: '3+ years',
          salary: '$80,000 - $100,000',
          status: 'Open',
          applicants: 8
        }
      ];
      setJobPostings(mockData);
    } catch (error) {
      console.error('Error fetching job postings:', error);
    }
  };

  const handleOpenJobDialog = (job = null) => {
    if (job) {
      setSelectedJob(job);
      setNewJob(job);
    } else {
      setSelectedJob(null);
      setNewJob({
        title: '',
        department: '',
        location: '',
        type: 'Full-time',
        experience: '',
        salary: '',
        description: '',
        requirements: '',
        status: 'Open'
      });
    }
    setOpenJobDialog(true);
  };

  const handleCloseJobDialog = () => {
    setOpenJobDialog(false);
    setSelectedJob(null);
    setNewJob({
      title: '',
      department: '',
      location: '',
      type: 'Full-time',
      experience: '',
      salary: '',
      description: '',
      requirements: '',
      status: 'Open'
    });
  };

  const handleSaveJob = async () => {
    try {
      if (selectedJob) {
        // Update existing job
        const updatedJobs = jobPostings.map(job =>
          job.id === selectedJob.id ? { ...job, ...newJob } : job
        );
        setJobPostings(updatedJobs);
      } else {
        // Create new job
        const job = {
          id: jobPostings.length + 1,
          ...newJob,
          applicants: 0
        };
        setJobPostings([...jobPostings, job]);
      }
      handleCloseJobDialog();
    } catch (error) {
      console.error('Error saving job posting:', error);
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      setJobPostings(jobPostings.filter(job => job.id !== jobId));
    } catch (error) {
      console.error('Error deleting job posting:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'success';
      case 'closed':
        return 'error';
      case 'draft':
        return 'default';
      default:
        return 'primary';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Recruitment Dashboard</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenJobDialog()}
        >
          Post New Job
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Experience</TableCell>
                  <TableCell>Salary Range</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Applicants</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobPostings.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>{job.title}</TableCell>
                    <TableCell>{job.department}</TableCell>
                    <TableCell>{job.location}</TableCell>
                    <TableCell>{job.type}</TableCell>
                    <TableCell>{job.experience}</TableCell>
                    <TableCell>{job.salary}</TableCell>
                    <TableCell>
                      <Chip
                        label={job.status}
                        color={getStatusColor(job.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{job.applicants}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenJobDialog(job)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteJob(job.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                      <IconButton size="small">
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton size="small">
                        <PersonAddIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <Dialog
        open={openJobDialog}
        onClose={handleCloseJobDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedJob ? 'Edit Job Posting' : 'Create New Job Posting'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Job Title"
                value={newJob.title}
                onChange={(e) =>
                  setNewJob({ ...newJob, title: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  value={newJob.department}
                  label="Department"
                  onChange={(e) =>
                    setNewJob({ ...newJob, department: e.target.value })
                  }
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept} value={dept}>
                      {dept}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location"
                value={newJob.location}
                onChange={(e) =>
                  setNewJob({ ...newJob, location: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Job Type</InputLabel>
                <Select
                  value={newJob.type}
                  label="Job Type"
                  onChange={(e) =>
                    setNewJob({ ...newJob, type: e.target.value })
                  }
                >
                  {jobTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Experience Required"
                value={newJob.experience}
                onChange={(e) =>
                  setNewJob({ ...newJob, experience: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Salary Range"
                value={newJob.salary}
                onChange={(e) =>
                  setNewJob({ ...newJob, salary: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Job Description"
                multiline
                rows={4}
                value={newJob.description}
                onChange={(e) =>
                  setNewJob({ ...newJob, description: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Requirements"
                multiline
                rows={4}
                value={newJob.requirements}
                onChange={(e) =>
                  setNewJob({ ...newJob, requirements: e.target.value })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseJobDialog}>Cancel</Button>
          <Button onClick={handleSaveJob} variant="contained">
            {selectedJob ? 'Update' : 'Post'} Job
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RecruitmentDashboard;
