import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button
} from '@mui/material';

const InterviewScheduler = () => {
  const [interviews] = useState([]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Interview Schedule
      </Typography>

      <Grid container spacing={3}>
        {interviews.map((interview) => (
          <Grid item xs={12} md={6} key={interview.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{interview.candidateName}</Typography>
                <Typography color="textSecondary">
                  {interview.position}
                </Typography>
                <Typography>
                  {new Date(interview.datetime).toLocaleString()}
                </Typography>
                <Button variant="contained" sx={{ mt: 2 }}>
                  Join Interview
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default InterviewScheduler;
