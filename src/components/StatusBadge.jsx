import React from 'react';

export default function StatusBadge({ status }) {
  const statusConfig = {
    'pending_manager': { text: 'Menunggu Manager', color: 'bg-yellow-100 text-yellow-800' },
    'pending_hrd': { text: 'Menunggu HRD', color: 'bg-orange-100 text-orange-800' },
    'pending_finance': { text: 'Menunggu Finance', color: 'bg-blue-100 text-blue-800' },
    'paid': { text: 'Telah Dibayar', color: 'bg-green-100 text-green-800' },
    'rejected': { text: 'Ditolak', color: 'bg-red-100 text-red-800' },
  };

  const config = statusConfig[status] || { text: status, color: 'bg-gray-100 text-gray-800' };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${config.color}`}>
      {config.text}
    </span>
  );
}