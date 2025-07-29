// src/pages/DashboardPage.jsx
import React from 'react';
import ModernDashboard from '../components/ModernDashboard';

const DashboardPage = ({ user }) => {
  return <ModernDashboard user={user} />;
};

export default DashboardPage;