// src/components/admin/UserManagement.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Plus, Search, Edit, Trash2, User, Eye, EyeOff, X, CheckCircle, AlertCircle } from 'lucide-react';
import AddUserForm from './AddUserForm';
import UserTable from './UserTable';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [submitStatus, setSubmitStatus] = useState(null);
  const [showAddUserForm, setShowAddUserForm] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users`, {
        headers: { 
          'x-auth-token': token,
          'Content-Type': 'application/json'
        }
      });
      
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setSubmitStatus('error');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAdded = () => {
    setSubmitStatus('success');
    setShowAddUserForm(false);
    fetchUsers();
    setTimeout(() => setSubmitStatus(null), 3000);
  };

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const filteredUsers = users.filter(user =>
    (user.firstName && user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.lastName && user.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getRoleBadgeColor = (role) => {
    return role === 'admin' 
      ? 'bg-purple-100 text-purple-800 border-purple-200'
      : 'bg-blue-100 text-blue-800 border-blue-200';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
          <p className="text-gray-600">Manage users and their roles in your organization</p>
        </div>
        <button
          onClick={() => setShowAddUserForm(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add User</span>
        </button>
      </div>

      {/* Success/Error Messages */}
      {submitStatus === 'success' && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-800 font-medium">User added successfully!</span>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-800 font-medium">Error adding user. Please try again.</span>
        </div>
      )}

      {/* Add User Form */}
      {showAddUserForm && (
        <AddUserForm 
          onClose={() => setShowAddUserForm(false)}
          onUserAdded={handleUserAdded}
          onError={() => setSubmitStatus('error')}
        />
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Users Table */}
      <UserTable 
        users={filteredUsers}
        loading={loading}
        getRoleBadgeColor={getRoleBadgeColor}
        allUsers={users}
      />
    </div>
  );
};

export default UserManagement;