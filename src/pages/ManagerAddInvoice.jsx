import React, { useState } from 'react';
import { 
  ChevronLeft,
  ChevronRight,
  UploadCloud,
  X
} from 'lucide-react';

export default function ManagerAddInvoice() {
  const [formData, setFormData] = useState({
    date: '',
    category: '',
    nominal: '',
    purpose: '',
    file: null
  });

  // State untuk mengontrol Modal
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateSelect = (day) => {
    // Format sederhana untuk contoh
    setFormData({ ...formData, date: `${day} April 2021` });
    setIsDateModalOpen(false);
  };

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  return (
    <div className="w-full">
      {/* Header Halaman */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Ajukan Invoice</h2>
          <p className="text-gray-500 text-sm mt-1">Buat pengajuan reimbursement baru</p>
        </div>
      </div>

      <div className="bg-white p-10 rounded-2xl shadow-sm max-w-4xl min-h-[600px]">
        
        {/* Header Formulir */}
        <div className="border-b border-gray-400 pb-4 mb-8">
          <h2 className="text-2xl font-serif text-gray-800 mb-2">Formulir Pengajuan Baru</h2>
          <p className="text-gray-600 font-serif text-sm">
            Silakan lengkapi detail pengeluaran Anda. Pengajuan ini akan diteruskan ke Direktur atau langsung ke Finance sesuai dengan aturan kebijakan perusahaan.
          </p>
        </div>

        {/* Isi Formulir */}
        <div className="space-y-8 font-serif">
          
          {/* Field: Tanggal */}
          <div>
            <label className="block text-gray-800 mb-3">Tanggal Transaksi</label>
            <button 
              onClick={() => setIsDateModalOpen(true)}
              className="px-6 py-1.5 bg-[#9CA3AF] text-white rounded-full text-sm font-sans hover:bg-gray-500 transition shadow-sm flex items-center space-x-2"
            >
              <span>{formData.date || 'Pilih Tgl'}</span>
              <span>&gt;</span>
            </button>
          </div>

          {/* Field: Kategori */}
          <div>
            <label className="block text-gray-800 mb-1">Kategori Pengeluaran</label>
            <input 
              type="text" 
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              placeholder="[ Pilih Kategori..            ]"
              className="w-full text-gray-500 bg-transparent border-none focus:outline-none focus:ring-0 placeholder-gray-400"
            />
          </div>

          {/* Field: Nominal */}
          <div>
            <label className="block text-gray-800 mb-1">Nominal (Rp)</label>
            <input 
              type="number" 
              name="nominal"
              value={formData.nominal}
              onChange={handleInputChange}
              placeholder="[ Rp................               ]"
              className="w-full text-gray-500 bg-transparent border-none focus:outline-none focus:ring-0 placeholder-gray-400"
            />
          </div>

          {/* Field: Keterangan */}
          <div>
            <label className="block text-gray-800 mb-1">Keterangan / Tujuan</label>
            <input 
              type="text" 
              name="purpose"
              value={formData.purpose}
              onChange={handleInputChange}
              placeholder="[ Tuliskan alasan pengeluaran secara detail..          ]"
              className="w-full text-gray-500 bg-transparent border-none focus:outline-none focus:ring-0 placeholder-gray-400"
            />
          </div>

          {/* Field: Upload */}
          <div>
            <label className="block text-gray-800 mb-3">Unggah Bukti Struk / Nota (Wajib)</label>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setIsUploadModalOpen(true)}
                className="px-8 py-1.5 bg-[#9CA3AF] text-white rounded-full text-sm font-sans hover:bg-gray-500 transition shadow-sm"
              >
                Upload
              </button>
              {formData.file && <span className="text-sm text-[#F16A28] font-sans">{formData.file.name}</span>}
            </div>
          </div>

        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MODAL 1: DATE PICKER (DARK MODE) */}
      {/* ------------------------------------------------------------- */}
      {isDateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#1E1E1E] text-white p-6 rounded-2xl shadow-2xl w-80 font-sans border border-purple-500/30">
            {/* Header Kalender */}
            <div className="flex justify-between items-center mb-6">
              <button className="p-1 bg-gray-800 rounded-full hover:bg-gray-700"><ChevronLeft size={16} /></button>
              <div className="flex space-x-2 font-bold text-lg">
                <span>April</span>
                <span className="text-gray-400">2021</span>
              </div>
              <button className="p-1 bg-gray-800 rounded-full hover:bg-gray-700"><ChevronRight size={16} /></button>
            </div>
            
            {/* Nama Hari */}
            <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-4">
              <div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div><div>Su</div>
            </div>
            
            {/* Tanggal (Dummy Statis Sesuai Gambar) */}
            <div className="grid grid-cols-7 text-center text-sm gap-y-4">
              {['29','30','31','1','2','3','4','5','6'].map((d, i) => (
                <div key={i} className={`p-1 cursor-pointer hover:text-[#F16A28] ${i < 3 ? 'text-gray-600' : ''}`} onClick={() => handleDateSelect(d)}>{d}</div>
              ))}
              <div className="p-1 bg-[#0066FF] rounded-full cursor-pointer" onClick={() => handleDateSelect('7')}>7</div>
              {['8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','1','2'].map((d, i) => (
                <div key={i+10} className={`p-1 cursor-pointer hover:text-[#F16A28] ${i >= 23 ? 'text-gray-600' : ''}`} onClick={() => handleDateSelect(d)}>{d}</div>
              ))}
            </div>

            <button onClick={() => setIsDateModalOpen(false)} className="mt-6 w-full py-2 bg-gray-700 rounded-full hover:bg-gray-600 transition">Tutup</button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 2: UPLOAD BUKTI */}
      {/* ------------------------------------------------------------- */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#F8FAFC] p-8 rounded-2xl shadow-2xl w-[500px] font-serif border border-purple-500/30 relative">
            <button onClick={() => setIsUploadModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
              <X size={20} />
            </button>
            
            <h3 className="text-xl font-bold text-gray-800 mb-1">Media Upload</h3>
            <p className="text-gray-500 text-sm mb-6">Add your documents here, and you can upload up to 5 file max.</p>
            
            {/* Area Drag & Drop */}
            <div className="border-2 border-dashed border-[#F16A28] bg-[#FFF8F5] rounded-xl p-8 flex flex-col items-center justify-center text-center">
              <UploadCloud size={40} className="text-[#F16A28] mb-3" />
              <p className="text-gray-700 font-bold mb-2">Drag your file(s) to start uploading</p>
              <p className="text-gray-500 text-sm mb-4">OR</p>
              
              <label className="cursor-pointer px-6 py-1.5 border border-[#F16A28] text-[#F16A28] font-bold rounded-full hover:bg-orange-50 transition">
                Browse files
                <input type="file" className="hidden" onChange={(e) => { handleFileUpload(e); setIsUploadModalOpen(false); }} />
              </label>
            </div>
            
            <p className="text-gray-400 text-xs mt-3">only support .jpg, .png and svg and zip files</p>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                onClick={() => setIsUploadModalOpen(false)}
                className="px-6 py-2 border border-gray-300 text-gray-600 rounded-md font-bold hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button 
                onClick={() => setIsUploadModalOpen(false)}
                className="px-8 py-2 bg-[#F16A28] text-white rounded-md font-bold hover:bg-opacity-90 transition"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}