// src/components/admin/FieldCustomization.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, AlertCircle } from 'lucide-react';
import LeadFields from './LeadFields';
import LeadSources from './LeadSources';
import LeadStages from './LeadStages';

const FieldCustomization = () => {
  const [submitStatus, setSubmitStatus] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  // CRM Settings state
  const [crmSettings, setCrmSettings] = useState({
    leadFields: [
      { id: 1, name: 'firstName', label: 'First Name', type: 'text', required: false, active: true },
      { id: 2, name: 'lastName', label: 'Last Name', type: 'text', required: true, active: true },
      { id: 3, name: 'email', label: 'Email', type: 'email', required: false, active: true },
      { id: 4, name: 'phone', label: 'Phone', type: 'tel', required: false, active: true },
      { id: 5, name: 'leadSource', label: 'Lead Source', type: 'select', required: false, active: true }
    ],
    leadSources: [
      { id: 1, value: 'website', label: 'Website', active: true },
      { id: 2, value: 'social-media', label: 'Social Media', active: true },
      { id: 3, value: 'referral', label: 'Referral', active: true },
      { id: 4, value: 'email-campaign', label: 'Email Campaign', active: true },
      { id: 5, value: 'cold-call', label: 'Cold Call', active: true },
      { id: 6, value: 'trade-show', label: 'Trade Show', active: true },
      { id: 7, value: 'other', label: 'Other', active: true }
    ],
    leadStages: [
      { id: 1, value: 'New', label: 'New', active: true },
      { id: 2, value: 'Contacted', label: 'Contacted', active: true },
      { id: 3, value: 'Qualified', label: 'Qualified', active: true },
      { id: 4, value: 'Won', label: 'Won', active: true },
      { id: 5, value: 'Lost', label: 'Lost', active: true }
    ]
  });

  useEffect(() => {
    loadCRMSettings();
  }, []);

  const loadCRMSettings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/crm-settings`, {
        headers: { 
          'x-auth-token': token,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success && response.data.data) {
        setCrmSettings({
          leadFields: response.data.data.leadFields || crmSettings.leadFields,
          leadSources: response.data.data.leadSources || crmSettings.leadSources,
          leadStages: response.data.data.leadStages || crmSettings.leadStages
        });
        setHasUnsavedChanges(false);
      }
    } catch (error) {
      console.error('Error loading CRM settings:', error);
      // Keep default settings if API fails
    } finally {
      setLoading(false);
    }
  };

  const saveCRMSettings = async () => {
    setIsSaving(true);
    setSubmitStatus(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setSubmitStatus('error');
        return;
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/crm-settings`,
        crmSettings,
        {
          headers: { 
            'x-auth-token': token,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setHasUnsavedChanges(false);
        setSubmitStatus('success');
        setTimeout(() => setSubmitStatus(null), 3000);
      }
    } catch (error) {
      console.error('Error saving CRM settings:', error);
      setSubmitStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const discardChanges = () => {
    if (window.confirm('Are you sure you want to discard all unsaved changes?')) {
      loadCRMSettings();
    }
  };

  const handleSettingsChange = (newSettings) => {
    setCrmSettings(newSettings);
    setHasUnsavedChanges(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">CRM Customization</h3>
          <p className="text-gray-600">Customize lead and contact fields for your organization</p>
        </div>
        
        {/* Save/Discard Buttons */}
        <div className="flex items-center space-x-3">
          {hasUnsavedChanges && (
            <>
              <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Unsaved changes</span>
              </div>
              <button
                onClick={discardChanges}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Discard
              </button>
              <button
                onClick={saveCRMSettings}
                disabled={isSaving}
                className={`px-4 py-2 rounded-xl font-medium flex items-center space-x-2 transition-all ${
                  isSaving
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:shadow-lg'
                }`}
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Success/Error Messages */}
      {submitStatus === 'success' && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-800 font-medium">CRM customizations saved successfully!</span>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-800 font-medium">Error saving customizations. Please try again.</span>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Lead Fields */}
        <LeadFields 
          fields={crmSettings.leadFields}
          onFieldsChange={(fields) => handleSettingsChange({...crmSettings, leadFields: fields})}
        />

        {/* Lead Sources */}
        <LeadSources 
          sources={crmSettings.leadSources}
          onSourcesChange={(sources) => handleSettingsChange({...crmSettings, leadSources: sources})}
        />

        {/* Lead Stages */}
        <LeadStages 
          stages={crmSettings.leadStages}
          onStagesChange={(stages) => handleSettingsChange({...crmSettings, leadStages: stages})}
        />
      </div>
    </div>
  );
};

export default FieldCustomization;