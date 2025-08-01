// src/components/ModernDashboard.jsx (Final Version)
import TopNavigation from './TopNavigation';
import ContactList from './ContactList';
import DealList from './DealList';
import AccountList from './AccountList';
import AccountForm from './AccountForm';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LeadForm from './LeadForm';
import LeadList from './LeadList';
import axios from 'axios';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  Plus,
  Target,
  X
} from 'lucide-react';

const ModernDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddLeadForm, setShowAddLeadForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('table');

  const [dashboardStats, setDashboardStats] = useState([
    { title: 'Total Leads', value: '0', change: '+0%', icon: Users, color: 'bg-gradient-to-br from-blue-500 to-blue-600' },
    { title: 'Active Accounts', value: '0', change: '+0%', icon: TrendingUp, color: 'bg-gradient-to-br from-emerald-500 to-emerald-600' },
    { title: 'Monthly Revenue', value: '$0', change: '+0%', icon: DollarSign, color: 'bg-gradient-to-br from-purple-500 to-purple-600' },
    { title: 'Active Deals', value: '0', change: '+0', icon: Target, color: 'bg-gradient-to-br from-orange-500 to-orange-600' }
  ]);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [leadsRes, accountsRes, dealsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/leads`),
        axios.get(`${import.meta.env.VITE_API_URL}/api/accounts`),
        axios.get(`${import.meta.env.VITE_API_URL}/api/deals`)
      ]);

      const leads = leadsRes.data;
      const accounts = accountsRes.data;
      const deals = dealsRes.data;

      const totalMRR = accounts.reduce((sum, acc) => sum + (acc.currentMonthlyPrice || 0), 0);
      const activeAccounts = accounts.filter(acc => acc.status === 'active').length;

      setDashboardStats([
        { 
          title: 'Total Leads', 
          value: leads.length.toString(), 
          change: `${leads.filter(l => l.leadStage === 'New').length} new`, 
          icon: Users, 
          color: 'bg-gradient-to-br from-blue-500 to-blue-600' 
        },
        { 
          title: 'Active Accounts', 
          value: activeAccounts.toString(), 
          change: `of ${accounts.length} total`, 
          icon: TrendingUp, 
          color: 'bg-gradient-to-br from-emerald-500 to-emerald-600' 
        },
        { 
          title: 'Monthly Revenue', 
          value: `$${totalMRR.toFixed(2)}`, 
          change: `${accounts.length} accounts`, 
          icon: DollarSign, 
          color: 'bg-gradient-to-br from-purple-500 to-purple-600' 
        },
        { 
          title: 'Active Deals', 
          value: deals.length.toString(), 
          change: `${deals.filter(d => d.stage !== 'Closed Won' && d.stage !== 'Closed Lost').length} open`, 
          icon: Target, 
          color: 'bg-gradient-to-br from-orange-500 to-orange-600' 
        }
      ]);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const StatCard = ({ stat, index }) => {
    const Icon = stat.icon;
    return (
      <div 
        className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
            <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
            <div className="flex items-center">
              <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
          </div>
          <div className={`${stat.color} p-4 rounded-xl shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full -mr-16 -mt-16"></div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Top Navigation */}
      <TopNavigation 
        user={user} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        onSearch={handleSearch}
      />
      
      {/* Main Content - Full Width */}
      <div className="min-h-screen">
        {/* Dashboard Content */}
        <main className="px-6 py-2">
          {activeTab === 'dashboard' && (
            <div className="space-y-3">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dashboardStats.map((stat, index) => (
                  <StatCard key={index} stat={stat} index={index} />
                ))}
              </div>

              {/* Dashboard Widgets */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Lead Form Section */}
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Add New Lead</h3>
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Plus className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                  <LeadForm />
                </div>

                {/* Lead List Section */}
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Leads</h3>
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-green-600" />
                    </div>
                  </div>
                  <LeadList />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'leads' && (
            <div className="space-y-6">
              {/* Leads Header with Reorganized Layout */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-4">
                    <h2 className="text-3xl font-bold text-gray-900">Leads</h2>
                    
                    {/* View Toggle Buttons - Only show if not searching */}
                    {!searchTerm && (
                      <div className="flex items-center bg-gray-100 rounded-lg p-1">
                        <button 
                          onClick={() => setViewMode('table')}
                          className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
                            viewMode === 'table'
                              ? 'bg-white text-gray-900 shadow-sm'
                              : 'text-gray-500 hover:text-gray-900'
                          }`}
                        >
                          <span>📋</span>
                          <span>Table</span>
                        </button>
                        <button 
                          onClick={() => setViewMode('board')}
                          className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
                            viewMode === 'board'
                              ? 'bg-white text-gray-900 shadow-sm'
                              : 'text-gray-500 hover:text-gray-900'
                          }`}
                        >
                          <span>📌</span>
                          <span>Board</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Add Lead Button - Moved to Right Side */}
                <button 
                  onClick={() => setShowAddLeadForm(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow-sm"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Lead</span>
                </button>
              </div>

              {/* Lead Form or List */}
              {showAddLeadForm ? (
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 max-w-md mx-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Add New Lead</h3>
                    <button 
                      onClick={() => setShowAddLeadForm(false)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <LeadForm />
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <LeadList 
                    searchTerm={searchTerm} 
                    viewMode={searchTerm ? 'table' : viewMode}
                  />
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'contacts' && (
            <div className="space-y-3">
              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                <ContactList />
              </div>
            </div>
          )}       
          
          {activeTab === 'accounts' && (
            <div className="space-y-8">
              {/* Add Account Form */}
              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Create New Account</h3>
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Plus className="w-4 h-4 text-green-600" />
                  </div>
                </div>
                <AccountForm onAccountCreated={() => window.location.reload()} />
              </div>

              {/* Account List */}
              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                <AccountList />
              </div>
            </div>
          )}
          
          {activeTab === 'deals' && (
            <div className="space-y-3">
              {/* Page Header */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Deal Pipeline</h2>
                <p className="text-gray-600 mt-2">Monitor your sales pipeline and close more deals.</p>
              </div>
              
              <DealList />
            </div>
          )}

          {activeTab === 'calendar' && (
            <div className="space-y-3">
              {/* Page Header */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Calendar & Schedule</h2>
                <p className="text-gray-600 mt-2">Schedule and manage your appointments.</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Calendar & Schedule</h3>
                  <p className="text-gray-600 mb-8">Manage your appointments and meetings...</p>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <p className="text-gray-500">This section will include:</p>
                    <ul className="text-gray-600 mt-2 space-y-1">
                      <li>• Appointment scheduling</li>
                      <li>• Meeting management</li>
                      <li>• Calendar integration</li>
                      <li>• Reminder notifications</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-3">
              {/* Page Header */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Reports & Analytics</h2>
                <p className="text-gray-600 mt-2">Analyze your business performance and metrics.</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">                
                <div className="text-center py-12">
                  <TrendingUp className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Reports & Analytics</h3>
                  <p className="text-gray-600 mb-8">Analyze your business performance...</p>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <p className="text-gray-500">This section will include:</p>
                    <ul className="text-gray-600 mt-2 space-y-1">
                      <li>• Sales performance metrics</li>
                      <li>• Lead conversion analytics</li>
                      <li>• Revenue tracking</li>
                      <li>• Custom report builder</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ModernDashboard;