import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download,
  Eye
} from 'lucide-react';
// import { api } from '../lib/api'; // Buka komentar saat integrasi backend

export default function ManagerReport() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulasi pengambilan data riwayat transaksi/invoice
    const fetchReports = async () => {
      try {
        // const response = await api.get('/manager/reports');
        // setReports(response.data);
        
        // Data dummy disesuaikan dengan gambar referensi
        setReports([
          { id: '#INV-042', name: 'Rifqi', division: 'Developer', date: '12 Aug 2026', category: 'Bensin/Tol', nominal: 250000, status: 'Approved' },
          { id: '#INV-041', name: 'Ady', division: 'designer', date: '12 Jul 2026', category: 'Makan Siang', nominal: 450000, status: 'Rejected' },
          { id: '#INV-045', name: 'Bayu', division: 'Problem solfing', date: '12 Jun 2026', category: 'Penginapan', nominal: 1200000, status: 'Pending' },
          { id: '#INV-031', name: 'Fajar', division: 'Developer', date: '12 Feb 2026', category: 'Tiket Kereta', nominal: 800000, status: 'Pending' }
        ]);
      } catch (error) {
        console.error('Gagal mengambil data report:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Approved': return 'bg-[#38A169] text-white';
      case 'Rejected': return 'bg-[#E53E3E] text-white';
      case 'Pending': return 'bg-[#ECC94B] text-gray-900';
      default: return 'bg-gray-300 text-gray-800';
    }
  };

  return (
    <div className="w-full">
      {/* Header Halaman */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Report/Invoice</h2>
          <p className="text-gray-500 text-sm mt-1">Riwayat semua pengajuan reimbursement</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm min-h-[600px]">
        
        {/* Toolbar Pencarian & Filter */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex space-x-4 w-full md:w-1/2">
            <div className="relative w-2/3">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Cari Id Trans/nama.." 
                className="w-full pl-10 pr-4 py-2 border-none rounded-md focus:outline-none focus:ring-1 focus:ring-[#232B3E] bg-[#232B3E] text-white placeholder-gray-400 text-sm font-sans"
              />
            </div>
            <button className="flex items-center px-4 py-2 bg-[#232B3E] text-white rounded-md hover:bg-opacity-90 text-sm font-sans transition">
              <Filter size={18} className="mr-2" /> Filter
            </button>
          </div>
          <button className="flex items-center px-6 py-2 bg-[#232B3E] text-white rounded-md hover:bg-opacity-90 text-sm font-sans transition">
            <Download size={18} className="mr-2" /> Export
          </button>
        </div>

        {/* Tabel Data (Desain Baris Berselang-seling) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans text-sm">
            <thead>
              <tr>
                <th className="py-4 px-4 font-bold text-gray-800">ID Trans</th>
                <th className="py-4 px-4 font-bold text-gray-800">Name & Divisi</th>
                <th className="py-4 px-4 font-bold text-gray-800">Tanggal</th>
                <th className="py-4 px-4 font-bold text-gray-800">Kategori</th>
                <th className="py-4 px-4 font-bold text-gray-800">Nominal</th>
                <th className="py-4 px-4 font-bold text-gray-800">Status</th>
                <th className="py-4 px-4 font-bold text-gray-800 text-center">Detail</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="text-center py-8 text-gray-500">Memuat data...</td></tr>
              ) : reports.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-8 text-gray-500">Tidak ada data report.</td></tr>
              ) : (
                reports.map((item, index) => (
                  <tr 
                    key={item.id} 
                    /* Efek selang-seling: baris genap berwarna biru pudar, baris ganjil putih */
                    className={`${index % 2 === 0 ? 'bg-[#DCE4ED]' : 'bg-white'} hover:brightness-95 transition`}
                  >
                    <td className="py-4 px-4 text-gray-600 font-medium">{item.id}</td>
                    <td className="py-4 px-4">
                      <div className="text-gray-800 font-bold">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.division}</div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{item.date}</td>
                    <td className="py-4 px-4 text-gray-600">{item.category}</td>
                    <td className="py-4 px-4 text-gray-800 font-medium">Rp {item.nominal.toLocaleString('id-ID')}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 text-xs font-bold rounded-md inline-block ${getStatusStyle(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button className="p-2 bg-orange-50 text-[#F16A28] rounded-full hover:bg-orange-100 transition inline-flex justify-center items-center">
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Dummy */}
        <div className="flex justify-center items-center mt-12 space-x-4 text-gray-500 font-sans">
          <button className="hover:text-[#F16A28] transition">«</button>
          <button className="hover:text-[#F16A28] transition">‹</button>
          <span className="font-bold text-gray-800">01</span>
          <button className="hover:text-[#F16A28] transition">›</button>
          <button className="hover:text-[#F16A28] transition">»</button>
        </div>

      </div>
    </div>
  );
}