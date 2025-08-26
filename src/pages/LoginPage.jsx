// src/components/Login.jsx - DEBUG VERSION
import React, { useState, useEffect } from 'react';
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
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

  // Debug: Check if we're already authenticated on component load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('🔍 Token found in localStorage:', token.substring(0, 20) + '...');
      setDebugInfo('Token found - should redirect to dashboard');
      // If there's already a token, redirect to dashboard
      window.location.href = '/dashboard';
    } else {
      console.log('🔍 No token found in localStorage');
      setDebugInfo('No token found - showing login form');
    }
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    console.log('🚀 Starting login process...');
    console.log('🔍 Current URL:', window.location.href);
    console.log('🔍 API URL:', import.meta.env.VITE_API_URL);

    try {
      console.log('📡 Sending login request...');
      setDebugInfo('Sending login request to server...');
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`, 
        formData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('✅ Login response received:', response.status);
      console.log('🔍 Response data:', response.data);
      
      if (response.data && response.data.token) {
        const token = response.data.token;
        console.log('🎯 Token received:', token.substring(0, 20) + '...');
        
        // Store the token
        localStorage.setItem('token', token);
        console.log('💾 Token stored in localStorage');
        
        // Verify token was stored
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          console.log('✅ Token verified in localStorage');
          setDebugInfo('Token stored successfully - redirecting...');
        } else {
          console.error('❌ Token NOT stored in localStorage');
          setDebugInfo('ERROR: Token not stored!');
          throw new Error('Failed to store token');
        }
        
        setSuccess('Login successful! Redirecting to dashboard...');
        
        // MULTIPLE REDIRECT ATTEMPTS WITH DEBUGGING
        console.log('🔄 Starting redirect process...');
        console.log('🔍 Current pathname before redirect:', window.location.pathname);
        
        // Method 1: Immediate redirect
        console.log('🔄 Method 1: window.location.href');
        setDebugInfo('Attempting redirect method 1...');
        window.location.href = '/dashboard';
        
        // Method 2: Backup after 100ms
        setTimeout(() => {
          console.log('🔄 Method 2: window.location.replace (backup)');
          setDebugInfo('Attempting redirect method 2...');
          window.location.replace('/dashboard');
        }, 100);
        
        // Method 3: Nuclear option after 500ms
        setTimeout(() => {
          console.log('🔄 Method 3: window.location.assign (nuclear)');
          setDebugInfo('Attempting redirect method 3...');
          window.location.assign('/dashboard');
        }, 500);
        
        // Method 4: Force page reload after 1 second
        setTimeout(() => {
          console.log('🔄 Method 4: Force page reload');
          setDebugInfo('Force reloading page to dashboard...');
          window.location = '/dashboard';
        }, 1000);
        
        return; // Stop execution
        
      } else {
        console.error('❌ No token in response:', response.data);
        throw new Error('No token received from server');
      }
      
    } catch (error) {
      console.error('💥 Login error:', error);
      setLoading(false);
      setSuccess('');
      
      if (error.response) {
        console.log('📡 Error response status:', error.response.status);
        console.log('📡 Error response data:', error.response.data);
        setDebugInfo(`Server error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
      } else if (error.request) {
        console.log('📡 No response received:', error.request);
        setDebugInfo('No response from server - check network');
      } else {
        console.log('📡 Request error:', error.message);
        setDebugInfo(`Request error: ${error.message}`);
      }
      
      // Handle different types of errors
      if (error.response?.status === 400) {
        setError('Invalid email or password');
      } else if (error.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else if (error.code === 'NETWORK_ERROR') {
        setError('Network error. Please check your connection.');
      } else {
        setError(error.response?.data?.message || error.message || 'Login failed. Please try again.');
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

      {/* Debug Info */}
      {debugInfo && (
        <Alert severity="info" sx={{ mb: 2, fontSize: '0.875rem' }}>
          <strong>Debug:</strong> {debugInfo}
        </Alert>
      )}

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

      {/* Manual Redirect Button for Testing */}
      <Button
        fullWidth
        variant="outlined"
        onClick={() => {
          console.log('🔄 Manual redirect button clicked');
          window.location.href = '/dashboard';
        }}
        sx={{ mt: 1, mb: 2 }}
      >
        Manual Redirect to Dashboard (Test Button)
      </Button>

      {/* Debug Information */}
      <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
        <Typography variant="caption" display="block">
          <strong>Current URL:</strong> {window.location.href}
        </Typography>
        <Typography variant="caption" display="block">
          <strong>API URL:</strong> {import.meta.env.VITE_API_URL}
        </Typography>
        <Typography variant="caption" display="block">
          <strong>Token in localStorage:</strong> {localStorage.getItem('token') ? 'Yes' : 'No'}
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;