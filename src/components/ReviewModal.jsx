import React, { useState } from 'react';
import { api } from '../lib/api';

export default function ReviewModal({ data, onClose, onSuccess, roleName }) {
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAction = async (status) => {
    try {
      setLoading(true);
      await api.reviewReimbursement(data.id, status, note);
      onSuccess(); // Refresh tabel setelah sukses
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Review Pengajuan Reimbursement</h2>
        
        {errorMsg && <div className="p-3 mb-4 bg-red-100 text-red-700 rounded-md">{errorMsg}</div>}

        <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
          <div>
            <p className="text-sm text-gray-500">Nama Karyawan</p>
            <p className="font-semibold">{data.profiles.full_name} ({data.profiles.job_level})</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Departemen</p>
            <p className="font-semibold">{data.profiles.department}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Tujuan Dinas</p>
            <p className="font-semibold">{data.purpose}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Pengajuan</p>
            <p className="font-bold text-blue-600">Rp {data.total_amount.toLocaleString('id-ID')}</p>
          </div>
        </div>

        <h3 className="font-bold mb-2">Rincian Item</h3>
        <table className="w-full text-left text-sm mb-6 border">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-2">Kategori</th>
              <th className="p-2">Deskripsi</th>
              <th className="p-2">Nominal</th>
              <th className="p-2">Bukti</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="p-2 uppercase text-xs font-semibold">{item.category}</td>
                <td className="p-2">
                  {item.description}
                  {item.category === 'hotel' && <span className="block text-xs text-gray-500">Tipe: {item.hotel_room_type}</span>}
                </td>
                <td className="p-2">Rp {item.amount.toLocaleString('id-ID')}</td>
                <td className="p-2">
                  {item.receipt_url ? (
                    <a href={item.receipt_url} target="_blank" rel="noreferrer" className="text-blue-500 underline text-xs">Lihat Bukti</a>
                  ) : (
                    <span className="text-gray-400 text-xs">Tidak ada</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1">Catatan Persetujuan / Penolakan (Opsional)</label>
          <textarea 
            className="w-full border rounded p-2 text-sm"
            rows="3"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Tambahkan catatan jika diperlukan..."
          />
        </div>

        <div className="flex justify-end gap-3 border-t pt-4">
          <button onClick={onClose} disabled={loading} className="px-4 py-2 border rounded hover:bg-gray-100">Batal</button>
          <button onClick={() => handleAction('rejected')} disabled={loading} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Tolak</button>
          <button onClick={() => handleAction('approved')} disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            {roleName === 'finance' ? 'Setujui & Tandai Dibayar' : 'Setujui Pengajuan'}
          </button>
        </div>
      </div>
    </div>
  );
}