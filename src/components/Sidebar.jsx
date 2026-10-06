import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutGrid, 
  PlusCircle, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Tags, 
  Users, 
  ShieldCheck, 
  LogOut,
  BarChart3
} from 'lucide-react';

export default function Sidebar({ role }) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  // Konfigurasi Menu Berdasarkan Role
  const roleMenus = {
    employee: [
      { label: 'Dashboard', path: '/employee/dashboard', icon: <LayoutGrid size={20} /> },
      { label: 'Add Reimburse', path: '/employee/add', icon: <PlusCircle size={20} /> },
      { label: 'History', path: '/employee/history', icon: <FileText size={20} /> },
    ],
    manager: [
      { label: 'Dashboard', path: '/manager/dashboard', icon: <LayoutGrid size={20} /> },
      { label: 'Pending Request', path: '/manager/pending', icon: <Clock size={20} /> },
      { label: 'Approved', path: '/manager/approved', icon: <CheckCircle size={20} /> },
      { label: 'Rejected', path: '/manager/rejected', icon: <XCircle size={20} /> },
      { label: 'Add Invoice', path: '/manager/add', icon: <PlusCircle size={20} /> },
      { label: 'Reports', path: '/manager/reports', icon: <BarChart3 size={20} /> },
    ],
    finance: [
      { label: 'Dashboard', path: '/finance/dashboard', icon: <LayoutGrid size={20} /> },
      { label: 'Categories', path: '/finance/categories', icon: <Tags size={20} /> },
      { label: 'History', path: '/finance/history', icon: <FileText size={20} /> },
    ],
    admin: [
      { label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutGrid size={20} /> },
      { label: 'Employee Access', path: '/admin/access', icon: <ShieldCheck size={20} /> },
      { label: 'Manage User', path: '/admin/users', icon: <Users size={20} /> },
    ]
  };

  // Otomatis mendeteksi role dari URL jika prop 'role' tidak dikirim
  const activeRole = role || (
    currentPath.startsWith('/manager') ? 'manager' :
    currentPath.startsWith('/finance') ? 'finance' :
    currentPath.startsWith('/admin') ? 'admin' : 'employee'
  );

  const menuItems = roleMenus[activeRole] || roleMenus.employee;

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <aside className="w-64 min-h-screen bg-[#212B3D] text-white flex flex-col justify-between font-serif select-none border-r border-slate-800/40 shrink-0">
      <div>
        {/* LOGO GEOMETRIS */}
        <div className="flex justify-center items-center py-8 px-6">
          <svg width="70" height="55" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 48 L48 12 L30 68 Z" fill="#FF6B00" />
            <path d="M28 68 L50 20 L40 68 Z" fill="#FF5500" />
            <path d="M36 14 L72 74 L52 74 L22 14 Z" fill="#181F2C" />
            <path d="M54 12 L90 12 L66 68 Z" fill="#A81335" />
          </svg>
        </div>

        {/* LIST MENU */}
        <nav className="flex flex-col mt-2 space-y-1">
          {menuItems.map((item) => {
            const isActive = currentPath === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center gap-4 px-8 py-3.5 text-sm transition-colors ${
                  isActive
                    ? 'text-[#F5A623] font-semibold bg-[#1a2231]'
                    : 'text-[#9A7D66] hover:text-[#F5A623] hover:bg-[#1a2231]/50'
                }`}
              >
                {/* Indikator Garis Oranye Kiri */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 bg-[#F5A623] rounded-r"></span>
                )}

                <span className={isActive ? 'text-[#F5A623]' : 'text-[#9A7D66]'}>
                  {item.icon}
                </span>

                <span className="tracking-wide">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* TOMBOL LOGOUT */}
      <div className="p-4 border-t border-slate-800/50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition font-sans"
        >
          <LogOut size={16} />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
}