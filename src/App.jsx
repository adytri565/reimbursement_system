import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './lib/AuthContext'
import RoleRoute from './routes/RoleRoute'

// ==========================================
// 1. IMPORT LAYOUTS
// ==========================================
import MainLayout from './layouts/MainLayout'
import ManagerLayout from './layouts/ManagerLayout'
import AdminLayout from './layouts/AdminLayout'
import FinanceLayout from './layouts/FinanceLayout'
import EmployeeLayout from './layouts/EmployeeLayout'

// ==========================================
// 2. IMPORT PAGES
// ==========================================
// Auth
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

// Employee
import EmployeeDashboard from './pages/EmployeeDashboard'
import AddReimburse from './pages/AddReimburse'
import EmployeeHistory from './pages/EmployeeHistory'

// Manager
import ManagerDashboard from './pages/ManagerDashboard'
import ManagerPending from './pages/ManagerPending'
import ManagerApproved from './pages/ManagerApproved'
import ManagerRejected from './pages/ManagerRejected'
import ManagerAddInvoice from './pages/ManagerAddInvoice'
import ManagerReport from './pages/ManagerReport'

// Finance
import FinanceDashboard from './pages/FinanceDashboard'
import FinanceCategories from './pages/FinanceCategories'
import FinanceHistory from './pages/FinanceHistory'

// Admin
import AdminDashboard from './pages/AdminDashboard'
import AdminEmployeeAccess from './pages/AdminEmployeeAccess'
import AdminManageUser from './pages/AdminManageUser'

// ==========================================
// 3. KOMPONEN REDIRECT OTOMATIS BERDASARKAN ROLE
// ==========================================
const RootRedirect = () => {
  const { session, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen font-sans text-gray-500">
        Memeriksa sesi login...
      </div>
    );
  }

  if (!session) return <Navigate to="/login" replace />;
  
  if (!userProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen font-sans text-gray-500">
        Memuat profil pengguna...
      </div>
    );
  }

  // Ambil role, ubah jadi huruf kecil dan hapus spasi jika ada
  const role = userProfile.role ? String(userProfile.role).trim().toLowerCase() : 'employee';

  console.log("Redirecting user with role:", role); // Cek di Console browser (F12)

  switch (role) {
    case 'manager':
      return <Navigate to="/manager/dashboard" replace />;
    case 'finance':
      return <Navigate to="/finance/dashboard" replace />;
    case 'admin':
      return <Navigate to="/admin/dashboard" replace />;
    case 'employee':
    default:
      return <Navigate to="/employee/dashboard" replace />;
  }
};

// ==========================================
// 4. MAIN ROUTING & APPLICATION PROVIDER
// ==========================================
export default function App() {
  return (
    <AuthProvider>
      
      <BrowserRouter>
        <Routes>
          {/* Default & Public Auth Routes */}
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* RUTE EMPLOYEE */}
          <Route
            path="/employee"
            element={
              <RoleRoute allowedRoles={['employee']}>
                <EmployeeLayout />
              </RoleRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<EmployeeDashboard />} />
            <Route path="add" element={<AddReimburse />} />
            <Route path="history" element={<EmployeeHistory />} />
          </Route>

          {/* RUTE MANAGER */}
          <Route
            path="/manager"
            element={
              <RoleRoute allowedRoles={['manager']}>
                <ManagerLayout />
              </RoleRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<ManagerDashboard />} />
            <Route path="pending" element={<ManagerPending />} />
            <Route path="approved" element={<ManagerApproved />} />
            <Route path="rejected" element={<ManagerRejected />} />
            <Route path="add" element={<ManagerAddInvoice />} />
            <Route path="reports" element={<ManagerReport />} />
          </Route>

          {/* RUTE FINANCE */}
          <Route
            path="/finance"
            element={
              <RoleRoute allowedRoles={['finance']}>
                <FinanceLayout />
              </RoleRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<FinanceDashboard />} />
            <Route path="categories" element={<FinanceCategories />} />
            <Route path="history" element={<FinanceHistory />} />
          </Route>

          {/* RUTE ADMIN */}
          <Route
            path="/admin"
            element={
              <RoleRoute allowedRoles={['admin']}>
                <AdminLayout />
              </RoleRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="access" element={<AdminEmployeeAccess />} />
            <Route path="users" element={<AdminManageUser />} />
          </Route>

          {/* Fallback Rute Tidak Ditemukan */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}