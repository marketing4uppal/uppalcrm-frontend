// src/components/ErrorMessage.jsx
import React from 'react';
import { Users } from 'lucide-react';

const ErrorMessage = ({ error }) => {
  return (
    <div className="w-full">
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <div className="flex items-center justify-center space-x-2 text-red-600 mb-2">
          <Users className="w-5 h-5" />
          <span className="font-medium">Error Loading Leads</span>
        </div>
        <p className="text-red-700">{error}</p>
      </div>
    </div>
  );
};

export default ErrorMessage;