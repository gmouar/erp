import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import hrService from '../../../services/hrService';

const PolicyManagement = () => {
  const [policies, setPolicies] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [newPolicy, setNewPolicy] = useState({
    title: '',
    description: '',
    category: 'general',
    effectiveDate: new Date(),
    status: 'draft',
    departments: []
  });

  const categories = [
    'general',
    'hr',
    'finance',
    'it',
    'security',
    'compliance'
  ];

  const departments = [
    'All',
    'HR',
    'Finance',
    'Engineering',
    'Marketing',
    'Sales',
    'Operations'
  ];

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      // This would be replaced with actual API call
      const mockData = [
        {
          id: 1,
          title: 'Work from Home Policy',
          description: 'Guidelines for remote work arrangements',
          category: 'hr',
          effectiveDate: '2024-01-01',
          status: 'active',
          departments: ['All'],
          createdAt: '2023-12-15',
          lastUpdated: '2023-12-15'
        },
        {
          id: 2,
          title: 'Information Security Policy',
          description: 'Guidelines for protecting company data',
          category: 'security',
          effectiveDate: '2024-01-01',
          status: 'active',
          departments: ['IT', 'Engineering'],
          createdAt: '2023-12-15',
          lastUpdated: '2023-12-15'
        }
      ];
      setPolicies(mockData);
    } catch (error) {
      console.error('Error fetching policies:', error);
    }
  };

  const handleOpenDialog = (policy = null) => {
    if (policy) {
      setSelectedPolicy(policy);
      setNewPolicy(policy);
    } else {
      setSelectedPolicy(null);
      setNewPolicy({
        title: '',
        description: '',
        category: 'general',
        effectiveDate: new Date(),
        status: 'draft',
        departments: []
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPolicy(null);
    setNewPolicy({
      title: '',
      description: '',
      category: 'general',
      effectiveDate: new Date(),
      status: 'draft',
      departments: []
    });
  };

  const handleSave = async () => {
    try {
      if (selectedPolicy) {
        // Update existing policy
        const updatedPolicies = policies.map(policy =>
          policy.id === selectedPolicy.id ? { ...policy, ...newPolicy } : policy
        );
        setPolicies(updatedPolicies);
      } else {
        // Create new policy
        const policy = {
          id: policies.length + 1,
          ...newPolicy,
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        };
        setPolicies([...policies, policy]);
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving policy:', error);
    }
  };

  const handleDelete = async (policyId) => {
    try {
      setPolicies(policies.filter(policy => policy.id !== policyId));
    } catch (error) {
      console.error('Error deleting policy:', error);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Policy Management
        </Typography>

        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            New Policy
          </Button>
        </Box>

        <Grid container spacing={3}>
          {policies.map((policy) => (
            <Grid item xs={12} key={policy.id}>
              <Card>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={8}>
                      <Typography variant="h6">{policy.title}</Typography>
                      <Typography color="textSecondary" gutterBottom>
                        Category: {policy.category}
                      </Typography>
                      <Typography variant="body2">
                        {policy.description}
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        {policy.departments.map((dept) => (
                          <Chip
                            key={dept}
                            label={dept}
                            size="small"
                            sx={{ mr: 1 }}
                          />
                        ))}
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(policy)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(policy.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                      <Typography variant="body2" color="textSecondary" align="right">
                        Effective: {new Date(policy.effectiveDate).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" align="right">
                        Last Updated: {new Date(policy.lastUpdated).toLocaleDateString()}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {selectedPolicy ? 'Edit Policy' : 'New Policy'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Policy Title"
                  value={newPolicy.title}
                  onChange={(e) => setNewPolicy({ ...newPolicy, title: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  value={newPolicy.description}
                  onChange={(e) => setNewPolicy({ ...newPolicy, description: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={newPolicy.category}
                    label="Category"
                    onChange={(e) => setNewPolicy({ ...newPolicy, category: e.target.value })}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Effective Date"
                  value={newPolicy.effectiveDate}
                  onChange={(date) => setNewPolicy({ ...newPolicy, effectiveDate: date })}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Applicable Departments</InputLabel>
                  <Select
                    multiple
                    value={newPolicy.departments}
                    label="Applicable Departments"
                    onChange={(e) => setNewPolicy({ ...newPolicy, departments: e.target.value })}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    {departments.map((department) => (
                      <MenuItem key={department} value={department}>
                        {department}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={newPolicy.status}
                    label="Status"
                    onChange={(e) => setNewPolicy({ ...newPolicy, status: e.target.value })}
                  >
                    <MenuItem value="draft">Draft</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="archived">Archived</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSave} variant="contained">
              {selectedPolicy ? 'Update' : 'Create'} Policy
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default PolicyManagement;
