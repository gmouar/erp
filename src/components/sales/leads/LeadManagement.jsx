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
  Card,
  CardContent,
  Chip,
  Stack,
  Tooltip,
  Rating,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';

import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';

import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Event as EventIcon,
  Star as StarIcon,
  ArrowForward as ArrowForwardIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const LeadManagement = () => {
  const [leads, setLeads] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [leadSummary, setLeadSummary] = useState({
    totalLeads: 0,
    newLeads: 0,
    qualifiedLeads: 0,
    convertedLeads: 0
  });

  const leadSources = [
    'Website',
    'Referral',
    'Social Media',
    'Trade Show',
    'Cold Call',
    'Email Campaign'
  ];

  const leadStatuses = [
    'New',
    'Contacted',
    'Qualified',
    'Proposal',
    'Negotiation',
    'Converted',
    'Lost'
  ];

  const industries = [
    'Technology',
    'Manufacturing',
    'Healthcare',
    'Finance',
    'Retail',
    'Education',
    'Other'
  ];

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      // This would be replaced with actual API call
      const mockData = [
        {
          id: 'LEAD001',
          company: 'Tech Solutions Inc',
          contactName: 'John Smith',
          title: 'CTO',
          email: 'john.smith@techsolutions.com',
          phone: '123-456-7890',
          source: 'Website',
          status: 'Qualified',
          industry: 'Technology',
          score: 4,
          value: 50000,
          assignedTo: 'Sarah Wilson',
          createdDate: '2024-02-01T10:00:00',
          lastContact: '2024-02-15T14:30:00',
          notes: 'Interested in enterprise solution',
          activities: [
            {
              type: 'Email',
              date: '2024-02-15T14:30:00',
              description: 'Sent product information'
            },
            {
              type: 'Call',
              date: '2024-02-10T11:00:00',
              description: 'Initial discovery call'
            }
          ]
        },
        {
          id: 'LEAD002',
          company: 'Healthcare Plus',
          contactName: 'Jane Doe',
          title: 'Procurement Manager',
          email: 'jane.doe@healthcareplus.com',
          phone: '098-765-4321',
          source: 'Trade Show',
          status: 'Proposal',
          industry: 'Healthcare',
          score: 5,
          value: 75000,
          assignedTo: 'Mike Johnson',
          createdDate: '2024-02-05T09:00:00',
          lastContact: '2024-02-16T10:15:00',
          notes: 'Requires custom solution',
          activities: [
            {
              type: 'Meeting',
              date: '2024-02-16T10:15:00',
              description: 'Product demo'
            }
          ]
        }
      ];

      setLeads(mockData);
      calculateLeadSummary(mockData);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  const calculateLeadSummary = (leadsData) => {
    const summary = leadsData.reduce((acc, lead) => {
      acc.totalLeads++;
      switch (lead.status.toLowerCase()) {
        case 'new':
          acc.newLeads++;
          break;
        case 'qualified':
          acc.qualifiedLeads++;
          break;
        case 'converted':
          acc.convertedLeads++;
          break;
      }
      return acc;
    }, {
      totalLeads: 0,
      newLeads: 0,
      qualifiedLeads: 0,
      convertedLeads: 0
    });

    setLeadSummary(summary);
  };

  const handleOpenDialog = (lead = null) => {
    setSelectedLead(lead || {
      company: '',
      contactName: '',
      title: '',
      email: '',
      phone: '',
      source: '',
      status: 'New',
      industry: '',
      score: 3,
      value: 0,
      assignedTo: '',
      notes: '',
      activities: []
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedLead(null);
    setOpenDialog(false);
  };

  const handleAddActivity = () => {
    setSelectedLead({
      ...selectedLead,
      activities: [
        {
          type: '',
          date: new Date(),
          description: ''
        },
        ...selectedLead.activities
      ]
    });
  };

  const handleUpdateActivity = (index, field, value) => {
    const updatedActivities = selectedLead.activities.map((activity, i) => {
      if (i === index) {
        return { ...activity, [field]: value };
      }
      return activity;
    });

    setSelectedLead({
      ...selectedLead,
      activities: updatedActivities
    });
  };

  const handleSaveLead = async () => {
    try {
      if (selectedLead.id) {
        // Update existing lead
        const updatedLeads = leads.map(lead =>
          lead.id === selectedLead.id ? selectedLead : lead
        );
        setLeads(updatedLeads);
        calculateLeadSummary(updatedLeads);
      } else {
        // Create new lead
        const newLead = {
          ...selectedLead,
          id: `LEAD${(leads.length + 1).toString().padStart(3, '0')}`,
          createdDate: new Date().toISOString(),
          lastContact: new Date().toISOString()
        };
        const updatedLeads = [...leads, newLead];
        setLeads(updatedLeads);
        calculateLeadSummary(updatedLeads);
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving lead:', error);
    }
  };

  const handleUpdateStatus = async (leadId, newStatus) => {
    try {
      const updatedLeads = leads.map(lead =>
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      );
      setLeads(updatedLeads);
      calculateLeadSummary(updatedLeads);
    } catch (error) {
      console.error('Error updating lead status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'new':
        return 'info';
      case 'contacted':
        return 'primary';
      case 'qualified':
        return 'success';
      case 'proposal':
        return 'warning';
      case 'negotiation':
        return 'secondary';
      case 'converted':
        return 'success';
      case 'lost':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Lead Management
        </Typography>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Leads
                </Typography>
                <Typography variant="h4">
                  {leadSummary.totalLeads}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  New Leads
                </Typography>
                <Typography variant="h4" color="info.main">
                  {leadSummary.newLeads}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Qualified Leads
                </Typography>
                <Typography variant="h4" color="success.main">
                  {leadSummary.qualifiedLeads}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Converted Leads
                </Typography>
                <Typography variant="h4" color="primary.main">
                  {leadSummary.convertedLeads}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Lead
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Score</TableCell>
                <TableCell>Value</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Last Contact</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>{lead.id}</TableCell>
                  <TableCell>{lead.company}</TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">{lead.contactName}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {lead.title}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{lead.source}</TableCell>
                  <TableCell>
                    <Chip
                      label={lead.status}
                      color={getStatusColor(lead.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Rating value={lead.score} readOnly size="small" />
                  </TableCell>
                  <TableCell>{formatCurrency(lead.value)}</TableCell>
                  <TableCell>{lead.assignedTo}</TableCell>
                  <TableCell>
                    {new Date(lead.lastContact).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(lead)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Send Email">
                      <IconButton size="small">
                        <EmailIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Schedule Call">
                      <IconButton size="small">
                        <PhoneIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {selectedLead?.id ? 'Edit Lead' : 'Add New Lead'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Company Name"
                  value={selectedLead?.company || ''}
                  onChange={(e) =>
                    setSelectedLead({
                      ...selectedLead,
                      company: e.target.value
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Industry</InputLabel>
                  <Select
                    value={selectedLead?.industry || ''}
                    label="Industry"
                    onChange={(e) =>
                      setSelectedLead({
                        ...selectedLead,
                        industry: e.target.value
                      })
                    }
                  >
                    {industries.map((industry) => (
                      <MenuItem key={industry} value={industry}>
                        {industry}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contact Name"
                  value={selectedLead?.contactName || ''}
                  onChange={(e) =>
                    setSelectedLead({
                      ...selectedLead,
                      contactName: e.target.value
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Title"
                  value={selectedLead?.title || ''}
                  onChange={(e) =>
                    setSelectedLead({
                      ...selectedLead,
                      title: e.target.value
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={selectedLead?.email || ''}
                  onChange={(e) =>
                    setSelectedLead({
                      ...selectedLead,
                      email: e.target.value
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={selectedLead?.phone || ''}
                  onChange={(e) =>
                    setSelectedLead({
                      ...selectedLead,
                      phone: e.target.value
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Source</InputLabel>
                  <Select
                    value={selectedLead?.source || ''}
                    label="Source"
                    onChange={(e) =>
                      setSelectedLead({
                        ...selectedLead,
                        source: e.target.value
                      })
                    }
                  >
                    {leadSources.map((source) => (
                      <MenuItem key={source} value={source}>
                        {source}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={selectedLead?.status || ''}
                    label="Status"
                    onChange={(e) =>
                      setSelectedLead({
                        ...selectedLead,
                        status: e.target.value
                      })
                    }
                  >
                    {leadStatuses.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography component="legend">Lead Score</Typography>
                  <Rating
                    value={selectedLead?.score || 0}
                    onChange={(event, newValue) =>
                      setSelectedLead({
                        ...selectedLead,
                        score: newValue
                      })
                    }
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Potential Value"
                  type="number"
                  value={selectedLead?.value || ''}
                  onChange={(e) =>
                    setSelectedLead({
                      ...selectedLead,
                      value: parseFloat(e.target.value)
                    })
                  }
                  InputProps={{
                    startAdornment: '$'
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Assigned To"
                  value={selectedLead?.assignedTo || ''}
                  onChange={(e) =>
                    setSelectedLead({
                      ...selectedLead,
                      assignedTo: e.target.value
                    })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  multiline
                  rows={3}
                  value={selectedLead?.notes || ''}
                  onChange={(e) =>
                    setSelectedLead({
                      ...selectedLead,
                      notes: e.target.value
                    })
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle1">Activities</Typography>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={handleAddActivity}
                  >
                    Add Activity
                  </Button>
                </Box>
                <Timeline>
                  {selectedLead?.activities?.map((activity, index) => (
                    <TimelineItem key={index}>
                      <TimelineSeparator>
                        <TimelineDot color="primary" />
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                              <InputLabel>Type</InputLabel>
                              <Select
                                size="small"
                                value={activity.type}
                                label="Type"
                                onChange={(e) =>
                                  handleUpdateActivity(index, 'type', e.target.value)
                                }
                              >
                                <MenuItem value="Email">Email</MenuItem>
                                <MenuItem value="Call">Call</MenuItem>
                                <MenuItem value="Meeting">Meeting</MenuItem>
                                <MenuItem value="Note">Note</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <DateTimePicker
                              label="Date"
                              value={activity.date}
                              onChange={(date) =>
                                handleUpdateActivity(index, 'date', date)
                              }
                              renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              size="small"
                              label="Description"
                              value={activity.description}
                              onChange={(e) =>
                                handleUpdateActivity(index, 'description', e.target.value)
                              }
                            />
                          </Grid>
                        </Grid>
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSaveLead} variant="contained">
              {selectedLead?.id ? 'Update' : 'Add'} Lead
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default LeadManagement;
