import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  BarChart3 
} from 'lucide-react';

export default function ManagerLayout() {
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
      
      {/* Sidebar Statis di Kiri */}
      <div className="w-64 bg-[#232B3E] text-white flex-shrink-0">
        <div className="flex flex-col items-center justify-center py-8 border-b border-gray-700/50">
          <h1 className="text-3xl font-bold italic tracking-wider">
            <span className="text-[#F16A28]">CB</span>N
          </h1>
          <span className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Manager Panel</span>
        </div>

        <nav className="flex flex-col mt-6">
          <Link to="/manager/dashboard" className={getMenuClass('/manager/dashboard')}>
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          
          <Link to="/manager/pending" className={getMenuClass('/manager/pending')}>
            <Clock size={20} />
            Pending Request
          </Link>
          
          <Link to="/manager/approved" className={getMenuClass('/manager/approved')}>
            <CheckCircle2 size={20} />
            Approved
          </Link>
          
          <Link to="/manager/rejected" className={getMenuClass('/manager/rejected')}>
            <XCircle size={20} />
            Rejected
          </Link>

          {/* Menu yang sebelumnya hilang sekarang ditambahkan kembali */}
          <Link to="/manager/add" className={getMenuClass('/manager/add')}>
            <FileText size={20} />
            Add Invoice
          </Link>

          <Link to="/manager/reports" className={getMenuClass('/manager/reports')}>
            <BarChart3 size={20} />
            Reports/Invoices
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