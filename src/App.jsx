// src/App.jsx (New Routing Setup)
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import setAuthToken from './utils/setAuthToken';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';

// Check for token on initial app load
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

// A special component to protect our routes
const PrivateRoute = ({ children }) => {
  return localStorage.token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;