import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  Wallet, 
  Search, 
  Filter, 
  Download, 
  X, 
  AlertCircle,
  Loader2,
  CheckCircle,
  Building2,
  RotateCcw
} from 'lucide-react';
import { api } from '../lib/api';

export default function FinanceDashboard() {
  // State Data Real API
  const [requests, setRequests] = useState([]);
  const [paidCount, setPaidCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State Modal Pencairan & Penolakan
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [transferRef, setTransferRef] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // State Search & Paginasi
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchFinanceQueue();
  }, []);

  // Mengambil antrean klaim yang SUDAH DISETUJUI Manager
  const fetchFinanceQueue = async () => {
    try {
      setLoading(true);
      setError('');

      if (!api || typeof api.get !== 'function') {
        throw new Error('Instans API belum terkonfigurasi.');
      }

      const response = await api.get('/finance/queue');
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
        date: item.created_at || item.date || new Date().toISOString(),
        category: item.category || 'Reimburse',
        purpose: item.purpose || item.description || 'Pengajuan klaim operasional.',
        manager_note: item.manager_note || 'Telah disetujui oleh Manager.',
        nominal: Number(item.total_amount || item.amount || 0),
        receipt_url: item.receipt_url || item.receipt || 'https://via.placeholder.com/300x400?text=Bukti+Struk'
      }));

      setRequests(formattedData);

      // Opsional: Ambil statistik paid jika API mendukung
      if (response?.data?.paid_count) {
        setPaidCount(response.data.paid_count);
      }
    } catch (err) {
      console.warn('Gagal memuat antrean finance:', err);
      setError('Gagal memuat antrean pencairan dari server.');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
    setIsRejecting(false);
    setRejectReason('');
    setTransferRef('');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
    setTransferRef('');
    setRejectReason('');
    setIsRejecting(false);
  };

  // Konfirmasi Pembayaran/Pencairan Dana ke Backend
  const handlePaymentSubmit = async () => {
    if (!transferRef.trim()) {
      alert('Mohon masukkan Nomor Referensi Transfer terlebih dahulu!');
      return;
    }

    try {
      setSubmitting(true);
      const targetId = selectedRequest.rawId || selectedRequest.id;
      
      await api.put(`/finance/pay/${targetId}`, {
        transfer_ref: transferRef
      });

      alert('Dana berhasil dikonfirmasi dan status diubah menjadi Telah Dibayar (Paid).');
      setRequests((prev) => prev.filter((req) => req.id !== selectedRequest.id));
      setPaidCount((prev) => prev + 1);
      handleCloseModal();
    } catch (err) {
      console.error('Gagal memproses pembayaran:', err);
      alert(err.response?.data?.message || 'Terjadi kesalahan saat mengonfirmasi pembayaran ke server.');
    } finally {
      setSubmitting(false);
    }
  };

  // Penolakan Pembayaran / Pengembalian ke Karyawan
  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) {
      alert('Mohon isi alasan penolakan/pengembalian pembayaran.');
      return;
    }

    try {
      setSubmitting(true);
      const targetId = selectedRequest.rawId || selectedRequest.id;

      await api.put(`/finance/reject/${targetId}`, {
        reason: rejectReason
      });

      alert('Pengajuan berhasil dikembalikan ke karyawan/manager.');
      setRequests((prev) => prev.filter((req) => req.id !== selectedRequest.id));
      handleCloseModal();
    } catch (err) {
      console.error('Gagal menolak pembayaran:', err);
      alert(err.response?.data?.message || 'Terjadi kesalahan saat memproses penolakan.');
    } finally {
      setSubmitting(false);
    }
  };

  // Export Data Antrean ke CSV
  const exportToCSV = () => {
    if (filteredRequests.length === 0) {
      alert('Tidak ada data antrean untuk di-export.');
      return;
    }

    const headers = ['ID Pengajuan,Nama Karyawan,Divisi,Kategori,Nominal,Bank,No Rekening,Tanggal'];
    const rows = filteredRequests.map(r => 
      `"${r.id}","${r.employee.full_name}","${r.employee.department}","${r.category}",${r.nominal},"${r.bank.name}","${r.bank.account}","${new Date(r.date).toLocaleDateString('id-ID')}"`
    );

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Antrean_Pencairan_Finance_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter Data Berdasarkan Pencarian
  const filteredRequests = requests.filter((item) => {
    const query = searchQuery.toLowerCase();
    const name = item.employee.full_name.toLowerCase();
    const reqId = String(item.id).toLowerCase();
    const dept = item.employee.department.toLowerCase();

    return name.includes(query) || reqId.includes(query) || dept.includes(query);
  });

  // Paginasi Data
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage) || 1;
  
  // Penyesuaian Halaman Otomatis jika Data Berkurang
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [filteredRequests.length, totalPages, currentPage]);

  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Kalkulasi Total Nominal Antrean
  const totalPendingAmount = requests.reduce((acc, curr) => acc + curr.nominal, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      
      {/* Header Halaman */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Finance Portal</h1>
        <p className="text-sm text-gray-500 mt-1">
          Verifikasi bukti transaksi dan lakukan pencairan dana reimbursement karyawan.
        </p>
      </div>

      {/* Grid Statistik Finance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Antrean Pencairan */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Menunggu Pembayaran
            </p>
            <h3 className="text-3xl font-bold text-gray-800">
              {String(requests.length).padStart(2, '0')}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 border border-amber-100 flex items-center justify-center">
            <CreditCard size={24} />
          </div>
        </div>

        {/* Card 2: Total Telah Dibayar */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Telah Dibayar (Bulan Ini)
            </p>
            <h3 className="text-3xl font-bold text-gray-800">{paidCount || 0}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 border border-emerald-100 flex items-center justify-center">
            <CheckCircle2 size={24} />
          </div>
        </div>

        {/* Card 3: Banner Total Nominal Dark Navy */}
        <div className="bg-[#232B3E] p-6 rounded-2xl text-white shadow-md flex flex-col justify-between relative overflow-hidden">
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
              Total Antrean Cair
            </p>
            <h3 className="text-2xl font-bold text-[#F16A28]">
              Rp {totalPendingAmount.toLocaleString('id-ID')}
            </h3>
          </div>
          <Wallet className="absolute right-4 bottom-4 text-white/10 w-20 h-20 pointer-events-none" />
        </div>

      </div>

      {/* Main Container Antrean Pencairan */}
      <div className="card-container min-h-[500px]">
        
        <div className="border-b border-gray-100 pb-5 mb-6">
          <h2 className="text-xl font-bold text-gray-800">Antrean Pencairan Dana</h2>
          <p className="text-xs text-gray-500 mt-1">
            Pengajuan berikut telah disetujui Manager. Mohon verifikasi rekening sebelum melakukan transfer.
          </p>
        </div>

        {/* Toolbar Search & Export */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex items-center space-x-3 w-full md:w-1/2">
            <div className="relative w-full">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Cari ID, Nama Karyawan, atau Divisi..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="search-input"
              />
            </div>
          </div>

          <button 
            onClick={exportToCSV}
            className="btn-outline text-xs px-4 py-2 flex items-center w-full md:w-auto justify-center"
          >
            <Download size={16} className="mr-1.5" /> Export CSV
          </button>
        </div>

        {/* Pesan Error jika API Off */}
        {error && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs font-medium flex items-center">
            <AlertCircle size={16} className="mr-2 text-amber-600" />
            {error}
          </div>
        )}

        {/* Tabel Data */}
        <div className="table-wrapper">
          <table className="table-main">
            <thead>
              <tr className="bg-gray-50/80">
                <th className="table-header">Nama & Divisi</th>
                <th className="table-header">ID Pengajuan</th>
                <th className="table-header text-center">Nominal</th>
                <th className="table-header">Info Rekening Bank</th>
                <th className="table-header text-center w-36">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-gray-400 font-medium">
                    Memuat antrean pencairan dana...
                  </td>
                </tr>
              ) : paginatedRequests.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-gray-400 font-medium">
                    Semua tagihan reimbursement telah lunas disalurkan.
                  </td>
                </tr>
              ) : (
                paginatedRequests.map((item) => (
                  <tr key={item.id} className="table-row">
                    <td className="table-cell">
                      <div className="font-bold text-gray-800">{item.employee.full_name}</div>
                      <div className="text-xs text-gray-400">{item.employee.department}</div>
                    </td>
                    <td className="table-cell font-mono font-medium text-gray-700">
                      {item.id}
                    </td>
                    <td className="table-cell font-bold text-gray-900 text-center">
                      Rp {item.nominal.toLocaleString('id-ID')}
                    </td>
                    <td className="table-cell">
                      <div className="inline-flex items-center px-2.5 py-1 bg-gray-100 rounded-md font-medium text-xs text-gray-800">
                        <Building2 size={14} className="mr-1.5 text-gray-500" />
                        {item.bank.name} - {item.bank.account}
                      </div>
                      <div className="text-[11px] text-gray-400 mt-0.5">
                        a.n {item.bank.owner}
                      </div>
                    </td>
                    <td className="table-cell text-center">
                      <button 
                        onClick={() => handleOpenModal(item)}
                        className="btn-secondary text-xs px-4 py-2"
                      >
                        Proses Bayar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginasi */}
        <div className="flex justify-between items-center pt-6 mt-4 border-t border-gray-100 text-xs text-gray-500">
          <div>
            Menampilkan <span className="font-bold text-gray-800">{paginatedRequests.length}</span> dari <span className="font-bold text-gray-800">{filteredRequests.length}</span> antrean
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

      {/* MODAL PROSES PEMBAYARAN FINANCE */}
      {isModalOpen && selectedRequest && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-box max-w-4xl" onClick={(e) => e.stopPropagation()}>
            
            <button 
              onClick={handleCloseModal} 
              className="modal-close-btn p-2 hover:bg-gray-100 rounded-full"
            >
              <X size={20} />
            </button>

            {/* Header Modal */}
            <div className="text-center pb-4 border-b border-gray-100 mb-6">
              <span className="text-xs font-semibold text-[#F16A28] uppercase tracking-wider">
                Verifikasi Finance
              </span>
              <h3 className="text-xl font-bold text-gray-800">PROSES PENCAIRAN DANA</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              
              {/* Kolom Kiri: Informasi & Rekening */}
              <div className="space-y-5">
                <div>
                  <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider border-b border-gray-100 pb-2 mb-3">
                    Informasi Pengajuan
                  </h4>
                  <div className="space-y-2 text-xs text-gray-700">
                    <div className="flex justify-between py-1 border-b border-gray-50">
                      <span className="text-gray-400">Karyawan:</span>
                      <span className="font-semibold text-gray-800">{selectedRequest.employee.full_name}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-50">
                      <span className="text-gray-400">ID Transaksi:</span>
                      <span className="font-mono font-medium">{selectedRequest.id}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-50">
                      <span className="text-gray-400">Kategori:</span>
                      <span className="font-medium">{selectedRequest.category}</span>
                    </div>
                    <div className="flex justify-between py-1 items-center">
                      <span className="text-gray-400">Total Nominal:</span>
                      <span className="text-lg font-bold text-[#F16A28]">
                        Rp {selectedRequest.nominal.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider border-b border-gray-100 pb-2 mb-2">
                    Catatan Manager
                  </h4>
                  <p className="text-xs text-gray-600 italic bg-gray-50 p-3 rounded-xl border border-gray-100">
                    "{selectedRequest.manager_note}"
                  </p>
                </div>

                {/* Box Rekening Tujuan */}
                <div className="bg-orange-50/60 p-4 rounded-xl border border-orange-100">
                  <h4 className="font-bold text-[#232B3E] mb-2 text-xs uppercase tracking-wider text-center">
                    Tujuan Transfer Bank
                  </h4>
                  <div className="bg-white p-3 rounded-lg text-center border border-orange-100">
                    <p className="text-lg font-bold text-gray-800 tracking-widest font-mono">
                      {selectedRequest.bank.account}
                    </p>
                    <p className="text-xs font-semibold text-[#F16A28]">{selectedRequest.bank.name}</p>
                    <p className="text-xs text-gray-400 mt-1">a.n {selectedRequest.bank.owner}</p>
                  </div>
                </div>
              </div>

              {/* Kolom Kanan: Bukti Struk & Form Ref Transfer */}
              <div className="space-y-5">
                <div>
                  <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider border-b border-gray-100 pb-2 mb-3">
                    Bukti Struk / Nota
                  </h4>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-2 h-44 flex items-center justify-center overflow-hidden">
                    <img 
                      src={selectedRequest.receipt_url} 
                      alt="Struk Pembayaran" 
                      className="max-h-full object-contain rounded-lg"
                    />
                  </div>
                </div>

                {/* Form Konfirmasi / Penolakan */}
                {!isRejecting ? (
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                    <h4 className="font-bold text-gray-800 text-xs uppercase">Konfirmasi Pembayaran</h4>
                    <div>
                      <label htmlFor="transferRefInput" className="form-label text-xs">
                        Nomor Referensi Transfer <span className="text-red-500">*</span>
                      </label>
                      <input 
                        id="transferRefInput"
                        type="text" 
                        value={transferRef}
                        onChange={(e) => setTransferRef(e.target.value)}
                        placeholder="Contoh: TRF-BCA-98213"
                        className="form-input text-xs"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 p-4 rounded-xl border border-red-200 space-y-3">
                    <h4 className="font-bold text-red-800 text-xs uppercase">Alasan Penolakan / Pengembalian</h4>
                    <div>
                      <textarea 
                        rows={3}
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Jelaskan alasan pengajuan dikembalikan (contoh: Rekening tidak valid/Struk tidak jelas)..."
                        className="form-input text-xs w-full p-2 border border-red-200 rounded-lg focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Modal Actions */}
            <div className="border-t border-gray-100 pt-5 flex flex-col sm:flex-row justify-between items-center gap-3">
              {!isRejecting ? (
                <button 
                  type="button"
                  onClick={() => setIsRejecting(true)}
                  className="btn-danger text-xs py-2"
                >
                  Tolak Pembayaran (Bermasalah)
                </button>
              ) : (
                <button 
                  type="button"
                  onClick={() => setIsRejecting(false)}
                  className="btn-outline text-xs py-2 flex items-center"
                >
                  <RotateCcw size={14} className="mr-1" /> Batal Tolak
                </button>
              )}
              
              <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                <button 
                  type="button"
                  onClick={handleCloseModal}
                  className="btn-outline text-xs px-5 py-2"
                  disabled={submitting}
                >
                  Batal
                </button>

                {!isRejecting ? (
                  <button 
                    type="button"
                    onClick={handlePaymentSubmit}
                    disabled={submitting}
                    className="btn-success text-xs px-6 py-2 flex items-center"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin mr-2" />
                        <span>Memproses...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle size={16} className="mr-1.5" />
                        <span>Tandai Telah Dibayar</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button 
                    type="button"
                    onClick={handleRejectSubmit}
                    disabled={submitting}
                    className="btn-danger text-xs px-6 py-2 flex items-center bg-red-600 hover:bg-red-700 text-white"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin mr-2" />
                        <span>Memproses...</span>
                      </>
                    ) : (
                      <span>Kirim Penolakan</span>
                    )}
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}