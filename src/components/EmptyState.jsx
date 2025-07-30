// src/components/EmptyState.jsx
import React from 'react';
import { UserPlus } from 'lucide-react';

const EmptyState = ({ searchTerm }) => {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <UserPlus className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {searchTerm ? 'No matching leads found' : 'No leads yet'}
      </h3>
      <p className="text-gray-500">
        {searchTerm ? 'Try adjusting your search terms' : 'Add your first lead to get started!'}
      </p>
    </div>
  );
};

export default EmptyState;