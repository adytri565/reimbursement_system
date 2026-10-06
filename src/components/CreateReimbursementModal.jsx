import React, { useState } from 'react';

const CATEGORIES = [
  { value: 'lunch', label: 'Makan Siang (Maks 30)', max: 30 },
  { value: 'dinner', label: 'Makan Malam (Maks 50)', max: 50 },
  { value: 'transport_airport_destination', label: 'Transportasi (Bandara ke Tujuan)' },
  { value: 'hotel', label: 'Hotel' },
  { value: 'flight', label: 'Tiket Pesawat' },
  { value: 'other', label: 'Lain-lain' }
];

export default function CreateReimbursementModal({ userProfile, onClose, onSuccess }) {
  const [title, setTitle] = useState('');
  const [purpose, setPurpose] = useState('');
  const [bankOption, setBankOption] = useState('saved'); // 'saved' atau 'manual'
  const [bankName, setBankName] = useState(userProfile?.default_bank_name || 'BCA');
  const [bankAccount, setBankAccount] = useState(userProfile?.default_bank_account || '');
  
  const [items, setItems] = useState([
    { category: 'lunch', description: '', amount: '', hotel_room_type: 'shared' }
  ]);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAddItem = () => {
    setItems([...items, { category: 'lunch', description: '', amount: '', hotel_room_type: 'shared' }]);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const calculateTotal = () => {
    return items.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    for (const item of items) {
      const amt = parseFloat(item.amount);
      if (item.category === 'lunch' && amt > 30) {
        setErrorMsg('Makan siang melebihi plafon maksimal 30.');
        return;
      }
      if (item.category === 'dinner' && amt > 50) {
        setErrorMsg('Makan malam melebihi plafon maksimal 50.');
        return;
      }
      if (['lunch', 'dinner'].includes(item.category) && item.description.length < 5) {
        setErrorMsg('Rincikan menu makanan pada deskripsi item.');
        return;
      }
    }

    const payload = {
      title,
      purpose,
      bank_name: bankOption === 'saved' ? userProfile.default_bank_name : bankName,
      bank_account_number: bankOption === 'saved' ? userProfile.default_bank_account : bankAccount,
      items: items.map(item => ({
        ...item,
        amount: parseFloat(item.amount)
      }))
    };

    try {
      const response = await fetch('http://localhost:8000/api/reimbursements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Gagal mengajukan reimbursement');
      onSuccess();
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Pengajuan Reimbursement Baru</h2>
        
        {errorMsg && (
          <div className="p-3 mb-4 text-sm bg-red-100 text-red-700 rounded-md">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Judul Pengajuan</label>
            <input 
              type="text" 
              required
              className="w-full border rounded p-2 text-sm"
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Contoh: Dinas Luar Kota Surabaya"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Keperluan / Keterangan Dinas</label>
            <textarea 
              required
              className="w-full border rounded p-2 text-sm"
              value={purpose} 
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Kunjungan klien PT ABC"
            />
          </div>

          {/* Opsi Rekening Bank */}
          <div className="bg-gray-50 p-3 rounded-lg border">
            <label className="block text-sm font-semibold mb-2">Rekening Pencairan</label>
            <div className="flex gap-4 mb-2 text-sm">
              <label className="flex items-center gap-1">
                <input 
                  type="radio" 
                  value="saved" 
                  checked={bankOption === 'saved'} 
                  onChange={() => setBankOption('saved')} 
                />
                Rekening Terdaftar ({userProfile?.default_bank_name || 'BCA'} - {userProfile?.default_bank_account || 'Belum diisi'})
              </label>
              <label className="flex items-center gap-1">
                <input 
                  type="radio" 
                  value="manual" 
                  checked={bankOption === 'manual'} 
                  onChange={() => setBankOption('manual')} 
                />
                Input Rekening Baru
              </label>
            </div>

            {bankOption === 'manual' && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                <input 
                  type="text" 
                  placeholder="Nama Bank (BCA, Mandiri, dll)" 
                  className="border rounded p-2 text-sm"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  required
                />
                <input 
                  type="text" 
                  placeholder="Nomor Rekening" 
                  className="border rounded p-2 text-sm"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  required
                />
              </div>
            )}
          </div>

          {/* Rincian Item Reimburse */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold">Rincian Pengeluaran</label>
              <button 
                type="button" 
                onClick={handleAddItem}
                className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
              >
                + Tambah Item
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item, idx) => (
                <div key={idx} className="p-3 border rounded-lg bg-gray-50 flex flex-col gap-2">
                  <div className="flex gap-2">
                    <select 
                      className="border rounded p-2 text-sm w-1/3"
                      value={item.category}
                      onChange={(e) => handleItemChange(idx, 'category', e.target.value)}
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>

                    <input 
                      type="number" 
                      placeholder="Nominal" 
                      className="border rounded p-2 text-sm w-1/3"
                      value={item.amount}
                      onChange={(e) => handleItemChange(idx, 'amount', e.target.value)}
                      required
                    />

                    {items.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => handleRemoveItem(idx)}
                        className="text-red-500 text-xs px-2"
                      >
                        Hapus
                      </button>
                    )}
                  </div>

                  {/* Pengaturan Khusus Hotel Berdasarkan Job Level */}
                  {item.category === 'hotel' && (
                    <div className="text-xs">
                      <label className="font-semibold block mb-1">Tipe Kamar Hotel:</label>
                      {userProfile?.job_level === 'director' ? (
                        <select 
                          className="border rounded p-1 text-xs"
                          value={item.hotel_room_type}
                          onChange={(e) => handleItemChange(idx, 'hotel_room_type', e.target.value)}
                        >
                          <option value="single">Single Room (Khusus Direktur)</option>
                          <option value="shared">Shared Room (Berdua)</option>
                        </select>
                      ) : (
                        <span className="text-gray-500 italic">
                          Tipe Kamar: Berdua / Shared (Wajib untuk Junior & Senior)
                        </span>
                      )}
                    </div>
                  )}

                  <input 
                    type="text" 
                    placeholder={
                      item.category === 'lunch' || item.category === 'dinner' 
                        ? "Rincian menu (Contoh: Nasi Goreng + Teh Manis)" 
                        : "Keterangan rincian pengeluaran"
                    }
                    className="border rounded p-2 text-sm w-full"
                    value={item.description}
                    onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <span className="font-bold text-sm">Total: {calculateTotal().toLocaleString()}</span>
            <div className="flex gap-2">
              <button 
                type="button" 
                onClick={onClose} 
                className="px-4 py-2 border rounded text-sm hover:bg-gray-100"
              >
                Batal
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                Kirim Pengajuan
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}