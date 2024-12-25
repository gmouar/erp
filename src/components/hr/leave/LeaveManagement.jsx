import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import hrService from '../../../services/hrService';

const LeaveManagement = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      const data = await hrService.getLeaveRequests();
      setLeaveRequests(data);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box style={{ padding: '24px' }}>
        <h2>Leave Management</h2>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div>
            {/* Leave request list and forms will go here */}
          </div>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default LeaveManagement;
