// components/TopNavigation.jsx (Final Version)
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap,
  Activity, 
  Users, 
  Phone, 
  DollarSign,
  Target,
  Calendar,
  TrendingUp,
  Search,
  Bell,
  Settings,
  LogOut,
  ChevronDown
} from 'lucide-react';

const TopNavigation = ({ user, activeTab, setActiveTab, onSearch }) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [notifications] = useState(3);
  const [searchTerm, setSearchTerm] = useState('');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'contacts', label: 'Contacts', icon: Phone },
    { id: 'accounts', label: 'Accounts', icon: DollarSign },
    { id: 'deals', label: 'Deals', icon: Target },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'reports', label: 'Reports', icon: TrendingUp }
  ];

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      {/* Main Navigation Bar */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left Side - Logo + Navigation + Search */}
          <div className="flex items-center space-x-8 flex-1">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  UppalCRM
                </h1>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === item.id
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Search - Moved to Navigation Area */}
            <div className="hidden lg:block flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search CRM..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* Right Side - Notifications and User */}
          <div className="flex items-center space-x-4">
            
            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                  {notifications}
                </span>
              )}
            </button>

            {/* Admin Panel (if admin) */}
            {user?.role === 'admin' && (
              <Link 
                to="/admin"
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                title="Admin Panel"
              >
                <Settings className="w-5 h-5" />
              </Link>
            )}

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user ? user.firstName?.[0] || user.name?.[0] || 'U' : 'U'}
                  </span>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.firstName ? `${user.firstName} ${user.lastName}` : user?.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role || 'User'}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {/* User Dropdown Menu */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.firstName ? `${user.firstName} ${user.lastName}` : user?.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                    <Settings className="w-4 h-4" />
                    <span>Account Settings</span>
                  </button>
                  
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                    <Bell className="w-4 h-4" />
                    <span>Notifications</span>
                  </button>
                  
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <button 
                      onClick={() => {
                        localStorage.removeItem('token');
                        window.location.reload();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200 bg-gray-50">
        {/* Mobile Search */}
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search CRM..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        {/* Mobile Nav Items */}
        <div className="px-4 py-2">
          <div className="flex space-x-1 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-xs font-medium whitespace-nowrap ${
                    activeTab === item.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Close dropdown when clicking outside */}
      {showUserDropdown && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setShowUserDropdown(false)}
        />
      )}
    </header>
  );
};

export default TopNavigation;