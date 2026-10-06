import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  Download,
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileEdit
} from 'lucide-react';
// Hapus import DashboardLayout, kita gunakan MainLayout dari router
// Pastikan path api benar, jika belum ada backend matikan saja dulu useEffect-nya
// import { api } from '../lib/api'; 

export default function EmployeeDashboard() {
  const [reimbursements, setReimbursements] = useState([]);
  const [loading, setLoading] = useState(false); // Ubah ke false sementara jika belum ada backend


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/reimbursements/me');
        setReimbursements(response.data);
      } catch (error) {
        console.error('Gagal mengambil data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-[#FFC107] text-white', 
      approved: 'bg-[#28A745] text-white', 
      rejected: 'bg-[#DC3545] text-white', 
      draft: 'bg-[#6C757D] text-white'     
    };
    
    const style = styles[status?.toLowerCase()] || styles.draft;
    const label = status === 'pending' ? 'Submitted' : 
                  status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Draft';

    return (
      <span className={`px-4 py-1 text-xs font-semibold rounded-md ${style}`}>
        {label}
      </span>
    );
  };

  return (
    // Kita ganti DashboardLayout dengan div biasa, karena sidebar sudah di-handle oleh MainLayout
    <div className="w-full">
      
      {/* HEADER HALAMAN */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Employee Dashboard</h1>
        <p className="text-gray-500">Welcome back, manage your reimbursements here.</p>
      </div>

      {/* Banner Total Reimbursement */}
      <div className="bg-[#232B3E] rounded-2xl p-8 mb-8 flex justify-between items-center text-white relative overflow-hidden shadow-lg">
        <div className="z-10">
          <h2 className="text-3xl font-bold italic tracking-wide">Total Reimbursement:</h2>
        </div>
        <div className="z-10 flex items-baseline">
          <span className="text-3xl font-bold text-gray-400 mr-2">Rp</span>
          <span className="text-6xl font-bold text-[#F16A28]">0</span> 
        </div>
      </div>

      {/* Grid Statistik (Tanpa import StatCard eksternal agar aman dari error) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Submitted', count: '00', icon: <AlertCircle className="text-yellow-500"/> },
          { label: 'Approved', count: '00', icon: <CheckCircle2 className="text-green-500"/> },
          { label: 'Rejected', count: '00', icon: <XCircle className="text-red-500"/> },
          { label: 'Draft', count: '00', icon: <FileEdit className="text-gray-500"/> },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm flex items-center space-x-4 border border-gray-100">
            <div className="p-3 bg-gray-50 rounded-xl">
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <h4 className="text-2xl font-bold text-gray-800">{stat.count}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Bagian Tabel (My Requests) */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">My Requests:</h3>
          <button className="text-gray-500 flex items-center hover:text-[#F16A28] transition-colors">
            <PlusCircle size={18} className="mr-2" /> Add Invoice
          </button>
        </div>

        {/* Toolbar Pencarian & Filter */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4 w-1/2">
            <div className="relative w-2/3">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#232B3E]"
              />
            </div>
            <button className="flex items-center px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
              <Filter size={18} className="mr-2" /> Filter
            </button>
          </div>
          <button className="flex items-center px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
            <Download size={18} className="mr-2" /> Export
          </button>
        </div>

        {/* Tabel Data */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="py-4 font-bold text-gray-700">No</th>
                <th className="py-4 font-bold text-gray-700">Id</th>
                <th className="py-4 font-bold text-gray-700">Tanggal</th>
                <th className="py-4 font-bold text-gray-700">Categories</th>
                <th className="py-4 font-bold text-gray-700">Amount</th>
                <th className="py-4 font-bold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">Memuat data...</td>
                </tr>
              ) : reimbursements.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">Belum ada pengajuan.</td>
                </tr>
              ) : (
                reimbursements.map((item, index) => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                    <td className="py-4 text-gray-600">{index + 1}</td>
                    {/* PERBAIKAN FATAL ERROR: Pakai String(item.id) agar tidak crash jika ID berupa angka */}
                    <td className="py-4 text-gray-800 font-medium">
                      REV-{String(item.id).substring(0, 3).toUpperCase()}
                    </td>
                    <td className="py-4 text-gray-600">
                      {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </td>
                    <td className="py-4 text-gray-600">{item.purpose}</td>
                    <td className="py-4 text-gray-800 font-medium">
                      Rp {item.total_amount?.toLocaleString('id-ID')}
                    </td>
                    <td className="py-4">
                      {getStatusBadge(item.status)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Dummy */}
        <div className="flex justify-center items-center mt-8 space-x-4 text-gray-500">
          <button className="hover:text-[#F16A28]">«</button>
          <button className="hover:text-[#F16A28]">‹</button>
          <span className="font-bold text-gray-800">01</span>
          <button className="hover:text-[#F16A28]">›</button>
          <button className="hover:text-[#F16A28]">»</button>
        </div>
      </div>
    </div>
  );
}