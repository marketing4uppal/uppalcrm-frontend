// src/components/ContactDetailModal.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Edit, User, Mail, Phone, Link as LinkIcon, Calendar, ExternalLink } from 'lucide-react';
import { formatDate } from '../utils/leadUtils';

const ContactDetailModal = ({ contact, onClose, onEdit, onViewLead }) => {
  const [relatedLead, setRelatedLead] = useState(null);
  const [loadingLead, setLoadingLead] = useState(true);

  useEffect(() => {
    const fetchRelatedLead = async () => {
      if (!contact.leadId) {
        setLoadingLead(false);
        return;
      }

      try {
        setLoadingLead(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/leads/${contact.leadId}`);
        setRelatedLead(response.data);
      } catch (error) {
        console.error('Error fetching related lead:', error);
      } finally {
        setLoadingLead(false);
      }
    };

    fetchRelatedLead();
  }, [contact.leadId]);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Contact Details</h3>
          <div className="flex items-center space-x-2">
            {onEdit && (
              <button 
                onClick={onEdit}
                className="p-2 text-orange-600 hover:text-orange-800 hover:bg-orange-50 rounded-lg transition-colors"
                title="Edit Contact"
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
          {/* Main Contact Info - Takes 2/3 of the space */}
          <div className="lg:col-span-2 space-y-4">
            {/* Contact Avatar and Name */}
            <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {contact.firstName[0]}{contact.lastName[0]}
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {contact.firstName} {contact.lastName}
                </h2>
                <p className="text-gray-600">Contact</p>
                {contact.leadId && (
                  <div className="flex items-center space-x-1 text-sm text-blue-600 mt-1">
                    <LinkIcon className="w-4 h-4" />
                    <span>Generated from Lead</span>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white border border-gray-200 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <label className="text-sm font-medium text-gray-500">First Name</label>
                </div>
                <p className="text-gray-900 font-medium">{contact.firstName}</p>
              </div>
              
              <div className="p-4 bg-white border border-gray-200 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <label className="text-sm font-medium text-gray-500">Last Name</label>
                </div>
                <p className="text-gray-900 font-medium">{contact.lastName}</p>
              </div>
              
              <div className="p-4 bg-white border border-gray-200 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <label className="text-sm font-medium text-gray-500">Email Address</label>
                </div>
                <p className="text-gray-900 font-medium">{contact.email}</p>
              </div>
              
              <div className="p-4 bg-white border border-gray-200 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                </div>
                <p className="text-gray-900 font-medium">{contact.phone || '-'}</p>
              </div>
              
              <div className="p-4 bg-white border border-gray-200 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <LinkIcon className="w-4 h-4 text-gray-400" />
                  <label className="text-sm font-medium text-gray-500">Associated Lead ID</label>
                </div>
                <p className="text-gray-900 font-medium">{contact.leadId || 'None'}</p>
              </div>
              
              <div className="p-4 bg-white border border-gray-200 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                    Lead Generated
                  </span>
                </div>
                <p className="text-sm text-gray-500">Contact Source</p>
              </div>
            </div>

            {/* Timestamps */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <label className="text-sm font-medium text-gray-500">Created</label>
                </div>
                <p className="text-gray-900 font-medium">{formatDate(contact.createdAt)}</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <label className="text-sm font-medium text-gray-500">Last Modified</label>
                </div>
                <p className="text-gray-900 font-medium">{formatDate(contact.updatedAt)}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-6 border-t border-gray-200">
              <button className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                <Phone className="w-4 h-4" />
                <span>Call Contact</span>
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
                  <span>Edit Contact</span>
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
              
              {/* Related Lead Section */}
              <div className="mb-4">
                <h5 className="text-sm font-medium text-gray-500 mb-2">Lead</h5>
                
                {loadingLead ? (
                  <div className="flex items-center space-x-2 text-gray-500">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                    <span className="text-sm">Loading...</span>
                  </div>
                ) : relatedLead ? (
                  <div className="bg-white rounded-lg p-3 border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer"
                       onClick={() => onViewLead && onViewLead(relatedLead)}>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                        {relatedLead.firstName[0]}{relatedLead.lastName[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">
                          {relatedLead.firstName} {relatedLead.lastName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{relatedLead.email}</p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="mt-2 flex items-center space-x-2">
                      {relatedLead.leadStage && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {relatedLead.leadStage}
                        </span>
                      )}
                      <span className="text-xs text-blue-600 font-medium">
                        Source Lead
                      </span>
                    </div>
                  </div>
                ) : contact.leadId ? (
                  <div className="text-sm text-gray-500 italic">
                    Related lead not found
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 italic">
                    No associated lead
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
  );};

export default ContactDetailModal;