// src/components/Login.jsx (Simplified)
import React, { useState } from 'react';
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const { email, password } = formData;
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const backendUrl = `${import.meta.env.VITE_API_URL}/api/auth/login`;
    try {
      const res = await axios.post(backendUrl, formData);
      localStorage.setItem('token', res.data.token);
      setAuthToken(res.data.token);
      navigate('/');
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || 'Login failed'));
    }
  };

  return (
    <Box component="form" onSubmit={onSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6">Login to Your Account</Typography>
      <TextField label="Email Address" type="email" name="email" value={email} onChange={onChange} required size="small" />
      <TextField label="Password" type="password" name="password" value={password} onChange={onChange} required size="small" />
      <Button type="submit" variant="contained" fullWidth>Login</Button>
    </Box>
  );
};

export default Login;