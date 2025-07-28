// src/components/LeadForm.jsx (MUI Version)
import React, { useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const LeadForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    leadSource: '',
  });

  const { firstName, lastName, email, phone, leadSource } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const backendUrl = `${import.meta.env.VITE_API_URL}/api/leads`;
    try {
      const res = await axios.post(backendUrl, formData);
      console.log('Lead created:', res.data);
      alert('Lead created successfully!');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        leadSource: '',
      });
    } catch (error) {
      console.error('Error creating lead:', error.response.data);
      alert('Error: ' + error.response.data.message);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: '400px' }}
    >
      <Typography variant="h6">Add New Lead</Typography>
      <TextField
        label="First Name"
        name="firstName"
        value={firstName}
        onChange={onChange}
        required
        variant="outlined"
        size="small"
      />
      <TextField
        label="Last Name"
        name="lastName"
        value={lastName}
        onChange={onChange}
        required
        variant="outlined"
        size="small"
      />
      <TextField
        label="Email Address"
        type="email"
        name="email"
        value={email}
        onChange={onChange}
        required
        variant="outlined"
        size="small"
      />
      <TextField
        label="Phone"
        name="phone"
        value={phone}
        onChange={onChange}
        variant="outlined"
        size="small"
      />
      <TextField
        label="Lead Source"
        name="leadSource"
        value={leadSource}
        onChange={onChange}
        variant="outlined"
        size="small"
      />
      <Button type="submit" variant="contained">
        Add Lead
      </Button>
    </Box>
  );
};

export default LeadForm;