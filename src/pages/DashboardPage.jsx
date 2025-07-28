// src/pages/DashboardPage.jsx (Correct Code)
import React from 'react';
import { Link } from 'react-router-dom';
import LeadList from '../components/LeadList';
import LeadForm from '../components/LeadForm';
import { Divider, Typography, Button, Box } from '@mui/material';

const DashboardPage = ({ user }) => {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" gutterBottom>Dashboard</Typography>
        {/* Show Admin Panel link only if user is an admin */}
        {user && user.role === 'admin' && (
          <Button component={Link} to="/admin" variant="contained">
            Admin Panel
          </Button>
        )}
      </Box>
      <Typography>Welcome to your CRM Dashboard.</Typography>
      <Divider sx={{ my: 4 }} />
      <LeadForm />
      <Divider sx={{ my: 4 }} />
      <LeadList />
    </Box>
  );
};

export default DashboardPage;