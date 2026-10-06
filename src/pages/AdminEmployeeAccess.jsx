import React, { useState, useEffect } from 'react';
import { Search, Filter, UserPlus, X } from 'lucide-react';
import { api } from '../lib/api';

const CustomToggle = ({ label, isOn, onChange }) => (
  <div className="flex flex-col items-center px-2">
    <span className="text-[11px] text-gray-800 font-serif mb-1">{label}</span>
    <div 
      className={`relative w-[52px] h-6 flex items-center rounded-full cursor-pointer transition-colors ${isOn ? 'bg-[#0D7C66]' : 'bg-gray-300'}`}
      onClick={onChange}
    >
      {isOn && <span className="absolute left-2 text-[10px] text-white font-bold font-sans">On</span>}
      <div className={`absolute w-[18px] h-[18px] bg-white rounded-full shadow transition-transform ${isOn ? 'translate-x-[30px]' : 'translate-x-1'}`} />
    </div>
  </div>
);

export default function AdminEmployeeAccess() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk Modal Add User
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '', email: '', department: '', employeeId: '', password: '', role: 'Employee', level: 'Junior'
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/admin/users'); 
      const formattedData = response.data.map(u => ({
        ...u,
        permissions: u.permissions || { report: true, submit: true, approve: true, payment: true, manageUsers: true }
      }));
      setUsers(formattedData);
    } catch (err) {
      console.error('Gagal mengambil data akses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggle = async (userId, permissionType) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          permissions: {
            ...user.permissions,
            [permissionType]: !user.permissions[permissionType]
          }
        };
      }
      return user;
    }));
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      await api.post('/api/admin/users', {
        full_name: formData.fullName,
        email: formData.email,
        department: formData.department,
        employee_id: formData.employeeId,
        password: formData.password,
        role: formData.role.toLowerCase(),
        level: formData.level
      });
      setIsModalOpen(false); // Tutup modal
      setFormData({ fullName: '', email: '', department: '', employeeId: '', password: '', role: 'Employee', level: 'Junior' });
      fetchUsers(); // Refresh tabel
    } catch (err) {
      console.error('Gagal menambah user:', err);
      alert('Gagal menambahkan user, periksa kembali inputan Anda.');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="w-full relative">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Employee Access</h2>
          <p className="text-gray-500 text-sm mt-1">Kelola izin fitur dan tambahkan karyawan baru</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <div className="flex space-x-4 w-full md:w-1/2">
            <div className="relative w-2/3">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input type="text" placeholder="Cari karyawan..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#232B3E] bg-[#232B3E] text-white placeholder-gray-400" />
            </div>
            <button className="flex items-center px-6 py-2 bg-[#232B3E] text-white rounded-lg hover:bg-opacity-90 transition">
              <Filter size={18} className="mr-2" /> Filter
            </button>
          </div>
          
          {/* Tombol yang memicu Modal */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-6 py-2 bg-[#F16A28] text-white rounded-lg hover:bg-opacity-90 transition font-medium shadow-sm"
          >
            <UserPlus size={18} className="mr-2" /> Add User
          </button>
        </div>

        {/* Tabel Akses */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse font-serif">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="py-4 font-bold text-gray-800 w-1/4">Name</th>
                <th className="py-4 font-bold text-gray-800 w-1/6">ID</th>
                <th className="py-4 font-bold text-gray-800 w-1/6">Role</th>
                <th className="py-4 font-bold text-gray-800 text-center">Permissions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" className="text-center py-8 text-gray-500">Memuat data akses...</td></tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition">
                    <td className="py-6">
                      <div className="font-medium text-gray-800">{user.full_name || 'Tanpa Nama'}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="py-6 text-gray-800 font-medium">{user.employee_id || '-'}</td>
                    <td className="py-6 text-gray-800 capitalize">{user.role}</td>
                    <td className="py-6">
                      <div className="flex justify-end space-x-2">
                        <CustomToggle label="Report" isOn={user.permissions?.report} onChange={() => handleToggle(user.id, 'report')} />
                        <CustomToggle label="Submit" isOn={user.permissions?.submit} onChange={() => handleToggle(user.id, 'submit')} />
                        <CustomToggle label="Approve" isOn={user.permissions?.approve} onChange={() => handleToggle(user.id, 'approve')} />
                        <CustomToggle label="Payment" isOn={user.permissions?.payment} onChange={() => handleToggle(user.id, 'payment')} />
                        <CustomToggle label="Manage" isOn={user.permissions?.manageUsers} onChange={() => handleToggle(user.id, 'manageUsers')} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL ADD USER */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-[#E9EEF5] p-8 rounded-2xl w-full max-w-2xl relative shadow-xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-red-500">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-serif text-gray-800 mb-6">Add New User</h2>
            
            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-serif text-gray-600 mb-1 ml-1">Nama Lengkap</label>
                  <input type="text" name="fullName" required value={formData.fullName} onChange={handleFormChange} className="w-full p-2.5 bg-[#D8E1EC] rounded-md focus:outline-none focus:ring-1 focus:ring-[#232B3E]" />
                </div>
                <div>
                  <label className="block text-sm font-serif text-gray-600 mb-1 ml-1">Email</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleFormChange} className="w-full p-2.5 bg-[#D8E1EC] rounded-md focus:outline-none focus:ring-1 focus:ring-[#232B3E]" />
                </div>
                <div>
                  <label className="block text-sm font-serif text-gray-600 mb-1 ml-1">Department</label>
                  <input type="text" name="department" value={formData.department} onChange={handleFormChange} className="w-full p-2.5 bg-[#D8E1EC] rounded-md focus:outline-none focus:ring-1 focus:ring-[#232B3E]" />
                </div>
                <div>
                  <label className="block text-sm font-serif text-gray-600 mb-1 ml-1">Employ ID</label>
                  <input type="text" name="employeeId" value={formData.employeeId} onChange={handleFormChange} className="w-full p-2.5 bg-[#D8E1EC] rounded-md focus:outline-none focus:ring-1 focus:ring-[#232B3E]" />
                </div>
                <div>
                  <label className="block text-sm font-serif text-gray-600 mb-1 ml-1">Password Baru</label>
                  <input type="password" name="password" required value={formData.password} onChange={handleFormChange} className="w-full p-2.5 bg-[#D8E1EC] rounded-md focus:outline-none focus:ring-1 focus:ring-[#232B3E]" />
                </div>
                
                {/* Dropdown Role & Level Bersebelahan */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-serif text-gray-600 mb-1 ml-1">Role</label>
                    <select name="role" value={formData.role} onChange={handleFormChange} className="w-full p-2.5 bg-[#D8E1EC] rounded-md focus:outline-none font-serif text-gray-700">
                      <option value="Employee">Employee</option>
                      <option value="Manager">Manager</option>
                      <option value="Finance">Finance</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-serif text-gray-600 mb-1 ml-1">Level</label>
                    <select name="level" value={formData.level} onChange={handleFormChange} className="w-full p-2.5 bg-[#D8E1EC] rounded-md focus:outline-none font-serif text-gray-700">
                      <option value="Junior">Junior</option>
                      <option value="Senior">Senior</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button type="submit" disabled={submitLoading} className="px-8 py-2.5 bg-[#232B3E] text-white font-serif rounded-md hover:bg-opacity-90 transition shadow-sm disabled:opacity-50">
                  {submitLoading ? 'Menyimpan...' : 'Submit Form'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}