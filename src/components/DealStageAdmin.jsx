// src/components/DealStageAdmin.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  GripVertical, 
  Eye, 
  EyeOff,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const DealStageAdmin = () => {
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingStage, setEditingStage] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const [newStage, setNewStage] = useState({
    name: '',
    probability: 50,
    color: '#3B82F6',
    description: '',
    isDefault: false
  });

  useEffect(() => {
    fetchStages();
  }, []);

  const fetchStages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/deal-stages`);
      setStages(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching deal stages:', error);
      setError('Failed to load deal stages. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStage = async (e) => {
    e.preventDefault();
    try {
      setSubmitStatus('loading');
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/deal-stages`, newStage);
      setStages([...stages, response.data.stage]);
      setNewStage({ name: '', probability: 50, color: '#3B82F6', description: '', isDefault: false });
      setShowAddForm(false);
      setSubmitStatus('success');
      setTimeout(() => setSubmitStatus(null), 3000);
    } catch (error) {
      console.error('Error creating deal stage:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 3000);
    }
  };

  const handleUpdateStage = async (stageId, updatedData) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/deal-stages/${stageId}`, updatedData);
      setStages(stages.map(stage => 
        stage._id === stageId ? response.data.stage : stage
      ));
      setEditingStage(null);
      setSubmitStatus('success');
      setTimeout(() => setSubmitStatus(null), 3000);
    } catch (error) {
      console.error('Error updating deal stage:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 3000);
    }
  };

  const handleDeleteStage = async (stageId) => {
    if (!window.confirm('Are you sure you want to delete this deal stage?')) {
      return;
    }

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/deal-stages/${stageId}`);
      setStages(stages.filter(stage => stage._id !== stageId));
      setSubmitStatus('success');
      setTimeout(() => setSubmitStatus(null), 3000);
    } catch (error) {
      console.error('Error deleting deal stage:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 3000);
    }
  };

  const handleToggleActive = async (stage) => {
    await handleUpdateStage(stage._id, { ...stage, isActive: !stage.isActive });
  };

  const initializeDefaultStages = async () => {
    try {
      setSubmitStatus('loading');
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/deal-stages/initialize`);
      setStages(response.data.stages);
      setSubmitStatus('success');
      setTimeout(() => setSubmitStatus(null), 3000);
    } catch (error) {
      console.error('Error initializing default stages:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 3000);
    }
  };

  const StageRow = ({ stage }) => {
    const [editData, setEditData] = useState(stage);
    const isEditing = editingStage === stage._id;

    const handleSave = () => {
      handleUpdateStage(stage._id, editData);
    };

    const handleCancel = () => {
      setEditData(stage);
      setEditingStage(null);
    };

    return (
      <tr className="hover:bg-gray-50">
        <td className="px-6 py-4">
          <div className="flex items-center">
            <GripVertical className="w-4 h-4 text-gray-400 mr-2 cursor-move" />
            <div 
              className="w-4 h-4 rounded-full mr-3" 
              style={{ backgroundColor: stage.color }}
            ></div>
            {isEditing ? (
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              />
            ) : (
              <span className="font-medium text-gray-900">{stage.name}</span>
            )}
          </div>
        </td>
        <td className="px-6 py-4">
          {isEditing ? (
            <input
              type="number"
              min="0"
              max="100"
              value={editData.probability}
              onChange={(e) => setEditData({ ...editData, probability: parseInt(e.target.value) })}
              className="border border-gray-300 rounded px-2 py-1 text-sm w-20"
            />
          ) : (
            <span className="text-gray-600">{stage.probability}%</span>
          )}
        </td>
        <td className="px-6 py-4">
          {isEditing ? (
            <input
              type="color"
              value={editData.color}
              onChange={(e) => setEditData({ ...editData, color: e.target.value })}
              className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
            />
          ) : (
            <div 
              className="w-8 h-8 rounded border border-gray-300"
              style={{ backgroundColor: stage.color }}
            ></div>
          )}
        </td>
        <td className="px-6 py-4">
          <button
            onClick={() => handleToggleActive(stage)}
            className={`p-1 rounded ${stage.isActive ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'}`}
          >
            {stage.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </td>
        <td className="px-6 py-4">
          {stage.isDefault && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Default
            </span>
          )}
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="p-1 text-green-600 hover:bg-green-50 rounded"
                >
                  <Save className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCancel}
                  className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setEditingStage(stage._id)}
                  className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteStage(stage._id)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </td>
      </tr>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
          <span className="text-gray-600">Loading deal stages...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Deal Stage Management</h2>
          <p className="text-gray-600 mt-1">Configure the stages for your sales pipeline</p>
        </div>
        <div className="flex items-center space-x-3">
          {stages.length === 0 && (
            <button
              onClick={initializeDefaultStages}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Initialize Default Stages
            </button>
          )}
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Stage</span>
          </button>
        </div>
      </div>

      {/* Status Messages */}
      {submitStatus === 'success' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-800 font-medium">Operation completed successfully!</span>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-800 font-medium">Error occurred. Please try again.</span>
        </div>
      )}

      {/* Add New Stage Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Add New Deal Stage</h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleAddStage} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stage Name</label>
              <input
                type="text"
                required
                value={newStage.name}
                onChange={(e) => setNewStage({ ...newStage, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., Discovery"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Probability (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                required
                value={newStage.probability}
                onChange={(e) => setNewStage({ ...newStage, probability: parseInt(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <input
                type="color"
                value={newStage.color}
                onChange={(e) => setNewStage({ ...newStage, color: e.target.value })}
                className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                value={newStage.description}
                onChange={(e) => setNewStage({ ...newStage, description: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Optional description"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={newStage.isDefault}
                  onChange={(e) => setNewStage({ ...newStage, isDefault: e.target.checked })}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">Set as default stage for new deals</span>
              </label>
            </div>
            
            <div className="md:col-span-2 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitStatus === 'loading'}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {submitStatus === 'loading' ? 'Creating...' : 'Create Stage'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stages Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Deal Stages ({stages.length})</h3>
        </div>
        
        {stages.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No deal stages configured</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first deal stage or initialize default stages.</p>
            <button
              onClick={initializeDefaultStages}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Initialize Default Stages
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stage Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Probability
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Color
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Active
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Default
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stages.map((stage) => (
                  <StageRow key={stage._id} stage={stage} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DealStageAdmin;