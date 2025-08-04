// src/components/LeadForm.jsx - Updated to use dynamic CRM settings
import React, { useState } from 'react';
import axios from 'axios';
import { User, Mail, Phone, Globe, CheckCircle, AlertCircle, Building, Briefcase } from 'lucide-react';
import { useCRMSettings } from '../hooks/useCRMSettings';

const LeadForm = () => {
  const { leadSources, leadFields, loading: settingsLoading, error: settingsError } = useCRMSettings();

// ADD THIS DEBUG CODE:
console.log('🔍 DEBUG - leadFields from useCRMSettings:', leadFields);
console.log('🔍 DEBUG - First Name field:', leadFields.find(f => f.name === 'firstName'));
console.log('🔍 DEBUG - Email field:', leadFields.find(f => f.name === 'email'));
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
    leadSource: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const { firstName, lastName, email, phone, company, jobTitle, leadSource } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (submitStatus) setSubmitStatus(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    const backendUrl = `${import.meta.env.VITE_API_URL}/api/leads`;
    
    try {
      const res = await axios.post(backendUrl, formData, {
        headers: {
          'x-auth-token': localStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      });
      console.log('Lead created:', res.data);
      setSubmitStatus('success');
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        jobTitle: '',
        leadSource: '',
      });
      
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

  // Helper function to get field icon
  const getFieldIcon = (fieldName) => {
    switch (fieldName) {
      case 'firstName':
      case 'lastName':
        return <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />;
      case 'email':
        return <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />;
      case 'phone':
        return <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />;
      case 'company':
        return <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />;
      case 'jobTitle':
        return <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />;
      case 'leadSource':
        return <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />;
      default:
        return <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />;
    }
  };

  // Helper function to render form field
  const renderFormField = (field) => {
    if (field.type === 'select' && field.name === 'leadSource') {
      return (
        <div key={field.id}>
          <label className={labelClass}>
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          <div className="relative">
            {getFieldIcon(field.name)}
            <select
              name="leadSource"
              value={leadSource}
              onChange={onChange}
              required={field.required}
              className={`${inputClass} appearance-none cursor-pointer`}
            >
              <option value="">Select {field.label.toLowerCase()}</option>
              {leadSources.map((source) => (
                <option key={source.id} value={source.value}>
                  {source.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      );
    }

    return (
      <div key={field.id}>
        <label className={labelClass}>
          {field.label} {field.required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          {getFieldIcon(field.name)}
          <input
            type={field.type}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={onChange}
            required={field.required}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            className={inputClass}
          />
        </div>
      </div>
    );
  };

  if (settingsLoading) {
    return (
      <div className="w-full max-w-md flex items-center justify-center py-8">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Loading form settings...</span>
        </div>
      </div>
    );
  }

  if (settingsError) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-800">Error loading form settings. Using defaults.</span>
        </div>
      </div>
    );
  }

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
        {/* Render dynamic fields based on CRM settings */}
        {leadFields.map(field => renderFormField(field))}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-6 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg text-white'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Creating Lead...</span>
            </div>
          ) : (
            'Add Lead'
          )}
        </button>
      </form>
    </div>
  );
};

export default LeadForm;