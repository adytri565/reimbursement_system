import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Download, 
  X, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  FileText,
  DollarSign
} from 'lucide-react';
import { api } from '../lib/api';

export default function EmployeeHistory() {
  // State Data Real
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // State Modal Detail
  const [selectedRequest, setSelectedRequest] = useState(null);

  // State Paginasi
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError('');

      if (!api || typeof api.get !== 'function') {
        throw new Error('Instans API belum terkonfigurasi.');
      }

      const response = await api.get('/reimbursements');
      const rawData = response?.data?.data || response?.data || response || [];
      const dataArray = Array.isArray(rawData) ? rawData : [];
      
      setRequests(dataArray);
    } catch (err) {
      console.warn('Gagal memuat data dari backend API:', err);
      setError('Koneksi ke server bermasalah. Menampilkan riwayat dari penyimpanan lokal.');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper Warna & Class Badge Status (Menggunakan class CSS dari index.css)
  const getStatusBadge = (status) => {
    const s = String(status || '').toLowerCase();
    switch (s) {
      case 'approved':
      case 'paid':
        return <span className="badge-approved">Approved</span>;
      case 'rejected':
        return <span className="badge-rejected">Rejected</span>;
      case 'submitted':
      case 'pending':
        return <span className="badge-pending">Submitted</span>;
      case 'draft':
        return <span className="bg-slate-500 text-white px-3 py-1 text-xs font-bold rounded-md inline-block">Draft</span>;
      default:
        return <span className="bg-gray-400 text-white px-3 py-1 text-xs font-bold rounded-md inline-block">{status}</span>;
    }
  };

  // Filter Data Berdasarkan Search & Dropdown Status
  const filteredRequests = (Array.isArray(requests) ? requests : []).filter((item) => {
    if (!item) return false;

    const query = searchQuery.toLowerCase();
    const reqId = String(item.id || item.request_id || '').toLowerCase();
    const category = String(item.category || '').toLowerCase();
    const purpose = String(item.purpose || item.description || '').toLowerCase();

    const matchesSearch = reqId.includes(query) || category.includes(query) || purpose.includes(query);

    const status = String(item.status || '').toLowerCase();
    let matchesStatus = true;
    if (statusFilter === 'APPROVED') matchesStatus = status === 'approved' || status === 'paid';
    if (statusFilter === 'REJECTED') matchesStatus = status === 'rejected';
    if (statusFilter === 'SUBMITTED') matchesStatus = status === 'submitted' || status === 'pending';
    if (statusFilter === 'DRAFT') matchesStatus = status === 'draft';

    return matchesSearch && matchesStatus;
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

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Header Halaman */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Riwayat Reimbursement</h1>
        <p className="text-sm text-gray-500 mt-1">
          Lihat seluruh rekam jejak dan status pengajuan reimbursement Anda.
        </p>
      </div>

      {/* Main Card Container */}
      <div className="card-container min-h-[600px]">
        
        {/* Toolbar Filter & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-gray-100">
          
          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari ID, kategori, atau keperluan..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="search-input"
            />
          </div>

          {/* Controls: Filter Dropdown & Export */}
          <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
            
            {/* Status Filter */}
            <div className="flex items-center space-x-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
              <Filter size={16} className="text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-xs font-semibold text-gray-700 focus:outline-none cursor-pointer"
              >
                <option value="ALL">Semua Status</option>
                <option value="SUBMITTED">Submitted / Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="DRAFT">Draft</option>
              </select>
            </div>

            {/* Export Button */}
            <button className="btn-outline text-xs px-4 py-2">
              <Download size={14} className="mr-1.5" />
              <span>Export</span>
            </button>

          </div>

        </div>

        {/* Info Pesan Error / Server Warning */}
        {error && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-xs font-medium">
            {error}
          </div>
        )}

        {/* Tabel Data Riwayat */}
        <div className="table-wrapper">
          <table className="table-main">
            <thead>
              <tr className="bg-gray-50/80">
                <th className="table-header w-12">No</th>
                <th className="table-header">ID Pengajuan</th>
                <th className="table-header">Tanggal</th>
                <th className="table-header">Kategori</th>
                <th className="table-header">Nominal</th>
                <th className="table-header text-center">Status</th>
                <th className="table-header text-center w-24">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-400 font-medium">
                    Memuat riwayat pengajuan...
                  </td>
                </tr>
              ) : paginatedRequests.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-400 font-medium">
                    Tidak ada riwayat pengajuan yang ditemukan.
                  </td>
                </tr>
              ) : (
                paginatedRequests.map((item, index) => {
                  const itemNumber = (currentPage - 1) * itemsPerPage + index + 1;
                  const formattedAmount = Number(item.total_amount || item.amount || 0).toLocaleString('id-ID');

                  return (
                    <tr key={item.id || index} className="table-row">
                      <td className="table-cell font-mono text-gray-400">{itemNumber}</td>
                      <td className="table-cell font-bold text-gray-800">
                        {item.id || `REV-${item.request_id || index + 100}`}
                      </td>
                      <td className="table-cell text-gray-600">
                        {formatDate(item.created_at || item.date || item.tanggal)}
                      </td>
                      <td className="table-cell font-medium text-gray-700">
                        {item.category || 'General'}
                      </td>
                      <td className="table-cell font-bold text-gray-900">
                        Rp {formattedAmount}
                      </td>
                      <td className="table-cell text-center">
                        {getStatusBadge(item.status)}
                      </td>
                      <td className="table-cell text-center">
                        <button
                          onClick={() => setSelectedRequest(item)}
                          className="p-2 text-gray-500 hover:text-[#F16A28] hover:bg-orange-50 rounded-lg transition inline-flex items-center justify-center"
                          title="Lihat Detail"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Navigation */}
        <div className="flex justify-between items-center pt-6 mt-4 border-t border-gray-100 text-xs text-gray-500">
          <div>
            Menampilkan <span className="font-bold text-gray-800">{paginatedRequests.length}</span> dari <span className="font-bold text-gray-800">{filteredRequests.length}</span> data
          </div>

          <div className="flex items-center space-x-2 font-mono">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition font-sans"
            >
              Sebelumnya
            </button>

            <span className="px-3 py-1.5 bg-[#232B3E] text-white font-bold rounded-lg font-sans">
              {currentPage} / {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition font-sans"
            >
              Selanjutnya
            </button>
          </div>
        </div>

      </div>

      {/* =========================================
          MODAL DETAIL PENGAJUAN (POP-UP)
          ========================================= */}
      {selectedRequest && (
        <div className="modal-overlay" onClick={() => setSelectedRequest(null)}>
          <div className="modal-box max-w-2xl" onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-orange-50 text-[#F16A28] rounded-xl">
                  <FileText size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    Detail Pengajuan {selectedRequest.id || `REV-${selectedRequest.request_id || ''}`}
                  </h3>
                  <p className="text-xs text-gray-400">
                    Dibuat pada {formatDate(selectedRequest.created_at || selectedRequest.date || selectedRequest.tanggal)}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setSelectedRequest(null)}
                className="modal-close-btn p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="py-6 space-y-6">
              
              {/* Status & Amount Card */}
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <p className="text-xs text-gray-400 font-medium">Total Nominal Klaim</p>
                  <p className="text-2xl font-bold text-[#232B3E]">
                    Rp {Number(selectedRequest.total_amount || selectedRequest.amount || 0).toLocaleString('id-ID')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium mb-1">Status Pengajuan</p>
                  {getStatusBadge(selectedRequest.status)}
                </div>
              </div>

              {/* Grid Informasi Detail */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                
                <div className="p-3 bg-white border border-gray-100 rounded-xl space-y-1">
                  <span className="text-gray-400">Kategori:</span>
                  <p className="font-semibold text-gray-800 text-sm">{selectedRequest.category || 'General'}</p>
                </div>

                <div className="p-3 bg-white border border-gray-100 rounded-xl space-y-1">
                  <span className="text-gray-400">Tanggal Transaksi:</span>
                  <p className="font-semibold text-gray-800 text-sm">
                    {formatDate(selectedRequest.created_at || selectedRequest.date || selectedRequest.tanggal)}
                  </p>
                </div>

              </div>

              {/* Keperluan / Deskripsi */}
              <div>
                <h4 className="text-xs font-semibold text-gray-500 mb-1.5">Keterangan / Keperluan:</h4>
                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 text-xs text-gray-700 leading-relaxed">
                  {selectedRequest.purpose || selectedRequest.description || 'Tidak ada deskripsi tambahan.'}
                </div>
              </div>

              {/* Catatan Penolakan / Catatan Approver (Jika Ada) */}
              {selectedRequest.notes && (
                <div>
                  <h4 className="text-xs font-semibold text-rose-600 mb-1.5">Catatan Evaluasi / Catatan Manager:</h4>
                  <div className="p-3.5 bg-rose-50 rounded-xl border border-rose-100 text-xs text-rose-800">
                    {selectedRequest.notes}
                  </div>
                </div>
              )}

              {/* Lampiran Nota / Bukti Pembayaran */}
              <div>
                <h4 className="text-xs font-semibold text-gray-500 mb-2">Lampiran Bukti Pembayaran:</h4>
                {selectedRequest.receipt_url || selectedRequest.receipt ? (
                  <div className="border border-gray-200 rounded-xl p-3 flex items-center justify-between bg-gray-50">
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <div className="p-2 bg-white rounded-lg border border-gray-200 text-gray-600">
                        <FileText size={20} />
                      </div>
                      <span className="text-xs font-medium text-gray-700 truncate">
                        Bukti_Pembayaran_{selectedRequest.id || 'Reimburse'}.jpg
                      </span>
                    </div>
                    <a 
                      href={selectedRequest.receipt_url || selectedRequest.receipt} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn-outline text-xs py-1.5 px-3"
                    >
                      <Eye size={14} className="mr-1" />
                      <span>Lihat File</span>
                    </a>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-center text-xs text-gray-400">
                    Tidak ada lampiran bukti pembayaran.
                  </div>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => setSelectedRequest(null)}
                className="btn-secondary text-xs"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}