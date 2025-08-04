// src/components/LeadForm.jsx (Updated - FirstName Optional)
import React, { useState } from 'react';
import axios from 'axios';
import { User, Mail, Phone, Globe, CheckCircle, AlertCircle } from 'lucide-react';

const LeadForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    leadSource: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null

  const { firstName, lastName, email, phone, leadSource } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear status when user starts typing again
    if (submitStatus) setSubmitStatus(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    const backendUrl = `${import.meta.env.VITE_API_URL}/api/leads`;
    
    try {
      const res = await axios.post(backendUrl, formData);
      console.log('Lead created:', res.data);
      setSubmitStatus('success');
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        leadSource: '',
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => setSubmitStatus(null), 3000);
      
    } catch (error) {
      console.error('Error creating lead:', error.response?.data || error.message);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200";
  const labelClass = "block text-sm font-medium text-gray-700 mb-2";

  return (
    <div className="w-full max-w-md">
      {/* Success Message */}
      {submitStatus === 'success' && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center space-x-2 animate-fade-in">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-800 font-medium">Lead created successfully!</span>
        </div>
      )}

      {/* Error Message */}
      {submitStatus === 'error' && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 animate-fade-in">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-800 font-medium">Error creating lead. Please try again.</span>
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
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              required
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-6 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg text-white transform hover:scale-105'
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Adding Lead...</span>
            </>
          ) : (
            <span>Add Lead</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default LeadForm;