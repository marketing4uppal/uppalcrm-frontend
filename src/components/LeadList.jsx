// src/components/LeadList.jsx (Final Version)
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Columns } from 'lucide-react';
import LeadTableView from './LeadTableView';
import LeadKanbanView from './LeadKanbanView';
import LeadDetailModal from './LeadDetailModal';
import ContactDetailModal from './ContactDetailModal';
import EditLead from './EditLead';
import EditContact from './EditContact';
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
    const fetchLeads = async () => {
      const backendUrl = `${import.meta.env.VITE_API_URL}/api/leads`;
      try {
        setLoading(true);
        const res = await axios.get(backendUrl);
        setLeads(res.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching leads:', error);
        setError('Failed to load leads. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

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

  // Contact handlers for cross-navigation
  const handleViewContact = (contact) => {
    setSelectedContact(contact);
    setShowContactDetail(true);
    // Close lead detail if open
    setShowLeadDetail(false);
  };

  const handleViewLead = (lead) => {
    setSelectedLead(lead);
    setShowLeadDetail(true);
    // Close contact detail if open
    setShowContactDetail(false);
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setShowEditContact(true);
    // Close other modals
    setShowContactDetail(false);
    setShowLeadDetail(false);
  };

  const handleContactUpdate = (updatedContact) => {
    // Update contact state if we had it loaded
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

  return (
    <div className="w-full">
      {/* Only show local controls if not using global controls */}
      {!globalSearchTerm && !globalViewMode && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {filteredLeads.length} Lead{filteredLeads.length !== 1 ? 's' : ''}
            </h2>
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
          </div>
        </div>
      )}

      {/* Show search indicator if using global search */}
      {globalSearchTerm && (
        <div className="mb-4 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            Found {filteredLeads.length} lead{filteredLeads.length !== 1 ? 's' : ''} matching "{globalSearchTerm}"
          </p>
        </div>
      )}

      {filteredLeads.length === 0 ? (
        <EmptyState searchTerm={effectiveSearchTerm} />
      ) : (
        <>
          {effectiveViewMode === 'table' ? (
            <LeadTableView 
              leads={filteredLeads}
              searchTerm={effectiveSearchTerm}
              onSearchChange={globalSearchTerm ? undefined : setLocalSearchTerm}
              onLeadSelect={handleLeadSelect}
              onEditLead={handleEditLead}
              hideLocalSearch={!!globalSearchTerm}
            />
          ) : (
            <LeadKanbanView 
              leads={filteredLeads}
              onLeadSelect={handleLeadSelect}
              onEditLead={handleEditLead}
            />
          )}
        </>
      )}

      {/* Lead Detail Modal */}
      {showLeadDetail && selectedLead && (
        <LeadDetailModal 
          lead={selectedLead}
          onClose={handleCloseDetail}
          onEdit={() => {
            handleCloseDetail();
            handleEditLead(selectedLead);
          }}
          onViewContact={handleViewContact}
        />
      )}

      {/* Contact Detail Modal (for cross-navigation) */}
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

      {/* Edit Lead Modal */}
      {showEditLead && editingLead && (
        <EditLead 
          lead={editingLead}
          onClose={handleCloseEdit}
          onUpdate={handleLeadUpdate}
        />
      )}

      {/* Edit Contact Modal (for cross-navigation) */}
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