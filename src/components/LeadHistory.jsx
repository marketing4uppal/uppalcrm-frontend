// src/components/LeadHistory.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, User, Edit, Plus, TrendingUp } from 'lucide-react';

const LeadHistory = ({ leadId }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const backendUrl = `${import.meta.env.VITE_API_URL}/api/leadhistory/${leadId}`;
        const res = await axios.get(backendUrl);
        setHistory(res.data);
      } catch (error) {
        console.error('Error fetching lead history:', error);
      } finally {
        setLoading(false);
      }
    };

    if (leadId) {
      fetchHistory();
    }
  }, [leadId]);

  const getActionIcon = (action) => {
    switch (action) {
      case 'created': return <Plus className="w-4 h-4 text-green-600" />;
      case 'updated': return <Edit className="w-4 h-4 text-blue-600" />;
      case 'status_changed': return <TrendingUp className="w-4 h-4 text-purple-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'created': return 'bg-green-50 border-green-200';
      case 'updated': return 'bg-blue-50 border-blue-200';
      case 'status_changed': return 'bg-purple-50 border-purple-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getChangeDescription = (action, changes, oldValues, newValues) => {
    if (action === 'created') {
      return 'Lead was created';
    }

    const changedFields = Object.keys(changes);
    if (changedFields.length === 1) {
      const field = changedFields[0];
      if (field === 'leadStage') {
        return `Status changed from "${oldValues[field] || 'None'}" to "${newValues[field]}"`;
      }
      return `${field} was updated`;
    }

    return `${changedFields.length} fields were updated`;
  };

  if (loading) {
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-gray-500 text-center">No history available</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-64 overflow-y-auto">
      {history.map((entry) => (
        <div key={entry._id} className={`border rounded-lg p-3 ${getActionColor(entry.action)}`}>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              {getActionIcon(entry.action)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">
                  {getChangeDescription(entry.action, entry.changes, entry.oldValues, entry.newValues)}
                </p>
                <span className="text-xs text-gray-500">
                  {formatDate(entry.createdAt)}
                </span>
              </div>
              {entry.userId && (
                <div className="flex items-center space-x-1 mt-1">
                  <User className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    {entry.userId.firstName} {entry.userId.lastName}
                  </span>
                </div>
              )}
              {Object.keys(entry.changes).length > 1 && (
                <div className="mt-2 text-xs text-gray-600">
                  <details>
                    <summary className="cursor-pointer hover:text-gray-800">View details</summary>
                    <div className="mt-1 space-y-1">
                      {Object.keys(entry.changes).map((field) => (
                        <div key={field} className="ml-2">
                          <span className="font-medium">{field}:</span> 
                          <span className="text-gray-500"> "{entry.oldValues[field] || 'None'}"</span> 
                          → 
                          <span className="text-gray-700"> "{entry.newValues[field]}"</span>
                        </div>
                      ))}
                    </div>
                  </details>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LeadHistory;