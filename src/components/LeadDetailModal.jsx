// src/components/LeadDetailModal.jsx
import React from 'react';
import { X } from 'lucide-react';
import LeadHistory from './LeadHistory';
import { formatSource, formatDate } from '../utils/leadUtils';

const LeadDetailModal = ({ lead, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Lead Details</h3>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Name</label>
              <p className="text-gray-900">{lead.firstName} {lead.lastName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-gray-900">{lead.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Phone</label>
              <p className="text-gray-900">{lead.phone || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Source</label>
              <p className="text-gray-900">{formatSource(lead.leadSource)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Created</label>
              <p className="text-gray-900">{formatDate(lead.createdAt)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Last Modified</label>
              <p className="text-gray-900">{formatDate(lead.updatedAt)}</p>
            </div>
          </div>
          
          <div className="border-t pt-4 mt-6">
            <h4 className="font-medium text-gray-900 mb-3">History</h4>
            <LeadHistory leadId={lead._id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailModal;