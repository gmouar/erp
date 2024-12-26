import React, { useState, useEffect } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  Divider
} from '@mui/material';
import JobPostings from './JobPostings';
import ApplicationReview from './ApplicationReview';
import InterviewScheduler from './InterviewScheduler';
import RecruitmentDashboard from './RecruitmentDashboard';
import recruitmentService from '../../../services/recruitmentService';

const RecruitmentManagement = ({ type = 'dashboard' }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [recruitmentData, setRecruitmentData] = useState({
    jobs: [],
    applications: [],
    interviews: []
  });

  useEffect(() => {
    fetchRecruitmentData();
  }, []);

  const fetchRecruitmentData = async () => {
    try {
      const jobs = await recruitmentService.getActiveJobPostings();
      setRecruitmentData(prev => ({ ...prev, jobs }));
    } catch (error) {
      console.error('Error fetching recruitment data:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Render different components based on type prop if provided
  if (type === 'jobs') {
    return <JobPostings />;
  }
  if (type === 'candidates') {
    return <ApplicationReview />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Recruitment Management
      </Typography>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Dashboard" />
          <Tab label="Job Postings" />
          <Tab label="Applications" />
          <Tab label="Interviews" />
        </Tabs>
        <Divider />
        <Box sx={{ p: 2 }}>
          {activeTab === 0 && <RecruitmentDashboard data={recruitmentData} />}
          {activeTab === 1 && <JobPostings jobs={recruitmentData.jobs} onUpdate={fetchRecruitmentData} />}
          {activeTab === 2 && <ApplicationReview />}
          {activeTab === 3 && <InterviewScheduler />}
        </Box>
      </Paper>
    </Box>
  );
};

export default RecruitmentManagement;
