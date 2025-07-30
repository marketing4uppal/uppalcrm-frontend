// src/utils/leadUtils.js
export const getSourceBadgeColor = (source) => {
  const colors = {
    'website': 'bg-blue-100 text-blue-800 border-blue-200',
    'social-media': 'bg-purple-100 text-purple-800 border-purple-200',
    'referral': 'bg-green-100 text-green-800 border-green-200',
    'email-campaign': 'bg-orange-100 text-orange-800 border-orange-200',
    'cold-call': 'bg-red-100 text-red-800 border-red-200',
    'trade-show': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    'other': 'bg-gray-100 text-gray-800 border-gray-200'
  };
  return colors[source] || colors['other'];
};

export const formatSource = (source) => {
  if (!source) return 'Unknown';
  return source.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

export const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getTimeAgo = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now - date;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else {
    return `${diffInDays}d ago`;
  }
};