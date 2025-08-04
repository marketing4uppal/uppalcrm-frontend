// src/components/admin/LeadSources.jsx
import React, { useState } from 'react';
import { Plus, Building, Edit, Trash2 } from 'lucide-react';
import ToggleSwitch from '../common/ToggleSwitch';

const LeadSources = ({ sources, onSourcesChange }) => {
  const [showAddSourceForm, setShowAddSourceForm] = useState(false);
  const [editingSource, setEditingSource] = useState(null);
  const [newSource, setNewSource] = useState({ label: '' });

  const toggleSourceActive = (sourceId) => {
    const updatedSources = sources.map(source => 
      source.id === sourceId ? { ...source, active: !source.active } : source
    );
    onSourcesChange(updatedSources);
  };

  const addSource = (e) => {
    e.preventDefault();
    if (newSource.label && newSource.label.trim()) {
      const maxId = Math.max(...sources.map(s => s.id), 0);
      const newSourceObj = {
        id: maxId + 1,
        value: newSource.label.toLowerCase().replace(/\s+/g, '-'),
        label: newSource.label.trim(),
        active: true
      };
      
      onSourcesChange([...sources, newSourceObj]);
      setNewSource({ label: '' });
      setShowAddSourceForm(false);
    }
  };

  const editSource = (sourceId, newLabel) => {
    if (newLabel && newLabel.trim()) {
      const updatedSources = sources.map(source =>
        source.id === sourceId ? { ...source, label: newLabel.trim() } : source
      );
      onSourcesChange(updatedSources);
    }
    setEditingSource(null);
  };

  const deleteSource = (sourceId) => {
    if (window.confirm('Are you sure you want to delete this source?')) {
      const updatedSources = sources.filter(source => source.id !== sourceId);
      onSourcesChange(updatedSources);
    }
  };

  const handleNewSourceChange = (e) => {
    setNewSource({ label: e.target.value });
  };

  return (
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
        <form onSubmit={addSource} className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Source label (e.g., LinkedIn)"
              value={newSource.label}
              onChange={handleNewSourceChange}
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
        {sources.map((source) => (
          <div key={source.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3 flex-1">
              <Building className="w-4 h-4 text-gray-400" />
              <div className="flex-1">
                {editingSource === source.id ? (
                  <input
                    type="text"
                    defaultValue={source.label}
                    onBlur={(e) => editSource(source.id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        editSource(source.id, e.target.value);
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
                onClick={() => setEditingSource(source.id)}
                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
              >
                <Edit className="w-3 h-3" />
              </button>
              <button
                onClick={() => deleteSource(source.id)}
                className="p-1 text-red-600 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeadSources;