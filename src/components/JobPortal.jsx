import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  Button,
  Dialog,
  TextField,
  CircularProgress,
  Grid,
  Chip,
  Fade,
  Stack
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import recruitmentService from '../services/recruitmentService';

const JobPortal = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applicationDialog, setApplicationDialog] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [application, setApplication] = useState({
    coverLetter: '',
    experience: '',
    skills: ''
  });

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const activeJobs = await recruitmentService.getActiveJobPostings();
      setJobs(activeJobs);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (job) => {
    setSelectedJob(job);
    setApplicationDialog(true);
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    try {
      await recruitmentService.submitApplication({
        jobId: selectedJob.id,
        applicantId: user?.id,
        ...application,
        experience: application.experience.split('\n'),
        skills: application.skills.split(',').map(skill => skill.trim())
      });
      setApplicationDialog(false);
      // Show success message
    } catch (error) {
      console.error('Error submitting application:', error);
      // Show error message
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Fade in={true} timeout={1000}>
        <Box>
          <Typography variant="h3" gutterBottom align="center" mb={6}>
            Career Opportunities
          </Typography>

          <Grid container spacing={3}>
            {jobs.map(job => (
              <Grid item xs={12} md={6} key={job.id}>
                <Card
                  sx={{
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)'
                    }
                  }}
                >
                  <Typography variant="h5">{job.title}</Typography>
                  <Typography color="textSecondary">{job.department}</Typography>
                  <Typography paragraph>{job.description}</Typography>
                  <Button 
                    variant="contained" 
                    onClick={() => handleApply(job)}
                    disabled={!user}
                  >
                    {user ? 'Apply Now' : 'Login to Apply'}
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Fade>

      <Dialog open={applicationDialog} onClose={() => setApplicationDialog(false)}>
        <Box component="form" onSubmit={handleSubmitApplication} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Apply for {selectedJob?.title}
          </Typography>
          
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Cover Letter"
            value={application.coverLetter}
            onChange={(e) => setApplication({...application, coverLetter: e.target.value})}
            sx={{ mb: 2 }}
          />
          
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Experience (one per line)"
            value={application.experience}
            onChange={(e) => setApplication({...application, experience: e.target.value})}
            sx={{ mb: 2 }}
          />
          
          <TextField
            fullWidth
            label="Skills (comma-separated)"
            value={application.skills}
            onChange={(e) => setApplication({...application, skills: e.target.value})}
            sx={{ mb: 2 }}
          />
          
          <Button type="submit" variant="contained" fullWidth>
            Submit Application
          </Button>
        </Box>
      </Dialog>
    </Container>
  );
};

export default JobPortal;
