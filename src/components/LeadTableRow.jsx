// src/components/LeadTableRow.jsx
import React from 'react';
import { Mail, Phone, Eye, MoreVertical, Edit } from 'lucide-react';
import { getSourceBadgeColor, formatSource, formatDate, getTimeAgo } from '../utils/leadUtils';

const LeadTableRow = ({ lead, onLeadSelect, onEditLead }) => {
  return (
    <tr 
      className="hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={() => onLeadSelect(lead)}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
            {lead.firstName[0]}{lead.lastName[0]}
          </div>
          <div>
            <div className="font-medium text-gray-900">
              {lead.firstName} {lead.lastName}
            </div>
            {lead.leadStage && (
              <div className="text-xs text-gray-500">{lead.leadStage}</div>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center text-gray-600">
          <Mail className="w-4 h-4 mr-2" />
          <span className="text-sm">{lead.email}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {lead.phone ? (
          <div className="flex items-center">
            <Phone className="w-4 h-4 mr-2" />
            <span>{lead.phone}</span>
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {lead.leadSource && (
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getSourceBadgeColor(lead.leadSource)}`}>
            {formatSource(lead.leadSource)}
          </span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        <div>
          <div className="font-medium">{formatDate(lead.createdAt)}</div>
          <div className="text-xs text-gray-400">{getTimeAgo(lead.createdAt)}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        <div>
          <div className="font-medium">{formatDate(lead.updatedAt)}</div>
          <div className="text-xs text-gray-400">{getTimeAgo(lead.updatedAt)}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center space-x-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onLeadSelect(lead);
            }}
            className="p-1 text-purple-600 hover:bg-purple-50 rounded"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onEditLead(lead);
            }}
            className="p-1 text-orange-600 hover:bg-orange-50 rounded"
            title="Edit Lead"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button 
            onClick={(e) => e.stopPropagation()}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
            title="Call"
          >
            <Phone className="w-4 h-4" />
          </button>
          <button 
            onClick={(e) => e.stopPropagation()}
            className="p-1 text-green-600 hover:bg-green-50 rounded"
            title="Email"
          >
            <Mail className="w-4 h-4" />
          </button>
          <button 
            onClick={(e) => e.stopPropagation()}
            className="p-1 text-gray-600 hover:bg-gray-50 rounded"
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