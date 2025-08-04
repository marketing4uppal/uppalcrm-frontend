// src/pages/AdminPage.jsx - Simplified and Bug-Free Version
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Users, 
  Settings, 
  Plus, 
  Search, 
  Edit,
  Trash2,
  ArrowLeft,
  Database,
  Sliders,
  User,
  Mail,
  Shield,
  Building,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  X
} from 'lucide-react';

const AdminPage = () => {
  // Main state
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [submitStatus, setSubmitStatus] = useState(null);

  // Form states
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showAddSourceForm, setShowAddSourceForm] = useState(false);
  const [showAddStageForm, setShowAddStageForm] = useState(false);
  const [editingSource, setEditingSource] = useState(null);
  const [editingStage, setEditingStage] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'user'
  });

  const [newSource, setNewSource] = useState({ label: '' });
  const [newStage, setNewStage] = useState({ label: '' });

  // Static data for customization
  const [leadFields, setLeadFields] = useState([
    { id: 1, name: 'firstName', label: 'First Name', type: 'text', required: true, active: true },
    { id: 2, name: 'lastName', label: 'Last Name', type: 'text', required: true, active: true },
    { id: 3, name: 'email', label: 'Email', type: 'email', required: false, active: true },
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

  const [leadStages, setLeadStages] = useState([
    { id: 1, value: 'New', label: 'New', active: true },
    { id: 2, value: 'Contacted', label: 'Contacted', active: true },
    { id: 3, value: 'Qualified', label: 'Qualified', active: true },
    { id: 4, value: 'Won', label: 'Won', active: true },
    { id: 5, value: 'Lost', label: 'Lost', active: true }
  ]);

  // Load users on component mount
  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  // API Functions
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setSubmitStatus('error');
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

  const handleAddUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitStatus(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setSubmitStatus('error');
        return;
      }

      await axios.post(`${import.meta.env.VITE_API_URL}/api/users`, formData, {
        headers: { 
          'x-auth-token': token,
          'Content-Type': 'application/json'
        }
      });
      
      setSubmitStatus('success');
      setFormData({ firstName: '', lastName: '', email: '', password: '', role: 'user' });
      setShowAddUserForm(false);
      
      // Refresh users list
      await fetchUsers();
      
      setTimeout(() => setSubmitStatus(null), 3000);
    } catch (error) {
      console.error('Error adding user:', error);
      setSubmitStatus('error');
    } finally {
      setLoading(false);
    }
  };

  // Form handlers
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Toggle functions
  const toggleFieldActive = (fieldId) => {
    setLeadFields(fields => 
      fields.map(field => 
        field.id === fieldId ? { ...field, active: !field.active } : field
      )
    );
  };

  const toggleSourceActive = (sourceId) => {
    setLeadSources(sources => 
      sources.map(source => 
        source.id === sourceId ? { ...source, active: !source.active } : source
      )
    );
  };

  const toggleStageActive = (stageId) => {
    setLeadStages(stages => 
      stages.map(stage => 
        stage.id === stageId ? { ...stage, active: !stage.active } : stage
      )
    );
  };

  // Source management
  const handleAddSource = (e) => {
    e.preventDefault();
    if (newSource.label && newSource.label.trim()) {
      const maxId = leadSources.length > 0 ? Math.max(...leadSources.map(s => s.id)) : 0;
      const newSourceObj = {
        id: maxId + 1,
        value: newSource.label.toLowerCase().replace(/\s+/g, '-'),
        label: newSource.label.trim(),
        active: true
      };
      setLeadSources([...leadSources, newSourceObj]);
      setNewSource({ label: '' });
      setShowAddSourceForm(false);
    }
  };

  const handleEditSource = (sourceId) => {
    setEditingSource(sourceId);
  };

  const handleSaveSource = (sourceId, newLabel) => {
    if (newLabel && newLabel.trim()) {
      setLeadSources(sources =>
        sources.map(source =>
          source.id === sourceId ? { ...source, label: newLabel.trim() } : source
        )
      );
    }
    setEditingSource(null);
  };

  const handleDeleteSource = (sourceId) => {
    if (window.confirm('Are you sure you want to delete this source?')) {
      setLeadSources(sources => sources.filter(source => source.id !== sourceId));
    }
  };

  // Stage management
  const handleAddStage = (e) => {
    e.preventDefault();
    if (newStage.label && newStage.label.trim()) {
      const maxId = leadStages.length > 0 ? Math.max(...leadStages.map(s => s.id)) : 0;
      const newStageObj = {
        id: maxId + 1,
        value: newStage.label.trim(),
        label: newStage.label.trim(),
        active: true
      };
      setLeadStages([...leadStages, newStageObj]);
      setNewStage({ label: '' });
      setShowAddStageForm(false);
    }
  };

  const handleEditStage = (stageId) => {
    setEditingStage(stageId);
  };

  const handleSaveStage = (stageId, newLabel) => {
    if (newLabel && newLabel.trim()) {
      setLeadStages(stages =>
        stages.map(stage =>
          stage.id === stageId ? { ...stage, label: newLabel.trim() } : stage
        )
      );
    }
    setEditingStage(null);
  };

  const handleDeleteStage = (stageId) => {
    if (window.confirm('Are you sure you want to delete this stage?')) {
      setLeadStages(stages => stages.filter(stage => stage.id !== stageId));
    }
  };

  // Utility functions
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

  // Components
  const ToggleSwitch = ({ isActive, onChange }) => (
    <button 
      onClick={onChange}
      className={`relative w-12 h-6 rounded-full transition-colors ${
        isActive ? 'bg-green-500' : 'bg-gray-300'
      }`}
    >
      <div className={`absolute w-5 h-5 bg-white rounded-full shadow-md transition-transform top-0.5 ${
        isActive ? 'translate-x-6' : 'translate-x-0.5'
      }`}></div>
    </button>
  );

  const UserManagement = () => (
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
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-gray-900">Add New User</h4>
            <button
              onClick={() => {
                setShowAddUserForm(false);
                setFormData({ firstName: '', lastName: '', email: '', password: '', role: 'user' });
              }}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                onClick={() => {
                  setShowAddUserForm(false);
                  setFormData({ firstName: '', lastName: '', email: '', password: '', role: 'user' });
                }}
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
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center">
                    <div className="flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                      Loading users...
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    {users.length === 0 ? 'No users found' : 'No users match your search'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.firstName || ''} {user.lastName || ''}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{user.email || ''}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)}`}>
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
                ))
              )}
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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
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
                <ToggleSwitch 
                  isActive={field.active} 
                  onChange={() => toggleFieldActive(field.id)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Lead Sources */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">Lead Sources</h4>
            <button
              onClick={() => setShowAddSourceForm(true)}
              className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {showAddSourceForm && (
            <form onSubmit={handleAddSource} className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Source label (e.g., LinkedIn)"
                  value={newSource.label}
                  onChange={(e) => setNewSource({ label: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <div className="flex space-x-2">
                  <button 
                    type="submit" 
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    Add
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowAddSourceForm(false);
                      setNewSource({ label: '' });
                    }}
                    className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {leadSources.map((source) => (
              <div key={source.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3 flex-1">
                  <Building className="w-4 h-4 text-gray-400" />
                  <div className="flex-1">
                    {editingSource === source.id ? (
                      <input
                        type="text"
                        defaultValue={source.label}
                        onBlur={(e) => handleSaveSource(source.id, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSaveSource(source.id, e.target.value);
                          }
                          if (e.key === 'Escape') {
                            setEditingSource(null);
                          }
                        }}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                    ) : (
                      <p className="font-medium text-gray-900">{source.label}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <ToggleSwitch 
                    isActive={source.active} 
                    onChange={() => toggleSourceActive(source.id)}
                  />
                  <button
                    onClick={() => handleEditSource(source.id)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleDeleteSource(source.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lead Stages */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">Lead Stages</h4>
            <button
              onClick={() => setShowAddStageForm(true)}
              className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {showAddStageForm && (
            <form onSubmit={handleAddStage} className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Stage label (e.g., Follow-up)"
                  value={newStage.label}
                  onChange={(e) => setNewStage({ label: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
                <div className="flex space-x-2">
                  <button 
                    type="submit" 
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                  >
                    Add
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowAddStageForm(false);
                      setNewStage({ label: '' });
                    }}
                    className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {leadStages.map((stage) => (
              <div key={stage.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3 flex-1">
                  <Settings className="w-4 h-4 text-gray-400" />
                  <div className="flex-1">
                    {editingStage === stage.id ? (
                      <input
                        type="text"
                        defaultValue={stage.label}
                        onBlur={(e) => handleSaveStage(stage.id, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSaveStage(stage.id, e.target.value);
                          }
                          if (e.key === 'Escape') {
                            setEditingStage(null);
                          }
                        }}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        autoFocus
                      />
                    ) : (
                      <p className="font-medium text-gray-900">{stage.label}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <ToggleSwitch 
                    isActive={stage.active} 
                    onChange={() => toggleStageActive(stage.id)}
                  />
                  <button
                    onClick={() => handleEditStage(stage.id)}
                    className="p-1 text-green-600 hover:bg-green-50 rounded"
                  >
                    <Edit className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleDeleteStage(stage.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-3 h-3" />
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