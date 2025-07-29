// src/components/ModernDashboard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LeadForm from './LeadForm';
import LeadList from './LeadList';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Phone,
  Mail,
  Bell,
  Settings,
  LogOut,
  Target,
  Activity,
  Zap,
  ChevronDown,
  X
} from 'lucide-react';

const ModernDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications] = useState(3);
const [showAddLeadForm, setShowAddLeadForm] = useState(false);

  // Sample stats - you'll replace these with real data from your API
  const stats = [
    { title: 'Total Leads', value: '2,847', change: '+12%', icon: Users, color: 'bg-gradient-to-br from-blue-500 to-blue-600' },
    { title: 'Conversion Rate', value: '18.2%', change: '+3.1%', icon: TrendingUp, color: 'bg-gradient-to-br from-emerald-500 to-emerald-600' },
    { title: 'Revenue', value: '$127,430', change: '+8.7%', icon: DollarSign, color: 'bg-gradient-to-br from-purple-500 to-purple-600' },
    { title: 'Active Deals', value: '45', change: '+5', icon: Target, color: 'bg-gradient-to-br from-orange-500 to-orange-600' }
  ];

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
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white/80 backdrop-blur-xl shadow-2xl border-r border-gray-200/50 z-40">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                UppalCRM
              </h1>
              <p className="text-xs text-gray-500">Business Edition</p>
            </div>
          </div>
          
          <nav className="space-y-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Activity },
              { id: 'leads', label: 'Leads', icon: Users },
              { id: 'deals', label: 'Deals', icon: Target },
              { id: 'calendar', label: 'Calendar', icon: Calendar },
              { id: 'reports', label: 'Reports', icon: TrendingUp }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
        
        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user ? user.name?.split(' ').map(n => n[0]).join('') || 'U' : 'U'}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500">{user?.role || 'User'}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="flex-1 flex items-center justify-center space-x-1 py-2 px-3 bg-white rounded-lg text-gray-600 hover:text-gray-900 transition-colors">
                <Settings className="w-4 h-4" />
              </button>
              <button className="flex-1 flex items-center justify-center space-x-1 py-2 px-3 bg-white rounded-lg text-gray-600 hover:text-gray-900 transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 min-h-screen">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-200/50 sticky top-0 z-30">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {activeTab === 'dashboard' ? 'Dashboard Overview' : 
                   activeTab === 'leads' ? 'Lead Management' :
                   activeTab === 'deals' ? 'Deal Pipeline' :
                   activeTab === 'calendar' ? 'Calendar & Schedule' :
                   activeTab === 'reports' ? 'Reports & Analytics' : 'Dashboard'}
                </h2>
                <p className="text-gray-600 mt-1">
                  {activeTab === 'dashboard' ? "Welcome back! Here's what's happening with your business." :
                   activeTab === 'leads' ? 'Manage and track all your leads in one place.' :
                   activeTab === 'deals' ? 'Monitor your sales pipeline and close more deals.' :
                   activeTab === 'calendar' ? 'Schedule and manage your appointments.' :
                   activeTab === 'reports' ? 'Analyze your business performance and metrics.' : 'Welcome back!'}
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search leads, deals..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-80 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                
                {/* Show Admin Panel link only if user is an admin */}
                {user && user.role === 'admin' && (
                  <Link 
                    to="/admin"
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Admin Panel</span>
                  </Link>
                )}
                
                <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors">
                  <Bell className="w-5 h-5" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                      {notifications}
                    </span>
                  )}
                </button>
                
                <button 
  onClick={() => {
    setActiveTab('leads');
    setShowAddLeadForm(true);
  }}
  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
>
  <Plus className="w-4 h-4" />
  <span>Add Lead</span>
</button>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content - NOW WITH REAL COMPONENTS */}
        <main className="p-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Stats Grid - Only show on dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <StatCard key={index} stat={stat} index={index} />
                ))}
              </div>

              {/* Your existing components with modern styling */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Lead Form Section */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Add New Lead</h3>
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Plus className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                  <LeadForm />
                </div>

                {/* Lead List Section */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
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
    {showAddLeadForm ? (
      // Show Add Lead Form
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
      // Show All Leads List
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">All Leads</h3>
          <button 
            onClick={() => setShowAddLeadForm(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lead</span>
          </button>
        </div>
        <LeadList />
      </div>
    )}
  </div>
)}
          {activeTab === 'deals' && (
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="text-center py-12">
                <Target className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Deal Pipeline</h3>
                <p className="text-gray-600 mb-8">Track your deals through the sales pipeline...</p>
                <div className="bg-gray-50 rounded-xl p-6">
                  <p className="text-gray-500">This section will include:</p>
                  <ul className="text-gray-600 mt-2 space-y-1">
                    <li>• Visual pipeline management</li>
                    <li>• Deal stage tracking</li>
                    <li>• Revenue forecasting</li>
                    <li>• Win/loss analysis</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'calendar' && (
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
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
          )}

          {activeTab === 'reports' && (
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
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
          )}
        </main>
      </div>
    </div>
  );
};

export default ModernDashboard;