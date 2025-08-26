// src/components/Login.jsx - FIXED VERSION (Using Lucide Icons)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock 
} from 'lucide-react';

const Login = () => {
  const navigate = useNavigate(); // ✅ CRITICAL: React Router navigation hook
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear any existing errors when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('Login successful! Redirecting...');

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`, 
        formData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.token) {
        // Store the token
        localStorage.setItem('token', response.data.token);
        
        console.log('Login successful, redirecting...');
        
        // ✅ BULLETPROOF REDIRECT - Multiple fallback methods
        
        // Method 1: React Router navigation (preferred)
        try {
          console.log('Attempting React Router navigate...');
          navigate('/dashboard', { replace: true });
          
          // Add a small delay to ensure navigation completes
          setTimeout(() => {
            // If we're still on the login page after navigation, force redirect
            if (window.location.pathname.includes('login') || window.location.pathname === '/') {
              console.log('React Router failed, using window.location fallback');
              window.location.href = '/dashboard';
            }
          }, 500);
          
        } catch (navError) {
          console.warn('React Router navigate failed:', navError);
          
          // Method 2: Direct window location (immediate fallback)
          console.log('Using window.location.href fallback');
          window.location.href = '/dashboard';
        }
        
      } else {
        throw new Error('No token received from server');
      }
      
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
      setSuccess('');
      
      // Handle different types of errors
      if (error.response?.status === 400) {
        setError('Invalid email or password');
      } else if (error.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else if (error.code === 'NETWORK_ERROR') {
        setError('Network error. Please check your connection.');
      } else {
        setError(error.response?.data?.message || 'Login failed. Please try again.');
      }
      
      // Clear any stored token on error
      localStorage.removeItem('token');
    }
  };

  // Custom icon components for Material UI compatibility
  const MailIcon = () => <Mail size={20} style={{ color: '#666' }} />;
  const LockIcon = () => <Lock size={20} style={{ color: '#666' }} />;
  const EyeIcon = () => <Eye size={20} style={{ color: '#666' }} />;
  const EyeOffIcon = () => <EyeOff size={20} style={{ color: '#666' }} />;

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Sign In
      </Typography>

      {/* Success Message */}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Email Field */}
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
        value={formData.email}
        onChange={handleInputChange}
        disabled={loading}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <MailIcon />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2 }}
      />

      {/* Password Field */}
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type={showPassword ? 'text' : 'password'}
        id="password"
        autoComplete="current-password"
        value={formData.password}
        onChange={handleInputChange}
        disabled={loading}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                disabled={loading}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      {/* Submit Button */}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading || !formData.email || !formData.password}
        sx={{
          mt: 1,
          mb: 2,
          py: 1.5,
          fontSize: '1rem',
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #2196F3 30%, #9C27B0 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #1976D2 30%, #7B1FA2 90%)',
          },
          '&:disabled': {
            background: '#ccc',
          },
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={20} color="inherit" />
            <span>Signing In...</span>
          </Box>
        ) : (
          'Sign In'
        )}
      </Button>
    </Box>
  );
};

export default Login;