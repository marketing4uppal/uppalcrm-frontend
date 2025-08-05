// src/pages/AdminPage.jsx - Simplified modular version
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Sliders, ArrowLeft } from 'lucide-react';
import UserManagement from '../components/admin/UserManagement';
import FieldCustomization from '../components/admin/FieldCustomization';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              className="p-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Manage your CRM system and users</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm border border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'users'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>User Management</span>
          </button>
          <button
            onClick={() => setActiveTab('customization')}
            className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'customization'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>CRM Customization</span>
          </button>
        </div>

        {/* Content */}
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'customization' && <FieldCustomization />}
      </div>
    </div>
  );
};

export default AdminPage;