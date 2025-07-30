// src/components/ContactList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditContact from './EditContact';
import { 
  Users, 
  Mail, 
  Phone, 
  Search, 
  Filter, 
  MoreVertical, 
  UserPlus,
  Building,
  Link as LinkIcon,
  Edit,
  Eye
} from 'lucide-react';

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [editingContact, setEditingContact] = useState(null);
  const [showEditContact, setShowEditContact] = useState(false);

  useEffect(() => {
    const fetchContacts = async () => {
      const backendUrl = `${import.meta.env.VITE_API_URL}/api/contacts`;
      try {
        setLoading(true);
        const res = await axios.get(backendUrl);
        setContacts(res.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching contacts:', error);
        setError('Failed to load contacts. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  // Filter contacts based on search term
  const filteredContacts = contacts.filter(contact =>
    contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (contact.phone && contact.phone.includes(searchTerm))
  );

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setShowEditContact(true);
  };

  const handleCloseEdit = () => {
    setShowEditContact(false);
    setEditingContact(null);
  };

  const handleContactUpdate = (updatedContact) => {
    // Update the contact in the local state
    setContacts(prevContacts => 
      prevContacts.map(contact => 
        contact._id === updatedContact._id ? updatedContact : contact
      )
    );
  };

  if (loading) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
            <span className="text-gray-600">Loading contacts...</span>
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
            <Users className="w-5 h-5" />
            <span className="font-medium">Error Loading Contacts</span>
          </div>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header with Search */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {filteredContacts.length} Contact{filteredContacts.length !== 1 ? 's' : ''}
          </h2>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-lg bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Contacts List */}
      {filteredContacts.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No matching contacts found' : 'No contacts yet'}
          </h3>
          <p className="text-gray-500">
            {searchTerm ? 'Try adjusting your search terms' : 'Contacts will appear here when you create leads!'}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden bg-white rounded-xl border border-gray-200">
          {/* Table Header */}
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
            <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="col-span-3">Contact</div>
              <div className="col-span-3">Email</div>
              <div className="col-span-2">Phone</div>
              <div className="col-span-2">Source</div>
              <div className="col-span-2">Actions</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {filteredContacts.map((contact) => (
              <div key={contact._id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* Contact Info */}
                  <div className="col-span-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {contact.firstName[0]}{contact.lastName[0]}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {contact.firstName} {contact.lastName}
                        </h4>
                        {contact.leadId && (
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <LinkIcon className="w-3 h-3" />
                            <span>From Lead</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="col-span-3">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{contact.email}</span>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="col-span-2">
                    {contact.phone ? (
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{contact.phone}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </div>

                  {/* Source */}
                  <div className="col-span-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                      Lead Generated
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="col-span-2">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleEditContact(contact)}
                        className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Edit Contact"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Call"
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Email"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        title="More Options"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 border-t border-gray-200 px-6 py-3">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Showing 1-{filteredContacts.length} of {filteredContacts.length}</span>
              <span>{filteredContacts.length} contact{filteredContacts.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      )}

      {/* Edit Contact Modal */}
      {showEditContact && editingContact && (
        <EditContact 
          contact={editingContact}
          onClose={handleCloseEdit}
          onUpdate={handleContactUpdate}
        />
      )}
    </div>
  );
};

export default ContactList;