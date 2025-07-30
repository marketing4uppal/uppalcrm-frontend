// src/components/LeadDetailModal.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Edit, User, Mail, Phone, Link as LinkIcon, Calendar, ExternalLink } from 'lucide-react';
import { formatSource, formatDate } from '../utils/leadUtils';

const LeadDetailModal = ({ lead, onClose, onEdit, onViewContact }) => {
  const [relatedContact, setRelatedContact] = useState(null);
  const [loadingContact, setLoadingContact] = useState(true);

  useEffect(() => {
    const fetchRelatedContact = async () => {
      try {
        setLoadingContact(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/contacts?leadId=${lead._id}`);
        
        if (response.data && response.data.length > 0) {
          setRelatedContact(response.data[0]); // Assuming one contact per lead
        }
      } catch (error) {
        console.error('Error fetching related contact:', error);
      } finally {
        setLoadingContact(false);
      }
    };

    if (lead._id) {
      fetchRelatedContact();
    }
  }, [lead._id]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Lead Details</h3>
          <div className="flex items-center space-x-2">
            {onEdit && (
              <button 
                onClick={onEdit}
                className="p-2 text-orange-600 hover:text-orange-800 hover:bg-orange-50 rounded-lg transition-colors"
                title="Edit Lead"
              >
                <Edit className="w-5 h-5" />
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Lead Info - Takes 2/3 of the space */}
          <div className="lg:col-span-2 space-y-4">
            {/* Lead Avatar and Name */}
            <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {lead.firstName[0]}{lead.lastName[0]}
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {lead.firstName} {lead.lastName}
                </h2>
                <p className="text-gray-600">Lead</p>
                {lead.leadStage && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200 mt-1">
                    {lead.leadStage}
                  </span>
                )}
              </div>
            </div>

            {/* Lead Information Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white border border-gray-200 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <label className="text-sm font-medium text-gray-500">First Name</label>
                </div>
                <p className="text-gray-900 font-medium">{lead.firstName}</p>
              </div>
              
              <div className="p-4 bg-white border border-gray-200 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <label className="text-sm font-medium text-gray-500">Last Name</label>
                </div>
                <p className="text-gray-900 font-medium">{lead.lastName}</p>
              </div>
              
              <div className="p-4 bg-white border border-gray-200 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <label className="text-sm font-medium text-gray-500">Email Address</label>
                </div>
                <p className="text-gray-900 font-medium">{lead.email}</p>
              </div>
              
              <div className="p-4 bg-white border border-gray-200 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                </div>
                <p className="text-gray-900 font-medium">{lead.phone || '-'}</p>
              </div>
              
              <div className="p-4 bg-white border border-gray-200 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <LinkIcon className="w-4 h-4 text-gray-400" />
                  <label className="text-sm font-medium text-gray-500">Lead Source</label>
                </div>
                <p className="text-gray-900 font-medium">{formatSource(lead.leadSource)}</p>
              </div>
              
              <div className="p-4 bg-white border border-gray-200 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="w-4 h-4 inline-block">📊</span>
                  <label className="text-sm font-medium text-gray-500">Lead Stage</label>
                </div>
                <p className="text-gray-900 font-medium">{lead.leadStage || 'New'}</p>
              </div>
            </div>

            {/* Timestamps */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <label className="text-sm font-medium text-gray-500">Created</label>
                </div>
                <p className="text-gray-900 font-medium">{formatDate(lead.createdAt)}</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <label className="text-sm font-medium text-gray-500">Last Modified</label>
                </div>
                <p className="text-gray-900 font-medium">{formatDate(lead.updatedAt)}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-6 border-t border-gray-200">
              <button className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                <Phone className="w-4 h-4" />
                <span>Call Lead</span>
              </button>
              <button className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors">
                <Mail className="w-4 h-4" />
                <span>Send Email</span>
              </button>
              {onEdit && (
                <button 
                  onClick={onEdit}
                  className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit Lead</span>
                </button>
              )}
            </div>
          </div>

          {/* Related Records Sidebar - Takes 1/3 of the space */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-xl p-4 h-fit">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <LinkIcon className="w-4 h-4" />
                <span>Related Records</span>
              </h4>
              
              {/* Related Contact Section */}
              <div className="mb-4">
                <h5 className="text-sm font-medium text-gray-500 mb-2">Contact</h5>
                
                {loadingContact ? (
                  <div className="flex items-center space-x-2 text-gray-500">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                    <span className="text-sm">Loading...</span>
                  </div>
                ) : relatedContact ? (
                  <div className="bg-white rounded-lg p-3 border border-gray-200 hover:border-green-300 transition-colors cursor-pointer"
                       onClick={() => onViewContact && onViewContact(relatedContact)}>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                        {relatedContact.firstName[0]}{relatedContact.lastName[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">
                          {relatedContact.firstName} {relatedContact.lastName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{relatedContact.email}</p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="mt-2 text-xs text-green-600 font-medium">
                      Generated Contact
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 italic">
                    No related contact found
                  </div>
                )}
              </div>

              {/* Future: Other related records can be added here */}
              <div className="border-t border-gray-200 pt-4">
                <p className="text-xs text-gray-400">
                  Related activities, deals, and tasks will appear here.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailModal;