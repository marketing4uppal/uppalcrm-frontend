// src/hooks/useCRMSettings.js - FIXED VERSION that fetches from API
import { useState, useEffect } from 'react';
import axios from 'axios';

export const useCRMSettings = () => {
  const [leadSources, setLeadSources] = useState([]);
  const [leadStages, setLeadStages] = useState([]);
  const [leadFields, setLeadFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCRMSettings();
  }, []);

  const fetchCRMSettings = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Fetching CRM settings from API...');
      
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/crm-settings`, {
        headers: { 
          'x-auth-token': token,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ API Response:', response.data);
      
      if (response.data.success && response.data.data) {
        const { leadFields: apiFields, leadSources: apiSources, leadStages: apiStages } = response.data.data;
        
        // Use API data if available, otherwise use fallbacks
        setLeadFields(apiFields || getFallbackLeadFields());
        setLeadSources(apiSources || getFallbackLeadSources());
        setLeadStages(apiStages || getFallbackLeadStages());
        
        console.log('✅ Using API data:', {
          fields: apiFields?.length || 0,
          sources: apiSources?.length || 0,
          stages: apiStages?.length || 0
        });
      } else {
        console.log('⚠️ No API data, using fallbacks');
        setFallbackValues();
      }
    } catch (error) {
      console.error('❌ Error fetching CRM settings:', error);
      console.log('⚠️ API failed, using fallbacks');
      setFallbackValues();
      setError('Failed to load settings from server, using defaults');
    } finally {
      setLoading(false);
    }
  };

  const setFallbackValues = () => {
    setLeadFields(getFallbackLeadFields());
    setLeadSources(getFallbackLeadSources());
    setLeadStages(getFallbackLeadStages());
  };

  const getFallbackLeadFields = () => [
    { id: 1, name: 'firstName', label: 'First Name', type: 'text', required: false, active: true, isCustom: false },     // ✅ NOT REQUIRED
    { id: 2, name: 'lastName', label: 'Last Name', type: 'text', required: true, active: true, isCustom: false },       // ✅ REQUIRED (only this one)
    { id: 3, name: 'email', label: 'Email', type: 'email', required: false, active: true, isCustom: false },            // ✅ NOT REQUIRED
    { id: 4, name: 'phone', label: 'Phone', type: 'tel', required: false, active: true, isCustom: false },              // ✅ NOT REQUIRED
    { id: 5, name: 'company', label: 'Company', type: 'text', required: false, active: true, isCustom: false },         // ✅ NOT REQUIRED
    { id: 6, name: 'jobTitle', label: 'Job Title', type: 'text', required: false, active: true, isCustom: false },      // ✅ NOT REQUIRED
    { id: 7, name: 'leadSource', label: 'Lead Source', type: 'select', required: false, active: true, isCustom: false } // ✅ NOT REQUIRED
  ];

  const getFallbackLeadSources = () => [
    { id: 1, value: 'website', label: 'Website', active: true },
    { id: 2, value: 'social-media', label: 'Social Media', active: true },
    { id: 3, value: 'referral', label: 'Referral', active: true },
    { id: 4, value: 'email-campaign', label: 'Email Campaign', active: true },
    { id: 5, value: 'cold-call', label: 'Cold Call', active: true },
    { id: 6, value: 'trade-show', label: 'Trade Show', active: true },
    { id: 7, value: 'other', label: 'Other', active: true }
  ];

  const getFallbackLeadStages = () => [
    { id: 1, value: 'New', label: 'New', active: true },
    { id: 2, value: 'Contacted', label: 'Contacted', active: true },
    { id: 3, value: 'Qualified', label: 'Qualified', active: true },
    { id: 4, value: 'Won', label: 'Won', active: true },
    { id: 5, value: 'Lost', label: 'Lost', active: true }
  ];

  // Helper functions
  const getActiveLeadSources = () => leadSources.filter(source => source.active !== false);
  
  const getActiveLeadStages = () => leadStages.filter(stage => stage.active !== false);
  
  const getActiveLeadFields = () => leadFields.filter(field => field.active !== false);
  
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
    leadSources: getActiveLeadSources(),
    leadStages: getActiveLeadStages(), 
    leadFields: getActiveLeadFields(),
    loading,
    error,
    getActiveLeadSources,
    getActiveLeadStages,
    getActiveLeadFields,
    isFieldRequired,
    isFieldActive,
    getFieldConfig,
    refetch: fetchCRMSettings
  };
};

export default useCRMSettings;