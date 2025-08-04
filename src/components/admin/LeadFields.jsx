// src/components/admin/LeadFields.jsx
import React, { useState } from 'react';
import { Plus, Database, Edit, Trash2 } from 'lucide-react';
import ToggleSwitch from '../common/ToggleSwitch';

const LeadFields = ({ fields, onFieldsChange }) => {
  const [showAddFieldForm, setShowAddFieldForm] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [newField, setNewField] = useState({
    label: '',
    type: 'text',
    required: false,
    options: ''
  });

  const toggleFieldActive = (fieldId) => {
    const updatedFields = fields.map(field => 
      field.id === fieldId ? { ...field, active: !field.active } : field
    );
    onFieldsChange(updatedFields);
  };

  const addField = (e) => {
    e.preventDefault();
    if (newField.label && newField.label.trim()) {
      const maxId = Math.max(...fields.map(f => f.id), 0);
      const fieldName = newField.label.toLowerCase()
        .replace(/[^a-z0-9]/g, '')  // Remove special characters
        .replace(/\s+/g, '');       // Remove spaces
      
      const newFieldObj = {
        id: maxId + 1,
        name: fieldName,
        label: newField.label.trim(),
        type: newField.type,
        required: newField.required,
        active: true,
        isCustom: true, // Mark as custom field
        options: newField.type === 'select' ? 
          newField.options.split('\n').filter(opt => opt.trim()).map(opt => opt.trim()) : 
          undefined
      };
      
      onFieldsChange([...fields, newFieldObj]);
      setNewField({ label: '', type: 'text', required: false, options: '' });
      setShowAddFieldForm(false);
    }
  };

  const editFieldLabel = (fieldId, newLabel) => {
    if (newLabel && newLabel.trim()) {
      const updatedFields = fields.map(field =>
        field.id === fieldId ? { ...field, label: newLabel.trim() } : field
      );
      onFieldsChange(updatedFields);
    }
    setEditingField(null);
  };

  const deleteField = (fieldId) => {
    const field = fields.find(f => f.id === fieldId);
    
    // Don't allow deletion of system fields
    if (!field.isCustom) {
      alert('System fields cannot be deleted.');
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete the "${field.label}" field? This action cannot be undone.`)) {
      const updatedFields = fields.filter(field => field.id !== fieldId);
      onFieldsChange(updatedFields);
    }
  };

  const handleNewFieldChange = (field, value) => {
    setNewField(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-gray-900">Lead Fields</h4>
        <button
          onClick={() => setShowAddFieldForm(true)}
          className="p-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Add Field Form */}
      {showAddFieldForm && (
        <form onSubmit={addField} className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="space-y-4">
            {/* Field Label */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field Label
              </label>
              <input
                type="text"
                placeholder="e.g., Budget, Timeline, Industry"
                value={newField.label}
                onChange={(e) => handleNewFieldChange('label', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            {/* Field Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field Type
              </label>
              <select
                value={newField.type}
                onChange={(e) => handleNewFieldChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="tel">Phone</option>
                <option value="number">Number</option>
                <option value="date">Date</option>
                <option value="select">Dropdown</option>
                <option value="textarea">Text Area</option>
                <option value="url">URL</option>
              </select>
            </div>

            {/* Dropdown Options (only show if type is select) */}
            {newField.type === 'select' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dropdown Options (one per line)
                </label>
                <textarea
                  placeholder="Option 1&#10;Option 2&#10;Option 3"
                  value={newField.options}
                  onChange={(e) => handleNewFieldChange('options', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="3"
                />
                <p className="text-xs text-gray-500 mt-1">Enter each option on a new line</p>
              </div>
            )}

            {/* Required Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Required Field</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={newField.required}
                  onChange={(e) => handleNewFieldChange('required', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            {/* Form Actions */}
            <div className="flex space-x-2 pt-2">
              <button 
                type="submit" 
                className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
              >
                Add Field
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setShowAddFieldForm(false);
                  setNewField({ 
                    label: '', 
                    type: 'text', 
                    required: false, 
                    options: '' 
                  });
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Existing Fields List */}
      <div className="space-y-3">
        {fields.map((field) => (
          <div key={field.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3 flex-1">
              <Database className="w-4 h-4 text-gray-400" />
              <div className="flex-1">
                {editingField === field.id ? (
                  <input
                    type="text"
                    defaultValue={field.label}
                    onBlur={(e) => editFieldLabel(field.id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        editFieldLabel(field.id, e.target.value);
                      }
                      if (e.key === 'Escape') {
                        setEditingField(null);
                      }
                    }}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    autoFocus
                  />
                ) : (
                  <div>
                    <p className="font-medium text-gray-900">{field.label}</p>
                    <p className="text-xs text-gray-500">
                      {field.type} • {field.required ? 'Required' : 'Optional'}
                      {field.isCustom && ' • Custom Field'}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <ToggleSwitch 
                isActive={field.active} 
                onChange={() => toggleFieldActive(field.id)}
              />
              {/* Only show edit/delete for custom fields, not system fields */}
              {field.isCustom && (
                <>
                  <button
                    onClick={() => setEditingField(field.id)}
                    className="p-1 text-purple-600 hover:bg-purple-50 rounded"
                  >
                    <Edit className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => deleteField(field.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeadFields;