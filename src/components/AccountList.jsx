// components/AccountList.jsx
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
  AlertTriangle
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
        <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No accounts yet</h3>
        <p className="text-gray-500">Create your first account to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Active Accounts ({accounts.length})
        </h3>
      </div>

      <div className="grid gap-4">
        {accounts.map((account) => (
          <div
            key={account._id}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{account.accountName}</h4>
                    <p className="text-sm text-gray-500">Account #{account.accountNumber}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(account.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(account.status)}`}>
                      {account.status.charAt(0).toUpperCase() + account.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Account Holder</p>
                    <p className="font-medium">{account.accountHolderName}</p>
                    {account.accountHolderEmail && (
                      <p className="text-sm text-gray-600">{account.accountHolderEmail}</p>
                    )}
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Service & Billing</p>
                    <p className="font-medium capitalize">{account.serviceType}</p>
                    <p className="text-sm text-gray-600">
                      ${account.currentMonthlyPrice}/{account.billingCycle}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Renewal Date</p>
                    <p className="font-medium">
                      {new Date(account.renewalDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      {Math.ceil((new Date(account.renewalDate) - new Date()) / (1000 * 60 * 60 * 24))} days
                    </p>
                  </div>
                </div>

                {account.contactId && (
                  <div className="flex items-center text-sm text-gray-600">
                    <span>Customer: {account.contactId.firstName} {account.contactId.lastName}</span>
                    {account.contactId.email && (
                      <>
                        <span className="mx-2">•</span>
                        <span>{account.contactId.email}</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountList;