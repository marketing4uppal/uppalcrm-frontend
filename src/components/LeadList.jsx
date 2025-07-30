// src/components/LeadList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Columns } from 'lucide-react';
import LeadTableView from './LeadTableView';
import LeadKanbanView from './LeadKanbanView';
import LeadDetailModal from './LeadDetailModal';
import EditLead from './EditLead';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import EmptyState from './EmptyState';

const LeadList = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('table');
  const [selectedLead, setSelectedLead] = useState(null);
  const [showLeadDetail, setShowLeadDetail] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [showEditLead, setShowEditLead] = useState(false);

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
    lead.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (lead.phone && lead.phone.includes(searchTerm)) ||
    (lead.leadSource && lead.leadSource.toLowerCase().includes(searchTerm.toLowerCase()))
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

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {filteredLeads.length} Lead{filteredLeads.length !== 1 ? 's' : ''}
          </h2>
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Table className="w-4 h-4" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'kanban'
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

      {filteredLeads.length === 0 ? (
        <EmptyState searchTerm={searchTerm} />
      ) : (
        <>
          {viewMode === 'table' ? (
            <LeadTableView 
              leads={filteredLeads}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onLeadSelect={handleLeadSelect}
              onEditLead={handleEditLead}
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
    </div>
  );
};

export default LeadList;