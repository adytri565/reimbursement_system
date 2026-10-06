import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../lib/AuthContext'; // Buka komentar jika AuthContext sudah siap
import AuthLayout from '../layouts/AuthLayout';

export default function RegisterPage() {
  // const { register } = useAuth(); // Buka komentar jika AuthContext sudah siap
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'employee'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // SIMULASI SEMENTARA (Hapus bagian ini jika sudah integrasi backend)
      setTimeout(() => {
        alert('Registrasi berhasil! Silakan login.');
        navigate('/login');
      }, 1000);

      // --- KODE ASLI BACKEND ---
      // const { error } = await register(formData.email, formData.password, {
      //   full_name: formData.fullName,
      //   role: formData.role
      // });
      // if (error) throw error;
      // alert('Registrasi berhasil! Silakan login.');
      // navigate('/login');
      
    } catch (err) {
      setError(err.message || 'Gagal mendaftar. Silakan coba lagi.');
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-sm">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Get Started Now</h2>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Name</label>
            <input 
              type="text" 
              name="fullName" 
              required 
              value={formData.fullName} 
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full px-4 py-2.5 border border-gray-400 rounded-lg focus:outline-none focus:border-[#F16A28] focus:ring-1 focus:ring-[#F16A28] text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Email address</label>
            <input 
              type="email" 
              name="email" 
              required 
              value={formData.email} 
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2.5 border border-gray-400 rounded-lg focus:outline-none focus:border-[#F16A28] focus:ring-1 focus:ring-[#F16A28] text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Password</label>
            <input 
              type="password" 
              name="password" 
              required 
              minLength="6" 
              value={formData.password} 
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-2.5 border border-gray-400 rounded-lg focus:outline-none focus:border-[#F16A28] focus:ring-1 focus:ring-[#F16A28] text-sm"
            />
          </div>
          
          {/* Field Role */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Role</label>
            <select 
              name="role" 
              value={formData.role} 
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-400 rounded-lg focus:outline-none focus:border-[#F16A28] focus:ring-1 focus:ring-[#F16A28] text-sm bg-white"
            >
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
              <option value="finance">Finance</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex items-center mt-2 mb-4">
            <input 
              type="checkbox" 
              required 
              className="w-4 h-4 text-[#F16A28] border-gray-300 rounded focus:ring-[#F16A28]" 
            />
            <label className="ml-2 text-xs text-gray-700">
              I agree to the <span className="underline font-medium cursor-pointer text-[#F16A28]">terms & policy</span>
            </label>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 mt-4 bg-[#F16A28] text-white font-bold rounded-lg hover:bg-opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Signup'}
          </button>
        </form>

        <p className="text-center text-sm font-semibold text-gray-800">
          Have an account? <Link to="/login" className="text-[#F16A28] hover:underline transition">Sign In</Link>
        </p>
      </div>
    </AuthLayout>
  );
}