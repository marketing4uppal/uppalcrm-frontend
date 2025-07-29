// src/components/LeadList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Mail, Phone, Globe, Search, Filter, MoreVertical, UserPlus } from 'lucide-react';

const LeadList = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

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

  return (
    <div className="w-full">
      {/* Header with Search */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-900">
            {filteredLeads.length} Lead{filteredLeads.length !== 1 ? 's' : ''}
          </span>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-lg bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Leads List */}
      {filteredLeads.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No matching leads found' : 'No leads yet'}
          </h3>
          <p className="text-gray-500">
            {searchTerm ? 'Try adjusting your search terms' : 'Add your first lead using the form on the left!'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLeads.map((lead) => (
            <div
              key={lead._id}
              className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl p-4 hover:shadow-md hover:bg-white transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                    {lead.firstName[0]}{lead.lastName[0]}
                  </div>
                  
                  {/* Lead Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-semibold text-gray-900">
                        {lead.firstName} {lead.lastName}
                      </h4>
                      {lead.leadSource && (
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getSourceBadgeColor(lead.leadSource)}`}>
                          {formatSource(lead.leadSource)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 mt-1">
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Mail className="w-3 h-3" />
                        <span>{lead.email}</span>
                      </div>
                      {lead.phone && (
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <Phone className="w-3 h-3" />
                          <span>{lead.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Phone className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                    <Mail className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Summary */}
      {filteredLeads.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Total: {filteredLeads.length} lead{filteredLeads.length !== 1 ? 's' : ''}</span>
            {searchTerm && (
              <span>Filtered from {leads.length} total lead{leads.length !== 1 ? 's' : ''}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadList;