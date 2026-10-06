import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Plus 
} from 'lucide-react';

// Import API dengan pengecekan aman
import { api } from '../lib/api';

export default function EmployeeDashboard() {
  const navigate = useNavigate();

  // State Data Real API
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State Toolbar & Paginasi
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchReimbursements();
  }, []);

  const fetchReimbursements = async () => {
    try {
      setLoading(true);
      setError('');

      if (!api || typeof api.get !== 'function') {
        throw new Error('Instans API belum dikonfigurasi dengan benar di lib/api.js');
      }

      const response = await api.get('/reimbursements');
      
      // Penanganan aman untuk struktur response
      const rawData = response?.data?.data || response?.data || response || [];
      const dataArray = Array.isArray(rawData) ? rawData : [];
      
      setRequests(dataArray);
   } catch (err) {
      console.warn('Gagal memuat data dari API backend:', err);
      setError('Koneksi ke server gagal atau API offline. Menampilkan data kosong.');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  // Kalkulasi Ringkasan Data Real (Safe Check)
  const calculateStats = () => {
    let totalAmount = 0;
    let submitted = 0;
    let approved = 0;
    let rejected = 0;
    let draft = 0;

    if (Array.isArray(requests)) {
      requests.forEach((req) => {
        if (!req) return;
        const status = String(req.status || '').toLowerCase();
        const amount = Number(req.total_amount || req.amount || 0);

        if (status === 'submitted' || status === 'pending') {
          submitted += 1;
          totalAmount += amount;
        } else if (status === 'approved' || status === 'paid') {
          approved += 1;
          totalAmount += amount;
        } else if (status === 'rejected') {
          rejected += 1;
        } else if (status === 'draft') {
          draft += 1;
        }
      });
    }

    return {
      totalAmount,
      submitted: String(submitted).padStart(2, '0'),
      approved: String(approved).padStart(2, '0'),
      rejected: String(rejected).padStart(2, '0'),
      draft: String(draft).padStart(2, '0'),
    };
  };

  const stats = calculateStats();

  // Filter Data Berdasarkan Search Input (Safe Check)
  const filteredRequests = (Array.isArray(requests) ? requests : []).filter((item) => {
    if (!item) return false;
    const query = searchQuery.toLowerCase();
    const reqId = String(item.id || item.request_id || '').toLowerCase();
    const category = String(item.category || '').toLowerCase();
    const purpose = String(item.purpose || '').toLowerCase();

    return reqId.includes(query) || category.includes(query) || purpose.includes(query);
  });

  // Paginasi Data
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage) || 1;
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return String(dateString);
    }
  };

  const getStatusBadge = (status) => {
    const s = String(status || '').toLowerCase();
    switch (s) {
      case 'submitted':
      case 'pending':
        return 'bg-[#F5A623] text-white';
      case 'approved':
      case 'paid':
        return 'bg-[#3B9A62] text-white';
      case 'rejected':
        return 'bg-[#E54D42] text-white';
      case 'draft':
        return 'bg-[#4B6575] text-white';
      default:
        return 'bg-gray-300 text-gray-700';
    }
  };

  return (
    <div className="space-y-6 font-sans text-gray-800 pb-12">
      
      {/* Header Judul */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Employee Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Welcome back, manage your reimbursements here.
        </p>
      </div>

      {/* Banner Total Reimbursement Dark Navy */}
      <div className="bg-[#1E2538] text-white p-7 rounded-2xl shadow-sm flex justify-between items-center">
        <h2 className="text-2xl sm:text-3xl font-serif italic font-bold tracking-wide">
          Total Reimbursement:
        </h2>
        <div className="text-3xl sm:text-4xl font-bold font-sans">
          <span className="text-slate-400 text-xl sm:text-2xl font-medium mr-2">Rp</span>
          {stats.totalAmount.toLocaleString('id-ID')}
        </div>
      </div>

      {/* 4 Kartu Status Identik UI Admin */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Submitted */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 border border-amber-100 shrink-0">
            <AlertCircle size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Submitted</p>
            <h3 className="text-2xl font-bold text-slate-900">{stats.submitted}</h3>
          </div>
        </div>

        {/* Approved */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 border border-emerald-100 shrink-0">
            <CheckCircle size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Approved</p>
            <h3 className="text-2xl font-bold text-slate-900">{stats.approved}</h3>
          </div>
        </div>

        {/* Rejected */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 border border-rose-100 shrink-0">
            <XCircle size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Rejected</p>
            <h3 className="text-2xl font-bold text-slate-900">{stats.rejected}</h3>
          </div>
        </div>

        {/* Draft */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 border border-slate-200 shrink-0">
            <FileText size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Draft</p>
            <h3 className="text-2xl font-bold text-slate-900">{stats.draft}</h3>
          </div>
        </div>

      </div>

      {/* Tabel "My Requests" */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-2xs space-y-5">
        
        {/* Header Aksi */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-900">My Requests:</h2>
          <button 
            onClick={() => navigate('/employee/add')}
            className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700 hover:text-orange-600 transition"
          >
            <Plus size={16} />
            <span>Add Invoice</span>
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:border-slate-400 transition"
              />
            </div>

            <button className="px-3.5 py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50 flex items-center space-x-2 transition">
              <Filter size={14} />
              <span>Filter</span>
            </button>
          </div>

          <button className="w-full sm:w-auto px-4 py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50 flex items-center justify-center space-x-2 transition">
            <Download size={14} />
            <span>Export</span>
          </button>
        </div>

        {/* Pesan Info jika API Belum Terhubung */}
        {error && (
          <div className="bg-amber-50 text-amber-700 border border-amber-200 p-3 rounded-xl text-xs font-medium">
            {error}
          </div>
        )}

        {/* Area Tabel Data */}
        <div className="overflow-x-auto min-h-[220px]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="text-slate-800 font-bold border-b border-gray-100 pb-3">
                <th className="py-3 px-2 w-12">No</th>
                <th className="py-3 px-4">Id</th>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Categories</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-400">
                    Memuat data pengajuan...
                  </td>
                </tr>
              ) : paginatedRequests.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-400 font-medium">
                    Belum ada pengajuan.
                  </td>
                </tr>
              ) : (
                paginatedRequests.map((item, index) => {
                  const itemNumber = (currentPage - 1) * itemsPerPage + index + 1;
                  const formattedAmount = Number(item.total_amount || item.amount || 0).toLocaleString('id-ID');

                  return (
                    <tr key={item.id || index} className="hover:bg-slate-50/60 transition">
                      <td className="py-4 px-2 text-gray-500">{itemNumber}</td>
                      <td className="py-4 px-4 font-medium text-slate-900">
                        {item.id || `REV-${item.request_id || index + 100}`}
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {formatDate(item.created_at || item.date || item.tanggal)}
                      </td>
                      <td className="py-4 px-4 text-gray-700 font-medium">
                        {item.category || 'General'}
                      </td>
                      <td className="py-4 px-4 font-bold text-slate-900">
                        Rp {formattedAmount}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-block px-3.5 py-1 rounded-md text-[11px] font-semibold ${getStatusBadge(item.status)}`}>
                          {item.status || 'Submitted'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Paginasi Style Admin */}
        <div className="flex justify-center items-center space-x-3 pt-4 border-t border-gray-50 text-xs text-gray-400 font-mono">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(1)}
            className="hover:text-slate-800 disabled:opacity-30 transition"
          >
            &laquo;
          </button>
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="hover:text-slate-800 disabled:opacity-30 transition"
          >
            &lt;
          </button>

          <span className="font-bold text-slate-800 font-sans px-2 py-0.5 bg-gray-100 rounded">
            {String(currentPage).padStart(2, '0')}
          </span>

          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="hover:text-slate-800 disabled:opacity-30 transition"
          >
            &gt;
          </button>
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(totalPages)}
            className="hover:text-slate-800 disabled:opacity-30 transition"
          >
            &raquo;
          </button>
        </div>

      </div>

    </div>
  );
}