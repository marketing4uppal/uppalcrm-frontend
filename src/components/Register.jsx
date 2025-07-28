// src/components/Register.jsx (MUI Version)
import React, { useState } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography } from '@mui/material';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const { firstName, lastName, email, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const backendUrl = `${import.meta.env.VITE_API_URL}/api/auth/register`;
    try {
      const res = await axios.post(backendUrl, formData);
      console.log(res.data);
      alert('Registration successful! Please log in.');
    } catch (error) {
      console.error(error.response.data);
      alert('Error: ' + error.response.data.message);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      <Typography variant="h6">Register New User</Typography>
      <TextField label="First Name" name="firstName" value={firstName} onChange={onChange} required size="small" />
      <TextField label="Last Name" name="lastName" value={lastName} onChange={onChange} required size="small" />
      <TextField label="Email Address" type="email" name="email" value={email} onChange={onChange} required size="small" />
      <TextField label="Password" type="password" name="password" value={password} onChange={onChange} required minLength="6" size="small" />
      <Button type="submit" variant="contained">Register</Button>
    </Box>
  );
};

export default Register;