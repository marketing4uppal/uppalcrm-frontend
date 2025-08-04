// src/components/LeadKanbanView.jsx (Updated with Single Name Display)
import React from 'react';
import { Mail, Phone, Building, Calendar, Eye, Edit, Trash2, MoreVertical } from 'lucide-react';
import { getSourceBadgeColor, formatSource, formatDate } from '../utils/leadUtils';

const LeadKanbanView = ({ leads, onLeadSelect, onEditLead, onDeleteLead }) => {
  
  // UPDATED: Function to get full name display
  const getDisplayName = (lead) => {
    const firstName = lead.firstName ? lead.firstName.trim() : '';
    const lastName = lead.lastName ? lead.lastName.trim() : '';
    
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    } else if (lastName) {
      return lastName;
    } else if (firstName) {
      return firstName;
    } else {
      return 'Unknown Lead';
    }
  };

  // UPDATED: Function to get initials for avatar
  const getInitials = (lead) => {
    const firstName = lead.firstName ? lead.firstName.trim() : '';
    const lastName = lead.lastName ? lead.lastName.trim() : '';
    
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`;
    } else if (lastName) {
      return lastName.substring(0, 2).toUpperCase();
    } else if (firstName) {
      return firstName.substring(0, 2).toUpperCase();
    } else {
      return 'UL'; // Unknown Lead
    }
  };

  // Group leads by stage
  const groupedLeads = {
    'New': leads.filter(lead => lead.leadStage === 'New'),
    'Contacted': leads.filter(lead => lead.leadStage === 'Contacted'),
    'Qualified': leads.filter(lead => lead.leadStage === 'Qualified'),
    'Won': leads.filter(lead => lead.leadStage === 'Won'),
    'Lost': leads.filter(lead => lead.leadStage === 'Lost')
  };

  const getStageColor = (stage) => {
    const colors = {
      'New': 'bg-gray-100 border-gray-300',
      'Contacted': 'bg-blue-100 border-blue-300',
      'Qualified': 'bg-green-100 border-green-300',
      'Won': 'bg-emerald-100 border-emerald-300',
      'Lost': 'bg-red-100 border-red-300'
    };
    return colors[stage] || 'bg-gray-100 border-gray-300';
  };

  const getStageTextColor = (stage) => {
    const colors = {
      'New': 'text-gray-700',
      'Contacted': 'text-blue-700',
      'Qualified': 'text-green-700',
      'Won': 'text-emerald-700',
      'Lost': 'text-red-700'
    };
    return colors[stage] || 'text-gray-700';
  };

  const LeadCard = ({ lead }) => (
    <div 
      className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer"
      onClick={() => onLeadSelect(lead)}
    >
      {/* Header with name and actions */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
            {getInitials(lead)}
          </div>
          <div className="min-w-0 flex-1">
            {/* UPDATED: Single name display */}
            <h4 className="text-sm font-medium text-gray-900 truncate">
              {getDisplayName(lead)}
            </h4>
            {lead.company && (
              <p className="text-xs text-gray-500 truncate">{lead.company}</p>
            )}
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex space-x-1 flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLeadSelect(lead);
            }}
            className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="View Details"
          >
            <Eye className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditLead(lead);
            }}
            className="p-1 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
            title="Edit Lead"
          >
            <Edit className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteLead(lead);
            }}
            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete Lead"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-2 mb-3">
        {lead.email && (
          <div className="flex items-center text-xs text-gray-600">
            <Mail className="w-3 h-3 mr-2 text-gray-400" />
            <span className="truncate">{lead.email}</span>
          </div>
        )}
        {lead.phone && (
          <div className="flex items-center text-xs text-gray-600">
            <Phone className="w-3 h-3 mr-2 text-gray-400" />
            <span>{lead.phone}</span>
          </div>
        )}
        {lead.jobTitle && (
          <div className="flex items-center text-xs text-gray-600">
            <Building className="w-3 h-3 mr-2 text-gray-400" />
            <span className="truncate">{lead.jobTitle}</span>
          </div>
        )}
      </div>

      {/* Lead Source Badge */}
      {lead.leadSource && (
        <div className="mb-3">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSourceBadgeColor(lead.leadSource)}`}>
            {formatSource(lead.leadSource)}
          </span>
        </div>
      )}

      {/* Score and Date */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center">
          <span className="font-medium">Score: {lead.score || 0}</span>
        </div>
        <div className="flex items-center">
          <Calendar className="w-3 h-3 mr-1" />
          <span>{formatDate(lead.createdAt)}</span>
        </div>
      </div>

      {/* Budget and Timeline (if available) */}
      {(lead.budget !== 'not-specified' || lead.timeline !== 'not-specified') && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <div className="flex justify-between text-xs">
            {lead.budget !== 'not-specified' && (
              <span className="text-green-600 font-medium">
                Budget: {lead.budget}
              </span>
            )}
            {lead.timeline !== 'not-specified' && (
              <span className="text-blue-600 font-medium">
                Timeline: {lead.timeline}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const StageColumn = ({ stage, leads, color, textColor }) => (
    <div className={`rounded-xl p-4 ${color} min-h-[500px]`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`font-semibold ${textColor}`}>{stage}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${textColor} bg-white bg-opacity-50`}>
          {leads.length}
        </span>
      </div>
      
      <div className="space-y-0">
        {leads.map((lead) => (
          <LeadCard key={lead._id} lead={lead} />
        ))}
        
        {leads.length === 0 && (
          <div className="text-center py-8">
            <div className={`text-sm ${textColor} opacity-60`}>
              No leads in this stage
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {Object.entries(groupedLeads).map(([stage, stageLeads]) => (
        <StageColumn
          key={stage}
          stage={stage}
          leads={stageLeads}
          color={getStageColor(stage)}
          textColor={getStageTextColor(stage)}
        />
      ))}
    </div>
  );
};

export default LeadKanbanView;