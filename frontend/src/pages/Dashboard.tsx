import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import DashboardLayout from '../components/Dashboard/DashboardLayout';

const Dashboard = () => {
  return (
    <DashboardLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome to your grocery calculator dashboard
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
            }}
          >
            <Typography variant="h6" component="h2" gutterBottom>
              Recent Items
            </Typography>
            <Typography variant="body2">
              No items added yet. Add some groceries to your cart!
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6} lg={4}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
            }}
          >
            <Typography variant="h6" component="h2" gutterBottom>
              Shopping Summary
            </Typography>
            <Typography variant="body2">
              Start shopping to see your summary.
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6} lg={4}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
            }}
          >
            <Typography variant="h6" component="h2" gutterBottom>
              Budget Status
            </Typography>
            <Typography variant="body2">
              Set a budget to track your grocery spending.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default Dashboard; 