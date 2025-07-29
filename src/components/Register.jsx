// src/components/Register.jsx (Simplified)
import React, { useState } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography } from '@mui/material';

const Register = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const { businessName, firstName, lastName, email, password } = formData;
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const backendUrl = `${import.meta.env.VITE_API_URL}/api/auth/register`;
    try {
      await axios.post(backendUrl, formData);
      alert('Registration successful! Please log in.');
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || 'Registration failed'));
    }
  };

  return (
    <Box component="form" onSubmit={onSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6">Create a New Account</Typography>
      <TextField label="Business Name" name="businessName" value={businessName} onChange={onChange} required size="small" />
      <TextField label="First Name" name="firstName" value={firstName} onChange={onChange} required size="small" />
      <TextField label="Last Name" name="lastName" value={lastName} onChange={onChange} required size="small" />
      <TextField label="Email Address" type="email" name="email" value={email} onChange={onChange} required size="small" />
      <TextField label="Password" type="password" name="password" value={password} onChange={onChange} required minLength="6" size="small" />
      <Button type="submit" variant="outlined" fullWidth>Register</Button>
    </Box>
  );
};

export default Register;