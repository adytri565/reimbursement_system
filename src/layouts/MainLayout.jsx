import React from 'react';
import { Outlet } from 'react-router-dom'; // INI WAJIB ADA

// Asumsi Anda punya Sidebar dan Navbar
// import Sidebar from '../components/Sidebar'; 
// import Navbar from '../components/Navbar'; 

export default function MainLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      
      {/* SIDEBAR DI SINI */}
      {/* <Sidebar /> */}

      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* NAVBAR DI SINI (Opsional) */}
        {/* <Navbar /> */}

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          
          {/* 👇 INI YANG PALING PENTING 👇 */}
          {/* Outlet adalah tempat di mana EmployeeDashboard akan dirender */}
          <Outlet /> 
          
        </main>
      </div>
    </div>
  );
}