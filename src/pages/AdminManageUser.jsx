import React, { useState, useEffect } from 'react';
import { Search, Filter, Edit2, Trash2 } from 'lucide-react';
import { api } from '../lib/api';

export default function AdminManageUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/admin/users');
        setUsers(response.data);
      } catch (err) {
        console.error('Gagal mengambil data user:', err);
        setError('Gagal memuat data pengguna dari server.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="w-full">
      {/* Header Halaman */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manage User</h2>
          <p className="text-gray-500 text-sm mt-1">Kelola detail profil, departemen, dan level karyawan</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm">
        
        {/* Toolbar */}
        <div className="flex space-x-4 w-full md:w-1/2 mb-8">
          <div className="relative w-2/3">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari nama, email, atau ID..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#232B3E] bg-[#232B3E] text-white placeholder-gray-400"
            />
          </div>
          <button className="flex items-center px-6 py-2 bg-[#232B3E] text-white rounded-lg hover:bg-opacity-90 transition">
            <Filter size={18} className="mr-2" /> Filter
          </button>
        </div>

        {/* Tabel User Profile */}
        <div className="overflow-x-auto min-h-[400px]">
          {error ? (
            <div className="flex items-center justify-center h-48 text-red-500 bg-red-50 rounded-lg font-medium">{error}</div>
          ) : (
            <table className="w-full text-left border-collapse font-serif text-sm">
              <thead>
                <tr className="border-b-2 border-gray-100">
                  <th className="py-4 font-bold text-gray-800">Name</th>
                  <th className="py-4 font-bold text-gray-800">Email</th>
                  <th className="py-4 font-bold text-gray-800">Department</th>
                  <th className="py-4 font-bold text-gray-800">Employee ID</th>
                  <th className="py-4 font-bold text-gray-800">Level</th>
                  <th className="py-4 font-bold text-gray-800 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500">Memuat data profil...</td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500">Belum ada data pengguna.</td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                      <td className="py-4 font-medium text-gray-800">{user.full_name || '-'}</td>
                      <td className="py-4 text-gray-600">{user.email}</td>
                      <td className="py-4 text-gray-700">{user.department || 'General'}</td>
                      <td className="py-4 text-gray-700">{user.employee_id || '-'}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-md ${
                          user.level === 'Senior' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {user.level || 'Junior'}
                        </span>
                      </td>
                      <td className="py-4 flex justify-center space-x-2">
                        <button className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition">
                          <Edit2 size={16} />
                        </button>
                        <button className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}