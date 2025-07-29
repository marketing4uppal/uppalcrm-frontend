// src/pages/AdminPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Users, 
  Settings, 
  Plus, 
  Search, 
  MoreVertical, 
  Shield, 
  Edit,
  Trash2,
  ArrowLeft,
  Database,
  Sliders,
  User,
  Mail,
  Phone,
  Building,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Form data for new user
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'user'
  });

  // Lead/Contact field customization state
  const [leadFields, setLeadFields] = useState([
    { id: 1, name: 'firstName', label: 'First Name', type: 'text', required: true, active: true },
    { id: 2, name: 'lastName', label: 'Last Name', type: 'text', required: true, active: true },
    { id: 3, name: 'email', label: 'Email', type: 'email', required: true, active: true },
    { id: 4, name: 'phone', label: 'Phone', type: 'tel', required: false, active: true },
    { id: 5, name: 'leadSource', label: 'Lead Source', type: 'select', required: false, active: true }
  ]);

  const [leadSources, setLeadSources] = useState([
    { id: 1, value: 'website', label: 'Website', active: true },
    { id: 2, value: 'social-media', label: 'Social Media', active: true },
    { id: 3, value: 'referral', label: 'Referral', active: true },
    { id: 4, value: 'email-campaign', label: 'Email Campaign', active: true },
    { id: 5, value: 'cold-call', label: 'Cold Call', active: true },
    { id: 6, value: 'trade-show', label: 'Trade Show', active: true },
    { id: 7, value: 'other', label: 'Other', active: true }
  ]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const backendUrl = `${import.meta.env.VITE_API_URL}/api/users`;
      const res = await axios.get(backendUrl);
      setUsers(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setSubmitStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitStatus(null);

    try {
      const backendUrl = `${import.meta.env.VITE_API_URL}/api/users`;
      const res = await axios.post(backendUrl, formData);
      
      setUsers([...users, res.data]);
      setSubmitStatus('success');
      setFormData({ firstName: '', lastName: '', email: '', password: '', role: 'user' });
      setShowAddUserForm(false);
      
      setTimeout(() => setSubmitStatus(null), 3000);
    } catch (error) {
      console.error('Error adding user:', error);
      setSubmitStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeColor = (role) => {
    return role === 'admin' 
      ? 'bg-purple-100 text-purple-800 border-purple-200'
      : 'bg-blue-100 text-blue-800 border-blue-200';
  };

  const UserManagement = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
          <p className="text-gray-600">Manage users and their roles in your organization</p>
        </div>
        <button
          onClick={() => setShowAddUserForm(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add User</span>
        </button>
      </div>

      {/* Add User Form Modal */}
      {showAddUserForm && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-gray-900">Add New User</h4>
            <button
              onClick={() => setShowAddUserForm(false)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter first name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter last name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email address"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                  className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50"
              >
                {loading ? 'Adding User...' : 'Add User'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900">Current Users ({filteredUsers.length})</h4>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text^xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                        {user.firstName?.[0]}{user.lastName?.[0]}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)}`}>
                      {user.role === 'admin' ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const FieldCustomization = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">CRM Customization</h3>
        <p className="text-gray-600">Customize lead and contact fields for your organization</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Lead Fields */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h4 className="font-semibold text-gray-900 mb-4">Lead Fields</h4>
          <div className="space-y-3">
            {leadFields.map((field) => (
              <div key={field.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Database className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{field.label}</p>
                    <p className="text-xs text-gray-500">{field.type} • {field.required ? 'Required' : 'Optional'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className={`w-10 h-6 rounded-full ${field.active ? 'bg-green-500' : 'bg-gray-300'} transition-colors`}>
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${field.active ? 'translate-x-5' : 'translate-x-1'}`}></div>
                  </button>
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lead Sources */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h4 className="font-semibold text-gray-900 mb-4">Lead Sources</h4>
          <div className="space-y-3">
            {leadSources.map((source) => (
              <div key={source.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Building className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{source.label}</p>
                    <p className="text-xs text-gray-500">{source.value}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className={`w-10 h-6 rounded-full ${source.active ? 'bg-green-500' : 'bg-gray-300'} transition-colors`}>
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${source.active ? 'translate-x-5' : 'translate-x-1'}`}></div>
                  </button>
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              to="/dashboard"
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-gray-600">Manage your CRM settings and users</p>
            </div>
          </div>

          {/* Status Messages */}
          {submitStatus === 'success' && (
            <div className="flex items-center space-x-2 bg-green-50 text-green-800 px-4 py-2 rounded-xl border border-green-200">
              <CheckCircle className="w-5 h-5" />
              <span>User added successfully!</span>
            </div>
          )}
          
          {submitStatus === 'error' && (
            <div className="flex items-center space-x-2 bg-red-50 text-red-800 px-4 py-2 rounded-xl border border-red-200">
              <AlertCircle className="w-5 h-5" />
              <span>Error adding user. Please try again.</span>
            </div>
          )}
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