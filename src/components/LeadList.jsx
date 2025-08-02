// src/components/LeadList.jsx (Final Version with Delete Functionality)
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Columns, Trash2, RotateCcw, Eye } from 'lucide-react';
import LeadTableView from './LeadTableView';
import LeadKanbanView from './LeadKanbanView';
import LeadDetailModal from './LeadDetailModal';
import ContactDetailModal from './ContactDetailModal';
import EditLead from './EditLead';
import EditContact from './EditContact';
import DeleteLeadModal from './DeleteLeadModal'; // NEW IMPORT
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import EmptyState from './EmptyState';

const LeadList = ({ searchTerm: globalSearchTerm = '', viewMode: globalViewMode = null }) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [localViewMode, setLocalViewMode] = useState('table');
  const [selectedLead, setSelectedLead] = useState(null);
  const [showLeadDetail, setShowLeadDetail] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [showEditLead, setShowEditLead] = useState(false);
  
  // NEW: Delete functionality states
  const [deletingLead, setDeletingLead] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeletedLeads, setShowDeletedLeads] = useState(false);
  const [deletedLeads, setDeletedLeads] = useState([]);
  
  // Contact-related states for cross-navigation
  const [selectedContact, setSelectedContact] = useState(null);
  const [showContactDetail, setShowContactDetail] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [showEditContact, setShowEditContact] = useState(false);

  // Use global search if provided, otherwise use local search
  const effectiveSearchTerm = globalSearchTerm || localSearchTerm;
  // Use global view mode if provided, otherwise use local view mode
  const effectiveViewMode = globalViewMode || localViewMode;

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    const backendUrl = `${import.meta.env.VITE_API_URL}/api/leads`;
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const res = await axios.get(backendUrl, { headers });
      setLeads(res.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching leads:', error);
      setError('Failed to load leads. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // NEW: Fetch deleted leads
  const fetchDeletedLeads = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/leads/deleted`, { headers });
      setDeletedLeads(res.data);
    } catch (error) {
      console.error('Error fetching deleted leads:', error);
      setDeletedLeads([]); // Set empty array if endpoint doesn't exist yet
    }
  };

  const filteredLeads = leads.filter(lead =>
    lead.firstName.toLowerCase().includes(effectiveSearchTerm.toLowerCase()) ||
    lead.lastName.toLowerCase().includes(effectiveSearchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(effectiveSearchTerm.toLowerCase()) ||
    (lead.phone && lead.phone.includes(effectiveSearchTerm)) ||
    (lead.leadSource && lead.leadSource.toLowerCase().includes(effectiveSearchTerm.toLowerCase()))
  );

  const handleLeadSelect = (lead) => {
    setSelectedLead(lead);
    setShowLeadDetail(true);
  };

  const handleCloseDetail = () => {
    setShowLeadDetail(false);
    setSelectedLead(null);
  };

  const handleEditLead = (lead) => {
    setEditingLead(lead);
    setShowEditLead(true);
  };

  const handleCloseEdit = () => {
    setShowEditLead(false);
    setEditingLead(null);
  };

  const handleLeadUpdate = (updatedLead) => {
    // Update the lead in the local state
    setLeads(prevLeads => 
      prevLeads.map(lead => 
        lead._id === updatedLead._id ? updatedLead : lead
      )
    );
    
    // Also update selectedLead if it's the same lead
    if (selectedLead && selectedLead._id === updatedLead._id) {
      setSelectedLead(updatedLead);
    }
  };

  // NEW: Delete functionality handlers
  const handleDeleteLead = (lead) => {
    setDeletingLead(lead);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = (leadId, contactAction) => {
    // Remove the lead from the active leads list
    setLeads(prevLeads => prevLeads.filter(lead => lead._id !== leadId));
    
    // Close any open modals related to this lead
    if (selectedLead && selectedLead._id === leadId) {
      setShowLeadDetail(false);
      setSelectedLead(null);
    }
    if (editingLead && editingLead._id === leadId) {
      setShowEditLead(false);
      setEditingLead(null);
    }
    
    // Show success message (you can replace this with a toast notification)
    const actionMessage = contactAction === 'delete' ? ' and contact' : 
                         contactAction === 'convert' ? ' (contact converted)' : 
                         ' (contact preserved)';
    
    alert(`Lead deleted successfully${actionMessage}`);
  };

  const handleRestoreLead = async (leadId) => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      await axios.post(`${import.meta.env.VITE_API_URL}/api/leads/${leadId}/restore`, {}, { headers });
      
      // Refresh both lists
      fetchLeads();
      fetchDeletedLeads();
      
      alert('Lead restored successfully');
    } catch (error) {
      console.error('Error restoring lead:', error);
      alert('Error restoring lead: ' + (error.response?.data?.error || error.message));
    }
  };

  const toggleDeletedView = () => {
    if (!showDeletedLeads) {
      fetchDeletedLeads();
    }
    setShowDeletedLeads(!showDeletedLeads);
  };

  // Contact handlers for cross-navigation
  const handleViewContact = (contact) => {
    setSelectedContact(contact);
    setShowContactDetail(true);
    setShowLeadDetail(false);
  };

  const handleViewLead = (lead) => {
    setSelectedLead(lead);
    setShowLeadDetail(true);
    setShowContactDetail(false);
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setShowEditContact(true);
    setShowContactDetail(false);
    setShowLeadDetail(false);
  };

  const handleContactUpdate = (updatedContact) => {
    if (selectedContact && selectedContact._id === updatedContact._id) {
      setSelectedContact(updatedContact);
    }
  };

  const handleCloseContactDetail = () => {
    setShowContactDetail(false);
    setSelectedContact(null);
  };

  const handleCloseEditContact = () => {
    setShowEditContact(false);
    setEditingContact(null);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  const currentLeads = showDeletedLeads ? deletedLeads : filteredLeads;

  return (
    <div className="w-full">
      {/* Header Controls */}
      {!globalSearchTerm && !globalViewMode && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {showDeletedLeads ? 
                `${deletedLeads.length} Deleted Lead${deletedLeads.length !== 1 ? 's' : ''}` :
                `${filteredLeads.length} Lead${filteredLeads.length !== 1 ? 's' : ''}`
              }
            </h2>
            
            {!showDeletedLeads && (
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setLocalViewMode('table')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    localViewMode === 'table'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Table className="w-4 h-4" />
                  <span>Table</span>
                </button>
                <button
                  onClick={() => setLocalViewMode('kanban')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    localViewMode === 'kanban'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Columns className="w-4 h-4" />
                  <span>Board</span>
                </button>
              </div>
            )}
          </div>

          {/* NEW: Deleted Leads Toggle */}
          <button
            onClick={toggleDeletedView}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
              showDeletedLeads
                ? 'bg-gray-100 border-gray-300 text-gray-700'
                : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {showDeletedLeads ? <Eye className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
            <span>{showDeletedLeads ? 'Show Active' : 'Show Deleted'}</span>
          </button>
        </div>
      )}

      {/* Search Results Indicator */}
      {globalSearchTerm && (
        <div className="mb-4 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            Found {filteredLeads.length} lead{filteredLeads.length !== 1 ? 's' : ''} matching "{globalSearchTerm}"
          </p>
        </div>
      )}

      {/* NEW: Deleted Leads View */}
      {showDeletedLeads ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {deletedLeads.length === 0 ? (
            <div className="p-8 text-center">
              <Trash2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Deleted Leads</h3>
              <p className="text-gray-600">All your leads are active!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deleted</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {deletedLeads.map((lead) => (
                    <tr key={lead._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {lead.firstName} {lead.lastName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {lead.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {lead.deletedAt ? new Date(lead.deletedAt).toLocaleDateString() : '-'}
                        {lead.deletedBy && (
                          <div className="text-xs text-gray-400">
                            by {lead.deletedBy.firstName} {lead.deletedBy.lastName}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {lead.deletionReason || '-'}
                        {lead.deletionNotes && (
                          <div className="text-xs text-gray-400 mt-1">
                            {lead.deletionNotes}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleRestoreLead(lead._id)}
                          className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                        >
                          <RotateCcw className="w-4 h-4" />
                          <span>Restore</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* Active Leads View */
        currentLeads.length === 0 ? (
          <EmptyState searchTerm={effectiveSearchTerm} />
        ) : (
          <>
            {effectiveViewMode === 'table' ? (
              <LeadTableView 
                leads={currentLeads}
                searchTerm={effectiveSearchTerm}
                onSearchChange={globalSearchTerm ? undefined : setLocalSearchTerm}
                onLeadSelect={handleLeadSelect}
                onEditLead={handleEditLead}
                onDeleteLead={handleDeleteLead} // NEW PROP
                hideLocalSearch={!!globalSearchTerm}
              />
            ) : (
              <LeadKanbanView 
                leads={currentLeads}
                onLeadSelect={handleLeadSelect}
                onEditLead={handleEditLead}
                onDeleteLead={handleDeleteLead} // NEW PROP (you may need to add this to LeadKanbanView too)
              />
            )}
          </>
        )
      )}

      {/* NEW: Delete Confirmation Modal */}
      <DeleteLeadModal
        lead={deletingLead}
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingLead(null);
        }}
        onDelete={handleDeleteConfirm}
      />

      {/* Existing Modals */}
      {showLeadDetail && selectedLead && (
        <LeadDetailModal 
          lead={selectedLead}
          onClose={handleCloseDetail}
          onEdit={() => {
            handleCloseDetail();
            handleEditLead(selectedLead);
          }}
          onDelete={() => handleDeleteLead(selectedLead)} // NEW PROP (optional)
          onViewContact={handleViewContact}
        />
      )}

      {showContactDetail && selectedContact && (
        <ContactDetailModal 
          contact={selectedContact}
          onClose={handleCloseContactDetail}
          onEdit={() => {
            handleCloseContactDetail();
            handleEditContact(selectedContact);
          }}
          onViewLead={handleViewLead}
        />
      )}

      {showEditLead && editingLead && (
        <EditLead 
          lead={editingLead}
          onClose={handleCloseEdit}
          onUpdate={handleLeadUpdate}
        />
      )}

      {showEditContact && editingContact && (
        <EditContact 
          contact={editingContact}
          onClose={handleCloseEditContact}
          onUpdate={handleContactUpdate}
        />
      )}
    </div>
  );
};

export default LeadList;