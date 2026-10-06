import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Settings 
} from 'lucide-react';

export default function AdminLayout() {
  const location = useLocation();
  const currentPath = location.pathname;

  const getMenuClass = (path) => {
    if (currentPath === path) {
      return "flex items-center gap-3 px-6 py-4 text-[#F16A28] bg-[#1d2433] border-l-4 border-[#F16A28] font-semibold transition";
    }
    return "flex items-center gap-3 px-6 py-4 text-gray-300 border-l-4 border-transparent hover:text-[#F16A28] hover:bg-[#1d2433] transition";
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      
      {/* Sidebar Statis Admin */}
      <div className="w-64 bg-[#232B3E] text-white flex-shrink-0">
        <div className="flex flex-col items-center justify-center py-8 border-b border-gray-700/50">
          <h1 className="text-3xl font-bold italic tracking-wider">
            <span className="text-[#F16A28]">CB</span>N
          </h1>
          <span className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Admin Panel</span>
        </div>

        <nav className="flex flex-col mt-6">
          <Link to="/admin/dashboard" className={getMenuClass('/admin/dashboard')}>
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          
          <Link to="/admin/access" className={getMenuClass('/admin/access')}>
            <Users size={20} />
            Employee Access
          </Link>
          
          <Link to="/admin/users" className={getMenuClass('/admin/users')}>
            <Settings size={20} />
            Manage User
          </Link>
        </nav>
      </div>

      {/* Konten Halaman Dinamis di Kanan */}
      <div className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </div>
      
    </div>
  );
}