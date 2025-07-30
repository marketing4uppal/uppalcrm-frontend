// src/App.jsx (Updated for Account-Centric CRM)
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import setAuthToken from './utils/setAuthToken';
import axios from 'axios';

// Pages
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';

// NEW: Entity-specific pages
import ContactsPage from './pages/ContactsPage';
import ContactDetailPage from './pages/ContactDetailPage';
import LeadsPage from './pages/LeadsPage';
import LeadDetailPage from './pages/LeadDetailPage';
import AccountsPage from './pages/AccountsPage';
import AccountDetailPage from './pages/AccountDetailPage';
import DealsPage from './pages/DealsPage';
import DealDetailPage from './pages/DealDetailPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';

import { CircularProgress, Box } from '@mui/material';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const PrivateRoute = ({ children }) => {
  return localStorage.token ? children : <Navigate to="/login" />;
};

// Admin route for organization management
const AdminRoute = ({ user, children }) => {
  if (user && (user.role === 'admin' || user.role === 'owner')) {
    return children;
  }
  return <Navigate to="/" />;
};

// Manager+ route for sensitive operations
const ManagerRoute = ({ user, children }) => {
  if (user && ['admin', 'owner', 'manager'].includes(user.role)) {
    return children;
  }
  return <Navigate to="/" />;
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
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Dashboard */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardPage user={user} />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage user={user} />
            </PrivateRoute>
          }
        />

        {/* Contact Management */}
        <Route
          path="/contacts"
          element={
            <PrivateRoute>
              <ContactsPage user={user} />
            </PrivateRoute>
          }
        />
        <Route
          path="/contacts/:contactId"
          element={
            <PrivateRoute>
              <ContactDetailPage user={user} />
            </PrivateRoute>
          }
        />

        {/* Lead Management */}
        <Route
          path="/leads"
          element={
            <PrivateRoute>
              <LeadsPage user={user} />
            </PrivateRoute>
          }
        />
        <Route
          path="/leads/:leadId"
          element={
            <PrivateRoute>
              <LeadDetailPage user={user} />
            </PrivateRoute>
          }
        />

        {/* Account Management (NEW) */}
        <Route
          path="/accounts"
          element={
            <PrivateRoute>
              <AccountsPage user={user} />
            </PrivateRoute>
          }
        />
        <Route
          path="/accounts/:accountId"
          element={
            <PrivateRoute>
              <AccountDetailPage user={user} />
            </PrivateRoute>
          }
        />

        {/* Deal Management */}
        <Route
          path="/deals"
          element={
            <PrivateRoute>
              <DealsPage user={user} />
            </PrivateRoute>
          }
        />
        <Route
          path="/deals/:dealId"
          element={
            <PrivateRoute>
              <DealDetailPage user={user} />
            </PrivateRoute>
          }
        />

        {/* Reports */}
        <Route
          path="/reports"
          element={
            <PrivateRoute>
              <ManagerRoute user={user}>
                <ReportsPage user={user} />
              </ManagerRoute>
            </PrivateRoute>
          }
        />

        {/* Settings */}
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <SettingsPage user={user} />
            </PrivateRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminRoute user={user}>
                <AdminPage user={user} />
              </AdminRoute>
            </PrivateRoute>
          }
        />

        {/* Catch all - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;