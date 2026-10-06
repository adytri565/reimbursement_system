import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Sesuaikan dengan path context Auth Anda

export default function RoleRoute({ allowedRoles, children }) {
  const { session, userProfile, loading } = useAuth();

  // 1. Tampilkan loading jika status autentikasi masih dimuat
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen font-sans text-gray-500 bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-brand-navy border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm">Memeriksa hak akses...</p>
        </div>
      </div>
    );
  }

  // 2. Jika belum login, lempar ke halaman login
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // 3. Normalisasi role pengguna ke huruf kecil
  const userRole = userProfile?.role?.toLowerCase();
  const normalizedAllowedRoles = allowedRoles.map((role) => role.toLowerCase());

  // 4. Jika role tidak sesuai, arahkan ke halaman unauthorized / root
  if (!normalizedAllowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  // 5. Jika lolos verifikasi, tampilkan komponen anak
  return children ? children : <Outlet />;
}