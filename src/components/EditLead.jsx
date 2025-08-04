// src/components/EditLead.jsx (Updated - FirstName Optional)
import React, { useState } from 'react';
import axios from 'axios';
import { User, Mail, Phone, Globe, CheckCircle, AlertCircle, X, Save } from 'lucide-react';

const EditLead = ({ lead, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    firstName: lead.firstName || '',
    lastName: lead.lastName || '',
    email: lead.email || '',
    phone: lead.phone || '',
    leadSource: lead.leadSource || '',
    leadStage: lead.leadStage || 'New',
    company: lead.company || '',
    jobTitle: lead.jobTitle || '',
    budget: lead.budget || 'not-specified',
    timeline: lead.timeline || 'not-specified',
    notes: lead.notes || ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const { firstName, lastName, email, phone, leadSource, leadStage, company, jobTitle, budget, timeline, notes } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (submitStatus) setSubmitStatus(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    const backendUrl = `${import.meta.env.VITE_API_URL}/api/leads/${lead._id}`;
    
    try {
      const res = await axios.put(backendUrl, formData);
      console.log('Lead updated:', res.data);
      setSubmitStatus('success');
      
      // Call the update callback to refresh the parent component
      if (onUpdate) {
        onUpdate(res.data.lead || res.data);
      }
      
      // Close modal after short delay
      setTimeout(() => {
        onClose();
      }, 1500);
      
    } catch (error) {
      console.error('Error updating lead:', error.response?.data || error.message);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200";
  const labelClass = "block text-sm font-medium text-gray-700 mb-2";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Edit Lead</h2>
              <p className="text-sm text-gray-500">{lead.firstName} {lead.lastName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Success Message */}
        {submitStatus === 'success' && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">Lead updated successfully!</span>
          </div>
        )}

        {/* Error Message */}
        {submitStatus === 'error' && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800 font-medium">Error updating lead. Please try again.</span>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          {/* First Name - UPDATED: Now Optional */}
          <div>
            <label className={labelClass}>
              First Name {/* REMOVED: Required asterisk */}
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                name="firstName"
                value={firstName}
                onChange={onChange}
                // REMOVED: required attribute
                placeholder="Enter first name (optional)"
                className={inputClass}
              />
            </div>
          </div>

          {/* Last Name - KEPT: Still Required */}
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

          {/* Lead Source */}
          <div>
            <label className={labelClass}>Lead Source</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                name="leadSource"
                value={leadSource}
                onChange={onChange}
                className={`${inputClass} appearance-none cursor-pointer`}
              >
                <option value="">Select lead source</option>
                <option value="website">Website</option>
                <option value="social-media">Social Media</option>
                <option value="referral">Referral</option>
                <option value="email-campaign">Email Campaign</option>
                <option value="cold-call">Cold Call</option>
                <option value="trade-show">Trade Show</option>
                <option value="google-ads">Google Ads</option>
                <option value="linkedin">LinkedIn</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Lead Stage */}
          <div>
            <label className={labelClass}>Lead Stage</label>
            <select
              name="leadStage"
              value={leadStage}
              onChange={onChange}
              className={`${inputClass} appearance-none cursor-pointer`}
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Won">Won</option>
              <option value="Lost">Lost</option>
            </select>
          </div>

          {/* Company */}
          <div>
            <label className={labelClass}>Company</label>
            <input
              type="text"
              name="company"
              value={company}
              onChange={onChange}
              placeholder="Enter company name"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Job Title */}
          <div>
            <label className={labelClass}>Job Title</label>
            <input
              type="text"
              name="jobTitle"
              value={jobTitle}
              onChange={onChange}
              placeholder="Enter job title"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Budget */}
          <div>
            <label className={labelClass}>Budget</label>
            <select
              name="budget"
              value={budget}
              onChange={onChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
            >
              <option value="not-specified">Not Specified</option>
              <option value="under-100">Under $100</option>
              <option value="100-500">$100 - $500</option>
              <option value="500-1000">$500 - $1,000</option>
              <option value="1000-5000">$1,000 - $5,000</option>
              <option value="5000+">$5,000+</option>
            </select>
          </div>

          {/* Timeline */}
          <div>
            <label className={labelClass}>Timeline</label>
            <select
              name="timeline"
              value={timeline}
              onChange={onChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
            >
              <option value="not-specified">Not Specified</option>
              <option value="immediate">Immediate</option>
              <option value="1-month">1 Month</option>
              <option value="1-3-months">1-3 Months</option>
              <option value="3-6-months">3-6 Months</option>
              <option value="6-12-months">6-12 Months</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className={labelClass}>Notes</label>
            <textarea
              name="notes"
              value={notes}
              onChange={onChange}
              placeholder="Additional notes about this lead"
              rows="3"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
            />
          </div>

          {/* Submit Buttons */}
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
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Update Lead</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLead;