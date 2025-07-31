// components/ContactDetailModal.jsx (Enhanced for new relationships)
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Building, 
  Calendar,
  DollarSign,
  Users,
  Target,
  Eye,
  Edit,
  Plus
} from 'lucide-react';

const ContactDetailModal = ({ contactId, isOpen, onClose }) => {
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (isOpen && contactId) {
      fetchContactDetails();
    }
  }, [isOpen, contactId]);

  const fetchContactDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/contacts/${contactId}`);
      setContact(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching contact details:', error);
      setError('Failed to load contact details');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {loading ? 'Loading...' : contact ? `${contact.firstName} ${contact.lastName}` : 'Contact Details'}
                </h2>
                <p className="text-blue-100">Customer Profile</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-600">{error}</div>
        ) : contact ? (
          <div className="flex flex-col h-full">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'overview', label: 'Overview', icon: Eye },
                  { id: 'accounts', label: `Accounts (${contact.accounts?.length || 0})`, icon: DollarSign },
                  { id: 'leads', label: `Leads (${contact.leads?.length || 0})`, icon: Users },
                  { id: 'deals', label: `Deals (${contact.deals?.length || 0})`, icon: Target }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Contact Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span>{contact.email}</span>
                        </div>
                        {contact.phone && (
                          <div className="flex items-center space-x-3">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>{contact.phone}</span>
                          </div>
                        )}
                        {contact.company && (
                          <div className="flex items-center space-x-3">
                            <Building className="w-4 h-4 text-gray-400" />
                            <span>{contact.company}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-3">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>Created {new Date(contact.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Summary</h3>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-blue-600">{contact.accounts?.length || 0}</div>
                          <div className="text-sm text-gray-500">Accounts</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-600">{contact.leads?.length || 0}</div>
                          <div className="text-sm text-gray-500">Leads</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-purple-600">{contact.deals?.length || 0}</div>
                          <div className="text-sm text-gray-500">Deals</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {contact.notes && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Notes</h3>
                      <p className="text-gray-700">{contact.notes}</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'accounts' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Active Accounts</h3>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                      <Plus className="w-4 h-4" />
                      <span>New Account</span>
                    </button>
                  </div>
                  
                  {contact.accounts && contact.accounts.length > 0 ? (
                    <div className="grid gap-4">
                      {contact.accounts.map((account) => (
                        <div key={account._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-900">{account.accountName}</h4>
                              <p className="text-sm text-gray-500">Account #{account.accountNumber}</p>
                              <div className="mt-2 flex items-center space-x-4 text-sm">
                                <span className="capitalize">{account.serviceType}</span>
                                <span>${account.currentMonthlyPrice}/{account.billingCycle}</span>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  account.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {account.status}
                                </span>
                              </div>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600">
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No accounts yet</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'leads' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Lead History</h3>
                  {contact.leads && contact.leads.length > 0 ? (
                    <div className="space-y-3">
                      {contact.leads.map((lead) => (
                        <div key={lead._id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{lead.firstName} {lead.lastName}</h4>
                              <p className="text-sm text-gray-500">{lead.email}</p>
                              <div className="mt-1 flex items-center space-x-2">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  lead.leadStage === 'Won' ? 'bg-green-100 text-green-800' :
                                  lead.leadStage === 'Qualified' ? 'bg-blue-100 text-blue-800' :
                                  lead.leadStage === 'Lost' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {lead.leadStage}
                                </span>
                                {lead.leadSource && (
                                  <span className="text-xs text-gray-500">{lead.leadSource}</span>
                                )}
                              </div>
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(lead.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No leads yet</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'deals' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Deal History</h3>
                  {contact.deals && contact.deals.length > 0 ? (
                    <div className="space-y-3">
                      {contact.deals.map((deal) => (
                        <div key={deal._id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{deal.dealName || `${deal.firstName} ${deal.lastName}`}</h4>
                              <div className="mt-1 flex items-center space-x-4 text-sm">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  deal.stage === 'Closed Won' ? 'bg-green-100 text-green-800' :
                                  deal.stage === 'Closed Lost' ? 'bg-red-100 text-red-800' :
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                  {deal.stage}
                                </span>
                                <span>${deal.amount}</span>
                                <span>{deal.dealType}</span>
                              </div>
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(deal.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No deals yet</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ContactDetailModal;