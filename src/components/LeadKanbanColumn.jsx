// src/components/LeadKanbanColumn.jsx
import React from 'react';
import { UserPlus } from 'lucide-react';
import LeadKanbanCard from './LeadKanbanCard';

const LeadKanbanColumn = ({ status, leads, onLeadSelect, onEditLead }) => {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">{status}</h3>
        <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
          {leads.length}
        </span>
      </div>
      <div className="space-y-3">
        {leads.map((lead) => (
          <LeadKanbanCard 
            key={lead._id}
            lead={lead}
            onLeadSelect={onLeadSelect}
            onEditLead={onEditLead}
          />
        ))}
        {leads.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <UserPlus className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No leads in {status}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadKanbanColumn;