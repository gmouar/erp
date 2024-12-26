import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Button,
  Dialog,
  TextField,
  CircularProgress,
  Typography
} from '@mui/material';
import recruitmentService from '../../../services/recruitmentService';

const JobPostings = ({ userRole }) => {
  const [postings, setPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newPosting, setNewPosting] = useState({
    title: '',
    department: '',
    description: '',
    requirements: '',
    location: '',
    closingDate: ''
  });

  useEffect(() => {
    loadPostings();
  }, []);

  const loadPostings = async () => {
    try {
      const data = await recruitmentService.getActiveJobPostings();
      setPostings(data);
    } catch (error) {
      console.error('Error loading job postings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await recruitmentService.createJobPosting({
        ...newPosting,
        requirements: newPosting.requirements.split('\n')
      });
      setDialogOpen(false);
      loadPostings();
    } catch (error) {
      console.error('Error creating job posting:', error);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ p: 3 }}>
      {userRole === 'HR' && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => setDialogOpen(true)}
          sx={{ mb: 3 }}
        >
          Create New Job Posting
        </Button>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
          <Typography variant="h6">Create New Job Posting</Typography>
          {/* Dialog form fields */}
          <TextField
            fullWidth
            label="Job Title"
            value={newPosting.title}
            onChange={(e) => setNewPosting({ ...newPosting, title: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Department"
            value={newPosting.department}
            onChange={(e) => setNewPosting({ ...newPosting, department: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            value={newPosting.description}
            onChange={(e) => setNewPosting({ ...newPosting, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Requirements"
            value={newPosting.requirements}
            onChange={(e) => setNewPosting({ ...newPosting, requirements: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Location"
            value={newPosting.location}
            onChange={(e) => setNewPosting({ ...newPosting, location: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Closing Date"
            type="date"
            value={newPosting.closingDate}
            onChange={(e) => setNewPosting({ ...newPosting, closingDate: e.target.value })}
            sx={{ mb: 2 }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Button type="submit" variant="contained" color="primary">
            Create
          </Button>
        </Box>
      </Dialog>

      <Box sx={{ display: 'grid', gap: 2 }}>
        {postings.map(posting => (
          <Card key={posting.id} sx={{ p: 2 }}>
            <Typography variant="h6">{posting.title}</Typography>
            <Typography>{posting.department}</Typography>
            <Typography>{posting.description}</Typography>
            <Typography>{posting.requirements.join(', ')}</Typography>
            <Typography>{posting.location}</Typography>
            <Typography>{posting.closingDate}</Typography>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default JobPostings;
