// src/components/LeadTableRow.jsx (Updated with Single Name Display)
import React from 'react';
import { Mail, Phone, Eye, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { getSourceBadgeColor, formatSource, formatDate, getTimeAgo } from '../utils/leadUtils';

const LeadTableRow = ({ lead, onLeadSelect, onEditLead, onDeleteLead }) => {
  // Format date to single line - professional format
  const formatCompactDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

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

  return (
    <tr 
      className="hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100"
      onClick={() => onLeadSelect(lead)}
    >
      {/* Name Column - UPDATED: Single name display */}
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
            {getInitials(lead)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-gray-900">
              {getDisplayName(lead)}
            </div>
            {lead.leadStage && (
              <div className="text-xs text-gray-500">{lead.leadStage}</div>
            )}
          </div>
        </div>
      </td>

      {/* Email Column */}
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center text-gray-600">
          <Mail className="w-4 h-4 mr-2 text-gray-400" />
          <span className="text-sm">{lead.email}</span>
        </div>
      </td>

      {/* Phone Column */}
      <td className="px-4 py-3 whitespace-nowrap">
        {lead.phone ? (
          <div className="flex items-center text-gray-600">
            <Phone className="w-4 h-4 mr-2 text-gray-400" />
            <span className="text-sm">{lead.phone}</span>
          </div>
        ) : (
          <span className="text-sm text-gray-400">-</span>
        )}
      </td>

      {/* Source Column */}
      <td className="px-4 py-3 whitespace-nowrap">
        {lead.leadSource && (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSourceBadgeColor(lead.leadSource)}`}>
            {formatSource(lead.leadSource)}
          </span>
        )}
      </td>

      {/* Created Date */}
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="text-sm text-gray-900">{formatCompactDate(lead.createdAt)}</div>
        <div className="text-xs text-gray-500">{formatTime(lead.createdAt)}</div>
      </td>

      {/* Modified Date */}
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="text-sm text-gray-900">{formatCompactDate(lead.updatedAt)}</div>
        <div className="text-xs text-gray-500">{formatTime(lead.updatedAt)}</div>
      </td>

      {/* Actions */}
      <td className="px-4 py-3 whitespace-nowrap text-right">
        <div className="flex items-center justify-end space-x-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onLeadSelect(lead);
            }}
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onEditLead(lead);
            }}
            className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors"
            title="Edit Lead"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDeleteLead(lead);
            }}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Delete Lead"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button 
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
            title="More Options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default LeadTableRow;