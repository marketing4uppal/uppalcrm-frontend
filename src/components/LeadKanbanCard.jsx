// src/components/LeadKanbanCard.jsx
import React from 'react';
import { Eye } from 'lucide-react';
import { getSourceBadgeColor, formatSource, getTimeAgo } from '../utils/leadUtils';

const LeadKanbanCard = ({ lead, onLeadSelect }) => {
  return (
    <div 
      className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onLeadSelect(lead)}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
          {lead.firstName[0]}{lead.lastName[0]}
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onLeadSelect(lead);
          }}
          className="p-1 text-gray-400 hover:text-gray-600"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>
      <div className="mb-3">
        <h4 className="font-medium text-gray-900 mb-1">
          {lead.firstName} {lead.lastName}
        </h4>
        <p className="text-sm text-gray-600 mb-2">{lead.email}</p>
        {lead.phone && (
          <p className="text-sm text-gray-600">{lead.phone}</p>
        )}
      </div>
      <div className="space-y-2">
        {lead.leadSource && (
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getSourceBadgeColor(lead.leadSource)}`}>
            {formatSource(lead.leadSource)}
          </span>
        )}
        <div className="text-xs text-gray-500">
          <div>Created: {getTimeAgo(lead.createdAt)}</div>
          <div>Modified: {getTimeAgo(lead.updatedAt)}</div>
        </div>
      </div>
    </div>
  );
};

export default LeadKanbanCard;