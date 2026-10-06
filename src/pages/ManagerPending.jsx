import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Eye,
  Check,
  X
} from 'lucide-react';
import { api } from '../lib/api';

export default function ManagerPending() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingData = async () => {
      try {
        // Memanggil endpoint khusus pending yang ada di manager.py
        const response = await api.get('/manager/reimbursements/pending');
        setRequests(response.data);
      } catch (error) {
        console.error('Gagal mengambil data pending request:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPendingData();
  }, []);

  return (
    <div className="w-full">
      {/* Header Halaman */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Pending Request</h2>
          <p className="text-gray-500 text-sm mt-1">Review and manage reimbursements waiting for your approval</p>
        </div>
      </div>

      {/* Tabel Permintaan Pending */}
      <div className="bg-white p-8 rounded-2xl shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4 w-1/2">
            <div className="relative w-2/3">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by name or ID" 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#232B3E] text-sm"
              />
            </div>
            <button className="flex items-center px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">
              <Filter size={18} className="mr-2" /> Filter
            </button>
          </div>
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
                <th className="py-4 font-bold text-gray-700 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-8 text-gray-500">Memuat data pending...</td></tr>
              ) : requests.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-8 text-gray-500">Hore! Tidak ada pengajuan yang perlu di-review.</td></tr>
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
                      <span className="bg-[#ECC94B] text-gray-900 px-3 py-1 text-xs font-bold rounded-md inline-block">
                        Pending
                      </span>
                    </td>
                    <td className="py-4 text-gray-800 font-semibold">Rp {item.total_amount?.toLocaleString('id-ID')}</td>
                    <td className="py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button 
                          title="Lihat Detail"
                          className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          title="Setujui"
                          className="p-2 bg-green-50 text-green-600 rounded-full hover:bg-green-100 transition"
                        >
                          <Check size={16} />
                        </button>
                        <button 
                          title="Tolak"
                          className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition"
                        >
                          <X size={16} />
                        </button>
                      </div>
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