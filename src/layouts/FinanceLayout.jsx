import React, { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CreditCard, // <-- Pastikan CreditCard diimpor di sini
  CheckCircle, 
  LogOut, 
  Menu, 
  X, 
  Bell 
} from 'lucide-react';

export default function FinanceLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { label: 'Dashboard', path: '/finance/dashboard', icon: <LayoutDashboard size={20} /> },
    { label: 'Kategori', path: '/finance/categories', icon: <CreditCard size={20} /> },
    { label: 'Paid History', path: '/finance/history', icon: <CheckCircle size={20} /> },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-[#F4F7FA] font-sans overflow-hidden">
      
      {/* Overlay Mobile */}
      <div 
        className={`fixed inset-0 z-20 bg-black/50 transition-opacity lg:hidden ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`} 
        onClick={() => setIsSidebarOpen(false)} 
      />
      
      {/* SIDEBAR FINANCE */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-[#232B3E] text-white flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        <div>
          {/* Logo */}
          <div className="flex items-center justify-between h-20 px-8 border-b border-gray-700/50">
            <h1 className="text-2xl font-bold text-white tracking-wide">
              CB<span className="text-[#F16A28]">N</span>
            </h1>
            <button className="lg:hidden text-gray-400 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
              <X size={24} />
            </button>
          </div>

          {/* Menu Navigasi */}
          <nav className="flex-1 px-4 py-8 space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/finance/dashboard' && location.pathname.startsWith(item.path));
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive 
                      ? 'bg-[#F16A28] text-white shadow-md font-semibold' 
                      : 'text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}>
                    {item.icon}
                  </div>
                  <span className="ml-3 font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-700/50">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-gray-400 transition-colors rounded-xl hover:bg-red-500/10 hover:text-red-500 text-xs font-medium"
          >
            <LogOut size={18} />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Header Atas */}
        <header className="h-20 bg-white shadow-xs flex items-center justify-between px-8 z-10 shrink-0">
          <div className="flex items-center">
            <button 
              className="mr-4 text-gray-500 hover:text-gray-700 lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-bold text-gray-800 hidden sm:block">Finance Portal</h2>
          </div>

          <div className="flex items-center space-x-6">
            <button className="relative p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="h-8 w-px bg-gray-200"></div>
            
            <div className="flex items-center">
              <span className="mr-3 text-sm font-medium text-gray-700 hidden sm:block">Finance Admin</span>
              <div className="w-9 h-9 rounded-full bg-[#E9EEF5] border border-gray-200 flex items-center justify-center text-[#232B3E] font-bold text-xs">
                FA
              </div>
            </div>
          </div>
        </header>

        {/* Area Render Halaman Anak */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>

      </main>
    </div>
  );
}