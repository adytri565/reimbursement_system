import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  X, 
  FileText, 
  CheckCircle2, 
  Building2, 
  Calendar, 
  AlertCircle,
  Tag,
  Receipt
} from 'lucide-react';
import { api } from '../lib/api';

export default function FinanceHistory() {
  // State Data & API
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // State Modal Detail
  const [selectedItem, setSelectedItem] = useState(null);

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

      const response = await api.get('/finance/history');
      const rawData = response?.data?.data || response?.data || response || [];
      const dataArray = Array.isArray(rawData) ? rawData : [];

      const formattedData = dataArray.map((item, index) => ({
        id: item.id || `REV-${item.request_id || index + 100}`,
        rawId: item.id || item.request_id,
        employee: { 
          full_name: item.profiles?.full_name || item.employee_name || 'Karyawan', 
          department: item.profiles?.department || item.department || 'Operasional' 
        },
        bank: { 
          name: item.profiles?.default_bank_name || item.bank_name || 'Bank BCA', 
          account: item.profiles?.default_bank_account || item.bank_account || '-', 
          owner: item.profiles?.full_name || item.employee_name || 'Karyawan'
        },
        paid_date: item.paid_at || item.paid_date || item.updated_at || item.created_at || new Date().toISOString(),
        category: item.category || 'Reimburse',
        purpose: item.purpose || item.description || 'Pengajuan klaim operasional.',
        transfer_ref: item.transfer_ref || item.ref_number || `TRF-BCN-${1000 + index}`,
        nominal: Number(item.total_amount || item.amount || item.nominal || 0),
        receipt_url: item.receipt_url || item.receipt || 'https://via.placeholder.com/300x400?text=Bukti+Struk',
        status: item.status || 'Paid'
      }));

      setHistory(formattedData);
    } catch (err) {
      console.warn('Gagal memuat riwayat finance dari backend:', err);
      setError('Koneksi server bermasalah. Menampilkan data riwayat lokal.');

      // Mock Data Fallback jika API backend belum siap
      setHistory([
        { 
          id: 'REV-098', 
          rawId: '098',
          employee: { full_name: 'Fajar Zul', department: 'Sales' }, 
          bank: { name: 'Mandiri', account: '0987654321', owner: 'Fajar Zul' },
          paid_date: '2026-08-10T10:30:00Z',
          category: 'Transport', 
          purpose: 'Tiket Pesawat & Taksi Klien Jakarta-Surabaya',
          transfer_ref: 'TRF-MND-887123',
          nominal: 1500000,
          receipt_url: 'https://via.placeholder.com/300x400?text=Struk+Tiket+Pesawat',
          status: 'Paid'
        },
        { 
          id: 'REV-095', 
          rawId: '095',
          employee: { full_name: 'Bayu R.', department: 'Sales' }, 
          bank: { name: 'BNI', account: '1122334455', owner: 'Bayu R.' },
          paid_date: '2026-08-05T14:15:00Z',
          category: 'Makan', 
          purpose: 'Jamuan Makan Siang Klien PT Mitra Sejahtera',
          transfer_ref: 'TRF-BNI-990011',
          nominal: 450000,
          receipt_url: 'https://via.placeholder.com/300x400?text=Struk+Resto',
          status: 'Paid'
        },
        { 
          id: 'REV-090', 
          rawId: '090',
          employee: { full_name: 'Ady Tri Kusuma H', department: 'IT' }, 
          bank: { name: 'BCA', account: '1234567890', owner: 'Ady Tri Kusuma H' },
          paid_date: '2026-08-01T09:00:00Z',
          category: 'Operasional', 
          purpose: 'Perpanjangan Server Domain & Hosting Cloud',
          transfer_ref: 'TRF-BCA-554433',
          nominal: 2500000,
          receipt_url: 'https://via.placeholder.com/300x400?text=Invoice+Cloud',
          status: 'Paid'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Helper Format Tanggal
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

  // Filter Data Berdasarkan Pencarian & Kategori
  const filteredHistory = history.filter((item) => {
    const query = searchQuery.toLowerCase();
    const name = item.employee.full_name.toLowerCase();
    const reqId = String(item.id).toLowerCase();
    const ref = String(item.transfer_ref).toLowerCase();
    const category = String(item.category).toLowerCase();

    const matchesSearch = name.includes(query) || reqId.includes(query) || ref.includes(query) || category.includes(query);
    const matchesCategory = categoryFilter === 'ALL' || item.category.toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  // Paginasi
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage) || 1;
  const paginatedHistory = filteredHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Fitur Export CSV
  const handleExportCSV = () => {
    if (filteredHistory.length === 0) {
      alert('Tidak ada data riwayat untuk di-export.');
      return;
    }

    const headers = ['ID Pengajuan,Tanggal Cair,Nama Karyawan,Divisi,Kategori,Nominal,Bank,No Rekening,Ref Transfer'];
    const rows = filteredHistory.map(r => 
      `"${r.id}","${formatDate(r.paid_date)}","${r.employee.full_name}","${r.employee.department}","${r.category}",${r.nominal},"${r.bank.name}","${r.bank.account}","${r.transfer_ref}"`
    );

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Riwayat_Pencairan_Finance_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      
      {/* Header Halaman */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Paid History</h1>
        <p className="text-sm text-gray-500 mt-1">
          Daftar seluruh transaksi reimbursement yang telah selesai diproses dan ditransfer oleh Tim Finance.
        </p>
      </div>

      {/* Main Container */}
      <div className="card-container min-h-[550px]">
        
        {/* Toolbar Search & Filter */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pb-4 border-b border-gray-100">
          
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-2/3">
            {/* Input Search */}
            <div className="relative w-full">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Cari Ref Transfer, ID, atau Nama Karyawan..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="search-input"
              />
            </div>

            {/* Filter Kategori */}
            <div className="flex items-center space-x-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 w-full sm:w-auto shrink-0">
              <Filter size={16} className="text-gray-500" />
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-xs font-semibold text-gray-700 focus:outline-none cursor-pointer w-full"
              >
                <option value="ALL">Semua Kategori</option>
                <option value="Transport">Transport / Bensin</option>
                <option value="Makan">Makanan / Jamuan</option>
                <option value="Operasional">Operasional</option>
                <option value="Akomodasi">Akomodasi</option>
              </select>
            </div>
          </div>

          {/* Tombol Export */}
          <button 
            onClick={handleExportCSV}
            className="btn-outline text-xs px-4 py-2 flex items-center justify-center w-full md:w-auto shrink-0"
          >
            <Download size={16} className="mr-1.5 text-[#F16A28]" /> Export Laporan (.csv)
          </button>
        </div>

        {/* Pesan Error / Peringatan Server */}
        {error && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs font-medium flex items-center">
            <AlertCircle size={16} className="mr-2 text-amber-600 shrink-0" />
            {error}
          </div>
        )}

        {/* Tabel Data Riwayat */}
        <div className="table-wrapper mt-4">
          <table className="table-main">
            <thead>
              <tr className="bg-gray-50/80">
                <th className="table-header">Tgl Cair</th>
                <th className="table-header">Nama & Divisi</th>
                <th className="table-header">ID Pengajuan</th>
                <th className="table-header">Rekening Tujuan</th>
                <th className="table-header">Ref Transfer</th>
                <th className="table-header text-right">Nominal (Rp)</th>
                <th className="table-header text-center w-20">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-400 font-medium">
                    Memuat riwayat pembayaran...
                  </td>
                </tr>
              ) : paginatedHistory.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-400 font-medium">
                    Tidak ada data riwayat pembayaran yang cocok.
                  </td>
                </tr>
              ) : (
                paginatedHistory.map((item) => (
                  <tr key={item.id} className="table-row">
                    <td className="table-cell text-gray-600 text-xs">
                      {formatDate(item.paid_date)}
                    </td>
                    <td className="table-cell">
                      <div className="font-bold text-gray-800">{item.employee.full_name}</div>
                      <div className="text-xs text-gray-400">{item.employee.department}</div>
                    </td>
                    <td className="table-cell font-mono font-medium text-gray-700 text-xs">
                      {item.id}
                    </td>
                    <td className="table-cell">
                      <div className="text-xs font-medium text-gray-800">
                        {item.bank.name} - {item.bank.account}
                      </div>
                      <div className="text-[11px] text-gray-400">a.n {item.bank.owner}</div>
                    </td>
                    <td className="table-cell">
                      <span className="inline-block font-mono text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-md font-bold">
                        {item.transfer_ref}
                      </span>
                    </td>
                    <td className="table-cell text-right font-bold text-gray-900">
                      Rp {item.nominal.toLocaleString('id-ID')}
                    </td>
                    <td className="table-cell text-center">
                      <button 
                        onClick={() => setSelectedItem(item)}
                        className="p-2 text-gray-400 hover:text-[#F16A28] hover:bg-orange-50 rounded-lg transition inline-flex items-center justify-center"
                        title="Lihat Detail Transaksi"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginasi Navigation */}
        <div className="flex justify-between items-center pt-6 mt-4 border-t border-gray-100 text-xs text-gray-500">
          <div>
            Menampilkan <span className="font-bold text-gray-800">{paginatedHistory.length}</span> dari <span className="font-bold text-gray-800">{filteredHistory.length}</span> riwayat
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
          MODAL DETAIL TRANSAKSI / PAID PROOF
          ========================================= */}
      {selectedItem && (
        <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="modal-box max-w-2xl" onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    Bukti Pencairan #{selectedItem.id}
                  </h3>
                  <p className="text-xs text-gray-400">
                    Dicairkan pada {formatDate(selectedItem.paid_date)}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setSelectedItem(null)}
                className="modal-close-btn p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="py-6 space-y-6">
              
              {/* Banner Referensi & Nominal */}
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <p className="text-xs text-gray-400 font-medium">Nominal Telah Ditransfer</p>
                  <p className="text-2xl font-bold text-[#232B3E]">
                    Rp {selectedItem.nominal.toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs text-gray-400 font-medium mb-1">Nomor Ref Transfer</p>
                  <span className="font-mono text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-lg inline-block border border-emerald-200">
                    {selectedItem.transfer_ref}
                  </span>
                </div>
              </div>

              {/* Grid Rincian Informasi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                
                <div className="p-3 bg-white border border-gray-100 rounded-xl space-y-1">
                  <span className="text-gray-400 flex items-center">
                    <Building2 size={14} className="mr-1 text-gray-400" /> Penerima / Karyawan:
                  </span>
                  <p className="font-bold text-gray-800 text-sm">{selectedItem.employee.full_name}</p>
                  <p className="text-gray-500">{selectedItem.employee.department} Division</p>
                </div>

                <div className="p-3 bg-white border border-gray-100 rounded-xl space-y-1">
                  <span className="text-gray-400 flex items-center">
                    <Tag size={14} className="mr-1 text-gray-400" /> Rekening Tujuan:
                  </span>
                  <p className="font-bold text-gray-800 text-sm">{selectedItem.bank.name} - {selectedItem.bank.account}</p>
                  <p className="text-gray-500">a.n {selectedItem.bank.owner}</p>
                </div>

              </div>

              {/* Deskripsi Keperluan */}
              <div>
                <h4 className="text-xs font-semibold text-gray-500 mb-1.5">Deskripsi Keperluan Klaim:</h4>
                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 text-xs text-gray-700 leading-relaxed">
                  {selectedItem.purpose}
                </div>
              </div>

              {/* Struk / Nota Lampiran */}
              <div>
                <h4 className="text-xs font-semibold text-gray-500 mb-2 flex items-center">
                  <Receipt size={14} className="mr-1" /> Bukti Lampiran Nota / Struk:
                </h4>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-2 h-44 flex items-center justify-center overflow-hidden">
                  <img 
                    src={selectedItem.receipt_url} 
                    alt="Bukti Nota" 
                    className="max-h-full object-contain rounded-lg"
                  />
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => setSelectedItem(null)}
                className="btn-secondary text-xs px-5 py-2"
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