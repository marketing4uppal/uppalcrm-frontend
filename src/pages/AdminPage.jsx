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
  EyeOff,
  Save,
  X
} from 'lucide-react';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [showAddSourceForm, setShowAddSourceForm] = useState(false);
  const [showAddStageForm, setShowAddStageForm] = useState(false);
  const [editingSource, setEditingSource] = useState(null);
  const [editingStage, setEditingStage] = useState(null);

  // Form data for new user
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'user'
  });

  // New source/stage form data
  const [newSource, setNewSource] = useState({ value: '', label: '' });
  const [newStage, setNewStage] = useState({ value: '', label: '' });

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

  const [leadStages, setLeadStages] = useState([
    { id: 1, value: 'New', label: 'New', active: true },
    { id: 2, value: 'Contacted', label: 'Contacted', active: true },
    { id: 3, value: 'Qualified', label: 'Qualified', active: true },
    { id: 4, value: 'Won', label: 'Won', active: true },
    { id: 5, value: 'Lost', label: 'Lost', active: true }
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

  // Toggle field active state
  const toggleFieldActive = (fieldId) => {
    setLeadFields(fields => 
      fields.map(field => 
        field.id === fieldId ? { ...field, active: !field.active } : field
      )
    );
  };

  // Toggle source active state
  const toggleSourceActive = (sourceId) => {
    setLeadSources(sources => 
      sources.map(source => 
        source.id === sourceId ? { ...source, active: !source.active } : source
      )
    );
  };

  // Toggle stage active state
  const toggleStageActive = (stageId) => {
    setLeadStages(stages => 
      stages.map(stage => 
        stage.id === stageId ? { ...stage, active: !stage.active } : stage
      )
    );
  };

  // Add new source
  const handleAddSource = (e) => {
    e.preventDefault();
    if (newSource.value && newSource.label) {
      const newId = Math.max(...leadSources.map(s => s.id)) + 1;
      setLeadSources([...leadSources, {
        id: newId,
        value: newSource.value.toLowerCase().replace(/\s+/g, '-'),
        label: newSource.label,
        active: true
      }]);
      setNewSource({ value: '', label: '' });
      setShowAddSourceForm(false);
    }
  };

  // Add new stage
  const handleAddStage = (e) => {
    e.preventDefault();
    if (newStage.value && newStage.label) {
      const newId = Math.max(...leadStages.map(s => s.id)) + 1;
      setLeadStages([...leadStages, {
        id: newId,
        value: newStage.value,
        label: newStage.label,
        active: true
      }]);
      setNewStage({ value: '', label: '' });
      setShowAddStageForm(false);
    }
  };

  // Edit source
  const handleEditSource = (source) => {
    setEditingSource(source.id);
  };

  // Save edited source
  const handleSaveSource = (sourceId, newLabel) => {
    setLeadSources(sources =>
      sources.map(source =>
        source.id === sourceId ? { ...source, label: newLabel } : source
      )
    );
    setEditingSource(null);
  };

  // Delete source
  const handleDeleteSource = (sourceId) => {
    setLeadSources(sources => sources.filter(source => source.id !== sourceId));
  };

  // Edit stage
  const handleEditStage = (stage) => {
    setEditingStage(stage.id);
  };

  // Save edited stage
  const handleSaveStage = (stageId, newLabel) => {
    setLeadStages(stages =>
      stages.map(stage =>
        stage.id === stageId ? { ...stage, label: newLabel } : stage
      )
    );
    setEditingStage(null);
  };

  // Delete stage
  const handleDeleteStage = (stageId) => {
    setLeadStages(stages => stages.filter(stage => stage.id !== stageId));
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
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add User</span>
        </button>
      </div>

      {showAddUserForm && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-gray-900">Add New User</h4>
            <button
              onClick={() => setShowAddUserForm(false)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <X className="w-4 h-4" />
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
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
                <div className="flex items-center space-x-2">
                  <ToggleSwitch 
                    isActive={field.active} 
                    onChange={() => toggleFieldActive(field.id)}
                  />
                </div>
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
                  onChange={(e) => setNewSource({...newSource, label: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  required
                />
                <div className="flex space-x-2">
                  <button type="submit" className="px-3 py-1 bg-blue-600 text-white text-sm rounded">
                    Add
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowAddSourceForm(false)}
                    className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded"
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
                        value={source.label}
                        onChange={(e) => {
                          const newLabel = e.target.value;
                          setLeadSources(sources =>
                            sources.map(s => s.id === source.id ? {...s, label: newLabel} : s)
                          );
                        }}
                        onBlur={() => setEditingSource(null)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            setEditingSource(null);
                          }
                        }}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        autoFocus
                      />
                    ) : (
                      <div>
                        <p className="font-medium text-gray-900">{source.label}</p>
                        <p className="text-xs text-gray-500">{source.value}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <ToggleSwitch 
                    isActive={source.active} 
                    onChange={() => toggleSourceActive(source.id)}
                  />
                  <button 
                    onClick={() => handleEditSource(source)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteSource(source.id)}
                    className="p-1 text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
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
              className="p-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {showAddStageForm && (
            <form onSubmit={handleAddStage} className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Stage name (e.g., Proposal Sent)"
                  value={newStage.label}
                  onChange={(e) => setNewStage({...newStage, label: e.target.value, value: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  required
                />
                <div className="flex space-x-2">
                  <button type="submit" className="px-3 py-1 bg-purple-600 text-white text-sm rounded">
                    Add
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowAddStageForm(false)}
                    className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded"
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
                        value={stage.label}
                        onChange={(e) => {
                          const newLabel = e.target.value;
                          setLeadStages(stages =>
                            stages.map(s => s.id === stage.id ? {...s, label: newLabel, value: newLabel} : s)
                          );
                        }}
                        onBlur={() => setEditingStage(null)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            setEditingStage(null);
                          }
                        }}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        autoFocus
                      />
                    ) : (
                      <div>
                        <p className="font-medium text-gray-900">{stage.label}</p>
                        <p className="text-xs text-gray-500">{stage.value}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <ToggleSwitch 
                    isActive={stage.active} 
                    onChange={() => toggleStageActive(stage.id)}
                  />
                  <button 
                    onClick={() => handleEditStage(stage)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteStage(stage.id)}
                    className="p-1 text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Save Configuration Button */}
      <div className="flex justify-end">
        <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-2">
          <Save className="w-4 h-4" />
          <span>Save Configuration</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto">
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
              <span>Changes saved successfully!</span>
            </div>
          )}
          
          {submitStatus === 'error' && (
            <div className="flex items-center space-x-2 bg-red-50 text-red-800 px-4 py-2 rounded-xl border border-red-200">
              <AlertCircle className="w-5 h-5" />
              <span>Error saving changes. Please try again.</span>
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