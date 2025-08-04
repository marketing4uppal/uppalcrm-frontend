// src/components/EditContact.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { User, Mail, Phone, CheckCircle, AlertCircle, X, Save } from 'lucide-react';

const EditContact = ({ contact, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    firstName: contact.firstName || '',
    lastName: contact.lastName || '',
    email: contact.email || '',
    phone: contact.phone || '',
    leadId: contact.leadId || ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const { firstName, lastName, email, phone, leadId } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (submitStatus) setSubmitStatus(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    const backendUrl = `${import.meta.env.VITE_API_URL}/api/contacts/${contact._id}`;
    
    try {
      const res = await axios.put(backendUrl, formData);
      console.log('Contact updated:', res.data);
      setSubmitStatus('success');
      
      // Call the update callback to refresh the parent component
      if (onUpdate) {
        onUpdate(res.data.contact || res.data);
      }
      
      // Close modal after short delay
      setTimeout(() => {
        onClose();
      }, 1500);
      
    } catch (error) {
      console.error('Error updating contact:', error.response?.data || error.message);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200";
  const labelClass = "block text-sm font-medium text-gray-700 mb-2";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Edit Contact</h3>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Message */}
        {submitStatus === 'success' && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">Contact updated successfully!</span>
          </div>
        )}

        {/* Error Message */}
        {submitStatus === 'error' && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800 font-medium">Error updating contact. Please try again.</span>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          {/* First Name */}
          <div>
            <label className={labelClass}>
              First Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                name="firstName"
                value={firstName}
                onChange={onChange}
                required
                placeholder="Enter first name"
                className={inputClass}
              />
            </div>
          </div>

          {/* Last Name */}
          <div>
            <label className={labelClass}>
              Last Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                name="lastName"
                value={lastName}
                onChange={onChange}
                required
                placeholder="Enter last name"
                className={inputClass}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className={labelClass}>
              Email Address 
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="email"
                name="email"
                value={email}
                onChange={onChange}
                placeholder="Enter email address"
                className={inputClass}
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className={labelClass}>Phone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="tel"
                name="phone"
                value={phone}
                onChange={onChange}
                placeholder="Enter phone number"
                className={inputClass}
              />
            </div>
          </div>

          {/* Lead ID (read-only in this case) */}
          <div>
            <label className={labelClass}>Associated Lead ID</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                name="leadId"
                value={leadId}
                onChange={onChange}
                placeholder="Lead ID (optional)"
                className={inputClass}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-6 rounded-xl font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-600 to-blue-600 hover:shadow-lg text-white transform hover:scale-105'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Update Contact</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditContact;