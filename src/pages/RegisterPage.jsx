import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient'; // KONEKSI LANGSUNG KE SUPABASE
import AuthLayout from '../layouts/AuthLayout';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    department: 'Operasional',
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
      // PROSES SIGN UP REAL KE SUPABASE AUTH
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            department: formData.department,
            role: formData.role.toLowerCase() // Menjamin role dikirim dalam lowercase
          }
        }
      });

      if (signUpError) throw signUpError;

      alert('Registrasi berhasil! Silakan login dengan akun baru Anda.');
      navigate('/login');
      
    } catch (err) {
      console.error('Gagal Registrasi:', err);
      setError(err.message || 'Gagal mendaftar. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-sm">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Get Started Now</h2>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm text-center border border-red-200">
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
              placeholder="Password (min 6 karakter)"
              className="w-full px-4 py-2.5 border border-gray-400 rounded-lg focus:outline-none focus:border-[#F16A28] focus:ring-1 focus:ring-[#F16A28] text-sm"
            />
          </div>

          {/* Field Department */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Department</label>
            <select 
              name="department" 
              value={formData.department} 
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-400 rounded-lg focus:outline-none focus:border-[#F16A28] focus:ring-1 focus:ring-[#F16A28] text-sm bg-white"
            >
              <option value="Operasional">Operasional</option>
              <option value="IT">IT & Engineering</option>
              <option value="Sales">Sales & Marketing</option>
              <option value="Finance">Finance & Accounting</option>
              <option value="HRD">HRD / Human Resources</option>
            </select>
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