// src/components/admin/LeadStages.jsx
import React, { useState } from 'react';
import { Plus, Settings, Edit, Trash2 } from 'lucide-react';
import ToggleSwitch from '../common/ToggleSwitch';

const LeadStages = ({ stages, onStagesChange }) => {
  const [showAddStageForm, setShowAddStageForm] = useState(false);
  const [editingStage, setEditingStage] = useState(null);
  const [newStage, setNewStage] = useState({ label: '' });

  const toggleStageActive = (stageId) => {
    const updatedStages = stages.map(stage => 
      stage.id === stageId ? { ...stage, active: !stage.active } : stage
    );
    onStagesChange(updatedStages);
  };

  const addStage = (e) => {
    e.preventDefault();
    if (newStage.label && newStage.label.trim()) {
      const maxId = Math.max(...stages.map(s => s.id), 0);
      const newStageObj = {
        id: maxId + 1,
        value: newStage.label.trim(),
        label: newStage.label.trim(),
        active: true
      };
      
      onStagesChange([...stages, newStageObj]);
      setNewStage({ label: '' });
      setShowAddStageForm(false);
    }
  };

  const editStage = (stageId, newLabel) => {
    if (newLabel && newLabel.trim()) {
      const updatedStages = stages.map(stage =>
        stage.id === stageId ? { ...stage, label: newLabel.trim() } : stage
      );
      onStagesChange(updatedStages);
    }
    setEditingStage(null);
  };

  const deleteStage = (stageId) => {
    if (window.confirm('Are you sure you want to delete this stage?')) {
      const updatedStages = stages.filter(stage => stage.id !== stageId);
      onStagesChange(updatedStages);
    }
  };

  const handleNewStageChange = (e) => {
    setNewStage({ label: e.target.value });
  };

  return (
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
        <form onSubmit={addStage} className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Stage label (e.g., Follow-up)"
              value={newStage.label}
              onChange={handleNewStageChange}
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
        {stages.map((stage) => (
          <div key={stage.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3 flex-1">
              <Settings className="w-4 h-4 text-gray-400" />
              <div className="flex-1">
                {editingStage === stage.id ? (
                  <input
                    type="text"
                    defaultValue={stage.label}
                    onBlur={(e) => editStage(stage.id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        editStage(stage.id, e.target.value);
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
                onClick={() => setEditingStage(stage.id)}
                className="p-1 text-green-600 hover:bg-green-50 rounded"
              >
                <Edit className="w-3 h-3" />
              </button>
              <button
                onClick={() => deleteStage(stage.id)}
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

export default LeadStages;