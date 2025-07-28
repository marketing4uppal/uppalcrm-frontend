// src/App.jsx (Final Layout)
import React, { useState, useEffect } from 'react';
import setAuthToken from './utils/setAuthToken';
import Register from './components/Register';
import Login from './components/Login';
import LeadForm from './components/LeadForm';
import LeadList from './components/LeadList';
import ContactForm from './components/ContactForm';
import ContactList from './components/ContactList';
import { Container, Box, Typography, Button, Divider } from '@mui/material';
import './App.css';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (localStorage.token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setIsAuthenticated(false);
    window.location.reload();
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {isAuthenticated ? (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4">Uppal CRM</Typography>
          <Button variant="outlined" onClick={handleLogout}>Logout</Button>
        </Box>
      ) : (
        <Typography variant="h4" align="center" sx={{ mb: 4 }}>Uppal CRM</Typography>
      )}

      {isAuthenticated ? (
        <Box>
          <LeadForm />
          <Divider sx={{ my: 4 }} />
          <LeadList />
          <Divider sx={{ my: 4 }} />
          <ContactForm />
          <Divider sx={{ my: 4 }} />
          <ContactList />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
          <Box sx={{ p: 3, border: '1px solid #ddd', borderRadius: '8px', width: '400px' }}><Register /></Box>
          <Box sx={{ p: 3, border: '1px solid #ddd', borderRadius: '8px', width: '400px' }}><Login /></Box>
        </Box>
      )}
    </Container>
  );
}

export default App;