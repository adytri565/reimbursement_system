import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'

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
import EmployeeHistory from './pages/EmployeeHistory';

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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        
        {/* ==========================================
            RUTE DEFAULT & AUTHENTICATION
            ========================================== */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ==========================================
            RUTE MANAGER (Menggunakan ManagerLayout)
            ========================================== */}
        <Route path="/manager" element={<ManagerLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ManagerDashboard />} />
          <Route path="pending" element={<ManagerPending />} />
          <Route path="approved" element={<ManagerApproved />} />
          <Route path="rejected" element={<ManagerRejected />} />
          <Route path="add" element={<ManagerAddInvoice />} />
          <Route path="reports" element={<ManagerReport />} />
        </Route>

        {/* ==========================================
            RUTE EMPLOYEE (Menggunakan MainLayout)
            ========================================== */}

<Route path="/employee" element={<EmployeeLayout />}>
  <Route index element={<Navigate to="dashboard" replace />} />
  <Route path="dashboard" element={<EmployeeDashboard />} />
  <Route path="add" element={<AddReimburse />} />
  <Route path="history" element={<EmployeeHistory />} />
</Route>

        {/* ==========================================
            RUTE FINANCE (Menggunakan FinanceLayout)
            ========================================== */}
        <Route path="/finance" element={<FinanceLayout />}> {/* <-- Ubah MainLayout menjadi FinanceLayout */}
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<FinanceDashboard />} />
          <Route path="categories" element={<FinanceCategories />} />
          <Route path="history" element={<FinanceHistory />} />
        </Route>

        {/* ==========================================
            RUTE ADMIN (Menggunakan AdminLayout)
            ========================================== */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="access" element={<AdminEmployeeAccess />} />
          <Route path="users" element={<AdminManageUser />} />
        </Route>

      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)