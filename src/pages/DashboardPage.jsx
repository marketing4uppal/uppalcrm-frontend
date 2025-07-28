// src/pages/DashboardPage.jsx
import React from 'react';
import LeadList from '../components/LeadList';
import LeadForm from '../components/LeadForm';
import { Divider, Typography } from '@mui/material';

const DashboardPage = () => {
  return (
    <div>
      <Typography variant="h5" gutterBottom>Dashboard</Typography>
      <Typography>Welcome to your CRM Dashboard.</Typography>
      <Divider sx={{ my: 4 }} />
      <LeadForm />
      <Divider sx={{ my: 4 }} />
      <LeadList />
    </div>
  );
};

export default DashboardPage;