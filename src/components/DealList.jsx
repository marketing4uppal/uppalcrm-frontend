// src/components/DealList.jsx (Fixed with Dynamic Stages and Delete)
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
  Target,
  Trash2 // NEW IMPORT
} from 'lucide-react';
import DeleteDealModal from './DeleteDealModal'; // NEW IMPORT

const DealList = () => {
  const [deals, setDeals] = useState([]);
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('pipeline');
  
  // NEW: Delete functionality states
  const [deletingDeal, setDeletingDeal] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    Promise.all([fetchDeals(), fetchStages()]);
  }, []);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/deals`);
      console.log('Fetched deals:', response.data); // Debug log
      setDeals(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching deals:', error);
      setError('Failed to load deals. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStages = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/deals/stages/list`);
      console.log('Fetched stages:', response.data); // Debug log
      setStages(response.data);
    } catch (error) {
      console.error('Error fetching stages:', error);
      // Fallback to default stages if API fails
      setStages([
        { name: 'Prospecting', color: '#6B7280' },
        { name: 'Discovery', color: '#3B82F6' },
        { name: 'Proposal', color: '#8B5CF6' },
        { name: 'Negotiation', color: '#F59E0B' },
        { name: 'Closed Won', color: '#10B981' },
        { name: 'Closed Lost', color: '#EF4444' }
      ]);
    }
  };

  // NEW: Delete functionality handlers
  const handleDeleteDeal = (deal) => {
    setDeletingDeal(deal);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = (dealId) => {
    setDeals(prevDeals => prevDeals.filter(deal => deal._id !== dealId));
    console.log('Deal deleted successfully');
  };

  const filteredDeals = deals.filter(deal => {
    const searchLower = searchTerm.toLowerCase();
    return (
      deal.firstName?.toLowerCase().includes(searchLower) ||
      deal.lastName?.toLowerCase().includes(searchLower) ||
      deal.dealName?.toLowerCase().includes(searchLower) ||
      deal.stage?.toLowerCase().includes(searchLower) ||
      deal.product?.toLowerCase().includes(searchLower) ||
      deal.email?.toLowerCase().includes(searchLower)
    );
  });

  // Group deals by stage dynamically
  const groupedDeals = {};
  
  // Initialize all stages with empty arrays
  stages.forEach(stage => {
    groupedDeals[stage.name] = [];
  });
  
  // Add deals to their respective stages
  filteredDeals.forEach(deal => {
    if (deal.stage && groupedDeals[deal.stage]) {
      groupedDeals[deal.stage].push(deal);
    } else {
      // Handle deals with unknown stages
      if (!groupedDeals['Other']) {
        groupedDeals['Other'] = [];
      }
      groupedDeals['Other'].push(deal);
    }
  });

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

  const getStageColor = (stageName) => {
    const stage = stages.find(s => s.name === stageName);
    return stage?.color || '#6B7280';
  };

  const PipelineColumn = ({ stage, deals }) => (
    <div className="bg-gray-50 rounded-xl p-4 min-h-[300px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">{stage}</h3>
        <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
          {deals.length}
        </span>
      </div>
      <div className="space-y-3">
        {deals.map((deal) => (
          <DealCard key={deal._id} deal={deal} onDelete={handleDeleteDeal} />
        ))}
        {deals.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm">
            No deals in this stage
          </div>
        )}
      </div>
    </div>
  );

  const DealCard = ({ deal, onDelete }) => (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 text-sm truncate">
            {deal.dealName || `${deal.firstName} ${deal.lastName}`}
          </h4>
          <p className="text-xs text-gray-500 mt-1 truncate">
            {deal.firstName} {deal.lastName}
          </p>
          {deal.email && (
            <p className="text-xs text-gray-400 truncate">{deal.email}</p>
          )}
        </div>
        <div className="flex space-x-1 ml-2">
          <button
            className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="View Details"
          >
            <Eye className="w-3 h-3" />
          </button>
          <button
            className="p-1 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
            title="Edit Deal"
          >
            <Edit className="w-3 h-3" />
          </button>
          {/* NEW: Delete Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(deal);
            }}
            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete Deal"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-900">
            {formatCurrency(deal.amount)}
          </span>
          {deal.probability && (
            <span className="text-xs text-gray-500">
              {deal.probability}%
            </span>
          )}
        </div>
        
        <div className="flex items-center text-xs text-gray-500">
          <Calendar className="w-3 h-3 mr-1" />
          Close: {formatDate(deal.closeDate)}
        </div>
        
        {deal.product && (
          <div className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded truncate">
            {deal.product}
          </div>
        )}
      </div>
    </div>
  );

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
          onClick={fetchDeals}
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
            <h1 className="text-2xl font-bold text-gray-900">Deals</h1>
            <p className="text-gray-600">Track your sales opportunities</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search deals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Deal</span>
            </button>
          </div>
        </div>

        {/* Pipeline Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Deals</p>
                <p className="text-xl font-semibold text-gray-900">{deals.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-xl font-semibold text-gray-900">
                  {formatCurrency(deals.reduce((sum, deal) => sum + (deal.amount || 0), 0))}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Won Deals</p>
                <p className="text-xl font-semibold text-gray-900">
                  {deals.filter(deal => deal.stage === 'Closed Won').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Win Rate</p>
                <p className="text-xl font-semibold text-gray-900">
                  {deals.length > 0 ? Math.round((deals.filter(deal => deal.stage === 'Closed Won').length / deals.length) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Debug Info (remove this in production) */}
        {deals.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <strong>Debug:</strong> Found {deals.length} deals. Stages: {deals.map(d => d.stage).join(', ')}
            </p>
          </div>
        )}

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 overflow-x-auto">
            {Object.entries(groupedDeals).map(([stage, stageDeals]) => {
              // Only show columns that have deals or are defined stages
              if (stageDeals.length === 0 && stage === 'Other') return null;
              return (
                <PipelineColumn key={stage} stage={stage} deals={stageDeals} />
              );
            })}
          </div>
        )}
      </div>

      {/* NEW: Delete Confirmation Modal */}
      <DeleteDealModal
        deal={deletingDeal}
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingDeal(null);
        }}
        onDelete={handleDeleteConfirm}
      />
    </>
  );
};

export default DealList;