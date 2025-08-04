// src/hooks/useCRMSettings.js - CORRECTED CLEAN VERSION
import { useState, useEffect } from 'react';

export const useCRMSettings = () => {
  const [leadSources, setLeadSources] = useState([]);
  const [leadStages, setLeadStages] = useState([]);
  const [leadFields, setLeadFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Set fallback values immediately
    console.log('🔍 Using fallback values with only Last Name required');
    setFallbackValues();
    setLoading(false);
  }, []);

  const setFallbackValues = () => {
    console.log('🔍 Setting fallback values - ONLY LAST NAME REQUIRED');
    
    const fallbackLeadSources = [
      { id: 1, value: 'website', label: 'Website' },
      { id: 2, value: 'social-media', label: 'Social Media' },
      { id: 3, value: 'referral', label: 'Referral' },
      { id: 4, value: 'email-campaign', label: 'Email Campaign' },
      { id: 5, value: 'cold-call', label: 'Cold Call' },
      { id: 6, value: 'trade-show', label: 'Trade Show' },
      { id: 7, value: 'other', label: 'Other' }
    ];
    
    const fallbackLeadStages = [
      { id: 1, value: 'New', label: 'New' },
      { id: 2, value: 'Contacted', label: 'Contacted' },
      { id: 3, value: 'Qualified', label: 'Qualified' },
      { id: 4, value: 'Won', label: 'Won' },
      { id: 5, value: 'Lost', label: 'Lost' }
    ];
    
    // CORRECTED: Only Last Name is required
    const fallbackLeadFields = [
      { id: 1, name: 'firstName', label: 'First Name', type: 'text', required: false, active: true },     // ❌ NOT REQUIRED
      { id: 2, name: 'lastName', label: 'Last Name', type: 'text', required: true, active: true },       // ✅ REQUIRED
      { id: 3, name: 'email', label: 'Email', type: 'email', required: false, active: true },            // ❌ NOT REQUIRED
      { id: 4, name: 'phone', label: 'Phone', type: 'tel', required: false, active: true },              // ❌ NOT REQUIRED
      { id: 5, name: 'company', label: 'Company', type: 'text', required: false, active: true },         // ❌ NOT REQUIRED
      { id: 6, name: 'jobTitle', label: 'Job Title', type: 'text', required: false, active: true },      // ❌ NOT REQUIRED
      { id: 7, name: 'leadSource', label: 'Lead Source', type: 'select', required: false, active: true } // ❌ NOT REQUIRED
    ];

    setLeadSources(fallbackLeadSources);
    setLeadStages(fallbackLeadStages);
    setLeadFields(fallbackLeadFields);
    
    console.log('✅ Fallback leadFields set with corrected requirements:', fallbackLeadFields);
    console.log('✅ First Name required:', fallbackLeadFields.find(f => f.name === 'firstName')?.required);
    console.log('✅ Last Name required:', fallbackLeadFields.find(f => f.name === 'lastName')?.required);
    console.log('✅ Email required:', fallbackLeadFields.find(f => f.name === 'email')?.required);
  };

  // Helper functions
  const getActiveLeadSources = () => leadSources;
  
  const getActiveLeadStages = () => leadStages;
  
  const getActiveLeadFields = () => leadFields;
  
  const isFieldRequired = (fieldName) => {
    const field = leadFields.find(f => f.name === fieldName);
    return field?.required || false;
  };
  
  const isFieldActive = (fieldName) => {
    const field = leadFields.find(f => f.name === fieldName);
    return field?.active !== false;
  };
  
  const getFieldConfig = (fieldName) => {
    return leadFields.find(f => f.name === fieldName);
  };

  return {
    leadSources,
    leadStages,
    leadFields,
    loading,
    error,
    getActiveLeadSources,
    getActiveLeadStages,
    getActiveLeadFields,
    isFieldRequired,
    isFieldActive,
    getFieldConfig
  };
};

export default useCRMSettings;