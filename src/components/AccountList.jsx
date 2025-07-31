// components/AccountList.jsx (Enhanced to show contact relationships)
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
  Edit
} from 'lucide-react';

const AccountList = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const getRenewalUrgency = (days) => {
    if (days < 0) return 'text-red-600 font-semibold'; // Overdue
    if (days <= 7) return 'text-orange-600 font-semibold'; // Due soon
    if (days <= 30) return 'text-yellow-600'; // Due this month
    return 'text-gray-600'; // Future
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-2">{error}</div>
        <button 
          onClick={fetchAccounts}
          className="text-blue-600 hover:text-blue-800"
        >
          Try again
        </button>
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="text-center py-12">
        <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No accounts yet</h3>
        <p className="text-gray-500">Create your first account to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Active Accounts ({accounts.length})
          </h3>
          <p className="text-sm text-gray-500">
            Total MRR: ${accounts.reduce((sum, acc) => sum + (acc.currentMonthlyPrice || 0), 0).toFixed(2)}
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {accounts.map((account) => {
          const daysUntilRenewal = getDaysUntilRenewal(account.renewalDate);
          const renewalUrgency = getRenewalUrgency(daysUntilRenewal);
          
          return (
            <div
              key={account._id}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">{account.accountName}</h4>
                    <p className="text-sm text-gray-500">Account #{account.accountNumber}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {getStatusIcon(account.status)}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(account.status)}`}>
                    {account.status.charAt(0).toUpperCase() + account.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4">
                {/* Account Holder Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-3">Account Holder</h5>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{account.accountHolderName}</span>
                    </div>
                    {account.accountHolderEmail && (
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{account.accountHolderEmail}</span>
                      </div>
                    )}
                    <div className="text-xs text-gray-500 capitalize">
                      Relationship: {account.relationship}
                    </div>
                  </div>
                </div>
                
                {/* Service & Billing */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-3">Service & Billing</h5>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Service:</span>
                      <span className="text-sm font-medium capitalize">{account.serviceType}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Price:</span>
                      <span className="text-sm font-medium">
                        ${account.currentMonthlyPrice}/{account.billingCycle}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Started:</span>
                      <span className="text-sm">{new Date(account.startDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                {/* Renewal Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-3">Renewal</h5>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{new Date(account.renewalDate).toLocaleDateString()}</span>
                    </div>
                    <div className={`text-sm ${renewalUrgency}`}>
                      {daysUntilRenewal < 0 
                        ? `${Math.abs(daysUntilRenewal)} days overdue`
                        : daysUntilRenewal === 0 
                        ? 'Due today'
                        : `${daysUntilRenewal} days remaining`
                      }
                    </div>
                    {daysUntilRenewal <= 30 && (
                      <div className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        Renewal needed soon
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              {account.contactId && (
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Customer: {account.contactId.firstName} {account.contactId.lastName}
                        </p>
                        {account.contactId.email && (
                          <p className="text-xs text-gray-500">{account.contactId.email}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Account Details">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors" title="Edit Account">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {account.notes && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Notes:</span> {account.notes}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AccountList;