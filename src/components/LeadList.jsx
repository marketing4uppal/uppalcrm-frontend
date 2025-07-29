// src/components/LeadList.jsx
import LeadHistory from './LeadHistory';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, 
  Mail, 
  Phone, 
  Globe, 
  Search, 
  Filter, 
  MoreVertical, 
  UserPlus, 
  Table,
  Columns,
  ChevronDown,
  Building,
  Tag,
  Calendar,
  Clock,
  Eye
} from 'lucide-react';

const LeadList = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'kanban'
  const [selectedLead, setSelectedLead] = useState(null);
  const [showLeadDetail, setShowLeadDetail] = useState(false);

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

  // Filter leads based on search term
  const filteredLeads = leads.filter(lead =>
    lead.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (lead.phone && lead.phone.includes(searchTerm)) ||
    (lead.leadSource && lead.leadSource.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getSourceBadgeColor = (source) => {
    const colors = {
      'website': 'bg-blue-100 text-blue-800 border-blue-200',
      'social-media': 'bg-purple-100 text-purple-800 border-purple-200',
      'referral': 'bg-green-100 text-green-800 border-green-200',
      'email-campaign': 'bg-orange-100 text-orange-800 border-orange-200',
      'cold-call': 'bg-red-100 text-red-800 border-red-200',
      'trade-show': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'other': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[source] || colors['other'];
  };

  const formatSource = (source) => {
    if (!source) return 'Unknown';
    return source.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return `${diffInDays}d ago`;
    }
  };

  // Group leads by status for kanban view
  const groupedLeads = {
    'New': filteredLeads.filter(lead => !lead.leadStage || lead.leadStage === 'New'),
    'Contacted': filteredLeads.filter(lead => lead.leadStage === 'Contacted'),
    'Qualified': filteredLeads.filter(lead => lead.leadStage === 'Qualified'),
    'Won': filteredLeads.filter(lead => lead.leadStage === 'Won'),
    'Lost': filteredLeads.filter(lead => lead.leadStage === 'Lost')
  };

  if (loading) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
            <span className="text-gray-600">Loading leads...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <div className="flex items-center justify-center space-x-2 text-red-600 mb-2">
            <Users className="w-5 h-5" />
            <span className="font-medium">Error Loading Leads</span>
          </div>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  const TableView = () => (
    <div className="overflow-hidden">
      {/* Table Header Controls */}
      <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 rounded-t-xl">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">All leads ({filteredLeads.length})</span>
          <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900">
            <Filter className="w-4 h-4" />
            <span>Filter by</span>
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center space-x-1">
                  <span>Name</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center space-x-1">
                  <span>Email</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center space-x-1">
                  <span>Phone</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center space-x-1">
                  <span>Source</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Created</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Modified</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredLeads.map((lead) => (
              <<tr 
  key={lead._id} 
  className="hover:bg-gray-50 transition-colors cursor-pointer"
  onClick={() => {
    setSelectedLead(lead);
    setShowLeadDetail(true);
  }}
>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                      {lead.firstName[0]}{lead.lastName[0]}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {lead.firstName} {lead.lastName}
                      </div>
                      {lead.leadStage && (
                        <div className="text-xs text-gray-500">{lead.leadStage}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    <span className="text-sm">{lead.email}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {lead.phone ? (
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      <span>{lead.phone}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {lead.leadSource && (
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getSourceBadgeColor(lead.leadSource)}`}>
                      {formatSource(lead.leadSource)}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <div>
                    <div className="font-medium">{formatDate(lead.createdAt)}</div>
                    <div className="text-xs text-gray-400">{getTimeAgo(lead.createdAt)}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <div>
                    <div className="font-medium">{formatDate(lead.updatedAt)}</div>
                    <div className="text-xs text-gray-400">{getTimeAgo(lead.updatedAt)}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => {
                        setSelectedLead(lead);
                        setShowLeadDetail(true);
                      }}
                      className="p-1 text-purple-600 hover:bg-purple-50 rounded"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                      <Phone className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-green-600 hover:bg-green-50 rounded">
                      <Mail className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-600 hover:bg-gray-50 rounded">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-t border-gray-200 rounded-b-xl">
        <div className="text-sm text-gray-500">
          Showing 1-{filteredLeads.length} of {filteredLeads.length}
        </div>
        <div className="text-sm text-gray-500">
          {filteredLeads.length} lead{filteredLeads.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );

  const KanbanView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {Object.entries(groupedLeads).map(([status, statusLeads]) => (
        <div key={status} className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">{status}</h3>
            <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
              {statusLeads.length}
            </span>
          </div>
          <div className="space-y-3">
            {statusLeads.map((lead) => (
              <div key={lead._id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {lead.firstName[0]}{lead.lastName[0]}
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedLead(lead);
                      setShowLeadDetail(true);
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
                <div className="mb-3">
                  <h4 className="font-medium text-gray-900 mb-1">
                    {lead.firstName} {lead.lastName}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">{lead.email}</p>
                  {lead.phone && (
                    <p className="text-sm text-gray-600">{lead.phone}</p>
                  )}
                </div>
                <div className="space-y-2">
                  {lead.leadSource && (
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getSourceBadgeColor(lead.leadSource)}`}>
                      {formatSource(lead.leadSource)}
                    </span>
                  )}
                  <div className="text-xs text-gray-500">
                    <div>Created: {getTimeAgo(lead.createdAt)}</div>
                    <div>Modified: {getTimeAgo(lead.updatedAt)}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-gray-100">
                  <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                    <Phone className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-green-600 hover:bg-green-50 rounded">
                    <Mail className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {statusLeads.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <UserPlus className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No leads in {status}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full">
      {/* View Toggle Header */}
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

      {/* Content */}
      {filteredLeads.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No matching leads found' : 'No leads yet'}
          </h3>
          <p className="text-gray-500">
            {searchTerm ? 'Try adjusting your search terms' : 'Add your first lead to get started!'}
          </p>
        </div>
      ) : (
        <>
          {viewMode === 'table' ? <TableView /> : <KanbanView />}
        </>
      )}

      {/* Lead Detail Modal - Placeholder for now */}
      {showLeadDetail && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Lead Details</h3>
              <button 
                onClick={() => setShowLeadDetail(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="text-gray-900">{selectedLead.firstName} {selectedLead.lastName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{selectedLead.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-gray-900">{selectedLead.phone || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Source</label>
                  <p className="text-gray-900">{formatSource(selectedLead.leadSource)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Created</label>
                  <p className="text-gray-900">{formatDate(selectedLead.createdAt)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Modified</label>
                  <p className="text-gray-900">{formatDate(selectedLead.updatedAt)}</p>
                </div>
              </div>
              
              <div className="border-t pt-4 mt-6">
  <h4 className="font-medium text-gray-900 mb-3">History</h4>
  <LeadHistory leadId={selectedLead._id} />
</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadList;