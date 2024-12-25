import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Share as ShareIcon
} from '@mui/icons-material';

const JobPostings = () => {
  const [jobs, setJobs] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [newJob, setNewJob] = useState({
    title: '',
    department: '',
    location: '',
    type: 'Full-time',
    experience: '',
    description: '',
    requirements: '',
    salary: '',
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
    'Internship'
  ];

  const handleOpenDialog = (job = null) => {
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
        description: '',
        requirements: '',
        salary: '',
        status: 'Open'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedJob(null);
  };

  const handleSaveJob = () => {
    if (selectedJob) {
      setJobs(jobs.map(job => 
        job.id === selectedJob.id ? { ...newJob, id: job.id } : job
      ));
    } else {
      setJobs([...jobs, { ...newJob, id: Date.now() }]);
    }
    handleCloseDialog();
  };

  const handleDeleteJob = (jobId) => {
    setJobs(jobs.filter(job => job.id !== jobId));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Job Postings</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Post New Job
        </Button>
      </Box>

      <Grid container spacing={3}>
        {jobs.map((job) => (
          <Grid item xs={12} md={6} key={job.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{job.title}</Typography>
                <Typography color="textSecondary" gutterBottom>
                  {job.department} • {job.location}
                </Typography>
                <Chip
                  label={job.type}
                  size="small"
                  sx={{ mr: 1 }}
                />
                <Chip
                  label={job.status}
                  color={job.status === 'Open' ? 'success' : 'default'}
                  size="small"
                />
                <Box sx={{ mt: 2 }}>
                  <IconButton onClick={() => handleOpenDialog(job)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteJob(job.id)}>
                    <DeleteIcon />
                  </IconButton>
                  <IconButton>
                    <ShareIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
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
                onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  value={newJob.department}
                  label="Department"
                  onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Job Type</InputLabel>
                <Select
                  value={newJob.type}
                  label="Job Type"
                  onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                >
                  {jobTypes.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                value={newJob.description}
                onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveJob} variant="contained">
            {selectedJob ? 'Update' : 'Post'} Job
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default JobPostings;
