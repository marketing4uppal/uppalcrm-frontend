// src/pages/LoginPage.jsx
import React from 'react';
import Register from '../components/Register';
import Login from '../components/Login';
import { Container, Box, Typography, Divider } from '@mui/material';

const LoginPage = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 4 }}>
      <Typography variant="h4" align="center" sx={{ mb: 4 }}>
        Uppal CRM
      </Typography>
      <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
        <Box sx={{ p: 3, border: '1px solid #ddd', borderRadius: '8px', width: '400px' }}>
          <Register />
        </Box>
        <Box sx={{ p: 3, border: '1px solid #ddd', borderRadius: '8px', width: '400px' }}>
          <Login />
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;