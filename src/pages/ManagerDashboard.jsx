import React, { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter, 
  Download,
  Eye
} from 'lucide-react';
import { api } from '../lib/api';

export default function ManagerDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchManagerData = async () => {
      try {
        const response = await api.get('/manager/reimbursements');
        setRequests(response.data);
      } catch (error) {
        console.error('Gagal mengambil data manager:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchManagerData();
  }, []);

  return (
    <div className="w-full">
      {/* Header Halaman */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
          <p className="text-gray-500 text-sm mt-1">Overview of all reimbursement requests</p>
        </div>
      </div>

      {/* Kartu Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard 
          number={requests.filter(r => r.status === 'pending').length.toString().padStart(2, '0')} 
          label="Pending Requests" 
          icon={<Clock />} 
        />
        <StatCard 
          number={requests.filter(r => r.status === 'approved').length.toString().padStart(2, '0')} 
          label="Approved Requests" 
          icon={<CheckCircle2 />} 
        />
        <StatCard 
          number={requests.filter(r => r.status === 'rejected').length.toString().padStart(2, '0')} 
          label="Rejected Requests" 
          icon={<XCircle />} 
        />
      </div>

      {/* Tabel Semua Permintaan */}
      <div className="bg-white p-8 rounded-2xl shadow-sm">
        <h3 className="text-xl font-bold text-gray-800 mb-6">All Requests:</h3>

        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4 w-1/2">
            <div className="relative w-2/3">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Employee's name, e-mail or serial" 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#232B3E] text-sm"
              />
            </div>
            <button className="flex items-center px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">
              <Filter size={18} className="mr-2" /> Filter
            </button>
          </div>
          <button className="flex items-center px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">
            <Download size={18} className="mr-2" /> Export
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="py-4 font-bold text-gray-700">Name</th>
                <th className="py-4 font-bold text-gray-700">Invoice ID</th>
                <th className="py-4 font-bold text-gray-700">Categories</th>
                <th className="py-4 font-bold text-gray-700">Status</th>
                <th className="py-4 font-bold text-gray-700">Nominal</th>
                <th className="py-4 font-bold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-8 text-gray-500">Memuat data...</td></tr>
              ) : requests.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-8 text-gray-500">Tidak ada permintaan.</td></tr>
              ) : (
                requests.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="py-4 pr-4">
                      <div className="font-semibold text-gray-800">{item.profiles?.full_name || 'Karyawan'}</div>
                      <div className="text-xs text-gray-500 mt-1">ID: {item.employee_id || '-'}</div>
                    </td>
                    <td className="py-4 text-gray-800 font-medium">REV-{item.id.substring(0, 5).toUpperCase()}</td>
                    <td className="py-4 text-gray-600">{item.purpose}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 text-xs font-bold rounded-md inline-block ${
                        item.status === 'pending' ? 'bg-[#ECC94B] text-gray-900' :
                        item.status === 'approved' ? 'bg-[#38A169] text-white' : 'bg-[#E53E3E] text-white'
                      }`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 text-gray-800 font-semibold">Rp {item.total_amount?.toLocaleString('id-ID')}</td>
                    <td className="py-4">
                      <button className="p-2 bg-orange-50 text-[#F16A28] rounded-full hover:bg-orange-100 transition">
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}