import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, CheckSquare, X } from 'lucide-react';
import { api } from '../lib/api'; 

// Komponen Toggle Kustom
const CustomToggle = ({ isOn, onChange }) => (
  <div 
    className={`relative w-[52px] h-6 flex items-center rounded-full cursor-pointer transition-colors ${isOn ? 'bg-[#0D7C66]' : 'bg-gray-300'}`}
    onClick={onChange}
  >
    {isOn && <span className="absolute left-2 text-[10px] text-white font-bold font-sans">On</span>}
    <div className={`absolute w-[18px] h-[18px] bg-white rounded-full shadow transition-transform ${isOn ? 'translate-x-[30px]' : 'translate-x-1'}`} />
  </div>
);

export default function FinanceCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    maxLimit: '',
    requireReceipt: 'true', // Menggunakan string untuk dropdown value
    isActive: 'true',
    role: 'All'
  });

  // Fungsi mengambil data dari Backend
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/finance/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Gagal mengambil data kategori:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleToggleActive = async (id, currentStatus) => {
    try {
      // Optimistic Update: Ubah di UI terlebih dahulu biar responsif
      setCategories(categories.map(cat => 
        cat.id === id ? { ...cat, is_active: !currentStatus, isActive: !currentStatus } : cat
      ));
      
      // Update ke Backend
      await api.patch(`/api/finance/categories/${id}`, {
        is_active: !currentStatus
      });
    } catch (error) {
      console.error('Gagal mengubah status:', error);
      fetchCategories(); // Rollback jika gagal
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      // Kirim data ke backend
      await api.post('/api/finance/categories', {
        name: formData.name,
        max_limit: Number(formData.maxLimit),
        require_receipt: formData.requireReceipt === 'true',
        is_active: formData.isActive === 'true',
        role: formData.role
      });
      
      setIsModalOpen(false);
      setFormData({ name: '', maxLimit: '', requireReceipt: 'true', isActive: 'true', role: 'All' });
      fetchCategories(); // Refresh tabel data
    } catch (error) {
      console.error('Gagal menambah kategori:', error);
      alert('Gagal menambahkan kategori. Periksa inputan Anda.');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="w-full relative">
      
      {/* Header Halaman */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Kategori Pengeluaran</h2>
          <p className="text-gray-500 text-sm mt-1">
            Kelola jenis pengeluaran yang diizinkan untuk diklaim beserta aturannya
          </p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm min-h-[500px]">
        {/* Toolbar */}
        <div className="flex justify-between items-center mb-8">
          <div className="relative w-1/3">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari Kategori" 
              className="w-full pl-10 pr-4 py-2 border-none rounded-md focus:outline-none focus:ring-1 focus:ring-[#232B3E] bg-[#232B3E] text-white placeholder-gray-400 text-sm font-sans"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-[#F16A28] text-white rounded-md hover:bg-opacity-90 text-sm font-sans shadow-sm transition"
          >
            <Plus size={16} className="mr-2" /> Tambah Kategori
          </button>
        </div>

        {/* Tabel Data */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-serif text-sm">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="py-4 font-bold text-gray-800 w-1/4">Nama Kategori</th>
                <th className="py-4 font-bold text-gray-800 w-1/4">Batas Maks. (Rp)</th>
                <th className="py-4 font-bold text-gray-800 text-center w-1/6">Wajib Struk?</th>
                <th className="py-4 font-bold text-gray-800 text-center w-1/6">Status Aktif</th>
                <th className="py-4 font-bold text-gray-800 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center py-8 text-gray-500">Memuat data kategori...</td></tr>
              ) : categories.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-8 text-gray-500">Belum ada kategori.</td></tr>
              ) : (
                categories.map((item) => {
                  // Memastikan field camelCase/snake_case tertangani aman
                  const maxLimit = item.max_limit || item.maxLimit || 0;
                  const requireReceipt = item.require_receipt ?? item.requireReceipt;
                  const isActive = item.is_active ?? item.isActive;

                  return (
                    <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                      <td className="py-6 text-gray-800 font-medium">{item.name}</td>
                      <td className="py-6 text-gray-600">Rp {maxLimit.toLocaleString('id-ID')} / klaim</td>
                      <td className="py-6 text-center">
                        <div className="flex justify-center">
                          {requireReceipt ? (
                            <div className="bg-[#38A169] text-white rounded p-0.5">
                              <CheckSquare size={18} className="fill-current text-[#38A169] bg-white rounded-sm" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 border-2 border-gray-300 rounded"></div>
                          )}
                        </div>
                      </td>
                      <td className="py-6 flex justify-center items-center">
                        <CustomToggle 
                          isOn={isActive} 
                          onChange={() => handleToggleActive(item.id, isActive)} 
                        />
                      </td>
                      <td className="py-6 text-center">
                        <button className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition inline-flex justify-center items-center">
                          <Edit2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Tambah Kategori */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#E9EEF5] p-8 rounded-2xl shadow-2xl w-[500px] relative font-serif">
            
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-red-500">
              <X size={20} />
            </button>
            
            <h3 className="text-xl font-bold text-gray-800 mb-6">Tambah Kategori Baru</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1 ml-1">Nama Kategori</label>
                <input 
                  type="text" name="name" required value={formData.name} onChange={handleInputChange}
                  className="w-full p-2.5 bg-[#D8E1EC] rounded-md focus:outline-none focus:ring-1 focus:ring-[#232B3E]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1 ml-1">Batas Maks. (Rp)</label>
                <input 
                  type="number" name="maxLimit" required value={formData.maxLimit} onChange={handleInputChange}
                  className="w-full p-2.5 bg-[#D8E1EC] rounded-md focus:outline-none focus:ring-1 focus:ring-[#232B3E]"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1 ml-1">Wajib Struk?</label>
                  <select 
                    name="requireReceipt" value={formData.requireReceipt} onChange={handleInputChange}
                    className="w-full p-2.5 bg-[#D8E1EC] rounded-md focus:outline-none focus:ring-1 focus:ring-[#232B3E]"
                  >
                    <option value="true">Ya, Wajib</option>
                    <option value="false">Tidak Wajib</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1 ml-1">Status</label>
                  <select 
                    name="isActive" value={formData.isActive} onChange={handleInputChange}
                    className="w-full p-2.5 bg-[#D8E1EC] rounded-md focus:outline-none focus:ring-1 focus:ring-[#232B3E]"
                  >
                    <option value="true">Aktif</option>
                    <option value="false">Nonaktif</option>
                  </select>
                </div>
              </div>

              {/* Baris Bawah: Dropdown Role & Tombol Submit */}
              <div className="flex justify-between items-end pt-4">
                <div className="w-32">
                  <label className="block text-sm text-gray-600 mb-1 ml-1">Role Akses</label>
                  <select 
                    name="role" value={formData.role} onChange={handleInputChange}
                    className="w-full p-2.5 bg-[#D8E1EC] rounded-md focus:outline-none font-serif text-gray-700"
                  >
                    <option value="All">Semua Role</option>
                    <option value="Manager">Manager</option>
                    <option value="Employee">Employee</option>
                  </select>
                </div>
                
                <button 
                  type="submit" 
                  disabled={submitLoading}
                  className="px-6 py-2.5 bg-[#232B3E] text-white font-sans text-sm rounded-md hover:bg-opacity-90 transition shadow-sm disabled:opacity-50"
                >
                  {submitLoading ? 'Menyimpan...' : 'Add Category'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}