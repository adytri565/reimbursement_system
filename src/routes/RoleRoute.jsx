import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

export default function RoleRoute({ children, allowedRoles }) {
  const { session, userProfile } = useAuth();

  // Jika belum login, lempar ke halaman login
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // Jika role tidak termasuk dalam allowedRoles, lempar ke dashboard default (karyawan)
  if (userProfile && !allowedRoles.includes(userProfile.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}