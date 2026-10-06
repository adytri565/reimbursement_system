import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Upload, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  FileText
} from 'lucide-react';
import { api } from '../lib/api';

export default function AddReimburse() {
  const navigate = useNavigate();

  // State Form Input
  const [formData, setFormData] = useState({
    category: 'Transport',
    date: new Date().toISOString().split('T')[0],
    amount: '',
    description: ''
  });

  // State File Attachment & Preview
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  // State Loading & Feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle Upload File / Nota
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) { // Max 5MB
        setError('Ukuran file terlalu besar! Maksimal 5MB.');
        return;
      }
      setError('');
      setFile(selectedFile);

      // Buat preview jika file berupa gambar
      if (selectedFile.type.startsWith('image/')) {
        setFilePreview(URL.createObjectURL(selectedFile));
      } else {
        setFilePreview(null);
      }
    }
  };

  // Hapus File Pilihan
  const handleRemoveFile = () => {
    setFile(null);
    setFilePreview(null);
  };

  // Handle Submit Form ke Backend API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.amount || Number(formData.amount) <= 0) {
      setError('Nominal reimbursement harus lebih besar dari 0.');
      return;
    }

    if (!formData.description.trim()) {
      setError('Keterangan / Deskripsi pengajuan wajib diisi.');
      return;
    }

    try {
      setLoading(true);

      // Menyiapkan Payload Data (Bisa disesuaikan dengan Multipart FormData jika backend menerima file)
      const dataPayload = new FormData();
      dataPayload.append('category', formData.category);
      dataPayload.append('date', formData.date);
      dataPayload.append('amount', formData.amount);
      dataPayload.append('description', formData.description);
      if (file) {
        dataPayload.append('receipt', file);
      }

      // Kirim data ke endpoint backend
      await api.post('/reimbursements', dataPayload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess(true);
      
      // Redirect ke dashboard/history setelah 1.5 detik
      setTimeout(() => {
        navigate('/employee/dashboard');
      }, 1500);

    } catch (err) {
      console.error('Error submitting reimbursement:', err);
      // Fallback jika API backend belum menerima FormData biasa
      try {
        await api.post('/reimbursements', {
          category: formData.category,
          tanggal: formData.date,
          amount: Number(formData.amount),
          purpose: formData.description,
          status: 'Submitted'
        });
        setSuccess(true);
        setTimeout(() => {
          navigate('/employee/dashboard');
        }, 1500);
      } catch (fallbackErr) {
        setError(err.response?.data?.message || 'Gagal mengirim pengajuan. Pastikan koneksi server terhubung.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      
      {/* Header & Tombol Kembali */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center text-sm font-medium text-gray-600 hover:text-[#F16A28] transition"
        >
          <ArrowLeft size={18} className="mr-2" />
          <span>Kembali</span>
        </button>
      </div>

      {/* Card Utama Form */}
      <div className="card-container">
        
        <div className="border-b border-gray-100 pb-5 mb-6">
          <h1 className="card-title">Buat Pengajuan Reimbursement</h1>
          <p className="card-subtitle mb-0">
            Isi formulir di bawah ini dan unggah bukti/nota pembayaran yang valid.
          </p>
        </div>

        {/* Pesan Sukses */}
        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center space-x-3 text-sm">
            <CheckCircle size={20} className="text-emerald-600 shrink-0" />
            <span>Pengajuan berhasil dikirim! Mengalihkan ke dashboard...</span>
          </div>
        )}

        {/* Pesan Error */}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center space-x-3 text-sm">
            <AlertCircle size={20} className="text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Kategori */}
            <div>
              <label htmlFor="category" className="form-label">
                Kategori Klaim <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="Transport">Transportasi & Bensin</option>
                <option value="Makan">Makanan & Jamuan Klien</option>
                <option value="Akomodasi">Akomodasi & Hotel</option>
                <option value="Parkir">Parkir & Tol</option>
                <option value="Operasional">Kebutuhan Kantor / Operasional</option>
                <option value="Lainnya">Lain-lain</option>
              </select>
            </div>

            {/* Tanggal Transaksi */}
            <div>
              <label htmlFor="date" className="form-label">
                Tanggal Transaksi <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

          </div>

          {/* Nominal / Total Biaya */}
          <div>
            <label htmlFor="amount" className="form-label">
              Total Nominal (Rp) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">
                Rp
              </span>
              <input
                type="number"
                id="amount"
                name="amount"
                placeholder="Contoh: 150000"
                value={formData.amount}
                onChange={handleChange}
                className="form-input pl-11"
                min="1"
                required
              />
            </div>
            {formData.amount && (
              <p className="mt-1 text-xs text-gray-500 font-medium">
                Terbilang: Rp {Number(formData.amount).toLocaleString('id-ID')}
              </p>
            )}
          </div>

          {/* Deskripsi / Keperluan */}
          <div>
            <label htmlFor="description" className="form-label">
              Keterangan Keperluan <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows="3"
              placeholder="Jelaskan detail keperluan transaksi ini..."
              value={formData.description}
              onChange={handleChange}
              className="form-input resize-none"
              required
            ></textarea>
          </div>

          {/* Unggah Bukti / Struk Payment */}
          <div>
            <label className="form-label">
              Unggah Nota / Bukti Pembayaran <span className="text-gray-400 font-normal">(JPG, PNG, PDF max 5MB)</span>
            </label>
            
            {!file ? (
              <label className="border-2 border-dashed border-gray-300 hover:border-[#F16A28] rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition bg-gray-50/50 hover:bg-orange-50/20">
                <Upload size={32} className="text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-700">
                  Klik untuk unggah nota pembayaran
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Format gambar atau PDF
                </p>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="p-4 border border-gray-200 rounded-xl flex items-center justify-between bg-gray-50">
                <div className="flex items-center space-x-3 overflow-hidden">
                  {filePreview ? (
                    <img 
                      src={filePreview} 
                      alt="Preview" 
                      className="w-12 h-12 object-cover rounded-lg border border-gray-200" 
                    />
                  ) : (
                    <div className="w-12 h-12 bg-[#232B3E] text-white rounded-lg flex items-center justify-center">
                      <FileText size={20} />
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                    <p className="text-xs text-gray-400">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="p-1 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition"
                  title="Hapus file"
                >
                  <X size={20} />
                </button>
              </div>
            )}
          </div>

          {/* Tombol Aksi */}
          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate('/employee/dashboard')}
              className="btn-outline"
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading || success}
              className="btn-primary"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin mr-2" />
                  <span>Mengirim...</span>
                </>
              ) : (
                <span>Kirim Pengajuan</span>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}