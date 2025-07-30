// src/components/LeadKanbanView.jsx
import React from 'react';
import LeadKanbanColumn from './LeadKanbanColumn';

const LeadKanbanView = ({ leads, onLeadSelect, onEditLead }) => {
  const groupedLeads = {
    'New': leads.filter(lead => !lead.leadStage || lead.leadStage === 'New'),
    'Contacted': leads.filter(lead => lead.leadStage === 'Contacted'),
    'Qualified': leads.filter(lead => lead.leadStage === 'Qualified'),
    'Won': leads.filter(lead => lead.leadStage === 'Won'),
    'Lost': leads.filter(lead => lead.leadStage === 'Lost')
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {Object.entries(groupedLeads).map(([status, statusLeads]) => (
        <LeadKanbanColumn 
          key={status}
          status={status}
          leads={statusLeads}
          onLeadSelect={onLeadSelect}
          onEditLead={onEditLead}
        />
      ))}
    </div>
  );
};

export default LeadKanbanView;