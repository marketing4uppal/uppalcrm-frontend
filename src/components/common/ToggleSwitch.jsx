// src/components/common/ToggleSwitch.jsx
import React from 'react';

const ToggleSwitch = ({ isActive, onChange }) => (
  <button 
    onClick={onChange}
    className={`relative w-12 h-6 rounded-full transition-colors ${
      isActive ? 'bg-green-500' : 'bg-gray-300'
    }`}
  >
    <div className={`absolute w-5 h-5 bg-white rounded-full shadow-md transition-transform top-0.5 ${
      isActive ? 'translate-x-6' : 'translate-x-0.5'
    }`}></div>
  </button>
);

export default ToggleSwitch;