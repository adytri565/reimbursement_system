import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../lib/AuthContext'; // Buka komentar jika AuthContext sudah siap
import AuthLayout from '../layouts/AuthLayout';

export default function LoginPage() {
  // const { login } = useAuth(); // Buka komentar jika AuthContext sudah siap
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // BAGIAN INI DIGUNAKAN UNTUK SIMULASI SEMENTARA
      // Hapus timeout ini dan aktifkan fungsi login() di bawahnya saat integrasi ke backend
      setTimeout(() => {
        navigate('/manager/dashboard'); // Diarahkan ke manager untuk testing
      }, 1000);

      // --- KODE ASLI BACKEND ---
      // const { error } = await login(email, password);
      // if (error) throw error;
      // navigate('/');
      
    } catch (err) {
      setError(err.message || 'Gagal login. Periksa email dan password Anda.');
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-sm">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Welcome Back</h2>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 mb-8">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Email address</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2.5 border border-gray-400 rounded-lg focus:outline-none focus:border-[#F16A28] focus:ring-1 focus:ring-[#F16A28] text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Password</label>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2.5 border border-gray-400 rounded-lg focus:outline-none focus:border-[#F16A28] focus:ring-1 focus:ring-[#F16A28] text-sm"
            />
          </div>

          <div className="flex justify-end">
            <span className="text-xs font-semibold text-gray-600 hover:text-[#F16A28] cursor-pointer transition">Forgot Password?</span>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 mt-2 bg-[#F16A28] text-white font-bold rounded-lg hover:bg-opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm font-semibold text-gray-800">
          Don't have an account? <Link to="/register" className="text-[#F16A28] hover:underline">Sign Up</Link>
        </p>
      </div>
    </AuthLayout>
  );
}