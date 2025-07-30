// src/utils/syncUtils.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Sync lead changes to associated contact
 * @param {Object} updatedLead - The updated lead object
 * @returns {Promise} - Promise that resolves when sync is complete
 */
export const syncLeadToContact = async (updatedLead) => {
  try {
    // Find the associated contact for this lead
    const contactResponse = await axios.get(`${API_URL}/api/contacts?leadId=${updatedLead._id}`);
    
    if (contactResponse.data && contactResponse.data.length > 0) {
      const associatedContact = contactResponse.data[0]; // Assuming one contact per lead
      
      // Prepare contact update data with lead changes
      const contactUpdateData = {
        firstName: updatedLead.firstName,
        lastName: updatedLead.lastName,
        email: updatedLead.email,
        phone: updatedLead.phone,
        leadId: updatedLead._id // Ensure lead association remains
      };
      
      // Update the associated contact
      const updateResponse = await axios.put(`${API_URL}/api/contacts/${associatedContact._id}`, contactUpdateData);
      
      console.log('Contact synced successfully:', updateResponse.data);
      return updateResponse.data;
    } else {
      console.log('No associated contact found for lead:', updatedLead._id);
      return null;
    }
  } catch (error) {
    console.error('Error syncing lead to contact:', error);
    throw error;
  }
};

/**
 * Sync contact changes to associated lead
 * @param {Object} updatedContact - The updated contact object
 * @returns {Promise} - Promise that resolves when sync is complete
 */
export const syncContactToLead = async (updatedContact) => {
  try {
    // Check if this contact has an associated lead
    if (!updatedContact.leadId) {
      console.log('Contact has no associated lead, skipping sync');
      return null;
    }
    
    // Get the associated lead
    const leadResponse = await axios.get(`${API_URL}/api/leads/${updatedContact.leadId}`);
    
    if (leadResponse.data) {
      const associatedLead = leadResponse.data;
      
      // Prepare lead update data with contact changes
      const leadUpdateData = {
        firstName: updatedContact.firstName,
        lastName: updatedContact.lastName,
        email: updatedContact.email,
        phone: updatedContact.phone,
        // Keep existing lead-specific fields
        leadSource: associatedLead.leadSource,
        leadStage: associatedLead.leadStage
      };
      
      // Update the associated lead
      const updateResponse = await axios.put(`${API_URL}/api/leads/${updatedContact.leadId}`, leadUpdateData);
      
      console.log('Lead synced successfully:', updateResponse.data);
      return updateResponse.data;
    } else {
      console.log('Associated lead not found:', updatedContact.leadId);
      return null;
    }
  } catch (error) {
    console.error('Error syncing contact to lead:', error);
    throw error;
  }
};

/**
 * Helper function to check if sync-relevant fields have changed
 * @param {Object} oldData - Original data
 * @param {Object} newData - Updated data
 * @returns {boolean} - Whether sync-relevant fields have changed
 */
export const hasSyncRelevantChanges = (oldData, newData) => {
  const syncFields = ['firstName', 'lastName', 'email', 'phone'];
  
  return syncFields.some(field => oldData[field] !== newData[field]);
};

/**
 * Batch sync multiple records (for bulk operations)
 * @param {Array} leads - Array of leads to sync
 * @param {string} direction - 'leadToContact' or 'contactToLead'
 */
export const batchSync = async (records, direction) => {
  const syncPromises = records.map(record => {
    if (direction === 'leadToContact') {
      return syncLeadToContact(record);
    } else if (direction === 'contactToLead') {
      return syncContactToLead(record);
    }
  });
  
  try {
    const results = await Promise.allSettled(syncPromises);
    const successful = results.filter(result => result.status === 'fulfilled').length;
    const failed = results.filter(result => result.status === 'rejected').length;
    
    console.log(`Batch sync completed: ${successful} successful, ${failed} failed`);
    return { successful, failed, results };
  } catch (error) {
    console.error('Batch sync error:', error);
    throw error;
  }
};