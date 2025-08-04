// src/components/admin/AddUserForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Plus, Eye, EyeOff, X } from 'lucide-react';

const AddUserForm = ({ onClose, onUserAdded, onError }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        onError();
        return;
      }

      await axios.post(`${import.meta.env.VITE_API_URL}/api/users`, formData, {
        headers: { 
          'x-auth-token': token,
          'Content-Type': 'application/json'
        }
      });
      
      onUserAdded();
    } catch (error) {
      console.error('Error adding user:', error);
      onError();
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ firstName: '', lastName: '', email: '', password: '', role: 'user' });
    onClose();
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-lg font-semibold text-gray-900">Add New User</h4>
        <button
          onClick={handleClose}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter first name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter last name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter email address"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              minLength="6"
              className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password (min 6 characters)"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="md:col-span-2 flex space-x-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 py-3 px-6 rounded-xl font-medium border border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 py-3 px-6 rounded-xl font-medium flex items-center justify-center space-x-2 ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
            }`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Adding...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Add User</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUserForm;