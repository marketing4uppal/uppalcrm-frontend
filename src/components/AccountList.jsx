// src/components/AccountList.jsx (Updated with Delete Functionality)
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  User, 
  Calendar, 
  DollarSign, 
  Phone, 
  Mail, 
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Eye,
  Edit,
  Trash2 // NEW IMPORT
} from 'lucide-react';
import DeleteAccountModal from './DeleteAccountModal'; // NEW IMPORT

const AccountList = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // NEW: Delete functionality states
  const [deletingAccount, setDeletingAccount] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/accounts`);
      setAccounts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      setError('Failed to load accounts');
      setLoading(false);
    }
  };

  // NEW: Delete functionality handlers
  const handleDeleteAccount = (account) => {
    setDeletingAccount(account);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = (accountId) => {
    // Remove the account from the list
    setAccounts(prevAccounts => prevAccounts.filter(account => account._id !== accountId));
    
    // Show success message (you can replace this with a toast notification)
    console.log('Account deleted successfully');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'inactive':
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'suspended':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDaysUntilRenewal = (renewalDate) => {
    const days = Math.ceil((new Date(renewalDate) - new Date()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">Error: {error}</div>
        <button 
          onClick={fetchAccounts}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Accounts</h1>
            <p className="text-gray-600">Manage customer accounts and billing</p>
          </div>
        </div>

        {/* Accounts Grid */}
        {accounts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No accounts yet</h3>
            <p className="text-gray-500">Accounts will appear here when deals are won!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {accounts.map((account) => (
              <div key={account._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  {/* Account Header */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-lg font-semibold">
                      {account.accountName[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{account.accountName}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(account.status)}`}>
                          {getStatusIcon(account.status)}
                          <span className="ml-1 capitalize">{account.status}</span>
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">Account #{account._id?.slice(-8)}</p>
                    </div>
                  </div>

                  {/* Actions Menu */}
                  <div className="flex items-center space-x-2">
                    <button
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                      title="Edit Account"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    {/* NEW: Delete Button */}
                    <button
                      onClick={() => handleDeleteAccount(account)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Account"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Account Details Grid */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Account Holder Info */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <User className="w-4 h-4 mr-2 text-gray-400" />
                      Account Holder
                    </h4>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">{account.accountHolderName}</span>
                      </p>
                      {account.contactId && (
                        <div className="space-y-1">
                          {account.contactId.email && (
                            <div className="flex items-center text-sm text-gray-500">
                              <Mail className="w-3 h-3 mr-1" />
                              {account.contactId.email}
                            </div>
                          )}
                          {account.contactId.phone && (
                            <div className="flex items-center text-sm text-gray-500">
                              <Phone className="w-3 h-3 mr-1" />
                              {account.contactId.phone}
                            </div>
                          )}
                        </div>
                      )}
                      <div className="text-xs text-gray-400">
                        Relationship: Self
                      </div>
                    </div>
                  </div>

                  {/* Service & Billing */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                      Service & Billing
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-600">Service:</span>
                        <span className="ml-2 text-sm font-medium capitalize">{account.serviceType}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Price:</span>
                        <span className="ml-2 text-sm font-medium">{formatCurrency(account.currentMonthlyPrice)}/monthly</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Started:</span>
                        <span className="ml-2 text-sm text-gray-900">
                          {new Date(account.startDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Renewal Info */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      Renewal
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-600">Next renewal:</span>
                        <span className="ml-2 text-sm font-medium">
                          {new Date(account.renewalDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        {(() => {
                          const days = getDaysUntilRenewal(account.renewalDate);
                          if (days < 0) {
                            return <span className="text-sm text-red-600 font-medium">Overdue</span>;
                          } else if (days <= 30) {
                            return <span className="text-sm text-yellow-600 font-medium">{days} days remaining</span>;
                          } else {
                            return <span className="text-sm text-gray-600">{days} days remaining</span>;
                          }
                        })()}
                      </div>
                      {(() => {
                        const days = getDaysUntilRenewal(account.renewalDate);
                        if (days <= 30 && days >= 0) {
                          return (
                            <div className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                              Renewal needed soon
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  </div>
                </div>

                {/* Contact Info at Bottom */}
                {account.contactId && (
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Customer: {account.contactId.firstName} {account.contactId.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{account.contactId.email}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                          <Eye className="w-3 h-3" />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors">
                          <Edit className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* NEW: Delete Confirmation Modal */}
      <DeleteAccountModal
        account={deletingAccount}
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingAccount(null);
        }}
        onDelete={handleDeleteConfirm}
      />
    </>
  );
};

export default AccountList;