// src/components/DealList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  DollarSign, 
  Calendar, 
  Users, 
  TrendingUp, 
  Search, 
  Filter, 
  Plus,
  Eye,
  Edit,
  MoreVertical,
  Target
} from 'lucide-react';

const DealList = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('pipeline'); // 'pipeline' or 'table'

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/deals`);
      setDeals(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching deals:', error);
      setError('Failed to load deals. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredDeals = deals.filter(deal =>
    deal.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deal.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deal.stage.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deal.product?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedDeals = {
    'Qualified': filteredDeals.filter(deal => deal.stage === 'Qualified'),
    'Proposal': filteredDeals.filter(deal => deal.stage === 'Proposal'),
    'Negotiation': filteredDeals.filter(deal => deal.stage === 'Negotiation'),
    'Closed Won': filteredDeals.filter(deal => deal.stage === 'Closed Won'),
    'Closed Lost': filteredDeals.filter(deal => deal.stage === 'Closed Lost')
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStageColor = (stage) => {
    const colors = {
      'Qualified': 'bg-green-100 text-green-800 border-green-200',
      'Proposal': 'bg-blue-100 text-blue-800 border-blue-200',
      'Negotiation': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Closed Won': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'Closed Lost': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[stage] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const calculateTotalValue = (deals) => {
    return deals.reduce((total, deal) => total + (deal.amount || 0), 0);
  };

  const DealCard = ({ deal }) => (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer mb-3">
      <div className="flex items-center justify-between mb-3">
        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
          {deal.firstName[0]}{deal.lastName[0]}
        </div>
        <div className="flex space-x-1">
          <button className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
            <Eye className="w-4 h-4" />
          </button>
          <button className="p-1 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded">
            <Edit className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="mb-3">
        <h4 className="font-medium text-gray-900 mb-1">
          {deal.firstName} {deal.lastName}
        </h4>
        <p className="text-lg font-bold text-green-600">
          {formatCurrency(deal.amount, deal.currency)}
        </p>
        {deal.product && (
          <p className="text-sm text-gray-600 mt-1">{deal.product}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Close Date:</span>
          <span className="text-gray-900">{formatDate(deal.closeDate)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Probability:</span>
          <span className="text-gray-900">{deal.probability || 50}%</span>
        </div>
        {deal.owner && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Owner:</span>
            <span className="text-gray-900">{deal.owner.name}</span>
          </div>
        )}
      </div>
    </div>
  );

  const PipelineColumn = ({ stage, deals }) => (
    <div className="bg-gray-50 rounded-xl p-4 min-h-96">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">{stage}</h3>
        <div className="flex flex-col items-end">
          <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs mb-1">
            {deals.length} deals
          </span>
          <span className="text-sm font-medium text-green-600">
            {formatCurrency(calculateTotalValue(deals))}
          </span>
        </div>
      </div>
      
      <div className="space-y-3">
        {deals.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No deals in {stage}</p>
          </div>
        ) : (
          deals.map((deal) => (
            <DealCard key={deal._id} deal={deal} />
          ))
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 border-2 border-green-600/30 border-t-green-600 rounded-full animate-spin"></div>
            <span className="text-gray-600">Loading deals...</span>
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
            <Target className="w-5 h-5" />
            <span className="font-medium">Error Loading Deals</span>
          </div>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {filteredDeals.length} Deal{filteredDeals.length !== 1 ? 's' : ''}
          </h2>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <DollarSign className="w-4 h-4" />
            <span>Total Value: {formatCurrency(calculateTotalValue(filteredDeals))}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search deals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Deal</span>
          </button>
        </div>
      </div>

      {/* Pipeline View */}
      {filteredDeals.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No matching deals found' : 'No deals yet'}
          </h3>
          <p className="text-gray-500">
            {searchTerm ? 'Try adjusting your search terms' : 'Deals will appear here when leads are qualified!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {Object.entries(groupedDeals).map(([stage, stageDeals]) => (
            <PipelineColumn key={stage} stage={stage} deals={stageDeals} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DealList;