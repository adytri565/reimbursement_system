import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

export default function DashboardLayout({ children, title, roleName, menuItems }) {
  const { userProfile, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="flex h-screen bg-brand-bg font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-navy text-gray-300 flex flex-col rounded-r-3xl shadow-xl z-10">
        <div className="p-6 flex items-center justify-center">
          {/* Ganti dengan Logo Anda */}
          <div className="text-4xl font-bold text-white tracking-widest italic">
            <span className="text-brand-orange">L</span>G
          </div>
        </div>

        <nav className="flex-1 mt-6">
          {menuItems.map((item, index) => {
            const isActive = location.pathname.includes(item.path);
            return (
              <Link 
                key={index} 
                to={item.path}
                className={`flex items-center px-6 py-4 mt-2 transition-colors ${
                  isActive 
                    ? 'border-l-4 border-brand-orange text-brand-orange bg-white/5' 
                    : 'hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        
        <button onClick={logout} className="p-6 text-left hover:text-brand-orange transition">
           Keluar
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="flex justify-between items-center px-10 py-6 bg-transparent">
          <div className="text-xl">
            <span className="text-gray-500">{roleName}</span> 
            <span className="mx-2"></span> 
            <span className="font-bold text-gray-800">{title}</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex space-x-3">
              <button className="bg-brand-card text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-opacity-90">
                <span>+</span> Invoice
              </button>
              <button className="bg-brand-card text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-opacity-90">
                Report
              </button>
            </div>
            
            <div className="flex items-center gap-3 border-l border-gray-300 pl-6">
              <span className="text-gray-700 font-medium">{userProfile?.full_name || 'User'}</span>
              <div className="w-10 h-10 bg-black rounded-full text-white flex items-center justify-center font-bold">
                {userProfile?.full_name?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-auto px-10 pb-10">
          {children}
        </div>
      </main>
    </div>
  );
}