import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download,
  Eye,
  X,
  Check,
  Hourglass
} from 'lucide-react';
// import { api } from '../lib/api'; // Buka saat disambungkan ke backend

export default function ManagerApproved() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    // Simulasi pengambilan data pengajuan yang sudah disetujui
    const fetchApprovedRequests = async () => {
      try {
        // const response = await api.get('/manager/reimbursements?status=approved');
        // setRequests(response.data);
        
        // Data dummy menyesuaikan gambar desain
        setRequests([
          { 
            id: 'REV-098', 
            employee: { full_name: 'Fajar Zul', email: 'fajar@gmail.com', department: 'Sales' }, 
            date: '10 Agustus 2026',
            approved_date: '10 Agustus 2026', // Tgl Disetujui
            submitted_date: '09 Ags 2026',
            category: 'Tiket Pesawat', 
            purpose: 'Tiket pesawat PP Jakarta-Bali untuk kunjungan ke klien cabang.',
            manager_note: 'Sesuai dengan budget dinas luar. Lanjutkan.',
            status: 'Approved', 
            total_amount: 1500000,
            approver_name: 'M Rifqi Fuadi',
            receipt_url: 'https://via.placeholder.com/300x400?text=Struk+Pembayaran'
          },
          { 
            id: 'REV-102', 
            employee: { full_name: 'Ady Tri Kusuma H', email: 'adytri@gmail.com', department: 'IT' }, 
            date: '12 Agustus 2026',
            approved_date: '12 Agustus 2026',
            submitted_date: '11 Ags 2026',
            category: 'Pending', // Mengikuti teks dummy di tabel gambar
            purpose: 'Makan siang bersama Klien untuk pembahasan project',
            manager_note: 'Disetujui',
            status: 'Approved', 
            total_amount: 37000,
            approver_name: 'M Rifqi Fuadi',
            receipt_url: 'https://via.placeholder.com/300x400?text=Struk+Pembayaran'
          }
        ]);
      } catch (error) {
        console.error('Gagal mengambil data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchApprovedRequests();
  }, []);

  const handleOpenModal = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  return (
    <div className="w-full">
      {/* Header Halaman Pengganti DashboardLayout */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Approved</h2>
          <p className="text-gray-500 text-sm mt-1">Daftar pengajuan tim yang telah Anda setujui</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm">
        {/* Toolbar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4 w-full md:w-1/2">
            <div className="relative w-2/3">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Cari nama atau ID" 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#232B3E] bg-[#232B3E] text-white placeholder-gray-400 font-sans"
              />
            </div>
            <button className="flex items-center px-4 py-2 bg-[#232B3E] text-white rounded-lg hover:bg-opacity-90 font-sans transition">
              <Filter size={18} className="mr-2" /> Filter
            </button>
          </div>
          <button className="flex items-center px-4 py-2 bg-[#232B3E] text-white rounded-lg hover:bg-opacity-90 font-sans transition">
            <Download size={18} className="mr-2" /> Export
          </button>
        </div>

        {/* Tabel Data */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse font-serif text-sm">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="py-4 font-bold text-gray-800">Name</th>
                <th className="py-4 font-bold text-gray-800">ID Pengajuan</th>
                <th className="py-4 font-bold text-gray-800">Tgl Disetujui</th>
                <th className="py-4 font-bold text-gray-800">Kategori</th>
                <th className="py-4 font-bold text-gray-800">Nominal</th>
                <th className="py-4 font-bold text-gray-800 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-8 text-gray-500">Memuat data...</td></tr>
              ) : requests.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-8 text-gray-500">Tidak ada pengajuan yang disetujui.</td></tr>
              ) : (
                requests.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                    <td className="py-4">
                      <div className="font-medium text-gray-800">{item.employee.full_name}</div>
                      <div className="text-xs text-gray-500">{item.employee.email}</div>
                    </td>
                    <td className="py-4 text-gray-600 font-medium">#{item.id}</td>
                    <td className="py-4 text-gray-600">{item.approved_date}</td>
                    <td className="py-4 text-gray-600">{item.category}</td>
                    <td className="py-4 text-gray-800 font-medium">Rp {item.total_amount?.toLocaleString('id-ID')}</td>
                    <td className="py-4 text-center">
                      <button 
                        onClick={() => handleOpenModal(item)}
                        className="p-2 bg-orange-100 text-[#F16A28] rounded-full hover:bg-orange-200 transition inline-flex justify-center items-center"
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
        
        {/* Pagination */}
        <div className="flex justify-center items-center mt-8 space-x-4 text-gray-500 font-sans">
          <button className="hover:text-[#F16A28]">«</button>
          <button className="hover:text-[#F16A28]">‹</button>
          <span className="font-bold text-gray-800">01</span>
          <button className="hover:text-[#F16A28]">›</button>
          <button className="hover:text-[#F16A28]">»</button>
        </div>
      </div>

      {/* Modal / Pop-up Tinjau Pengajuan Disetujui */}
      {isModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 font-serif">
          <div className="bg-white w-full max-w-4xl rounded-2xl p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <button onClick={handleCloseModal} className="absolute top-6 right-6 text-gray-400 hover:text-gray-700">
              <X size={24} />
            </button>

            <div className="text-center mb-8">
              <h2 className="text-xl text-gray-800 mb-1">Approved</h2>
              <h3 className="text-lg font-bold text-gray-700 uppercase">DETAIL PENGAJUAN (DISETUJUI)</h3>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              {/* Kolom Kiri: Informasi */}
              <div>
                <h4 className="font-bold text-gray-800 mb-4">INFORMASI PENGAJUAN</h4>
                <div className="space-y-2 text-gray-700">
                  <p className="grid grid-cols-[120px_1fr]"><span className="font-medium">Nama</span> <span>: {selectedRequest.employee.full_name}</span></p>
                  <p className="grid grid-cols-[120px_1fr]"><span className="font-medium">Divisi</span> <span>: {selectedRequest.employee.department}</span></p>
                  <p className="grid grid-cols-[120px_1fr]"><span className="font-medium">ID Trans</span> <span>: #{selectedRequest.id}</span></p>
                  <p className="grid grid-cols-[120px_1fr]"><span className="font-medium">Tanggal</span> <span>: {selectedRequest.date}</span></p>
                  <br />
                  <p className="grid grid-cols-[120px_1fr]"><span className="font-medium">Kategori</span> <span>: {selectedRequest.category}</span></p>
                  <p className="grid grid-cols-[120px_1fr]"><span className="font-medium">Nominal</span> <span>: Rp {selectedRequest.total_amount?.toLocaleString('id-ID')}</span></p>
                  <br />
                  <p className="font-medium mb-1">Keterangan Karyawan :</p>
                  <p className="text-gray-600 italic">"{selectedRequest.purpose}"</p>
                  <br />
                  <p className="font-medium mb-1">Catatan Persetujuan Anda :</p>
                  <p className="text-gray-600 italic">"{selectedRequest.manager_note}"</p>
                </div>
              </div>

              {/* Kolom Kanan: Bukti Struk & Tracking */}
              <div className="flex flex-col space-y-6">
                <div>
                  <h4 className="font-bold text-gray-800 mb-4">BUKTI STRUK / NOTA</h4>
                  <div className="bg-gray-100 border border-gray-200 rounded-lg p-2 h-48 flex items-center justify-center overflow-hidden">
                    <img src={selectedRequest.receipt_url} alt="Struk" className="max-h-full object-contain mix-blend-multiply" />
                  </div>
                </div>

                {/* Tracking Status */}
                <div className="text-sm font-sans space-y-4">
                  <div>
                    <p className="font-semibold text-gray-800">Langkah 1: Diajukan ({selectedRequest.submitted_date})</p>
                    <p className="text-gray-600 flex items-center mt-1"><Check size={14} className="mr-1" /> Selesai</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Langkah 2: Disetujui Atasan ({selectedRequest.approved_date.substring(0, 6)})</p>
                    <p className="text-gray-600 flex items-center mt-1"><Check size={14} className="mr-1" /> Oleh: {selectedRequest.approver_name}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Langkah 3: Pencairan Finance</p>
                    <p className="text-[#F16A28] flex items-center mt-1"><Hourglass size={14} className="mr-1" /> Sedang diproses...</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Area Tombol Bawah */}
            <div className="border-t border-gray-200 pt-6 flex justify-center">
              <button 
                onClick={handleCloseModal}
                className="px-8 py-2 bg-[#94A3B8] text-white rounded font-sans font-medium hover:bg-opacity-90 transition shadow-sm"
              >
                Tutup Panel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}