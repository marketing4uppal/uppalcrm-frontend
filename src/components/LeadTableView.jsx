// src/components/LeadTableView.jsx (Updated with Delete Function)
import React from 'react';
import { Search, Filter, ChevronDown, Calendar, Clock } from 'lucide-react';
import LeadTableRow from './LeadTableRow';

const LeadTableView = ({ leads, searchTerm, onSearchChange, onLeadSelect, onEditLead, onDeleteLead, hideLocalSearch }) => {
  return (
    <div className="overflow-hidden">
      {/* Only show search if not hidden by global search */}
      {!hideLocalSearch && (
        <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 rounded-t-xl">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">All leads ({leads.length})</span>
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
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )}

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
            {leads.map((lead) => (
              <LeadTableRow 
                key={lead._id} 
                lead={lead} 
                onLeadSelect={onLeadSelect}
                onEditLead={onEditLead}
                onDeleteLead={onDeleteLead}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-t border-gray-200 rounded-b-xl">
        <div className="text-sm text-gray-500">
          Showing 1-{leads.length} of {leads.length}
        </div>
        <div className="text-sm text-gray-500">
          {leads.length} lead{leads.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
};

export default LeadTableView;