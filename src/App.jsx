// src/App.jsx (Updated to include PublicPage)
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import setAuthToken from './utils/setAuthToken';
import axios from 'axios';

import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import PublicPage from './pages/PublicPage'; // NEW IMPORT
import { CircularProgress, Box } from '@mui/material';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const PrivateRoute = ({ children }) => {
  return localStorage.token ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ user, children }) => {
  if (user && user.role === 'admin') {
    return children;
  }
  return <Navigate to="/dashboard" />; // Changed from "/" to "/dashboard"
};

// NEW: Public Route - only show if user is NOT logged in
const PublicRoute = ({ children }) => {
  return localStorage.token ? <Navigate to="/dashboard" /> : children;
};

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (localStorage.token) {
        try {
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`);
          setUser(res.data);
        } catch (error) {
          console.error("Failed to load user", error);
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };
    loadUser();
  }, []);

  if (isLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
  }

  return (
    <Router>
      <Routes>
        {/* NEW: Public landing page - only accessible when not logged in */}
        <Route 
          path="/" 
          element={
            <PublicRoute>
              <PublicPage />
            </PublicRoute>
          } 
        />
        
        {/* Keep your existing login page */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } 
        />
        
        {/* Dashboard - default page for logged-in users */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage user={user} />
            </PrivateRoute>
          }
        />
        
        {/* Admin page */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminRoute user={user}>
                <AdminPage />
              </AdminRoute>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;