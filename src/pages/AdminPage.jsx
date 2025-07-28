// src/pages/AdminPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'user',
  });

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users`);
      setUsers(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/users`, formData);
      alert('User created successfully!');
      fetchUsers(); // Refresh the user list
      setFormData({ firstName: '', lastName: '', email: '', password: '', role: 'user' });
    } catch (error) {
      alert('Error creating user: ' + error.response.data.message);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Admin - User Management</Typography>

      <Box component="form" onSubmit={onSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: '400px', mb: 4, p: 2, border: '1px solid #ddd', borderRadius: '8px' }}>
        <Typography variant="h6">Add New User</Typography>
        <TextField label="First Name" name="firstName" value={formData.firstName} onChange={onChange} required size="small" />
        <TextField label="Last Name" name="lastName" value={formData.lastName} onChange={onChange} required size="small" />
        <TextField label="Email Address" type="email" name="email" value={formData.email} onChange={onChange} required size="small" />
        <TextField label="Password" type="password" name="password" value={formData.password} onChange={onChange} required size="small" />
        <FormControl size="small">
          <InputLabel>Role</InputLabel>
          <Select name="role" value={formData.role} label="Role" onChange={onChange}>
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </FormControl>
        <Button type="submit" variant="contained">Add User</Button>
      </Box>

      <Typography variant="h6" gutterBottom>Current Users</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.firstName} {user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminPage;