import React from 'react';
import { useAuth } from '../lib/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const { userProfile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm">
      <div className="font-semibold text-gray-700">
        Divisi: {userProfile?.department || 'Memuat...'}
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-bold">{userProfile?.full_name}</p>
          <p className="text-xs text-gray-500 uppercase">{userProfile?.role}</p>
        </div>
        <button 
          onClick={handleLogout}
          className="bg-red-50 text-red-600 px-3 py-1 rounded text-sm hover:bg-red-100 font-medium"
        >
          Keluar
        </button>
      </div>
    </header>
  );
}