// src/pages/LoginPage.jsx (New Design)
import React from 'react';
import Register from '../components/Register';
import Login from '../components/Login';
import { Grid, Box, Paper, Typography, Stack, Divider } from '@mui/material';

const LoginPage = () => {
  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      {/* Left Column (Branding/Image) */}
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1556742502-ec7c0e2f34b1?auto=format&fit=crop&w=1287&q=80)',
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Right Column (Forms) */}
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
            Welcome to Uppal CRM
          </Typography>

          {/* We use a Stack to space out the Login and Register forms */}
          <Stack spacing={4} sx={{ width: '100%' }}>
            <Login />
            <Divider>OR</Divider>
            <Register />
          </Stack>
        </Box>
      </Grid>
    </Grid>
  );
};

export default LoginPage;