import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

export default function RoleRoute({ children, allowedRoles }) {
  const { session, userProfile, loading } = useAuth();

  // 1. Tampilkan indikator loading jika profil user masih dalam proses pengambilan dari Supabase
  if (loading || (session && !userProfile)) {
    return (
      <div className="flex items-center justify-center min-h-screen font-sans text-gray-500">
        Memeriksa hak akses...
      </div>
    );
  }

  // 2. Jika sesi login tidak ada, lempar ke halaman login
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  const userRole = userProfile?.role?.toLowerCase();
  const normalizedAllowedRoles = allowedRoles.map(role => role.toLowerCase());

  // 3. Jika role tidak termasuk dalam allowedRoles, lempar ke '/' (biarkan RootRedirect mengarahkan ke dashboard yang sesuai)
  if (!userRole || !normalizedAllowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
}