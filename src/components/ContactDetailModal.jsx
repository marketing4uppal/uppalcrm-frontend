// src/components/ContactDetailModal.jsx
import React from 'react';
import { X, Edit, User, Mail, Phone, Link as LinkIcon, Calendar } from 'lucide-react';
import { formatDate } from '../utils/leadUtils';

const ContactDetailModal = ({ contact, onClose, onEdit }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
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
        
        <div className="space-y-4">
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
      </div>
    </div>
  );
};

export default ContactDetailModal;