// src/hooks/useCRMSettings.js - FIXED VERSION
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
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.log('🔍 No token found, using fallback values');
        setFallbackValues();
        return;
      }

      console.log('🔍 Attempting to fetch CRM settings...');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/crm-settings`, {
        headers: { 
          'x-auth-token': token,
          'Content-Type': 'application/json'
        }
      });

      console.log('🔍 CRM Settings API Response:', response.data);

      if (response.data.success && response.data.data) {
        const settings = response.data.data;
        
        // Set data from API
        setLeadSources(settings.leadSources?.filter(source => source.active) || []);
        setLeadStages(settings.leadStages?.filter(stage => stage.active).sort((a, b) => a.order - b.order) || []);
        setLeadFields(settings.leadFields?.filter(field => field.active) || []);
        
        console.log('🔍 Set leadFields from API:', settings.leadFields);
        setError(null);
      } else {
        console.log('🔍 API response invalid, using fallback values');
        setFallbackValues();
      }
    } catch (err) {
      console.error('🔍 Error fetching CRM settings:', err);
      setError('Failed to load CRM settings');
      setFallbackValues();
    } finally {
      setLoading(false);
    }
  };

  const setFallbackValues = () => {
    console.log('🔍 Setting fallback values with corrected requirements');
    
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
    
    const fallbackLeadFields = [
      { id: 1, name: 'firstName', label: 'First Name', type: 'text', required: false }, // FALSE
      { id: 2, name: 'lastName', label: 'Last Name', type: 'text', required: true },   // TRUE
      { id: 3, name: 'email', label: 'Email', type: 'email', required: false },        // FALSE
      { id: 4, name: 'phone', label: 'Phone', type: 'tel', required: false },
      { id: 5, name: 'company', label: 'Company', type: 'text', required: false },
      { id: 6, name: 'jobTitle', label: 'Job Title', type: 'text', required: false },
      { id: 7, name: 'leadSource', label: 'Lead Source', type: 'select', required: false }
    ];

    setLeadSources(fallbackLeadSources);
    setLeadStages(fallbackLeadStages);
    setLeadFields(fallbackLeadFields);
    
    console.log('🔍 Fallback leadFields set:', fallbackLeadFields);
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
    return field?.active !== false; // Default to true if not specified
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
    refresh: fetchCRMSettings,
    getActiveLeadSources,
    getActiveLeadStages,
    getActiveLeadFields,
    isFieldRequired,
    isFieldActive,
    getFieldConfig
  };
};

export default useCRMSettings;